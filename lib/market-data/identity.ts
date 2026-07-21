import type { AssetIdentity, AssetType } from './types';

const aliases: Record<string, AssetType> = { forex: 'fx', foreign_exchange: 'fx', index: 'index_proxy', proxy: 'index_proxy' };

export function normalizeAssetIdentity(input: { assetType: string; assetId: string; symbol?: string; name?: string; provider?: string; providerId?: string }): AssetIdentity {
  const assetType = aliases[input.assetType.toLowerCase().trim()] ?? input.assetType.toLowerCase().trim() as AssetType;
  const raw = input.assetId.trim();
  const isFx = assetType === 'fx';
  const compactWithPrefix = raw.toUpperCase().replace(/[^A-Z]/g, '');
  const compact = isFx && compactWithPrefix.startsWith('FX') && compactWithPrefix.length === 8 ? compactWithPrefix.slice(2) : compactWithPrefix;
  const displaySymbol = isFx && compact.length === 6 ? `${compact.slice(0, 3)}/${compact.slice(3)}` : (input.symbol ?? raw).toUpperCase();
  const assetId = isFx && compact.length === 6 ? compact.toLowerCase() : raw;
  return { assetType, assetId, symbol: compact || displaySymbol, displaySymbol, name: input.name?.trim() || displaySymbol, providerIdentifiers: input.provider && input.providerId ? { [input.provider]: input.providerId } : {} };
}

export function canonicalAssetKey(identity: Pick<AssetIdentity, 'assetType' | 'assetId'>): string {
  return `${identity.assetType}:${identity.assetId}`;
}
