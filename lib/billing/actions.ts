'use server';

import { createClient } from '@/lib/supabase/server';
import { PaystackProvider } from './paystack';
import { revalidatePath } from 'next/cache';

export async function cancelSubscription(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  const { data: subscription } = await supabase.from('subscriptions').select('subscription_code,provider_email_token,status').eq('user_id', user.id).maybeSingle();
  if (subscription?.status !== 'active' || !subscription.subscription_code || !subscription.provider_email_token) return { success: false, error: 'This subscription cannot be cancelled from AlphaForge yet. Please refresh after the provider webhook is processed.' };
  try {
    await new PaystackProvider().cancelSubscription(subscription.subscription_code, subscription.provider_email_token);
    const { error } = await supabase.from('subscriptions').update({ status: 'non_renewing', cancel_at_period_end: true, updated_at: new Date().toISOString() }).eq('user_id', user.id);
    if (error) throw error;
    revalidatePath('/dashboard/settings/billing');
    return { success: true };
  } catch (error) {
    console.error('Subscription cancellation failed', error instanceof Error ? error.message : 'unknown');
    return { success: false, error: 'Subscription cancellation failed. Please try again.' };
  }
}
