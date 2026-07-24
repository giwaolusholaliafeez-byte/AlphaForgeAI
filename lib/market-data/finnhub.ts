import { FinnhubQuote, FinnhubSearchResult, FinnhubProfile, StockAsset, MarketDataError, AssetNewsItem, EarningsCalendarItem, IpoCalendarItem } from "./types";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export class FinnhubClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = FINNHUB_BASE_URL;
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append("token", this.apiKey);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
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
          code: `FINNHUB_${response.status}`,
          message: errorMessage,
          source: "finnhub",
        } as MarketDataError;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw {
          code: "FINNHUB_TIMEOUT",
          message: "Request to Finnhub timed out",
          source: "finnhub",
        } as MarketDataError;
      }
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<FinnhubQuote> {
    return this.fetch<FinnhubQuote>("/quote", { symbol });
  }

  async search(query: string): Promise<FinnhubSearchResult> {
    return this.fetch<FinnhubSearchResult>("/search", { q: query });
  }

  async getProfile(symbol: string): Promise<FinnhubProfile> {
    return this.fetch<FinnhubProfile>("/stock/profile2", { symbol });
  }

  async getCompanyNews(symbol: string, from: string, to: string): Promise<AssetNewsItem[]> {
    const items = await this.fetch<Array<{ id?: number; headline?: string; summary?: string; source?: string; url?: string; datetime?: number; image?: string; category?: string }>>("/company-news", { symbol, from, to });
    return items.filter((item) => item.headline && item.url && item.datetime).map((item) => ({ id: String(item.id ?? `${symbol}-${item.datetime}`), headline: item.headline as string, summary: item.summary, source: item.source ?? "Finnhub", url: item.url as string, datetime: new Date((item.datetime as number) * 1000).toISOString(), image: item.image, category: item.category }));
  }

  async getMarketNews(category = 'general'): Promise<AssetNewsItem[]> {
    const items = await this.fetch<Array<{ id?: number; headline?: string; summary?: string; source?: string; url?: string; datetime?: number; image?: string; category?: string; related?: string }>>('/news', { category });
    return items.filter((item) => item.headline && item.url && item.datetime).map((item) => ({ id: String(item.id ?? `${item.headline}-${item.datetime}`), headline: item.headline as string, summary: item.summary, source: item.source ?? 'Finnhub', url: item.url as string, datetime: new Date((item.datetime as number) * 1000).toISOString(), image: item.image, category: item.category ?? category, relatedAsset: item.related ?? null }));
  }

  async getEarningsCalendar(from: string, to: string): Promise<EarningsCalendarItem[]> {
    const data = await this.fetch<{ earningsCalendar?: Array<{ symbol?: string; date?: string; hour?: string; quarter?: number; year?: number; epsEstimate?: number | null; epsActual?: number | null; revenueEstimate?: number | null; revenueActual?: number | null }> }>("/calendar/earnings", { from, to });
    return (data.earningsCalendar ?? [])
      .filter((item) => item.symbol && item.date)
      .map((item) => ({
        symbol: item.symbol as string,
        date: item.date as string,
        hour: item.hour || null,
        quarter: item.quarter ?? null,
        year: item.year ?? null,
        epsEstimate: item.epsEstimate ?? null,
        epsActual: item.epsActual ?? null,
        revenueEstimate: item.revenueEstimate ?? null,
        revenueActual: item.revenueActual ?? null,
      }));
  }

  async getIpoCalendar(from: string, to: string): Promise<IpoCalendarItem[]> {
    const data = await this.fetch<{ ipoCalendar?: Array<{ symbol?: string; name?: string; date?: string; exchange?: string; price?: string; numberOfShares?: number; totalSharesValue?: number; status?: string }> }>("/calendar/ipo", { from, to });
    return (data.ipoCalendar ?? [])
      .filter((item) => item.name && item.date)
      .map((item) => ({
        symbol: item.symbol || null,
        name: item.name as string,
        date: item.date as string,
        exchange: item.exchange || null,
        priceRange: item.price || null,
        numberOfShares: item.numberOfShares ?? null,
        totalSharesValue: item.totalSharesValue ?? null,
        status: item.status || "expected",
      }));
  }

  async getMultipleQuotes(symbols: string[]): Promise<Map<string, FinnhubQuote>> {
    const results = new Map<string, FinnhubQuote>();

    const batchSize = 10;
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
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }

    return results;
  }

  async getCandles(symbol: string, resolution: string, from: number, to: number): Promise<any> {
    return this.fetch("/stock/candle", {
      symbol,
      resolution,
      from: from.toString(),
      to: to.toString(),
    });
  }

  normalizeQuote(symbol: string, quote: FinnhubQuote, profile?: FinnhubProfile): StockAsset {
    const now = new Date().toISOString();

    return {
      id: symbol,
      symbol: symbol,
      name: profile?.name || symbol,
      type:
        symbol.startsWith("SPY") || symbol.startsWith("QQQ") || symbol.startsWith("DIA") || symbol.startsWith("VOO")
          ? "etf"
          : "stock",
      price: quote.c || null,
      change: quote.d || null,
      changePercent: quote.dp || null,
      currency: profile?.currency || "USD",
      marketCap: profile?.marketCapitalization || null,
      volume: null,
      logo: profile?.logo || null,
      exchange: (profile?.exchange || null) ?? "",
      industry: profile?.finnhubIndustry || null,
      country: profile?.country || null,
      lastUpdated: quote.t ? new Date(quote.t * 1000).toISOString() : now,
      source: "finnhub",
    };
  }
}
