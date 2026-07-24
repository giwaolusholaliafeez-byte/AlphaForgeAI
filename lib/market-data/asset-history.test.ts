import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCoinGeckoOhlc } from './candles.ts';

test('normalizes genuine CoinGecko OHLC without inventing volume', () => {
  const candles = normalizeCoinGeckoOhlc([[1000, 10, 12, 9, 11]]);
  assert.deepEqual(candles[0], { timestamp: 1000, open: 10, high: 12, low: 9, close: 11, volume: null });
});

test('rejects malformed OHLC instead of creating a candle', () => {
  assert.deepEqual(normalizeCoinGeckoOhlc([[1000, 10, Number.NaN, 9, 11]]), []);
});
