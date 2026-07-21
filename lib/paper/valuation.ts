export interface PersistedPaperPosition { id: string; assetType: string; assetId: string; symbol: string; quantity: number; averageCost: number; }
export interface MarkedPaperPosition extends PersistedPaperPosition { currentPrice: number | null; marketValue: number | null; unrealizedPnl: number | null; unrealizedPnlPercent: number | null; }

export function markPaperPositions(positions: PersistedPaperPosition[], prices: Map<string, number>): MarkedPaperPosition[] {
  return positions.map((position) => {
    const currentPrice = prices.get(position.id) ?? null;
    const marketValue = currentPrice === null ? null : currentPrice * position.quantity;
    const unrealizedPnl = marketValue === null ? null : marketValue - position.quantity * position.averageCost;
    return { ...position, currentPrice, marketValue, unrealizedPnl, unrealizedPnlPercent: unrealizedPnl === null || position.averageCost === 0 ? null : unrealizedPnl / (position.quantity * position.averageCost) * 100 };
  });
}

export function calculatePaperEquity(cash: number, positions: MarkedPaperPosition[]): number {
  return cash + positions.reduce((total, position) => total + (position.marketValue ?? 0), 0);
}
