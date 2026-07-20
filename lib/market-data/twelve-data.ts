import { MarketDataError } from './types';

const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

export interface TwelveDataQuote {
  symbol: string;
  name: string | null;
  exchange: string | null;
  currency: string | null;
  price: string | null;
  day_change: string | null;
  change: string | null;
  previous_close: string | null;
  high: string | null;
  low: string | null;
  open: string | null;
  extended_change?: string | null;
  extended_change_percent?: string | null;
  timestamp: number | null;
}

export interface TwelveDataSearchResult {
  data: Array<{
    symbol: string;
    name: string;
    exchange: string;
    instrument_type: string;
    country: string;
  }>;
  status: string;
}

export class TwelveDataClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = TWELVE_DATA_BASE_URL;
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('apikey', this.apiKey);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
        next: { revalidate: 60 },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        
        throw {
          code: `TWELVEDATA_${response.status}`,
          message: errorMessage,
          source: 'twelvedata',
        } as MarketDataError;
      }

      const data = await response.json();
      
      // Check for error response
      if (data.status === 'error') {
        throw {
          code: 'TWELVEDATA_ERROR',
          message: data.message || 'Twelve Data API error',
          source: 'twelvedata',
        } as MarketDataError;
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          code: 'TWELVEDATA_TIMEOUT',
          message: 'Request to Twelve Data timed out',
          source: 'twelvedata',
        } as MarketDataError;
      }
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<TwelveDataQuote> {
    return this.fetch<TwelveDataQuote>('/quote', { symbol });
  }

  async getMultipleQuotes(symbols: string[]): Promise<Map<string, TwelveDataQuote>> {
    const results = new Map<string, TwelveDataQuote>();
    
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const promises = batch.map(async (symbol) => {
        try {
          const quote = await this.getQuote(symbol);
          results.set(symbol, quote);
        } catch (error) {
          console.warn(`Failed to fetch quote for ${symbol}:`, error);
        }
      });
      await Promise.all(promises);
      
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return results;
  }

  async search(query: string): Promise<TwelveDataSearchResult> {
    return this.fetch<TwelveDataSearchResult>('/symbol_search', { 
      symbol: query,
      outputsize: '10'
    });
  }
}
