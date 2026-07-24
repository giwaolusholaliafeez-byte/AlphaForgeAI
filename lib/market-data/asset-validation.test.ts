import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidAssetRoute } from './asset-validation.ts';

test('accepts a valid forex pair', () => {
  // Regression test: the asset detail page used to combine the fx type
  // check and the format check into one else-if condition
  // (`assetType === 'fx' && !validateForexPair(assetId)`), so a valid pair
  // made the condition false and fell through to a catch-all notFound().
  // Every valid FX pair 404'd until this was centralized and fixed.
  assert.equal(isValidAssetRoute('fx', 'eurusd'), true);
  assert.equal(isValidAssetRoute('fx', 'GBPUSD'), true);
  assert.equal(isValidAssetRoute('fx', 'EUR/USD'), true);
});

test('rejects an invalid forex pair', () => {
  assert.equal(isValidAssetRoute('fx', 'not-a-pair'), false);
  assert.equal(isValidAssetRoute('fx', ''), false);
});

test('accepts valid stock, etf, and crypto identifiers', () => {
  assert.equal(isValidAssetRoute('stock', 'AAPL'), true);
  assert.equal(isValidAssetRoute('etf', 'SPY'), true);
  assert.equal(isValidAssetRoute('crypto', 'bitcoin'), true);
});

test('rejects invalid identifiers for their asset type', () => {
  assert.equal(isValidAssetRoute('stock', 'not valid!'), false);
  assert.equal(isValidAssetRoute('crypto', 'BITCOIN'), false); // crypto ids are lowercase
});

test('rejects unsupported asset types', () => {
  assert.equal(isValidAssetRoute('bond', 'US10Y'), false);
  assert.equal(isValidAssetRoute('', 'AAPL'), false);
});
