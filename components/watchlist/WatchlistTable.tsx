"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  assetType: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  href: string;
  addedAt: string;
}

interface WatchlistTableProps {
  items: WatchlistItem[];
  onRemove: (id: string) => void;
  className?: string;
}

export default function WatchlistTable({ items, onRemove, className }: WatchlistTableProps) {
  const formatPrice = (value: number | null) => {
    if (value === null || value === undefined) return "Unavailable";
    if (value >= 1000) return `$${value.toFixed(2)}`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(6)}`;
  };

  const isPositive = (value: number | null) => {
    if (value === null) return false;
    return value >= 0;
  };

  const typeLabels: Record<string, string> = {
    stock: "Stock",
    etf: "ETF",
    crypto: "Crypto",
    index_proxy: "Proxy",
  };

  if (items.length === 0) {
    return (
      <div className={cn("bg-[#1E293B] rounded-lg border border-[#1E293B] p-8 text-center", className)}>
        <p className="text-[#A1A7B3]">No assets in your watchlist yet</p>
        <p className="text-xs text-[#A1A7B3] mt-1">Click "Add Asset" to start tracking</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[#A1A7B3]">
              <th className="text-left py-3 px-4 font-medium">Asset</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">Price</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">Change</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">% Change</th>
              <th className="text-right py-3 px-4 font-medium">Added</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const positive = isPositive(item.change);
              
              return (
                <tr
                  key={item.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4">
                    <Link href={item.href} className="hover:text-[#2563EB] transition-colors">
                      <div>
                        <p className="font-medium text-white">{item.symbol}</p>
                        <p className="text-xs text-[#A1A7B3]">{item.name}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-[#A1A7B3] text-xs">
                    {typeLabels[item.assetType] || item.assetType}
                  </td>
                  <td className="py-3 px-4 text-right text-white tabular-nums">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "font-medium",
                      positive ? "text-green-500" : "text-red-500"
                    )}>
                      {item.change !== null ? `${positive ? '+' : ''}${item.change.toFixed(2)}` : "Unavailable"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "font-medium flex items-center justify-end gap-0.5",
                      positive ? "text-green-500" : "text-red-500"
                    )}>
                      {item.changePercent !== null ? (
                        <>
                          {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          {`${positive ? '+' : ''}${item.changePercent.toFixed(2)}%`}
                        </>
                      ) : "Unavailable"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-[#A1A7B3] text-xs">
                    {new Date(item.addedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#A1A7B3] hover:text-white"
                          aria-label={`View ${item.symbol}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(item.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        aria-label={`Remove ${item.symbol} from watchlist`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
