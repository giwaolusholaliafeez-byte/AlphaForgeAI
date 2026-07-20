"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WatchlistMobileCardProps {
  item: {
    id: string;
    symbol: string;
    name: string;
    assetType: string;
    price: number | null;
    change: number | null;
    changePercent: number | null;
    href: string;
    addedAt: string;
  };
  onRemove: (id: string) => void;
}

export default function WatchlistMobileCard({ item, onRemove }: WatchlistMobileCardProps) {
  const formatPrice = (value: number | null) => {
    if (value === null || value === undefined) return "Unavailable";
    if (value >= 1000) return `$${value.toFixed(2)}`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    if (value >= 0.01) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(6)}`;
  };

  const positive = item.change !== null && item.change >= 0;

  const typeLabels: Record<string, string> = {
    stock: "Stock",
    etf: "ETF",
    crypto: "Crypto",
    index_proxy: "Proxy",
  };

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-white">{item.symbol}</p>
            <span className="text-xs text-[#A1A7B3]">{typeLabels[item.assetType] || item.assetType}</span>
          </div>
          <p className="text-sm text-[#A1A7B3] truncate">{item.name}</p>
        </div>
        <div className="flex items-center gap-1">
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
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#A1A7B3]">Price</p>
          <p className="text-lg font-semibold text-white tabular-nums">
            {formatPrice(item.price)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#A1A7B3]">24h Change</p>
          <span className={cn(
            "text-sm font-medium flex items-center justify-end gap-0.5",
            positive ? "text-green-500" : "text-red-500"
          )}>
            {item.changePercent !== null ? (
              <>
                {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {`${positive ? '+' : ''}${item.changePercent.toFixed(2)}%`}
              </>
            ) : "Unavailable"}
          </span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[10px] text-[#A1A7B3]">Added: {new Date(item.addedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
