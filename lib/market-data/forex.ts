import { MarketDataError } from './types';

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v1';

export interface ForexAsset {
  id: string;
  pair: string;
  base: string;
  quote: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  previousClose: number | null;
  currentDate: string | null;
  previousDate: string | null;
  currency: string;
  source: string;
  lastUpdated: string | null;
  exchange: string;
}

interface FrankfurterTimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

// Currency pairs to display
const CURRENCY_PAIRS = [
  { id: 'eur_usd', base: 'EUR', quote: 'USD', display: 'EUR/USD' },
  { id: 'gbp_usd', base: 'GBP', quote: 'USD', display: 'GBP/USD' },
  { id: 'usd_jpy', base: 'USD', quote: 'JPY', display: 'USD/JPY' },
  { id: 'usd_chf', base: 'USD', quote: 'CHF', display: 'USD/CHF' },
  { id: 'aud_usd', base: 'AUD', quote: 'USD', display: 'AUD/USD' },
  { id: 'usd_cad', base: 'USD', quote: 'CAD', display: 'USD/CAD' },
  { id: 'nzd_usd', base: 'NZD', quote: 'USD', display: 'NZD/USD' },
  { id: 'eur_gbp', base: 'EUR', quote: 'GBP', display: 'EUR/GBP' },
  { id: 'eur_jpy', base: 'EUR', quote: 'JPY', display: 'EUR/JPY' },
  { id: 'gbp_jpy', base: 'GBP', quote: 'JPY', display: 'GBP/JPY' },
  { id: 'gbp_chf', base: 'GBP', quote: 'CHF', display: 'GBP/CHF' },
  { id: 'aud_jpy', base: 'AUD', quote: 'JPY', display: 'AUD/JPY' },
  { id: 'cad_jpy', base: 'CAD', quote: 'JPY', display: 'CAD/JPY' },
];

// Currencies needed for calculations
const REQUIRED_CURRENCIES = ['USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

export class ForexClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = FRANKFURTER_BASE_URL;
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getRate(rates: Record<string, number>, currency: string): number | null {
    if (currency === 'EUR') {
      return 1;
    }
    
    const value = rates[currency];
    if (value !== undefined && value !== null && Number.isFinite(value) && value > 0) {
      return value;
    }
    return null;
  }

  private calculateCrossRate(
    rates: Record<string, number>,
    base: string,
    quote: string
  ): number | null {
    // If base is same as quote, return 1
    if (base === quote) return 1;
    
    // If base is EUR, direct rate
    if (base === 'EUR') {
      return this.getRate(rates, quote);
    }
    
    // If quote is EUR, invert the rate
    if (quote === 'EUR') {
      const baseRate = this.getRate(rates, base);
      return baseRate !== null ? 1 / baseRate : null;
    }
    
    // Otherwise, cross rate through EUR
    const baseRate = this.getRate(rates, base);
    const quoteRate = this.getRate(rates, quote);
    
    if (baseRate !== null && quoteRate !== null) {
      return quoteRate / baseRate;
    }
    
    return null;
  }

  async getRates(): Promise<Map<string, ForexAsset>> {
    try {
      // Get dates for the last 10 days
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 10);

      const startStr = this.formatDate(startDate);
      const endStr = this.formatDate(endDate);

      // Build URL correctly
      const url = new URL(`${this.baseUrl}/${startStr}..${endStr}`);
      url.searchParams.set('base', 'EUR');
      url.searchParams.set('symbols', REQUIRED_CURRENCIES.join(','));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
        next: { revalidate: 3600 }, // Cache for 1 hour
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
          code: `FRANKFURTER_${response.status}`,
          message: errorMessage,
          source: 'frankfurter',
        } as MarketDataError;
      }

      const data = await response.json() as FrankfurterTimeSeriesResponse;

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw {
          code: 'FRANKFURTER_INVALID_RESPONSE',
          message: 'Invalid response structure from Frankfurter',
          source: 'frankfurter',
        } as MarketDataError;
      }

      if (!data.rates || typeof data.rates !== 'object') {
        throw {
          code: 'FRANKFURTER_NO_RATES',
          message: 'No rate data available from Frankfurter',
          source: 'frankfurter',
        } as MarketDataError;
      }

      // Get sorted dates
      const dates = Object.keys(data.rates).sort();
      if (dates.length < 2) {
        throw {
          code: 'FRANKFURTER_INSUFFICIENT_DATA',
          message: 'Insufficient historical data from Frankfurter',
          source: 'frankfurter',
        } as MarketDataError;
      }

      // Get current and previous dates
      const currentDate = dates[dates.length - 1];
      const previousDate = dates[dates.length - 2];
      
      const currentRates = data.rates[currentDate];
      const previousRates = data.rates[previousDate];

      if (!currentRates || typeof currentRates !== 'object') {
        throw {
          code: 'FRANKFURTER_INVALID_CURRENT',
          message: 'Invalid current date rates from Frankfurter',
          source: 'frankfurter',
        } as MarketDataError;
      }

      const results = new Map<string, ForexAsset>();
      const now = new Date().toISOString();

      CURRENCY_PAIRS.forEach(pair => {
        // Calculate current rate
        const currentRate = this.calculateCrossRate(currentRates, pair.base, pair.quote);
        
        // Calculate previous rate
        let previousRate: number | null = null;
        if (previousRates && typeof previousRates === 'object') {
          previousRate = this.calculateCrossRate(previousRates, pair.base, pair.quote);
        }

        if (currentRate !== null && Number.isFinite(currentRate) && currentRate > 0) {
          let change: number | null = null;
          let changePercent: number | null = null;
          
          if (previousRate !== null && Number.isFinite(previousRate) && previousRate > 0) {
            change = currentRate - previousRate;
            changePercent = (change / previousRate) * 100;
          }

          results.set(pair.id.replace('_', ''), {
            id: pair.id.replace('_', ''),
            pair: pair.display,
            base: pair.base,
            quote: pair.quote,
            price: currentRate,
            change: change,
            changePercent: changePercent,
            previousClose: previousRate,
            currentDate: currentDate,
            previousDate: previousRate !== null ? previousDate : null,
            currency: pair.quote,
            source: 'Frankfurter Daily Reference Rates',
            lastUpdated: now,
            exchange: 'FX Reference Market',
          });
        }
      });

      return results;
    } catch (error) {
      console.error('FX fetch error:', error);
      throw error;
    }
  }
}

export { CURRENCY_PAIRS };
