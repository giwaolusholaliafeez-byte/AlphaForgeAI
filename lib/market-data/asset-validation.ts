export function validateAssetType(type: string): type is 'stock' | 'etf' | 'crypto' | 'fx' | 'index_proxy' {
  return ['stock', 'etf', 'crypto', 'fx', 'index_proxy'].includes(type);
}

export function validateStockSymbol(symbol: string): boolean {
  // Allow uppercase letters, numbers, periods, and hyphens
  return /^[A-Z0-9.-]{1,10}$/.test(symbol);
}

export function validateCryptoId(id: string): boolean {
  // Allow lowercase letters, numbers, and hyphens
  return /^[a-z0-9-]{1,50}$/.test(id);
}

export function validateForexPair(id: string): boolean {
  return /^(?:[A-Za-z]{3}[\/_-]?[A-Za-z]{3})$/.test(id);
}

/**
 * Single source of truth for "is this assetType/assetId combination a
 * routable asset". Used by both the asset detail page and the asset detail
 * API route so they can never drift out of sync.
 *
 * Regression guard: an earlier version of this check lived inline as an
 * if/else-if chain in the page component with a bug — the fx branch's
 * condition was `assetType === 'fx' && !validateForexPair(assetId)`, so a
 * VALID fx pair (condition false) fell through to a catch-all `else {
 * notFound() }` clause meant for unrecognized types. Every valid FX pair
 * therefore 404'd. Centralizing the check here removes the trap entirely.
 */
export function isValidAssetRoute(assetType: string, assetId: string): boolean {
  if (!validateAssetType(assetType)) return false;
  if (assetType === 'stock' || assetType === 'etf') return validateStockSymbol(assetId);
  if (assetType === 'crypto') return validateCryptoId(assetId);
  if (assetType === 'fx') return validateForexPair(assetId);
  // index_proxy has no dedicated id format validator; let getAssetDetail's
  // own type dispatch decide (it currently returns "Unsupported asset type").
  return assetType === 'index_proxy';
}

export function normalizeAssetType(type: string): string {
  return type.toLowerCase().trim();
}

export function normalizeSymbol(symbol: string): string {
  return symbol.toUpperCase().trim();
}
