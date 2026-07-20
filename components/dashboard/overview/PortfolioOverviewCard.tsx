"use client";

import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PortfolioOverviewCardProps {
  totalValue: number;
  cashBalance: number;
  holdingsValue: number;
  unrealizedGain: number;
  holdingsCount: number;
  isPositive: boolean;
  isDemo?: boolean;
  isLoading?: boolean;
  onCreatePortfolio?: () => void;
}

export default function PortfolioOverviewCard({
  totalValue,
  cashBalance,
  holdingsValue,
  unrealizedGain,
  holdingsCount,
  isPositive,
  isDemo = false,
  isLoading = false,
  onCreatePortfolio,
}: PortfolioOverviewCardProps) {
  const formatCurrency = (value: number) => {
    if (!Number.isFinite(value)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-6 animate-pulse">
        <div className="h-4 w-24 bg-white/[0.04] rounded mb-4" />
        <div className="h-8 w-32 bg-white/[0.04] rounded mb-2" />
        <div className="h-4 w-20 bg-white/[0.04] rounded" />
      </div>
    );
  }

  if (!isDemo && holdingsCount === 0 && !totalValue) {
    return (
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-[#0B0F1A]">
            <Wallet className="h-6 w-6 text-[#A1A7B3]" />
          </div>
        </div>
        <h3 className="text-sm font-medium text-white mb-1">No Portfolio Yet</h3>
        <p className="text-xs text-[#A1A7B3] mb-4">Create your first portfolio to start tracking</p>
        {onCreatePortfolio ? <Button onClick={onCreatePortfolio} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-sm">Create Portfolio</Button> : <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-sm"><Link href="/dashboard/portfolio">Create Portfolio</Link></Button>}
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-[#A1A7B3] uppercase tracking-wider">
          {isDemo ? "Simulated Portfolio" : "Portfolio Overview"}
        </span>
        {isDemo && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4B000]/10 text-[#F4B000] border border-[#F4B000]/20">
            Demo
          </span>
        )}
      </div>

      <div className="mt-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-[#F4B000] tabular-nums">
            {formatCurrency(totalValue)}
          </span>
          {unrealizedGain !== 0 && (
            <span className={cn(
              "text-xs font-medium flex items-center gap-0.5",
              isPositive ? "text-green-500" : "text-red-500"
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {formatCurrency(unrealizedGain)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.06]">
        <div>
          <p className="text-[10px] text-[#A1A7B3] uppercase tracking-wider">Holdings</p>
          <p className="text-sm font-medium text-white tabular-nums">{formatCurrency(holdingsValue)}</p>
          <p className="text-[10px] text-[#A1A7B3]">{holdingsCount} assets</p>
        </div>
        <div>
          <p className="text-[10px] text-[#A1A7B3] uppercase tracking-wider">Cash</p>
          <p className="text-sm font-medium text-white tabular-nums">{formatCurrency(cashBalance)}</p>
        </div>
        <div className="flex items-end justify-end">
          <Link href="/dashboard/portfolio">
            <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#2563EB]/80 text-xs h-7 px-2">
              View Details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
