'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const orderSchema = z.object({ clientOrderId: z.string().uuid(), assetType: z.enum(['stock', 'etf', 'crypto', 'fx', 'index_proxy']), assetId: z.string().trim().min(1).max(100), symbol: z.string().trim().min(1).max(20), side: z.enum(['buy', 'sell']), quantity: z.number().finite().positive(), executionPrice: z.number().finite().positive() });

export async function executePaperOrder(input: unknown): Promise<{ success: boolean; error?: string }> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Invalid paper order details.' };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  const { error } = await supabase.rpc('execute_paper_market_order', { p_client_order_id: parsed.data.clientOrderId, p_asset_type: parsed.data.assetType, p_asset_id: parsed.data.assetId, p_symbol: parsed.data.symbol, p_side: parsed.data.side, p_quantity: parsed.data.quantity, p_execution_price: parsed.data.executionPrice });
  if (error) return { success: false, error: error.message.includes('Insufficient') ? error.message : 'Paper order could not be executed.' };
  revalidatePath('/dashboard/paper');
  revalidatePath('/dashboard/accounts');
  revalidatePath('/dashboard/activity');
  return { success: true };
}

export async function resetPaperAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  const { error } = await supabase.rpc('reset_paper_account');
  if (error) return { success: false, error: 'Paper account could not be reset.' };
  revalidatePath('/dashboard/paper');
  revalidatePath('/dashboard/accounts');
  return { success: true };
}
