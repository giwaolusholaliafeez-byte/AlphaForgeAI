import { CoinGeckoClient } from "@/lib/market-data/coingecko";
import { FinnhubClient } from "@/lib/market-data/finnhub";

export interface DashboardMarketSnapshot {
  symbol: string;
  label: string;
  name: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  href: string;
}

export async function getLiveDashboardMarketData(): Promise<DashboardMarketSnapshot[]> {
  const snapshots: DashboardMarketSnapshot[] = [];
  const stockSymbols = ["SPY", "QQQ", "VOO", "NVDA", "AAPL", "TSLA", "AMD", "META", "INTC"];
  const stockKey = process.env.FINNHUB_API_KEY;

  if (stockKey) {
    const quotes = await new FinnhubClient(stockKey).getMultipleQuotes(stockSymbols);
    for (const symbol of stockSymbols) {
      const quote = quotes.get(symbol);
      if (!quote || !Number.isFinite(quote.c)) continue;
      const isEtf = ["SPY", "QQQ", "VOO"].includes(symbol);
      snapshots.push({ symbol, label: isEtf ? symbol : symbol, name: symbol, price: quote.c, change: quote.d, changePercent: quote.dp, href: `/dashboard/markets/${isEtf ? "etf" : "stock"}/${symbol}` });
    }
  }

  try {
    const crypto = (await new CoinGeckoClient().getMarketData(["bitcoin"]))[0];
    if (crypto && Number.isFinite(crypto.current_price)) snapshots.push({ symbol: "BTC", label: "Bitcoin", name: crypto.name, price: crypto.current_price, change: crypto.current_price * ((crypto.price_change_percentage_24h ?? 0) / 100), changePercent: crypto.price_change_percentage_24h, href: "/dashboard/markets/crypto/bitcoin" });
  } catch (error) {
    console.warn("Dashboard crypto snapshot unavailable", error instanceof Error ? error.message : "unknown error");
  }
  return snapshots;
}
