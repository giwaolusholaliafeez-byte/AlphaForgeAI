export interface MetricCard {
  id: string;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: any;
  emphasis?: 'gold' | 'royal' | 'teal' | 'none';
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: string;
  change: string;
  positive: boolean;
  category?: 'stock' | 'crypto' | 'commodity';
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: string;
  change: string;
  positive: boolean;
  volume?: string;
  sparkline?: number[];
}

export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  value: number;
  change: number;
  allocation?: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  positive: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface MarketEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  relatedAsset?: string;
}

export interface AIBrief {
  id: string;
  timestamp: string;
  insights: string[];
  risk: string;
  opportunity: string;
}
