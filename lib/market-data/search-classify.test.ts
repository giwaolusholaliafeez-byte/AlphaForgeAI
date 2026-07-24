import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTwelveDataInstrument } from './search-classify.ts';

test('classifies real stock and ETF instrument types', () => {
  assert.equal(classifyTwelveDataInstrument('Common Stock'), 'stock');
  assert.equal(classifyTwelveDataInstrument('ETF'), 'etf');
});

test('drops Physical Currency instead of mislabeling FX as a stock', () => {
  // Regression test: Twelve Data returns forex pairs like EUR/USD with
  // instrument_type "Physical Currency", which used to fall through to
  // "stock" (only "forex" was matched), showing a duplicate/mislabeled FX
  // result and letting an unsupported assetId reach the stock code path.
  assert.equal(classifyTwelveDataInstrument('Physical Currency'), null);
});

test('drops unsupported instrument types like warrants and trusts', () => {
  assert.equal(classifyTwelveDataInstrument('Warrant'), null);
  assert.equal(classifyTwelveDataInstrument('Investment Trust'), null);
  assert.equal(classifyTwelveDataInstrument('Unit'), null);
});
