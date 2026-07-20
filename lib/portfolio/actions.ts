'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PortfolioFormSchema, CashBalanceSchema } from './validation';

export async function createPortfolio(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const cashBalanceStr = formData.get('cashBalance') as string;
  const cashBalance = cashBalanceStr ? parseFloat(cashBalanceStr) : 0;

  const nameValidation = PortfolioFormSchema.safeParse({ name });
  if (!nameValidation.success) {
    return { success: false, error: nameValidation.error.issues[0]?.message || 'Invalid portfolio name' };
  }

  const balanceValidation = CashBalanceSchema.safeParse({ cashBalance });
  if (!balanceValidation.success) {
    return { success: false, error: balanceValidation.error.issues[0]?.message || 'Invalid cash balance' };
  }

  const { data: existingPortfolios } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  const isFirst = !existingPortfolios || existingPortfolios.length === 0;

  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      user_id: user.id,
      name: name.trim(),
      base_currency: 'USD',
      cash_balance: cashBalance,
      is_default: isFirst,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating portfolio:', {
      code: error.code,
      message: error.message,
    });
    
    if (error.code === '42501') {
      return { 
        success: false, 
        error: 'Permission denied. Please check the RLS policies for the portfolios table.' 
      };
    }
    
    return { success: false, error: 'Failed to create portfolio. Please try again.' };
  }

  revalidatePath('/dashboard/portfolio');
  redirect(`/dashboard/portfolio?portfolio=${data.id}`);
}

export async function renamePortfolio(portfolioId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  
  const validation = PortfolioFormSchema.safeParse({ name });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Invalid portfolio name' };
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', portfolioId)
    .single();

  if (!portfolio || portfolio.user_id !== user.id) {
    return { success: false, error: 'Portfolio not found' };
  }

  const { error } = await supabase
    .from('portfolios')
    .update({ name: name.trim() })
    .eq('id', portfolioId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error renaming portfolio:', error);
    return { success: false, error: 'Failed to rename portfolio' };
  }

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}

export async function deletePortfolio(portfolioId: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', portfolioId)
    .single();

  if (!portfolio || portfolio.user_id !== user.id) {
    return { success: false, error: 'Portfolio not found' };
  }

  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id);

  if (portfolios && portfolios.length <= 1) {
    return { success: false, error: 'Cannot delete your last portfolio. Create a new one first.' };
  }

  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', portfolioId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting portfolio:', error);
    return { success: false, error: 'Failed to delete portfolio' };
  }

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}

export async function setDefaultPortfolio(portfolioId: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', portfolioId)
    .single();

  if (!portfolio || portfolio.user_id !== user.id) {
    return { success: false, error: 'Portfolio not found' };
  }

  const { error: clearError } = await supabase
    .from('portfolios')
    .update({ is_default: false })
    .eq('user_id', user.id);

  if (clearError) {
    console.error('Error clearing default:', clearError);
    return { success: false, error: 'Failed to update default portfolio' };
  }

  const { error } = await supabase
    .from('portfolios')
    .update({ is_default: true })
    .eq('id', portfolioId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error setting default:', error);
    return { success: false, error: 'Failed to update default portfolio' };
  }

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}

export async function updateCashBalance(portfolioId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const cashBalance = parseFloat(formData.get('cashBalance') as string);
  
  const validation = CashBalanceSchema.safeParse({ cashBalance });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Invalid cash balance' };
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('id', portfolioId)
    .single();

  if (!portfolio || portfolio.user_id !== user.id) {
    return { success: false, error: 'Portfolio not found' };
  }

  const { error } = await supabase
    .from('portfolios')
    .update({ cash_balance: cashBalance })
    .eq('id', portfolioId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating cash balance:', error);
    return { success: false, error: 'Failed to update cash balance' };
  }

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}

export async function addHolding(portfolioId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify portfolio ownership
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .select('id')
    .eq('id', portfolioId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (portfolioError || !portfolio) {
    console.error('Portfolio ownership check failed:', {
      code: portfolioError?.code,
      message: portfolioError?.message,
    });
    return { success: false, error: 'The selected portfolio does not belong to this account.' };
  }

  // Extract and validate form data
  const assetType = formData.get('assetType') as string;
  const assetId = formData.get('assetId') as string;
  const symbol = formData.get('symbol') as string;
  const assetName = formData.get('assetName') as string;
  const quantityValue = formData.get('quantity') as string;
  const averageCostValue = formData.get('averageCost') as string;
  const acquiredAt = formData.get('acquiredAt') as string || null;
  const notes = formData.get('notes') as string || null;

  // Validate required fields
  if (!assetId || !symbol || !assetName || !quantityValue || !averageCostValue) {
    return { success: false, error: 'All required fields must be filled.' };
  }

  // Validate asset type
  const allowedTypes = ['stock', 'etf', 'crypto', 'index_proxy'];
  if (!allowedTypes.includes(assetType)) {
    return { success: false, error: `Invalid asset type: ${assetType}` };
  }

  // Parse quantity and average cost with proper decimal handling
  const quantityStr = quantityValue.trim().replace(',', '.');
  const averageCostStr = averageCostValue.trim().replace(',', '.');
  
  const quantity = Number.parseFloat(quantityStr);
  const averageCost = Number.parseFloat(averageCostStr);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { success: false, error: 'Quantity must be a positive number.' };
  }

  if (!Number.isFinite(averageCost) || averageCost < 0) {
    return { success: false, error: 'Average cost must be a valid number greater than or equal to 0.' };
  }

  // Validate notes length
  if (notes && notes.length > 500) {
    return { success: false, error: 'Notes must be 500 characters or less.' };
  }

  // Prepare insert data with exact database column names
  const holdingInsert = {
    portfolio_id: portfolioId,
    user_id: user.id,
    asset_type: assetType,
    asset_id: assetId.trim(),
    symbol: symbol.trim().toUpperCase(),
    asset_name: assetName.trim(),
    quantity: quantity,
    average_cost: averageCost,
    acquired_at: acquiredAt || null,
    notes: notes || null,
  };

  // Insert the holding
  const { data, error } = await supabase
    .from('portfolio_holdings')
    .insert(holdingInsert)
    .select('*')
    .single();

  if (error) {
    console.error('addHolding failed:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (error.code === '23505') {
      return { 
        success: false, 
        error: 'This asset already exists in this portfolio. Edit the existing holding instead.' 
      };
    }

    if (error.code === '23503') {
      return { 
        success: false, 
        error: 'The selected portfolio could not be found.' 
      };
    }

    if (error.code === '23514') {
      return { 
        success: false, 
        error: 'One of the holding values does not meet the database requirements.' 
      };
    }

    if (error.code === '42501') {
      return { 
        success: false, 
        error: 'You do not have permission to add a holding to this portfolio.' 
      };
    }

    if (error.code === 'PGRST116') {
      return { 
        success: false, 
        error: 'The selected portfolio could not be verified.' 
      };
    }

    return { success: false, error: `Failed to add holding: ${error.message}` };
  }

  if (!data) {
    return { success: false, error: 'Failed to add holding: No data returned.' };
  }

  // Revalidate and return success - PortfolioClient handles the refresh
  revalidatePath('/dashboard/portfolio');
  return { success: true, data };
}

export async function updateHolding(holdingId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data: holding, error: holdingError } = await supabase
    .from('portfolio_holdings')
    .select('user_id')
    .eq('id', holdingId)
    .single();

  if (holdingError || !holding || holding.user_id !== user.id) {
    return { success: false, error: 'Holding not found' };
  }

  const assetType = formData.get('assetType') as string;
  const assetId = formData.get('assetId') as string;
  const symbol = formData.get('symbol') as string;
  const assetName = formData.get('assetName') as string;
  const quantityValue = formData.get('quantity') as string;
  const averageCostValue = formData.get('averageCost') as string;
  const acquiredAt = formData.get('acquiredAt') as string || null;
  const notes = formData.get('notes') as string || null;

  if (!assetId || !symbol || !assetName || !quantityValue || !averageCostValue) {
    return { success: false, error: 'All required fields must be filled.' };
  }

  const quantityStr = quantityValue.trim().replace(',', '.');
  const averageCostStr = averageCostValue.trim().replace(',', '.');
  
  const quantity = Number.parseFloat(quantityStr);
  const averageCost = Number.parseFloat(averageCostStr);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { success: false, error: 'Quantity must be a positive number.' };
  }

  if (!Number.isFinite(averageCost) || averageCost < 0) {
    return { success: false, error: 'Average cost must be a valid number greater than or equal to 0.' };
  }

  if (notes && notes.length > 500) {
    return { success: false, error: 'Notes must be 500 characters or less.' };
  }

  const { error } = await supabase
    .from('portfolio_holdings')
    .update({
      asset_type: assetType,
      asset_id: assetId.trim(),
      symbol: symbol.trim().toUpperCase(),
      asset_name: assetName.trim(),
      quantity: quantity,
      average_cost: averageCost,
      acquired_at: acquiredAt || null,
      notes: notes || null,
    })
    .eq('id', holdingId)
    .eq('user_id', user.id);

  if (error) {
    console.error('updateHolding failed:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (error.code === '23505') {
      return { 
        success: false, 
        error: 'This asset already exists in this portfolio. Edit the existing holding instead.' 
      };
    }

    return { success: false, error: `Failed to update holding: ${error.message}` };
  }

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}

export async function removeHolding(holdingId: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data: holding, error: holdingError } = await supabase
    .from('portfolio_holdings')
    .select('user_id')
    .eq('id', holdingId)
    .single();

  if (holdingError || !holding || holding.user_id !== user.id) {
    return { success: false, error: 'Holding not found' };
  }

  const { error } = await supabase
    .from('portfolio_holdings')
    .delete()
    .eq('id', holdingId)
    .eq('user_id', user.id);

  if (error) {
    console.error('removeHolding failed:', {
      code: error.code,
      message: error.message,
    });
    return { success: false, error: 'Failed to remove holding' };
  }

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}
