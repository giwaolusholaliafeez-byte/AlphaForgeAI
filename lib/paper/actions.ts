'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAssetDetail } from '@/lib/market-data/asset-details';

const orderSchema = z.object({ clientOrderId: z.string().uuid(), assetType: z.enum(['stock', 'etf', 'crypto']), assetId: z.string().trim().min(1).max(100), symbol: z.string().trim().min(1).max(20), side: z.enum(['buy', 'sell']), quantity: z.number().finite().positive() });
const previewSchema = orderSchema.omit({ clientOrderId: true });

export async function getPaperOrderPreview(input: unknown): Promise<{ success: boolean; error?: string; preview?: { price: number; orderValue: number; buyingPowerBefore: number; buyingPowerAfter: number; ownedQuantity: number; remainingQuantity: number } }> {
  const parsed = previewSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Invalid paper order details.' };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  const detail = await getAssetDetail(parsed.data.assetType, parsed.data.assetId);
  const price = detail.data?.price;
  if (price === null || price === undefined || !Number.isFinite(price) || price <= 0) return { success: false, error: 'Current market price is unavailable. This paper order cannot be executed safely.' };
  const [{ data: account }, { data: position }] = await Promise.all([
    supabase.from('paper_accounts').select('cash_balance').eq('user_id', user.id).maybeSingle(),
    supabase.from('paper_positions').select('quantity').eq('user_id', user.id).eq('asset_type', parsed.data.assetType).eq('asset_id', parsed.data.assetId).maybeSingle(),
  ]);
  const buyingPowerBefore = Number(account?.cash_balance ?? 0);
  const ownedQuantity = Number(position?.quantity ?? 0);
  const orderValue = Math.round(price * parsed.data.quantity * 100000000) / 100000000;
  return { success: true, preview: { price, orderValue, buyingPowerBefore, buyingPowerAfter: buyingPowerBefore + (parsed.data.side === 'buy' ? -orderValue : orderValue), ownedQuantity, remainingQuantity: ownedQuantity - parsed.data.quantity } };
}

export async function executePaperOrder(input: unknown): Promise<{ success: boolean; error?: string }> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Invalid paper order details.' };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  const detail = await getAssetDetail(parsed.data.assetType, parsed.data.assetId);
  const executionPrice = detail.data?.price;
  if (executionPrice === null || executionPrice === undefined || !Number.isFinite(executionPrice) || executionPrice <= 0) return { success: false, error: 'Current market price is unavailable. This paper order cannot be executed safely.' };
  const { error } = await supabase.rpc('execute_paper_market_order', { p_client_order_id: parsed.data.clientOrderId, p_asset_type: parsed.data.assetType, p_asset_id: parsed.data.assetId, p_symbol: parsed.data.symbol, p_side: parsed.data.side, p_quantity: parsed.data.quantity, p_execution_price: executionPrice });
  if (error) return { success: false, error: error.message.includes('Insufficient') ? error.message : 'Paper order could not be executed.' };
  revalidatePath('/dashboard/paper');
  revalidatePath('/dashboard/accounts');
  revalidatePath('/dashboard/activity');
  return { success: true };
}

export async function openPaperAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  const { error } = await supabase.rpc('open_paper_account');
  if (error) return { success: false, error: 'Paper account could not be opened.' };
  revalidatePath('/dashboard/paper'); revalidatePath('/dashboard/accounts'); revalidatePath('/dashboard');
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
