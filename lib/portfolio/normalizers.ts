import { Portfolio, PortfolioHolding } from '@/types/portfolio';

export function toFiniteNumber(
  value: unknown,
  fallback: number = 0
): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  
  return fallback;
}

export function normalizePortfolioRow(row: any): Portfolio {
  return {
    id: row.id || '',
    userId: row.user_id || '',
    name: row.name || 'Unnamed Portfolio',
    baseCurrency: row.base_currency || 'USD',
    cashBalance: toFiniteNumber(row.cash_balance, 0),
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

export function normalizeHoldingRow(row: any): PortfolioHolding {
  return {
    id: row.id || '',
    portfolioId: row.portfolio_id || '',
    userId: row.user_id || '',
    assetType: row.asset_type || 'stock',
    assetId: row.asset_id || '',
    symbol: row.symbol || 'UNKNOWN',
    assetName: row.asset_name || 'Unknown Asset',
    quantity: toFiniteNumber(row.quantity, 0),
    averageCost: toFiniteNumber(row.average_cost, 0),
    acquiredAt: row.acquired_at || null,
    notes: row.notes || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

export function formatCurrency(
  value: number | null | undefined,
  currency: string = 'USD'
): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Unavailable';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(
  value: number | null | undefined
): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Unavailable';
  }
  
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
