"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketItem {
  label: string;
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  href?: string;
}

interface MarketStatusStripProps {
  items: MarketItem[];
  className?: string;
}

export default function MarketStatusStrip({ items, className }: MarketStatusStripProps) {
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return "—";
    if (price >= 1000) return `$${price.toFixed(2)}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatChange = (change: number | null) => {
    if (change === null || change === undefined) return "—";
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number | null) => {
    if (change === null || change === undefined) return "text-[#A1A7B3]";
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  const getArrow = (change: number | null) => {
    if (change === null || change === undefined) return <Minus className="h-3 w-3" />;
    return change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  if (!items || items.length === 0) {
    return (
      <div className={cn("p-4 rounded-lg bg-[#1E293B] border border-[#1E293B] text-center", className)}>
        <p className="text-sm text-[#A1A7B3]">Market data unavailable</p>
      </div>
    );
  }

  return (
    <div className={cn("p-3 rounded-lg bg-[#111827] border border-white/[0.06]", className)}>
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
        {items.map((item, index) => {
          const content = (
            <div key={index} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-medium text-white">{item.label}</span>
              <span className="text-xs text-[#A1A7B3]">{item.symbol}</span>
              <span className="text-xs font-medium text-white tabular-nums">
                {formatPrice(item.price)}
              </span>
              <span className={cn("text-xs font-medium flex items-center gap-0.5", getChangeColor(item.change))}>
                {getArrow(item.change)}
                {formatChange(item.changePercent)}
              </span>
            </div>
          );

          if (item.href) {
            return (
              <Link key={index} href={item.href} className="hover:opacity-80 transition-opacity">
                {content}
              </Link>
            );
          }

          return content;
        })}
      </div>
    </div>
  );
}
