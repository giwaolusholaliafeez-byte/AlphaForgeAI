"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPortfolioDateTime } from "@/lib/format/date";
import WatchlistPageHeader from "@/components/watchlist/WatchlistPageHeader";
import WatchlistTable from "@/components/watchlist/WatchlistTable";
import WatchlistMobileCard from "@/components/watchlist/WatchlistMobileCard";
import AddWatchlistAsset from "@/components/watchlist/AddWatchlistAsset";

// Mock data - will be replaced with real watchlist data in later phases
const mockWatchlistItems = [
  {
    id: "1",
    symbol: "NVDA",
    name: "NVIDIA",
    assetType: "stock",
    price: 145.67,
    change: 11.32,
    changePercent: 8.42,
    href: "/dashboard/markets/stock/NVDA",
    addedAt: new Date().toISOString(),
  },
  {
    id: "2",
    symbol: "AAPL",
    name: "Apple",
    assetType: "stock",
    price: 178.34,
    change: 1.96,
    changePercent: 1.11,
    href: "/dashboard/markets/stock/AAPL",
    addedAt: new Date().toISOString(),
  },
  {
    id: "3",
    symbol: "BTC",
    name: "Bitcoin",
    assetType: "crypto",
    price: 68234,
    change: 1436,
    changePercent: 2.15,
    href: "/dashboard/markets/crypto/bitcoin",
    addedAt: new Date().toISOString(),
  },
];

export default function WatchlistPage() {
  const router = useRouter();
  const [items, setItems] = useState(mockWatchlistItems);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setLastUpdated(formatPortfolioDateTime(new Date().toISOString()));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(formatPortfolioDateTime(new Date().toISOString()));
      setIsRefreshing(false);
    }, 500);
  };

  const handleRemove = (id: string) => {
    if (confirm("Remove this asset from your watchlist?")) {
      setItems(items.filter(item => item.id !== id));
      router.refresh();
    }
  };

  const handleSearch = async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const allAssets = [
      { id: "aapl", symbol: "AAPL", name: "Apple", type: "stock", source: "finnhub" },
      { id: "msft", symbol: "MSFT", name: "Microsoft", type: "stock", source: "finnhub" },
      { id: "nvda", symbol: "NVDA", name: "NVIDIA", type: "stock", source: "finnhub" },
      { id: "bitcoin", symbol: "BTC", name: "Bitcoin", type: "crypto", source: "coingecko" },
      { id: "ethereum", symbol: "ETH", name: "Ethereum", type: "crypto", source: "coingecko" },
      { id: "spy", symbol: "SPY", name: "SPDR S&P 500 ETF", type: "etf", source: "finnhub" },
    ];
    return allAssets
      .filter(asset => 
        asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
        asset.name.toLowerCase().includes(query.toLowerCase())
      );
  };

  const handleAdd = async (result: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItem = {
      id: Date.now().toString(),
      symbol: result.symbol,
      name: result.name,
      assetType: result.type,
      price: 100.00,
      change: 0,
      changePercent: 0,
      href: `/dashboard/markets/${result.type}/${result.id}`,
      addedAt: new Date().toISOString(),
    };
    setItems([...items, newItem]);
    router.refresh();
  };

  const existingSymbols = items.map(item => item.symbol);

  return (
    <div className="space-y-6">
      <WatchlistPageHeader
        title="Watchlist"
        description="Track your favorite assets"
        assetCount={items.length}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onAddAsset={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <AddWatchlistAsset
          onSearch={async (query) => {
            const results = await handleSearch(query);

            return results.map((result) => ({
              ...result,
              type: (
                result.type === "crypto"
                  ? "crypto"
                  : result.type === "etf"
                    ? "etf"
                    : "stock"
              ) as "stock" | "etf" | "crypto",
            }));
          }}
          onAdd={handleAdd}
          onCancel={() => setShowAddForm(false)}
          existingSymbols={existingSymbols}
        />
      )}

      {/* Desktop Table */}
      <div className="hidden md:block">
        <WatchlistTable items={items} onRemove={handleRemove} />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {items.map((item) => (
          <WatchlistMobileCard key={item.id} item={item} onRemove={handleRemove} />
        ))}
        {items.length === 0 && (
          <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-8 text-center">
            <p className="text-[#A1A7B3]">No assets in your watchlist</p>
          </div>
        )}
      </div>
    </div>
  );
}
