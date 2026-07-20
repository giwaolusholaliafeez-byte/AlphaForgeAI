import { MarketAsset, StockAsset, CryptoAsset } from './types';

export function normalizeStockAsset(
  symbol: string,
  name: string,
  price: number | null,
  change: number | null,
  changePercent: number | null,
  exchange?: string | null,
  logo?: string | null
): StockAsset {
  const now = new Date().toISOString();
  
  return {
    id: symbol,
    symbol: symbol.toUpperCase(),
    name: name || symbol,
    type: symbol.startsWith('SPY') || symbol.startsWith('QQQ') || symbol.startsWith('DIA') || symbol.startsWith('VOO') ? 'etf' : 'stock',
    price,
    change,
    changePercent,
    currency: 'USD',
    marketCap: null,
    volume: null,
    logo: logo || null,
    exchange: (exchange || null) ?? "",
    industry: null,
    country: null,
    lastUpdated: now,
    source: 'finnhub',
  };
}

export function normalizeCryptoAsset(
  id: string,
  symbol: string,
  name: string,
  price: number | null,
  changePercent: number | null,
  marketCap: number | null,
  volume: number | null,
  rank: number | null,
  logo?: string | null,
  sparkline?: number[] | null
): CryptoAsset {
  const now = new Date().toISOString();
  
  return {
    id,
    symbol: symbol.toUpperCase(),
    name,
    type: 'crypto',
    price,
    change: changePercent,
    changePercent,
    currency: 'USD',
    marketCap: (marketCap || null) ?? 0,
    volume: (volume || null) ?? 0,
    logo: logo || null,
    rank: (rank || null) ?? 0,
    exchange: 'Crypto Market',
    lastUpdated: now,
    source: 'coingecko',
    sparkline: sparkline || null,
  };
}

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return '—';
  if (price >= 1000) return `$${price.toFixed(2)}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

export function formatChange(change: number | null): string {
  if (change === null || change === undefined) return '—';
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
}

export function formatMarketCap(value: number | null): string {
  if (!value) return '—';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}

export function formatVolume(value: number | null): string {
  if (!value) return '—';
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}
