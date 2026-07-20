"use client";

import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import { formatCurrency } from "@/lib/portfolio/normalizers";

interface PortfolioSummaryCardsProps {
  totalValue: number;
  holdingsValue: number;
  cashBalance: number;
  unrealizedGain: number;
  isPositive: boolean;
  holdingsCount: number;
}

export default function PortfolioSummaryCards({
  totalValue,
  holdingsValue,
  cashBalance,
  unrealizedGain,
  isPositive,
  holdingsCount,
}: PortfolioSummaryCardsProps) {
  // Ensure all values are valid numbers
  const safeTotal = Number.isFinite(totalValue) ? totalValue : 0;
  const safeHoldings = Number.isFinite(holdingsValue) ? holdingsValue : 0;
  const safeCash = Number.isFinite(cashBalance) ? cashBalance : 0;
  const safeGain = Number.isFinite(unrealizedGain) ? unrealizedGain : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Portfolio Value"
        value={formatCurrency(safeTotal)}
        icon={<Wallet className="h-5 w-5" />}
        emphasis="gold"
      />
      <MetricCard
        label="Holdings Value"
        value={formatCurrency(safeHoldings)}
        icon={<PieChart className="h-5 w-5" />}
        change={`${holdingsCount} assets`}
      />
      <MetricCard
        label="Cash Balance"
        value={formatCurrency(safeCash)}
        icon={<DollarSign className="h-5 w-5" />}
      />
      <MetricCard
        label="Unrealized Gain/Loss"
        value={formatCurrency(safeGain)}
        icon={safeGain >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        change={safeGain >= 0 ? 'Gain' : 'Loss'}
        changePositive={safeGain >= 0}
      />
    </div>
  );
}
