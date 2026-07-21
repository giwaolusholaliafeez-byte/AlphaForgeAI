import { FinnhubClient } from './finnhub';
import type { AssetNewsItem } from './types';

export type NewsCategory = 'latest' | 'markets' | 'stocks' | 'crypto' | 'macro';

export async function getCurrentNews(category: NewsCategory = 'latest'): Promise<AssetNewsItem[]> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return [];
  const client = new FinnhubClient(key);
  if (category === 'latest' || category === 'markets' || category === 'macro') return (await client.getMarketNews('general').catch(() => [])).sort((a, b) => b.datetime.localeCompare(a.datetime)).slice(0, 50);
  const symbols = category === 'crypto' ? ['COIN', 'MSTR'] : ['SPY', 'NVDA', 'AAPL', 'MSFT', 'TSLA'];
  const to = new Date(); const from = new Date(to.getTime() - 3 * 24 * 60 * 60 * 1000); const fromDate = from.toISOString().slice(0, 10); const toDate = to.toISOString().slice(0, 10);
  const items = (await Promise.all(symbols.map((symbol) => client.getCompanyNews(symbol, fromDate, toDate).catch(() => [])))).flat();
  return items.sort((a, b) => b.datetime.localeCompare(a.datetime)).slice(0, 50);
}
