"use client";

import { useState } from "react";
import { BookmarkPlus, Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetDetail } from "@/lib/market-data/types";
import PaperTradePanel from "./PaperTradePanel";

interface AssetActionsProps {
  asset: AssetDetail;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function AssetActions({ asset, onRefresh, isRefreshing }: AssetActionsProps) {
  const [showWatchlistMessage, setShowWatchlistMessage] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState(false);

  const handleWatchlist = () => {
    setShowWatchlistMessage(true);
    setTimeout(() => setShowWatchlistMessage(false), 3000);
  };

  const handleAlert = () => {
    setShowAlertMessage(true);
    setTimeout(() => setShowAlertMessage(false), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleWatchlist}
          variant="outline"
          className="border-[#1E293B] text-white hover:bg-[#1E293B]"
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
        <Button
          onClick={handleAlert}
          variant="outline"
          className="border-[#1E293B] text-white hover:bg-[#1E293B]"
        >
          <Bell className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            className="border-[#1E293B] text-white hover:bg-[#1E293B]"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        )}
      </div>

      {showWatchlistMessage && (
        <div className="p-3 rounded-lg bg-[#00C2A8]/10 border border-[#00C2A8]/20">
          <p className="text-sm text-[#00C2A8]">
            Persistent watchlists will be connected in the watchlist phase.
          </p>
        </div>
      )}

      {showAlertMessage && (
        <div className="p-3 rounded-lg bg-[#00C2A8]/10 border border-[#00C2A8]/20">
          <p className="text-sm text-[#00C2A8]">
            Alert creation will be available in the alerts phase.
          </p>
        </div>
      )}

      <PaperTradePanel asset={asset} />
    </div>
  );
}
