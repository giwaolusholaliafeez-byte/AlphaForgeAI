import { createClient } from '@/lib/supabase/server';
import type { FeatureLimits, Subscription, SubscriptionPlan } from './types';

const FREE_LIMITS: FeatureLimits = { portfolioLimit: 1, watchlistLimit: 20, alertLimit: 5, advancedResearch: false, exports: false };
const PRO_LIMITS: FeatureLimits = { portfolioLimit: null, watchlistLimit: null, alertLimit: null, advancedResearch: true, exports: true };

export function getFeatureLimits(plan: SubscriptionPlan): FeatureLimits {
  return plan === 'pro' ? PRO_LIMITS : FREE_LIMITS;
}

export async function getUserSubscription(): Promise<Subscription> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { plan: 'free', status: 'inactive', currentPeriodStart: null, currentPeriodEnd: null, cancelAtPeriodEnd: false };

  const { data } = await supabase.from('subscriptions').select('plan,status,current_period_start,current_period_end,cancel_at_period_end,subscription_code').eq('user_id', user.id).maybeSingle();
  if (!data || data.status === 'cancelled' || data.status === 'inactive') return { plan: 'free', status: data?.status ?? 'inactive', currentPeriodStart: data?.current_period_start ?? null, currentPeriodEnd: data?.current_period_end ?? null, cancelAtPeriodEnd: data?.cancel_at_period_end ?? false, subscriptionCode: data?.subscription_code ?? null };
  const plan: SubscriptionPlan = data.plan === 'pro' ? 'pro' : 'free';
  return { plan, status: data.status, currentPeriodStart: data.current_period_start ?? null, currentPeriodEnd: data.current_period_end ?? null, cancelAtPeriodEnd: Boolean(data.cancel_at_period_end), subscriptionCode: data.subscription_code ?? null };
}

export async function getUserPlan(): Promise<SubscriptionPlan> { return (await getUserSubscription()).plan; }
export async function isProUser(): Promise<boolean> { return (await getUserPlan()) === 'pro'; }
export async function requirePro(): Promise<{ ok: true } | { ok: false; error: string }> {
  return (await isProUser()) ? { ok: true } : { ok: false, error: 'This feature requires AlphaForge Pro.' };
}
