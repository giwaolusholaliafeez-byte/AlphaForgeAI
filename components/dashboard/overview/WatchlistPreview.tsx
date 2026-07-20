"use client";

import Link from "next/link";
import { Bookmark, Plus, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  positive: boolean;
  href: string;
}

interface WatchlistPreviewProps {
  items: WatchlistItem[];
  count?: number;
}

export default function WatchlistPreview({ items, count }: WatchlistPreviewProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-[#0B0F1A]">
            <Bookmark className="h-5 w-5 text-[#A1A7B3]" />
          </div>
        </div>
        <h3 className="text-sm font-medium text-white mb-1">No Watchlist</h3>
        <p className="text-xs text-[#A1A7B3] mb-4">Track your favorite assets here</p>
        <Link href="/dashboard/watchlist">
          <Button variant="outline" size="sm" className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Asset
          </Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toFixed(2)}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-[#A1A7B3]" />
          <span className="text-xs font-medium text-[#A1A7B3] uppercase tracking-wider">
            Watchlist {count !== undefined && `(${count})`}
          </span>
        </div>
        <Link href="/dashboard/watchlist">
          <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#2563EB]/80 text-xs h-7 px-2">
            View All
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.symbol}
            href={item.href}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-white">{item.symbol}</p>
              <p className="text-xs text-[#A1A7B3]">{item.name}</p>
            </div>
            <div className="flex items-center gap-4 text-right">
              <span className="text-sm text-white tabular-nums">{formatPrice(item.price)}</span>
              <span className={cn(
                "text-xs font-medium flex items-center gap-0.5 w-16 justify-end",
                item.positive ? "text-green-500" : "text-red-500"
              )}>
                {item.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {item.positive ? '+' : ''}{item.change.toFixed(1)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
