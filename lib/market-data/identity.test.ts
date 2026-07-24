import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalAssetKey, normalizeAssetIdentity } from './identity.ts';

test('normalizes forex provider symbol variants to one identity', () => {
  const left = normalizeAssetIdentity({ assetType: 'forex', assetId: 'EUR/USD' });
  const right = normalizeAssetIdentity({ assetType: 'fx', assetId: 'FX:EURUSD' });
  const third = normalizeAssetIdentity({ assetType: 'fx', assetId: 'EUR-USD' });
  assert.equal(left.assetType, 'fx');
  assert.equal(left.displaySymbol, 'EUR/USD');
  assert.equal(left.assetId, 'eurusd');
  assert.equal(canonicalAssetKey(left), canonicalAssetKey(right));
  assert.equal(canonicalAssetKey(left), canonicalAssetKey(third));
});

test('maps type aliases to their canonical asset type', () => {
  assert.equal(normalizeAssetIdentity({ assetType: 'foreign_exchange', assetId: 'GBPUSD' }).assetType, 'fx');
  assert.equal(normalizeAssetIdentity({ assetType: 'index', assetId: 'SPX' }).assetType, 'index_proxy');
  assert.equal(normalizeAssetIdentity({ assetType: 'proxy', assetId: 'SPX' }).assetType, 'index_proxy');
});

test('leaves non-fx identities unchanged', () => {
  const stock = normalizeAssetIdentity({ assetType: 'stock', assetId: 'AAPL', name: 'Apple Inc' });
  assert.equal(stock.assetType, 'stock');
  assert.equal(stock.assetId, 'AAPL');
  assert.equal(stock.displaySymbol, 'AAPL');
  assert.equal(stock.name, 'Apple Inc');

  const crypto = normalizeAssetIdentity({ assetType: 'crypto', assetId: 'bitcoin', symbol: 'BTC' });
  assert.equal(crypto.assetId, 'bitcoin');
  assert.equal(crypto.displaySymbol, 'BTC');
});
