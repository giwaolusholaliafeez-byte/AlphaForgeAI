import type { AssetCandle } from './types';

export function normalizeCoinGeckoOhlc(values: Array<[number, number, number, number, number]>): AssetCandle[] {
  return values.map(([timestamp, open, high, low, close]) => ({ timestamp, open, high, low, close, volume: null })).filter((candle) => Number.isFinite(candle.timestamp) && [candle.open, candle.high, candle.low, candle.close].every(Number.isFinite));
}
