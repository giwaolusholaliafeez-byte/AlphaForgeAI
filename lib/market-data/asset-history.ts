import { AssetHistoricalSeries, AssetHistoricalPoint } from "./types";
import { FinnhubClient } from "./finnhub";
import { CoinGeckoClient } from "./coingecko";

export interface HistoryRange {
  label: string;
  value: string;
  days: number;
  resolution?: string;
}

export const HISTORY_RANGES: HistoryRange[] = [
  { label: "1D", value: "1D", days: 1 },
  { label: "1W", value: "1W", days: 7 },
  { label: "1M", value: "1M", days: 30 },
  { label: "3M", value: "3M", days: 90 },
  { label: "1Y", value: "1Y", days: 365 },
  { label: "5Y", value: "5Y", days: 1825 },
  { label: "MAX", value: "MAX", days: 3650 },
];

export async function getStockHistory(
  symbol: string,
  range: string
): Promise<AssetHistoricalSeries | null> {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const client = new FinnhubClient(apiKey);

    const rangeConfig = HISTORY_RANGES.find((r) => r.value === range);
    if (!rangeConfig) {
      return null;
    }

    const to = Math.floor(Date.now() / 1000);
    const from = to - rangeConfig.days * 24 * 60 * 60;

    let resolution: string;
    if (rangeConfig.days <= 1) resolution = "5";
    else if (rangeConfig.days <= 7) resolution = "15";
    else if (rangeConfig.days <= 30) resolution = "60";
    else if (rangeConfig.days <= 90) resolution = "D";
    else resolution = "W";

    // Use the existing getCandles method from FinnhubClient
    const candles = await client.getCandles(symbol, resolution, from, to);

    if (!candles || !candles.c || candles.c.length === 0) {
      return null;
    }

    const points: AssetHistoricalPoint[] = candles.t.map((timestamp: number, index: number) => ({
      timestamp: timestamp * 1000,
      value: candles.c[index],
    }));

    return {
      points,
      range,
      source: "finnhub",
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.warn(`Failed to fetch history for ${symbol}:`, error);
    return null;
  }
}

export async function getCryptoHistory(
  coinId: string,
  range: string
): Promise<AssetHistoricalSeries | null> {
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const client = new CoinGeckoClient();

    const rangeConfig = HISTORY_RANGES.find((r) => r.value === range);
    if (!rangeConfig) {
      return null;
    }

    let days: number | string = rangeConfig.days;
    if (range === "MAX") days = "max";
    else if (days > 365) days = "max";

    const data = await client.getMarketChart(coinId, days as any);

    if (!data || !data.prices || data.prices.length === 0) {
      return null;
    }

    const points: AssetHistoricalPoint[] = data.prices.map((point: [number, number]) => ({
      timestamp: point[0],
      value: point[1],
    }));

    return {
      points,
      range,
      source: "coingecko",
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.warn(`Failed to fetch history for ${coinId}:`, error);
    return null;
  }
}
