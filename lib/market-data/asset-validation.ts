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

export function normalizeAssetType(type: string): string {
  return type.toLowerCase().trim();
}

export function normalizeSymbol(symbol: string): string {
  return symbol.toUpperCase().trim();
}
