"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MarketAsset } from "@/lib/market-data/types";
import { formatPrice, formatChange, formatMarketCap, formatVolume } from "@/lib/market-data/normalizers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, Search, Bell, X } from "lucide-react";
import Image from "next/image";

interface AssetDetailDrawerProps {
  asset: MarketAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AssetDetailDrawer({ asset, open, onOpenChange }: AssetDetailDrawerProps) {
  if (!asset) return null;

  const isPositive = asset.change && asset.change > 0;
  const isCrypto = asset.type === 'crypto';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#1E293B] border-[#0B0F1A] w-full sm:max-w-md">
        <SheetHeader className="border-b border-[#0B0F1A] pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {asset.logo && (
                <div className="w-12 h-12 rounded-full bg-[#0B0F1A] flex items-center justify-center overflow-hidden">
                  <Image
                    src={asset.logo}
                    alt={asset.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <div>
                <SheetTitle className="text-white text-xl">{asset.symbol}</SheetTitle>
                <p className="text-sm text-[#A1A7B3]">{asset.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-[#A1A7B3] hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Price */}
          <div>
            <p className="text-3xl font-bold text-white">
              {formatPrice(asset.price)}
            </p>
            <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {formatChange(asset.changePercent)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-[#0B0F1A]">
              <p className="text-xs text-[#A1A7B3]">Type</p>
              <p className="text-sm font-medium text-white capitalize">{asset.type}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0B0F1A]">
              <p className="text-xs text-[#A1A7B3]">Source</p>
              <p className="text-sm font-medium text-white">{asset.source}</p>
            </div>
            {asset.exchange && (
              <div className="p-3 rounded-lg bg-[#0B0F1A] col-span-2">
                <p className="text-xs text-[#A1A7B3]">Exchange</p>
                <p className="text-sm font-medium text-white">{asset.exchange}</p>
              </div>
            )}
            {asset.marketCap && (
              <div className="p-3 rounded-lg bg-[#0B0F1A]">
                <p className="text-xs text-[#A1A7B3]">Market Cap</p>
                <p className="text-sm font-medium text-white">{formatMarketCap(asset.marketCap)}</p>
              </div>
            )}
            {asset.volume && (
              <div className="p-3 rounded-lg bg-[#0B0F1A]">
                <p className="text-xs text-[#A1A7B3]">24h Volume</p>
                <p className="text-sm font-medium text-white">{formatVolume(asset.volume)}</p>
              </div>
            )}
            {asset.rank && (
              <div className="p-3 rounded-lg bg-[#0B0F1A]">
                <p className="text-xs text-[#A1A7B3]">Rank</p>
                <p className="text-sm font-medium text-white">#{asset.rank}</p>
              </div>
            )}
          </div>

          {/* Timestamp */}
          {asset.lastUpdated && (
            <p className="text-xs text-[#A1A7B3]">
              Last updated: {new Date(asset.lastUpdated).toLocaleString()}
            </p>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-[#0B0F1A]">
            <Button 
              className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
              onClick={() => {
                // Show coming soon message
                const message = `${asset.type === 'crypto' ? 'Crypto' : 'Stock'} details page coming soon!`;
                alert(message);
              }}
            >
              <Search className="h-4 w-4 mr-2" />
              Research Asset
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-[#0B0F1A] text-white hover:bg-[#0B0F1A]"
              onClick={() => {
                alert('Add to watchlist feature coming soon!');
              }}
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-[#0B0F1A] text-white hover:bg-[#0B0F1A]"
              onClick={() => {
                alert('Alert creation coming soon!');
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>

          <p className="text-[10px] text-[#A1A7B3] text-center">
            Data provided by {asset.source}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
