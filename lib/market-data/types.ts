export type AssetType = 'stock' | 'etf' | 'crypto' | 'fx' | 'index_proxy';

export interface AssetIdentity {
  assetType: AssetType;
  assetId: string;
  symbol: string;
  displaySymbol: string;
  name: string;
  providerIdentifiers: Record<string, string>;
}

export interface MarketQuote {
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  source: string;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
  marketCap: number | null;
  volume: number | null;
  logo?: string | null;
  exchange?: string | null;
  lastUpdated: string | null;
  source: string;
  rank?: number | null;
}

export interface AssetCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number | null;
}

export interface StockAsset extends MarketAsset {
  type: 'stock' | 'etf';
  exchange: string;
  industry?: string | null;
  country?: string | null;
}

export interface CryptoAsset extends MarketAsset {
  type: 'crypto';
  rank: number;
  marketCap: number;
  volume: number;
  sparkline?: number[] | null;
}

export interface MarketSearchResult {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  exchange?: string;
  source: string;
}

export interface MarketDataResponse {
  assets: MarketAsset[];
  timestamp: string;
  source: string;
  total?: number;
}

export interface MarketDataError {
  code: string;
  message: string;
  source?: string;
  details?: any;
}

export interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price
  l: number;  // Low price
  o: number;  // Open price
  pc: number; // Previous close
  t: number;  // Timestamp
}

export interface FinnhubSearchResult {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
    primaryExchange?: string;
  }>;
}

export interface FinnhubProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
  last_updated: string;
}
// Asset Detail Types
export interface AssetDetail extends MarketAsset {
  description?: string | null;
  website?: string | null;
  ipoDate?: string | null;
  industry?: string | null;
  country?: string | null;
  allTimeHigh?: number | null;
  allTimeLow?: number | null;
  athDate?: string | null;
  atlDate?: string | null;
  circulatingSupply?: number | null;
  totalSupply?: number | null;
  maxSupply?: number | null;
  fullyDilutedValuation?: number | null;
  categories?: string[];
  recommendation?: RecommendationTrend[];
}

export interface StockDetail extends AssetDetail {
  type: 'stock' | 'etf';
  pe?: number | null;
  eps?: number | null;
  beta?: number | null;
  dividendYield?: number | null;
  revenueGrowth?: number | null;
  profitMargin?: number | null;
  previousClose?: number | null;
  open?: number | null;
  dayHigh?: number | null;
  dayLow?: number | null;
  week52High?: number | null;
  week52Low?: number | null;
  etfCategory?: string | null;
  expenseRatio?: number | null;
  aum?: number | null;
  holdingsCount?: number | null;
  inceptionDate?: string | null;
}

export interface CryptoDetail extends AssetDetail {
  type: 'crypto';
  fullyDilutedValuation: number | null;
  athDate: string | null;
  atlDate: string | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  categories: string[];
  description: string | null;
  homepage: string | null;
  developerScore?: number | null;
  communityScore?: number | null;
  liquidityScore?: number | null;
  publicInterestScore?: number | null;
}

export interface AssetHistoricalPoint {
  timestamp: number;
  value: number;
}

export interface AssetHistoricalSeries {
  points: AssetHistoricalPoint[];
  candles?: AssetCandle[];
  range: string;
  source: string;
  lastUpdated: string;
}

export interface RecommendationTrend {
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export interface AssetNewsItem {
  id: string;
  headline: string;
  summary?: string;
  source: string;
  url: string;
  datetime: string;
  image?: string | null;
  category?: string;
  relatedAsset?: string | null;
}

export interface EarningsCalendarItem {
  symbol: string;
  date: string;
  hour: string | null;
  quarter: number | null;
  year: number | null;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
}

export interface IpoCalendarItem {
  symbol: string | null;
  name: string;
  date: string;
  exchange: string | null;
  priceRange: string | null;
  numberOfShares: number | null;
  totalSharesValue: number | null;
  status: string;
}

export interface AssetDetailResponse {
  data: AssetDetail | null;
  error: string | null;
  source: string;
  lastUpdated: string | null;
  isDelayed: boolean;
  isConfigured: boolean;
}

export interface AssetHistoryResponse {
  data: AssetHistoricalSeries | null;
  error: string | null;
  source: string;
  lastUpdated: string | null;
  isConfigured: boolean;
}
