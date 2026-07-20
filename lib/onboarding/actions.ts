'use server';

import { createClient } from '@/lib/supabase/server';
import type { UserType } from '@/lib/accounts/types';
import { revalidatePath } from 'next/cache';

export async function saveUserType(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const value = formData.get('userType');
  if (value !== 'investor' && value !== 'trader' && value !== 'exploring') return { success: false, error: 'Choose a valid usage profile.' };
  const userType: UserType = value;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  const { error } = await supabase.from('profiles').upsert({ user_id: user.id, user_type: userType, updated_at: new Date().toISOString() });
  if (error) return { success: false, error: 'Unable to save your preference.' };
  revalidatePath('/dashboard');
  return { success: true };
}
