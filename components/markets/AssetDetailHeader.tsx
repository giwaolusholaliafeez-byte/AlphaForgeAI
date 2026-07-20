"use client";

import Link from "next/link";
import { ChevronLeft, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssetDetailHeaderProps {
  name: string;
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  exchange?: string | null;
  assetType: string;
  className?: string;
}

export default function AssetDetailHeader({
  name,
  symbol,
  price,
  change,
  changePercent,
  exchange,
  assetType,
  className,
}: AssetDetailHeaderProps) {
  const formatPrice = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    if (value >= 1000) return `$${value.toFixed(2)}`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(6)}`;
  };

  const isPositive = change !== null && change >= 0;

  const typeLabels: Record<string, string> = {
    stock: "Stock",
    etf: "ETF",
    crypto: "Cryptocurrency",
    fx: "FX",
    index_proxy: "Index Proxy",
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Link
        href="/dashboard/markets"
        className="inline-flex items-center text-sm text-[#A1A7B3] hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Markets
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{name}</h1>
            <span className="text-sm font-medium text-[#A1A7B3]">{symbol}</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/[0.04] text-[#A1A7B3] border border-white/[0.06]">
              {typeLabels[assetType] || assetType}
            </span>
          </div>
          {exchange && (
            <p className="text-sm text-[#A1A7B3]">Exchange: {exchange}</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-white tabular-nums">
            {formatPrice(price)}
          </p>
          <span className={cn(
            "text-sm font-medium flex items-center justify-end gap-0.5",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {change !== null ? `${isPositive ? '+' : ''}${change.toFixed(2)}` : "—"}
            <span className="ml-1">
              {changePercent !== null ? `(${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)` : ""}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
