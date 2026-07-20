import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-paystack-signature');
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!signature || !secret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 });
  const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  let payload: unknown;
  try { payload = JSON.parse(rawBody) as unknown; } catch { return NextResponse.json({ error: 'Invalid payload' }, { status: 400 }); }
  if (!isRecord(payload) || typeof payload.event !== 'string' || !isRecord(payload.data)) return NextResponse.json({ received: true });
  if (payload.event !== 'charge.success' && payload.event !== 'subscription.create' && payload.event !== 'subscription.disable') return NextResponse.json({ received: true });
  const data = payload.data;
  const customer = isRecord(data.customer) ? data.customer : null;
  const email = customer && typeof customer.email === 'string' ? customer.email : null;
  const reference = typeof data.reference === 'string' ? data.reference : null;
  if (!email || !reference) return NextResponse.json({ error: 'Missing provider identity' }, { status: 400 });
  const supabase = createAdminClient();
  const { data: userData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const matchedUser = userData.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
  if (!matchedUser) return NextResponse.json({ received: true });
  const status = payload.event === 'subscription.disable' ? 'cancelled' : 'active';
  const { error } = await supabase.from('subscriptions').upsert({ user_id: matchedUser.id, provider: 'paystack', plan: status === 'active' ? 'pro' : 'free', status, provider_reference: reference, customer_code: customer && typeof customer.customer_code === 'string' ? customer.customer_code : null, subscription_code: typeof data.subscription_code === 'string' ? data.subscription_code : null, provider_email_token: typeof data.email_token === 'string' ? data.email_token : null, current_period_end: typeof data.next_payment_date === 'string' ? data.next_payment_date : null, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) { console.error('Paystack webhook persistence failed', error.code); return NextResponse.json({ error: 'Persistence failed' }, { status: 500 }); }
  return NextResponse.json({ received: true });
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
