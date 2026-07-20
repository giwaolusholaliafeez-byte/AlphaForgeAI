"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketOverviewCardProps {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  href: string;
  className?: string;
  chart?: React.ReactNode;
}

export default function MarketOverviewCard({
  symbol,
  name,
  price,
  change,
  changePercent,
  href,
  className,
  chart,
}: MarketOverviewCardProps) {
  const formatPrice = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    if (value >= 1000) return `$${value.toFixed(2)}`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(6)}`;
  };

  // Explicit null-safe boolean calculation
  const isPositive = typeof change === "number"
    ? change >= 0
    : false;

  return (
    <Link
      href={href}
      className={cn(
        "block bg-[#1E293B] rounded-lg border border-[#1E293B] p-4 hover:border-white/[0.08] transition-all duration-150",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white">{symbol}</p>
          <p className="text-xs text-[#A1A7B3]">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white tabular-nums">
            {formatPrice(price)}
          </p>
          <span className={cn(
            "text-xs font-medium flex items-center justify-end gap-0.5",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {changePercent !== null ? `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%` : "—"}
          </span>
        </div>
      </div>
      {chart && <div className="mt-3">{chart}</div>}
    </Link>
  );
}
