import { createClient } from '@/lib/supabase/server';
import { Portfolio, PortfolioHolding } from '@/types/portfolio';
import { normalizePortfolioRow, normalizeHoldingRow } from './normalizers';

export async function getPortfolios(userId: string): Promise<Portfolio[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching portfolios:', {
      code: error.code,
      message: error.message,
    });
    return [];
  }

  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(normalizePortfolioRow);
}

export async function getPortfolioById(portfolioId: string): Promise<Portfolio | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', portfolioId)
    .single();

  if (error) {
    console.error('Error fetching portfolio:', {
      code: error.code,
      message: error.message,
    });
    return null;
  }

  if (!data) {
    return null;
  }

  return normalizePortfolioRow(data);
}

export async function getDefaultPortfolio(userId: string): Promise<Portfolio | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error) {
    const { data: firstData, error: firstError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (firstError || !firstData) {
      return null;
    }
    
    return normalizePortfolioRow(firstData);
  }

  if (!data) {
    return null;
  }

  return normalizePortfolioRow(data);
}

export async function getPortfolioHoldings(portfolioId: string, userId: string): Promise<PortfolioHolding[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('portfolio_holdings')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching holdings:', {
      code: error.code,
      message: error.message,
    });
    return [];
  }

  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeHoldingRow);
}

export async function getPortfolioWithHoldings(portfolioId: string, userId: string): Promise<{
  portfolio: Portfolio | null;
  holdings: PortfolioHolding[];
}> {
  const [portfolio, holdings] = await Promise.all([
    getPortfolioById(portfolioId),
    getPortfolioHoldings(portfolioId, userId),
  ]);

  return { 
    portfolio, 
    holdings: Array.isArray(holdings) ? holdings : [] 
  };
}

export async function portfolioBelongsToUser(portfolioId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('id')
    .eq('id', portfolioId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return false;
  return true;
}

export async function holdingBelongsToUser(holdingId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('portfolio_holdings')
    .select('id')
    .eq('id', holdingId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return false;
  return true;
}

export async function getTableExists(tableName: string): Promise<boolean> {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    return !error;
  } catch {
    return false;
  }
}
