import test from 'node:test';
import assert from 'node:assert/strict';
import { orderWithPopularFirst } from './universe-ordering.ts';

const universe = [
  { symbol: 'ZZZ', name: 'ZZZ Corp' },
  { symbol: 'AAA', name: 'AAA Corp' },
  { symbol: 'NVDA', name: 'NVIDIA Corp' },
  { symbol: 'MMM', name: '3M Company' },
];

test('surfaces the curated popular symbols first, in the given order', () => {
  const ordered = orderWithPopularFirst(universe, ['NVDA', 'ZZZ']);
  assert.deepEqual(ordered.map((item) => item.symbol), ['NVDA', 'ZZZ', 'AAA', 'MMM']);
});

test('sorts the remaining universe alphabetically after the popular symbols', () => {
  const ordered = orderWithPopularFirst(universe, []);
  assert.deepEqual(ordered.map((item) => item.symbol), ['AAA', 'MMM', 'NVDA', 'ZZZ']);
});

test('never drops or duplicates a symbol, even if popular list has repeats or misses', () => {
  const ordered = orderWithPopularFirst(universe, ['NVDA', 'NVDA', 'DOES_NOT_EXIST']);
  assert.equal(ordered.length, universe.length);
  assert.equal(new Set(ordered.map((item) => item.symbol)).size, universe.length);
  assert.equal(ordered[0].symbol, 'NVDA');
});
