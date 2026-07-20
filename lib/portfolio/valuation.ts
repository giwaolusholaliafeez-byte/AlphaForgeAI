import { PortfolioHolding } from "@/types/portfolio";
import { getCurrentPrices } from "./prices";
import { toFiniteNumber } from "./normalizers";

export interface ValuedHolding {
  holding: PortfolioHolding;
  currentPrice: number | null;
  marketValue: number | null;
  costBasis: number;
  unrealizedGain: number | null;
  returnPercentage: number | null;
  allocationPercentage: number;
}

export interface PortfolioValuation {
  holdingsValue: number;
  cashBalance: number;
  totalValue: number;
  totalCostBasis: number;
  totalUnrealizedGain: number;
  returnPercentage: number | null;
  valuedHoldings: ValuedHolding[];
  unavailablePrices: string[];
}

export async function calculatePortfolioValuation(
  holdings: PortfolioHolding[] = [],
  cashBalance: number = 0
): Promise<PortfolioValuation> {
  const safeHoldings = Array.isArray(holdings) ? holdings : [];

  if (safeHoldings.length === 0) {
    return {
      holdingsValue: 0,
      cashBalance: toFiniteNumber(cashBalance, 0),
      totalValue: toFiniteNumber(cashBalance, 0),
      totalCostBasis: 0,
      totalUnrealizedGain: 0,
      returnPercentage: null,
      valuedHoldings: [],
      unavailablePrices: [],
    };
  }

  const priceMap = await getCurrentPrices(safeHoldings);

  const valuedHoldings: ValuedHolding[] = [];
  const unavailablePrices: string[] = [];
  let holdingsValue = 0;
  let totalCostBasis = 0;

  safeHoldings.forEach((holding) => {
    const currentPrice = priceMap.get(holding.id) || null;
    const costBasis = toFiniteNumber(holding.quantity * holding.averageCost, 0);
    totalCostBasis += costBasis;

    let marketValue: number | null = null;
    let unrealizedGain: number | null = null;
    let returnPercentage: number | null = null;

    if (currentPrice !== null && Number.isFinite(currentPrice) && currentPrice > 0) {
      marketValue = toFiniteNumber(holding.quantity * currentPrice, 0);
      holdingsValue += marketValue;
      unrealizedGain = toFiniteNumber(marketValue - costBasis, 0);
      returnPercentage = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : null;
    } else {
      unavailablePrices.push(holding.symbol);
    }

    valuedHoldings.push({
      holding,
      currentPrice,
      marketValue,
      costBasis,
      unrealizedGain,
      returnPercentage,
      allocationPercentage: 0,
    });
  });

  const totalValue = holdingsValue + toFiniteNumber(cashBalance, 0);
  valuedHoldings.forEach((vh) => {
    if (vh.marketValue !== null && totalValue > 0) {
      vh.allocationPercentage = (vh.marketValue / totalValue) * 100;
    }
  });

  const totalUnrealizedGain = toFiniteNumber(
    totalValue - totalCostBasis - toFiniteNumber(cashBalance, 0),
    0
  );

  return {
    holdingsValue,
    cashBalance: toFiniteNumber(cashBalance, 0),
    totalValue,
    totalCostBasis,
    totalUnrealizedGain,
    returnPercentage: totalCostBasis > 0 ? (totalUnrealizedGain / totalCostBasis) * 100 : null,
    valuedHoldings,
    unavailablePrices,
  };
}

export function calculateAllocation(
  valuedHoldings: ValuedHolding[] = []
): Array<{ assetType: string; value: number; percentage: number; color: string }> {
  const safeHoldings = Array.isArray(valuedHoldings) ? valuedHoldings : [];

  if (safeHoldings.length === 0) {
    return [];
  }

  const allocationMap = new Map<string, number>();

  safeHoldings.forEach((valuedHolding) => {
    if (!valuedHolding || !valuedHolding.holding) {
      return;
    }

    const marketValue = valuedHolding.marketValue;
    if (typeof marketValue !== "number" || !Number.isFinite(marketValue) || marketValue <= 0) {
      return;
    }

    const assetType = valuedHolding.holding.assetType;
    if (!assetType) {
      return;
    }

    const current = allocationMap.get(assetType) ?? 0;
    allocationMap.set(assetType, current + marketValue);
  });

  if (allocationMap.size === 0) {
    return [];
  }

  const totalValue = Array.from(allocationMap.values()).reduce((total, value) => total + value, 0);

  if (totalValue <= 0) {
    return [];
  }

  const colors: Record<string, string> = {
    stock: "#2563EB",
    etf: "#00C2A8",
    crypto: "#F4B000",
    fx: "#A1A7B3",
    index_proxy: "#3B82F6",
  };

  return Array.from(allocationMap.entries()).map(([assetType, value]) => ({
    assetType,
    value,
    percentage: (value / totalValue) * 100,
    color: colors[assetType] || "#A1A7B3",
  }));
}
