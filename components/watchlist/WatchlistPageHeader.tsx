"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WatchlistPageHeaderProps {
  title: string;
  description?: string;
  assetCount?: number;
  lastUpdated?: string | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onAddAsset: () => void;
  className?: string;
}

export default function WatchlistPageHeader({
  title,
  description,
  assetCount,
  lastUpdated,
  isRefreshing = false,
  onRefresh,
  onAddAsset,
  className,
}: WatchlistPageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {assetCount !== undefined && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/[0.04] text-[#A1A7B3] border border-white/[0.06]">
              {assetCount}
            </span>
          )}
        </div>
        {description && <p className="text-sm text-[#A1A7B3]">{description}</p>}
        {lastUpdated && (
          <p className="text-xs text-[#A1A7B3] mt-0.5">Updated: {lastUpdated}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="border-white/[0.06] text-white hover:bg-white/[0.04]"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-2", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        )}
        <Button onClick={onAddAsset} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>
    </div>
  );
}
