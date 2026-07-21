import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePaperEquity, markPaperPositions } from './valuation.ts';

test('quote updates drive mark-to-market equity without changing accounting basis', () => {
  const position = { id: '1', assetType: 'stock', assetId: 'AAPL', symbol: 'AAPL', quantity: 10, averageCost: 100 };
  const marked = markPaperPositions([position], new Map([['1', 125]]))[0];
  assert.equal(marked.unrealizedPnl, 250);
  assert.equal(marked.averageCost, 100);
  assert.equal(calculatePaperEquity(99000, [marked]), 100250);
});
