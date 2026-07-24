"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPortfolioDateTime } from "@/lib/format/date";
import WatchlistPageHeader from "@/components/watchlist/WatchlistPageHeader";
import WatchlistTable from "@/components/watchlist/WatchlistTable";
import WatchlistMobileCard from "@/components/watchlist/WatchlistMobileCard";
import AddWatchlistAsset from "@/components/watchlist/AddWatchlistAsset";

export default function WatchlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<Array<{ id: string; symbol: string; name: string; assetType: string; price: number | null; change: number | null; changePercent: number | null; href: string; addedAt: string }>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const enrichWithLivePrices = useCallback(async (loaded: Array<{ id: string; symbol: string; name: string; assetType: string; price: number | null; change: number | null; changePercent: number | null; href: string; addedAt: string }>) => {
    const enriched = await Promise.all(
      loaded.map(async (item) => {
        try {
          const assetType = item.href.split("/")[3];
          const assetId = item.href.split("/")[4];
          const response = await fetch(`/api/assets/${assetType}/${assetId}`);
          if (!response.ok) return item;
          const payload = await response.json() as { data?: { price: number | null; change: number | null; changePercent: number | null } };
          if (!payload.data || payload.data.price === null) return item;
          return { ...item, price: payload.data.price, change: payload.data.change, changePercent: payload.data.changePercent };
        } catch {
          return item;
        }
      })
    );
    setItems(enriched);
  }, []);

  useEffect(() => {
    setLastUpdated(formatPortfolioDateTime(new Date().toISOString()));
    fetch("/api/watchlist")
      .then((response) => response.json())
      .then((data) => {
        const loaded = (data.items ?? []).map((item: { id: string; symbol: string; name: string; asset_type: string; asset_id: string; created_at: string }) => ({ id: item.id, symbol: item.symbol, name: item.name, assetType: item.asset_type, price: null, change: null, changePercent: null, href: `/dashboard/markets/${item.asset_type}/${item.asset_id}`, addedAt: item.created_at }));
        setItems(loaded);
        void enrichWithLivePrices(loaded);
      })
      .catch(() => setItems([]));
  }, [enrichWithLivePrices]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(formatPortfolioDateTime(new Date().toISOString()));
      setIsRefreshing(false);
    }, 500);
  };

  const handleRemove = async (id: string) => {
    if (confirm("Remove this asset from your watchlist?")) {
      const response = await fetch(`/api/watchlist?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (response.ok) setItems((current) => current.filter(item => item.id !== id));
    }
  };

  const handleSearch = async (query: string) => { const response = await fetch(`/api/markets/search?q=${encodeURIComponent(query)}`); if (!response.ok) throw new Error('Search failed.'); const data = await response.json(); return data.results ?? []; };

  const handleAdd = async (result: any) => {
    const response = await fetch("/api/watchlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetType: result.type, assetId: result.id, symbol: result.symbol, name: result.name }) });
    if (!response.ok) return;
    const data = await response.json();
    setItems((current) => [{ id: data.item.id, symbol: data.item.symbol, name: data.item.name, assetType: data.item.asset_type, price: null, change: null, changePercent: null, href: `/dashboard/markets/${data.item.asset_type}/${data.item.asset_id}`, addedAt: data.item.created_at }, ...current]);
    setShowAddForm(false);
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

            return results;
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
