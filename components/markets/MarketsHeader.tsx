"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketsHeaderProps {
  lastUpdated: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  error?: string | null;
}

export default function MarketsHeader({
  lastUpdated,
  isRefreshing,
  onRefresh,
  error,
}: MarketsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <p className="text-sm text-[#A1A7B3]">
          Live market data and asset exploration
        </p>
        {lastUpdated && (
          <p className="text-xs text-[#A1A7B3] mt-1">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
        <p className="text-[10px] text-[#A1A7B3] mt-0.5">
          Market data is supplied by external providers and may be delayed.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {error && (
          <span className="text-xs text-red-500 mr-2">{error}</span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border-[#1E293B] text-white hover:bg-[#1E293B]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
}
