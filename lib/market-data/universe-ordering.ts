// Pure, dependency-free ordering logic — kept as its own leaf module so it
// stays unit-testable under `node --test` without pulling in provider
// clients (Node's ESM loader can't resolve this project's extensionless
// internal imports when a .ts file is executed directly, so any test that
// imports a module transitively importing e.g. FinnhubClient fails to load).

export interface UniverseSymbol {
  symbol: string;
  name: string;
}

export function orderWithPopularFirst(all: UniverseSymbol[], popular: string[]): UniverseSymbol[] {
  const bySymbol = new Map(all.map((item) => [item.symbol, item]));
  const ordered: UniverseSymbol[] = [];
  const seen = new Set<string>();
  for (const symbol of popular) {
    const match = bySymbol.get(symbol);
    if (match && !seen.has(symbol)) {
      ordered.push(match);
      seen.add(symbol);
    }
  }
  const rest = all.filter((item) => !seen.has(item.symbol)).sort((a, b) => a.symbol.localeCompare(b.symbol));
  return [...ordered, ...rest];
}
