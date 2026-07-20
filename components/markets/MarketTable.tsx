"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarketTableRow {
  id: string;
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  marketCap?: number | null;
  volume?: number | null;
  href: string;
  type?: string;
}

interface MarketTableProps {
  rows: MarketTableRow[];
  showMarketCap?: boolean;
  showVolume?: boolean;
  className?: string;
}

export default function MarketTable({
  rows,
  showMarketCap = true,
  showVolume = true,
  className,
}: MarketTableProps) {
  const formatPrice = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    if (value >= 1000) return `$${value.toFixed(2)}`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(6)}`;
  };

  const formatLargeNumber = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(0)}`;
  };

  if (rows.length === 0) {
    return (
      <div className={cn("bg-[#1E293B] rounded-lg border border-[#1E293B] p-8 text-center", className)}>
        <p className="text-sm text-[#A1A7B3]">No assets available</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden", className)}>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[#A1A7B3]">
              <th className="text-left py-3 px-4 font-medium">Asset</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">Price</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">Change</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">% Change</th>
              {showMarketCap && (
                <th className="text-right py-3 px-4 font-medium tabular-nums">Market Cap</th>
              )}
              {showVolume && (
                <th className="text-right py-3 px-4 font-medium tabular-nums">Volume</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isPositive = row.change !== null && row.change >= 0;
              
              return (
                <tr
                  key={row.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4">
                    <Link href={row.href} className="hover:text-[#2563EB] transition-colors">
                      <div>
                        <p className="font-medium text-white">{row.symbol}</p>
                        <p className="text-xs text-[#A1A7B3]">{row.name}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right text-white tabular-nums">
                    {formatPrice(row.price)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "font-medium",
                      isPositive ? "text-green-500" : "text-red-500"
                    )}>
                      {isPositive ? '+' : ''}{row.change?.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "font-medium flex items-center justify-end gap-0.5",
                      isPositive ? "text-green-500" : "text-red-500"
                    )}>
                      {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {row.changePercent !== null ? `${isPositive ? '+' : ''}${row.changePercent.toFixed(2)}%` : "—"}
                    </span>
                  </td>
                  {showMarketCap && (
                    <td className="py-3 px-4 text-right text-[#A1A7B3] tabular-nums">
                      {formatLargeNumber(row.marketCap ?? null)}
                    </td>
                  )}
                  {showVolume && (
                    <td className="py-3 px-4 text-right text-[#A1A7B3] tabular-nums">
                      {formatLargeNumber(row.volume ?? null)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-white/[0.06] md:hidden">
        {rows.map((row) => {
          const isPositive = row.change !== null && row.change >= 0;
          return <Link key={row.id} href={row.href} className="block p-4 active:bg-white/[0.04]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-medium text-white">{row.symbol}</p><p className="truncate text-xs text-[#A1A7B3]">{row.name}</p></div><div className="text-right"><p className="font-medium tabular-nums text-white">{formatPrice(row.price)}</p><p className={cn("mt-1 flex items-center justify-end gap-0.5 text-xs font-medium", isPositive ? "text-green-500" : "text-red-500")}>{isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{row.changePercent === null ? "—" : `${isPositive ? "+" : ""}${row.changePercent.toFixed(2)}%`}</p></div></div><div className="mt-3 flex gap-4 text-xs text-[#A1A7B3]"><span>Change {row.change === null ? "—" : `${isPositive ? "+" : ""}${row.change.toFixed(2)}`}</span>{showMarketCap && <span>Cap {formatLargeNumber(row.marketCap ?? null)}</span>}{showVolume && <span>Vol {formatLargeNumber(row.volume ?? null)}</span>}</div></Link>;
        })}
      </div>
    </div>
  );
}
