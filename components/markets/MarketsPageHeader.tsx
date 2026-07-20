"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketsPageHeaderProps {
  title: string;
  description?: string;
  lastUpdated?: string | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  providerStatus?: "connected" | "delayed" | "unavailable";
  className?: string;
}

export default function MarketsPageHeader({
  title,
  description,
  lastUpdated,
  isRefreshing = false,
  onRefresh,
  providerStatus,
  className,
}: MarketsPageHeaderProps) {
  const statusColors = {
    connected: "text-[#00C2A8]",
    delayed: "text-[#F4B000]",
    unavailable: "text-[#A1A7B3]",
  };

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
        {description && <p className="text-sm text-[#A1A7B3]">{description}</p>}
        <div className="flex items-center gap-3 mt-0.5">
          {lastUpdated && (
            <span className="text-xs text-[#A1A7B3]">Updated: {lastUpdated}</span>
          )}
          {providerStatus && (
            <span className={cn("text-xs font-medium", statusColors[providerStatus])}>
              ● {providerStatus}
            </span>
          )}
        </div>
      </div>
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
    </div>
  );
}
