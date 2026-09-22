import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CREDIT_COST = 1;

const CAPTION_TEMPLATES: Record<string, Record<string, string[]>> = {
  eg: {
    ar: [
      "✨ {product} بجودة مش موجودة في السوق!\n💥 اطلب دلوقتي وهيوصلك باب لباب\n🔥 اضغط اللينك في البايو\n#مصر #تسوق_اونلاين #منتجات_مصرية",
      "🌟 جرب الجديد! {product} اللي كلنا كنا مستنياه\n❤️ شارك مع صحابك لو عجبك\n👇 الرابط في البايو\n#القاهرة #اشتري_مصري"
    ]
  },
  sa: {
    ar: [
      "✨ {product} - الجودة التي تستحقها!\n🚀 توصيل سريع لجميع مناطق المملكة\n💎 اطلب الآن عبر الرابط في البايو\n#السعودية #تسوق #الرياض",
      "🌟 اكتشف {product} الجديد!\n⭐ جودة عالمية بسعر مناسب\n📱 تواصل معنا الآن\n#جدة #المملكة_العربية_السعودية"
    ]
  },
  us: {
    en: [
      "✨ Introducing {product} - game changer!\n🔥 Limited time offer - shop now!\n🛒 Link in bio\n#shopnow #musthave #trending",
      "💫 {product} just dropped and it's everything!\n❤️ Tag a friend who needs this\n🛍️ Shop the link in bio\n#newarrival #shopping"
    ]
  }
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { product_name, country, language, platform, image_url } = await req.json();

  // Check credits
  const { data: wallet } = await supabase
    .from('credit_wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (!wallet || wallet.balance < CREDIT_COST) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
  }

  try {
    // Get trending hashtags via n8n
    const n8nResponse = await fetch(
      `${process.env.N8N_WEBHOOK_URL}/webhook/generate-caption`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`
        },
        body: JSON.stringify({
          product_name,
          country: country || 'us',
          language: language || 'en',
          platform: platform || 'instagram',
          image_url,
          user_id: user.id
        })
      }
    );

    let captions: string[];

    if (n8nResponse.ok) {
      const n8nResult = await n8nResponse.json();
      captions = n8nResult.captions;
    } else {
      // Fallback to template captions
      const countryTemplates = CAPTION_TEMPLATES[country] || CAPTION_TEMPLATES.us;
      const langTemplates = countryTemplates[language] || countryTemplates.en || CAPTION_TEMPLATES.us.en;
      captions = langTemplates.map(t => t.replace('{product}', product_name));
    }

    // Deduct credits
    await supabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: CREDIT_COST,
      p_transaction_type: 'ai_operation',
      p_description: `Caption generation for ${product_name}`,
      p_metadata: { country, language, platform }
    });

    return NextResponse.json({
      success: true,
      captions,
      credits_used: CREDIT_COST,
      credits_remaining: wallet.balance - CREDIT_COST
    });

  } catch (error) {
    console.error('Caption generation error:', error);
    return NextResponse.json({ error: 'Failed to generate captions' }, { status: 500 });
  }
}
