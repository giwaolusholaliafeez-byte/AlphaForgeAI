export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  baseCurrency: string;
  cashBalance: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioHolding {
  id: string;
  portfolioId: string;
  userId: string;
  assetType: 'stock' | 'etf' | 'crypto' | 'fx' | 'index_proxy';
  assetId: string;
  symbol: string;
  assetName: string;
  quantity: number;
  averageCost: number;
  acquiredAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HoldingValuation {
  currentPrice: number | null;
  marketValue: number | null;
  costBasis: number;
  unrealizedGain: number | null;
  returnPercentage: number | null;
  allocationPercentage: number;
}

export interface PortfolioHoldingWithValuation extends PortfolioHolding, HoldingValuation {}

export interface PortfolioSummary {
  totalValue: number;
  holdingsValue: number;
  cashBalance: number;
  unrealizedGain: number;
  returnPercentage: number | null;
  totalCostBasis: number;
}

export interface PortfolioAllocation {
  assetType: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PortfolioFormValues {
  name: string;
}

export interface HoldingFormValues {
  assetType: 'stock' | 'etf' | 'crypto' | 'fx' | 'index_proxy';
  assetId: string;
  symbol: string;
  assetName: string;
  quantity: number;
  averageCost: number;
  acquiredAt: string | null;
  notes: string | null;
}

export interface PortfolioDataResponse {
  portfolio: Portfolio | null;
  holdings: PortfolioHoldingWithValuation[];
  summary: PortfolioSummary | null;
  allocation: PortfolioAllocation[];
  error: string | null;
  isConfigured: boolean;
}

export interface PortfolioActionResult {
  success: boolean;
  error: string | null;
  data?: any;
}
