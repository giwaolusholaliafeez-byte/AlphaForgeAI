"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoverItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: number;
  positive: boolean;
  href: string;
}

interface MarketMoversProps {
  items: MoverItem[];
  title: string;
  viewAllHref?: string;
}

export default function MarketMovers({ items, title, viewAllHref }: MarketMoversProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5">
        <p className="text-sm text-[#A1A7B3] text-center">No market movers available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-xs font-medium text-[#A1A7B3] uppercase tracking-wider">{title}</span>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#2563EB]/80 text-xs h-7 px-2">
              View All
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        )}
      </div>
      <div className="divide-y divide-white/[0.04]">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.symbol}
            href={item.href}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div>
                <p className="text-sm font-medium text-white">{item.symbol}</p>
                <p className="text-xs text-[#A1A7B3] truncate">{item.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <span className="text-sm text-white tabular-nums">{item.price}</span>
              <span className={cn(
                "text-xs font-medium flex items-center gap-0.5 w-16 justify-end",
                item.positive ? "text-green-500" : "text-red-500"
              )}>
                {item.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {item.change}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
