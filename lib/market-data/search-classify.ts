import type { AssetType } from './types';

/**
 * Classifies a Twelve Data symbol-search instrument_type into a supported
 * AlphaForge asset class, or null if we don't support trading/tracking that
 * instrument type (warrants, trusts, physical-currency duplicates of the
 * FX pairs already sourced separately, etc). Returning null means the
 * caller should drop the result rather than mislabel it.
 */
export function classifyTwelveDataInstrument(instrumentType: string): Extract<AssetType, 'stock' | 'etf'> | null {
  const normalized = instrumentType.toLowerCase();
  if (normalized.includes('etf')) return 'etf';
  if (normalized.includes('common stock')) return 'stock';
  return null;
}
