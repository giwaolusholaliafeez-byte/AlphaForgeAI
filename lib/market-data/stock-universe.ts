import { FinnhubClient } from "./finnhub";
import { orderWithPopularFirst, type UniverseSymbol } from "./universe-ordering";

/**
 * Provider-backed stock/ETF browsing universe. Replaces a hardcoded
 * ~16-symbol list with Finnhub's real US symbol list (~18k common stocks,
 * ~6k ETPs), paginated so we never fetch live quotes for more than one
 * page's worth of symbols at a time.
 */

// A small curated set of liquid, widely-known names shown first on page 1
// so the default view isn't a wall of alphabetical small caps. The FULL
// real universe (thousands of symbols) is reachable via pagination — this
// list only affects default ordering, it is not the extent of what's
// browsable.
const POPULAR_STOCKS = [
  "AAPL", "MSFT", "NVDA", "AMZN", "META", "GOOGL", "TSLA", "AMD",
  "JPM", "V", "NFLX", "INTC", "KO", "DIS", "BA", "XOM", "WMT", "PG",
];
const POPULAR_ETFS = ["SPY", "QQQ", "DIA", "VOO", "IWM", "GLD", "VTI", "ARKK"];

export type { UniverseSymbol };

async function getFullUniverse(apiKey: string): Promise<{ stocks: UniverseSymbol[]; etfs: UniverseSymbol[] }> {
  const client = new FinnhubClient(apiKey);
  const symbols = await client.getUsSymbols();
  const stocks: UniverseSymbol[] = [];
  const etfs: UniverseSymbol[] = [];
  for (const item of symbols) {
    const entry = { symbol: item.symbol, name: item.description };
    if (item.type === "Common Stock") stocks.push(entry);
    else if (item.type === "ETP") etfs.push(entry);
  }
  return { stocks, etfs };
}

export async function getStockUniversePage(
  assetClass: "stock" | "etf",
  page: number,
  pageSize: number,
  apiKey: string
): Promise<{ symbols: UniverseSymbol[]; total: number }> {
  const { stocks, etfs } = await getFullUniverse(apiKey);
  const ordered = assetClass === "etf" ? orderWithPopularFirst(etfs, POPULAR_ETFS) : orderWithPopularFirst(stocks, POPULAR_STOCKS);
  const start = Math.max(0, (page - 1) * pageSize);
  return { symbols: ordered.slice(start, start + pageSize), total: ordered.length };
}
