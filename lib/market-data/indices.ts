import { MarketDataError } from './types';
import { FinnhubClient } from './finnhub';

export interface IndexProxyAsset {
  id: string;
  symbol: string;
  name: string;
  proxyName: string;
  underlyingMarket: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  previousClose: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  currency: string;
  source: string;
  lastUpdated: string | null;
  exchange: string;
  isProxy: boolean;
}

// ETF proxies for major indices
const INDEX_PROXIES = [
  { 
    id: 'spy', 
    symbol: 'SPY', 
    name: 'S&P 500 ETF Proxy', 
    proxyName: 'SPDR S&P 500 ETF Trust',
    underlyingMarket: 'S&P 500 Index'
  },
  { 
    id: 'qqq', 
    symbol: 'QQQ', 
    name: 'Nasdaq-100 ETF Proxy', 
    proxyName: 'Invesco QQQ Trust',
    underlyingMarket: 'Nasdaq-100 Index'
  },
  { 
    id: 'dia', 
    symbol: 'DIA', 
    name: 'Dow Jones ETF Proxy', 
    proxyName: 'SPDR Dow Jones Industrial Average ETF',
    underlyingMarket: 'Dow Jones Industrial Average'
  },
  { 
    id: 'iwm', 
    symbol: 'IWM', 
    name: 'Russell 2000 ETF Proxy', 
    proxyName: 'iShares Russell 2000 ETF',
    underlyingMarket: 'Russell 2000 Index'
  },
  { 
    id: 'vixy', 
    symbol: 'VIXY', 
    name: 'VIX Futures ETF Proxy', 
    proxyName: 'ProShares VIX Short-Term Futures ETF',
    underlyingMarket: 'CBOE VIX Index'
  },
];

export class IndicesClient {
  private finnhub: FinnhubClient;

  constructor(finnhubKey: string) {
    this.finnhub = new FinnhubClient(finnhubKey);
  }

  async getMultipleQuotes(): Promise<Map<string, IndexProxyAsset>> {
    const results = new Map<string, IndexProxyAsset>();
    const symbols = INDEX_PROXIES.map(p => p.symbol);
    
    const quotes = await this.finnhub.getMultipleQuotes(symbols);
    
    INDEX_PROXIES.forEach(proxy => {
      const quote = quotes.get(proxy.symbol);
      if (quote && quote.c !== undefined && quote.c !== null) {
        const asset = this.normalizeQuote(proxy, quote);
        results.set(proxy.id, asset);
      }
    });

    return results;
  }

  normalizeQuote(
    proxy: typeof INDEX_PROXIES[0], 
    quote: any
  ): IndexProxyAsset {
    const now = new Date().toISOString();
    
    return {
      id: proxy.id,
      symbol: proxy.symbol,
      name: proxy.proxyName,
      proxyName: proxy.name,
      underlyingMarket: proxy.underlyingMarket,
      price: quote.c || null,
      change: quote.d || null,
      changePercent: quote.dp || null,
      previousClose: quote.pc || null,
      dayHigh: quote.h || null,
      dayLow: quote.l || null,
      currency: 'USD',
      source: 'finnhub',
      lastUpdated: quote.t ? new Date(quote.t * 1000).toISOString() : now,
      exchange: 'ETF Market',
      isProxy: true,
    };
  }
}

export { INDEX_PROXIES };
