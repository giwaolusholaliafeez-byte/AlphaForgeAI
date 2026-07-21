import { AssetHistoricalSeries, AssetHistoricalPoint, AssetCandle } from "./types";
import { FinnhubClient } from "./finnhub";
import { CoinGeckoClient } from "./coingecko";
import { ForexClient } from './forex';
import { normalizeAssetIdentity } from './identity';
import { TwelveDataClient } from './twelve-data';

export interface HistoryRange {
  label: string;
  value: string;
  days: number;
  resolution?: string;
}

export const HISTORY_RANGES: HistoryRange[] = [
  { label: "1D", value: "1D", days: 1 },
  { label: "5D", value: "5D", days: 5 },
  { label: "1W", value: "1W", days: 7 },
  { label: "1M", value: "1M", days: 30 },
  { label: "3M", value: "3M", days: 90 },
  { label: "6M", value: "6M", days: 180 },
  { label: "1Y", value: "1Y", days: 365 },
  { label: "5Y", value: "5Y", days: 1825 },
  { label: "MAX", value: "MAX", days: 3650 },
];

export async function getStockHistory(
  symbol: string,
  range: string,
  interval = '1D'
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
    const requestedResolution: Record<string, string> = { '1m': '1', '5m': '5', '15m': '15', '30m': '30', '1H': '60', '4H': '60', '1D': 'D', '1W': 'W' };
    if (requestedResolution[interval]) resolution = requestedResolution[interval];
    else if (rangeConfig.days <= 1) resolution = "5";
    else if (rangeConfig.days <= 7) resolution = "15";
    else if (rangeConfig.days <= 30) resolution = "60";
    else if (rangeConfig.days <= 90) resolution = "D";
    else resolution = "W";

    // Use the existing getCandles method from FinnhubClient
    const candles = await client.getCandles(symbol, resolution, from, to);

    if (!candles || !candles.c || candles.c.length === 0) {
      return null;
    }

    const normalizedCandles: AssetCandle[] = candles.t.map((timestamp: number, index: number) => ({ timestamp: timestamp * 1000, open: candles.o[index], high: candles.h[index], low: candles.l[index], close: candles.c[index], volume: candles.v?.[index] ?? null })).filter((c: AssetCandle) => [c.open, c.high, c.low, c.close].every(Number.isFinite));
    const points: AssetHistoricalPoint[] = normalizedCandles.map((candle) => ({
      timestamp: candle.timestamp,
      value: candle.close,
    }));

    return {
      points,
      candles: normalizedCandles,
      range,
      source: "finnhub",
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.warn(`Failed to fetch history for ${symbol}:`, error);
    return null;
  }
}

export async function getForexHistory(pair: string, range: string, interval = '1D'): Promise<AssetHistoricalSeries | null> {
  const identity = normalizeAssetIdentity({ assetType: 'fx', assetId: pair });
  const config = HISTORY_RANGES.find((item) => item.value === range);
  if (!config) return null;
  const twelveKey = process.env.TWELVE_DATA_API_KEY;
  const intervalMap: Record<string, string> = { '1m': '1min', '5m': '5min', '15m': '15min', '30m': '30min', '1H': '1h', '4H': '4h', '1D': '1day', '1W': '1week' };
  if (twelveKey && intervalMap[interval]) {
    const outputsize = range === '1D' ? 200 : range === '5D' ? 500 : range === '1M' ? 1000 : range === '3M' ? 2000 : range === '6M' ? 3000 : 5000;
    const response = await new TwelveDataClient(twelveKey).getTimeSeries(identity.displaySymbol, intervalMap[interval], outputsize).catch(() => null);
    const candles = response?.values?.map((item) => ({ timestamp: Date.parse(item.datetime.includes(' ') ? item.datetime.replace(' ', 'T') + 'Z' : item.datetime), open: Number(item.open), high: Number(item.high), low: Number(item.low), close: Number(item.close), volume: item.volume ? Number(item.volume) : null })).filter((item) => Number.isFinite(item.timestamp) && [item.open, item.high, item.low, item.close].every(Number.isFinite));
    if (candles?.length) return { points: candles.map((candle) => ({ timestamp: candle.timestamp, value: candle.close })), candles, range, source: 'twelvedata', lastUpdated: new Date().toISOString() };
  }
  const end = new Date(); const start = new Date(end); start.setUTCDate(start.getUTCDate() - Math.min(config.days, 365));
  const response = await fetch(`https://api.frankfurter.dev/v1/${start.toISOString().slice(0, 10)}..${end.toISOString().slice(0, 10)}?base=${identity.assetId.slice(0, 3).toUpperCase()}&symbols=${identity.assetId.slice(3).toUpperCase()}`, { next: { revalidate: 3600 } });
  if (!response.ok) return null;
  const data = await response.json() as { rates?: Record<string, Record<string, number>> };
  const quote = identity.assetId.slice(3).toUpperCase();
  const points: AssetHistoricalPoint[] = Object.entries(data.rates ?? {}).map(([date, rates]) => ({ timestamp: Date.parse(`${date}T00:00:00Z`), value: rates[quote] })).filter((point) => Number.isFinite(point.value));
  return points.length ? { points, range, source: 'frankfurter', lastUpdated: new Date().toISOString() } : null;
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
