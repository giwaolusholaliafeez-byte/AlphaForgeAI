import type { ValuedHolding } from "@/lib/portfolio/valuation";
import type { DashboardMarketSnapshot } from "@/lib/dashboard/live-market";

export interface IntelligenceHolding {
  symbol: string;
  assetType: string;
  value: number;
  allocation: number;
  unrealizedGain: number | null;
  dailyContribution: number | null;
}

export interface PortfolioIntelligence {
  totalValue: number;
  cashValue: number;
  cashAllocation: number;
  holdings: IntelligenceHolding[];
  largestPosition: IntelligenceHolding | null;
  topThreeAllocation: number;
  cryptoAllocation: number;
  equityAllocation: number;
  dailyChange: number | null;
  dailyChangePercent: number | null;
  dailyCoverage: number;
  diversification: "Limited" | "Moderate" | "Broad";
  risks: string[];
}

export function buildPortfolioIntelligence(valuedHoldings: ValuedHolding[], cashValue: number, snapshots: DashboardMarketSnapshot[]): PortfolioIntelligence {
  const safeCash = Number.isFinite(cashValue) && cashValue > 0 ? cashValue : 0;
  const priced = valuedHoldings.filter((item) => item.marketValue !== null && item.marketValue > 0);
  const totalValue = safeCash + priced.reduce((sum, item) => sum + (item.marketValue ?? 0), 0);
  const snapshotMap = new Map(snapshots.map((snapshot) => [snapshot.symbol.toUpperCase(), snapshot]));
  const holdings = priced.map((item) => {
    const value = item.marketValue ?? 0;
    const snapshot = snapshotMap.get(item.holding.symbol.toUpperCase());
    return { symbol: item.holding.symbol, assetType: item.holding.assetType, value, allocation: totalValue > 0 ? (value / totalValue) * 100 : 0, unrealizedGain: item.unrealizedGain, dailyContribution: snapshot?.changePercent == null ? null : value * snapshot.changePercent / 100 };
  }).sort((a, b) => b.value - a.value);
  const dailyItems = holdings.filter((item) => item.dailyContribution !== null);
  const dailyChange = dailyItems.length === 0 ? null : dailyItems.reduce((sum, item) => sum + (item.dailyContribution ?? 0), 0);
  const largestPosition = holdings[0] ?? null;
  const topThreeAllocation = holdings.slice(0, 3).reduce((sum, item) => sum + item.allocation, 0);
  const cryptoAllocation = holdings.filter((item) => item.assetType === "crypto").reduce((sum, item) => sum + item.value, 0) / Math.max(totalValue, 1) * 100;
  const equityAllocation = holdings.filter((item) => item.assetType === "stock" || item.assetType === "etf" || item.assetType === "index_proxy").reduce((sum, item) => sum + item.value, 0) / Math.max(totalValue, 1) * 100;
  const diversification = holdings.length <= 2 || topThreeAllocation >= 75 ? "Limited" : holdings.length <= 5 || topThreeAllocation >= 55 ? "Moderate" : "Broad";
  const risks: string[] = [];
  if (largestPosition && largestPosition.allocation >= 25) risks.push(`${largestPosition.symbol} represents ${largestPosition.allocation.toFixed(1)}% of the portfolio, creating single-position concentration.`);
  if (topThreeAllocation >= 60) risks.push(`Your three largest positions represent ${topThreeAllocation.toFixed(1)}% of the portfolio.`);
  if (cryptoAllocation >= 20) risks.push(`Crypto exposure is ${cryptoAllocation.toFixed(1)}% of the portfolio and may increase volatility.`);
  if (safeCash / Math.max(totalValue, 1) >= 25) risks.push(`Cash represents ${(safeCash / Math.max(totalValue, 1) * 100).toFixed(1)}% of the portfolio.`);
  if (risks.length === 0) risks.push("No concentration signal crossed the current review thresholds.");
  return { totalValue, cashValue: safeCash, cashAllocation: totalValue > 0 ? safeCash / totalValue * 100 : 0, holdings, largestPosition, topThreeAllocation, cryptoAllocation, equityAllocation, dailyChange, dailyChangePercent: dailyChange === null || totalValue === 0 ? null : dailyChange / totalValue * 100, dailyCoverage: holdings.length === 0 ? 0 : dailyItems.length / holdings.length * 100, diversification, risks };
}
