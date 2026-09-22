import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CREDIT_COST = 2; // 2 credits per background removal

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check credits
  const { data: wallet } = await supabase
    .from('credit_wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (!wallet || wallet.balance < CREDIT_COST) {
    return NextResponse.json({
      error: 'Insufficient credits',
      credits_required: CREDIT_COST,
      credits_available: wallet?.balance || 0
    }, { status: 402 });
  }

  const formData = await req.formData();
  const imageFile = formData.get('image') as File;

  if (!imageFile) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    // Call PhotoRoom API via n8n workflow
    const n8nFormData = new FormData();
    n8nFormData.append('image', imageFile);
    n8nFormData.append('user_id', user.id);
    n8nFormData.append('output_type', 'cutout');

    const n8nResponse = await fetch(
      `${process.env.N8N_WEBHOOK_URL}/webhook/background-remove`,
      {
        method: 'POST',
        body: n8nFormData,
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`
        }
      }
    );

    if (!n8nResponse.ok) {
      throw new Error('n8n workflow failed');
    }

    const result = await n8nResponse.json();

    // Deduct credits
    await supabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: CREDIT_COST,
      p_transaction_type: 'ai_operation',
      p_description: 'Background removal',
      p_metadata: { image_url: result.image_url }
    });

    // Log to media_assets
    await supabase.from('media_assets').insert({
      user_id: user.id,
      type: 'processed_image',
      url: result.image_url,
      operation: 'background_remove',
      credits_used: CREDIT_COST,
      original_filename: imageFile.name
    });

    return NextResponse.json({
      success: true,
      image_url: result.image_url,
      credits_used: CREDIT_COST,
      credits_remaining: wallet.balance - CREDIT_COST
    });

  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
