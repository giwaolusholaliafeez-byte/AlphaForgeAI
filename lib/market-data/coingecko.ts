import { CoinGeckoMarketData, CryptoAsset, MarketSearchResult, MarketDataError } from './types';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export class CoinGeckoClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = COINGECKO_BASE_URL;
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string>, timeoutMs: number = 10000): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        
        throw {
          code: `COINGECKO_${response.status}`,
          message: errorMessage,
          source: 'coingecko',
        } as MarketDataError;
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw {
          code: 'COINGECKO_INVALID_RESPONSE',
          message: 'Invalid response format from CoinGecko',
          source: 'coingecko',
        } as MarketDataError;
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          code: 'COINGECKO_TIMEOUT',
          message: 'Request to CoinGecko timed out',
          source: 'coingecko',
        } as MarketDataError;
      }
      throw error;
    }
  }

  async getMarketData(coinIds: string[]): Promise<CoinGeckoMarketData[]> {
    const params = {
      vs_currency: 'usd',
      ids: coinIds.join(','),
      order: 'market_cap_desc',
      per_page: '250',
      page: '1',
      sparkline: 'true',
      price_change_percentage: '1h,24h,7d',
      locale: 'en',
    };

    return this.fetch<CoinGeckoMarketData[]>('/coins/markets', params);
  }

  /**
   * Provider-backed crypto universe browsing by global market cap rank —
   * not limited to a fixed coin-id allowlist. Real CoinGecko pagination.
   */
  async getTopMarkets(page: number, perPage: number): Promise<CoinGeckoMarketData[]> {
    const params = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: String(perPage),
      page: String(page),
      sparkline: 'true',
      price_change_percentage: '1h,24h,7d',
      locale: 'en',
    };

    return this.fetch<CoinGeckoMarketData[]>('/coins/markets', params);
  }

  async search(query: string): Promise<MarketSearchResult[]> {
    const params = {
      query: query,
    };

    const result = await this.fetch<any>('/search', params);
    
    if (!result || !result.coins || !Array.isArray(result.coins)) {
      return [];
    }

    return result.coins.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol ? coin.symbol.toUpperCase() : 'UNKNOWN',
      name: coin.name || coin.id,
      type: 'crypto',
      source: 'coingecko',
    }));
  }

  async getMarketChart(coinId: string, days: number | string): Promise<any> {
    const params = {
      vs_currency: 'usd',
      days: days.toString(),
    };

    return this.fetch<any>(`/coins/${coinId}/market_chart`, params);
  }

  async getOhlc(coinId: string, days: number | string): Promise<Array<[number, number, number, number, number]>> {
    return this.fetch<Array<[number, number, number, number, number]>>(`/coins/${coinId}/ohlc`, { vs_currency: 'usd', days: days.toString() });
  }

  normalizeAsset(data: CoinGeckoMarketData): CryptoAsset {
    const now = new Date().toISOString();
    
    const price = data.current_price !== undefined && data.current_price !== null ? data.current_price : null;
    const changePercent = data.price_change_percentage_24h !== undefined && data.price_change_percentage_24h !== null ? data.price_change_percentage_24h : null;
    const marketCap = data.market_cap !== undefined && data.market_cap !== null ? data.market_cap : null;
    const volume = data.total_volume !== undefined && data.total_volume !== null ? data.total_volume : null;
    const rank = data.market_cap_rank !== undefined && data.market_cap_rank !== null ? data.market_cap_rank : null;

    return {
      id: data.id || 'unknown',
      symbol: data.symbol ? data.symbol.toUpperCase() : 'UNKNOWN',
      name: data.name || data.id || 'Unknown',
      type: 'crypto',
      price: price,
      change: changePercent,
      changePercent: changePercent,
      currency: 'USD',
      marketCap: (marketCap) ?? 0,
      volume: (volume) ?? 0,
      logo: data.image && typeof data.image === 'string' && data.image.startsWith('https://') ? data.image : null,
      rank: (rank) ?? 0,
      exchange: 'Crypto Market',
      lastUpdated: data.last_updated || now,
      source: 'coingecko',
      sparkline: data.sparkline_in_7d?.price && Array.isArray(data.sparkline_in_7d.price) ? data.sparkline_in_7d.price : null,
    };
  }
}
