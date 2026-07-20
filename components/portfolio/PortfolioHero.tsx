"use client";

import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/portfolio/normalizers";
import { cn } from "@/lib/utils";

interface PortfolioHeroProps {
  totalValue: number;
  holdingsValue: number;
  cashBalance: number;
  unrealizedGain: number;
  isPositive: boolean;
  holdingsCount: number;
  className?: string;
}

export default function PortfolioHero({
  totalValue,
  holdingsValue,
  cashBalance,
  unrealizedGain,
  isPositive,
  holdingsCount,
  className,
}: PortfolioHeroProps) {
  const safeTotal = Number.isFinite(totalValue) ? totalValue : 0;
  const safeGain = Number.isFinite(unrealizedGain) ? unrealizedGain : 0;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-[#1E293B] rounded-lg border border-[#1E293B]", className)}>
      {/* Total Value */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-[#A1A7B3] uppercase tracking-wider">Total Portfolio Value</span>
        <span className="text-3xl font-bold text-[#F4B000] tabular-nums mt-1">
          {formatCurrency(safeTotal)}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-sm font-medium flex items-center gap-0.5",
            safeGain >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {safeGain >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {formatCurrency(safeGain)}
          </span>
          <span className="text-xs text-[#A1A7B3]">{holdingsCount} holdings</span>
        </div>
      </div>

      {/* Holdings Value */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-[#A1A7B3] uppercase tracking-wider">Holdings Value</span>
        <span className="text-2xl font-semibold text-white tabular-nums mt-1">
          {formatCurrency(Number.isFinite(holdingsValue) ? holdingsValue : 0)}
        </span>
        <span className="text-xs text-[#A1A7B3] mt-1">Market value of all positions</span>
      </div>

      {/* Cash Balance */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-[#A1A7B3] uppercase tracking-wider">Cash Balance</span>
        <span className="text-2xl font-semibold text-white tabular-nums mt-1">
          {formatCurrency(Number.isFinite(cashBalance) ? cashBalance : 0)}
        </span>
        <span className="text-xs text-[#A1A7B3] mt-1">Available for investment</span>
      </div>
    </div>
  );
}
