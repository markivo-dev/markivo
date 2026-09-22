import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// Paddle sends webhook events here
// We verify the signature and update credits in Supabase

const CREDITS_PER_PLAN: Record<string, number> = {
  'pri_01m31607hpqejtkj5j20zb4jrj': 500, // Pro Monthly $15.99
};

async function verifyPaddleSignature(req: NextRequest, body: string): Promise<boolean> {
  const signature = req.headers.get('paddle-signature');
  if (!signature) return false;

  // Parse the signature header: ts=xxx;h1=xxx
  const parts = signature.split(';');
  const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
  const h1 = parts.find(p => p.startsWith('h1='))?.split('=')[1];

  if (!ts || !h1) return false;

  const secret = process.env.PADDLE_WEBHOOK_SECRET!;
  const signedPayload = `${ts}:${body}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(signedPayload);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature_bytes = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const computed = Buffer.from(signature_bytes).toString('hex');

  return computed === h1;
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Verify webhook signature
  const isValid = await verifyPaddleSignature(req, body);
  if (!isValid) {
    console.error('Invalid Paddle webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  const supabase = await createAdminClient();

  console.log('Paddle webhook event:', event.event_type);

  try {
    switch (event.event_type) {
      case 'subscription.activated':
      case 'transaction.completed': {
        const { data } = event;
        const customerId = data.customer_id;
        const priceId = data.items?.[0]?.price?.id;
        const userId = data.custom_data?.user_id;

        if (!userId) {
          console.error('No user_id in custom_data');
          break;
        }

        const creditsToAdd = CREDITS_PER_PLAN[priceId] || 500;

        // Update credit wallet
        const { error: walletError } = await supabase.rpc('add_credits', {
          p_user_id: userId,
          p_amount: creditsToAdd,
          p_transaction_type: 'subscription',
          p_description: `Pro subscription - ${creditsToAdd} credits`,
          p_metadata: {
            paddle_customer_id: customerId,
            paddle_transaction_id: data.id,
            price_id: priceId
          }
        });

        if (walletError) {
          console.error('Error adding credits:', walletError);
        } else {
          console.log(`Added ${creditsToAdd} credits to user ${userId}`);
        }

        // Update user subscription status
        await supabase.from('profiles').update({
          plan: 'pro',
          paddle_customer_id: customerId,
          subscription_status: 'active',
          subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }).eq('id', userId);

        break;
      }

      case 'subscription.cancelled':
      case 'subscription.past_due': {
        const { data } = event;
        const userId = data.custom_data?.user_id;

        if (userId) {
          await supabase.from('profiles').update({
            plan: 'free',
            subscription_status: event.event_type === 'subscription.cancelled' ? 'cancelled' : 'past_due'
          }).eq('id', userId);
        }
        break;
      }

      case 'subscription.updated': {
        const { data } = event;
        const userId = data.custom_data?.user_id;

        if (userId) {
          await supabase.from('profiles').update({
            subscription_status: data.status
          }).eq('id', userId);
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
