import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PaystackProvider } from '@/lib/billing/paystack';

export async function POST(request: Request) { try { const body: unknown = await request.json(); const plan = isRecord(body) && body.plan === 'pro' ? 'pro' : null; if (!plan) return NextResponse.json({ error: 'Only the Pro plan can be purchased.' }, { status: 400 }); const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const result = await new PaystackProvider().initializeCheckout({ email: user.email, plan, callbackUrl: `${new URL(request.url).origin}/dashboard/settings/billing` }); return NextResponse.json(result); } catch (error) { console.error('Billing checkout failed', error instanceof Error ? error.message : 'unknown'); return NextResponse.json({ error: 'Billing is not configured.' }, { status: 503 }); } }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
