import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalAssetKey, normalizeAssetIdentity } from './identity.ts';

test('normalizes forex provider symbol variants to one identity', () => {
  const left = normalizeAssetIdentity({ assetType: 'forex', assetId: 'EUR/USD' });
  const right = normalizeAssetIdentity({ assetType: 'fx', assetId: 'FX:EURUSD' });
  assert.equal(left.assetType, 'fx');
  assert.equal(left.displaySymbol, 'EUR/USD');
  assert.equal(left.assetId, 'eurusd');
  assert.equal(canonicalAssetKey(left), canonicalAssetKey(right));
});
