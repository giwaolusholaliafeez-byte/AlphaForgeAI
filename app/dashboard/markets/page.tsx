"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MarketAsset } from "@/lib/market-data/types";
import { MarketSearchResult } from "@/lib/market-data/types";
import { ForexAsset } from "@/lib/market-data/forex";
import MarketsHeader from "@/components/markets/MarketsHeader";
import MarketTabs from "@/components/markets/MarketTabs";
import MarketSummaryCards from "@/components/markets/MarketSummaryCards";
import AssetSearch from "@/components/markets/AssetSearch";
import AssetTable from "@/components/markets/AssetTable";
import AssetDetailDrawer from "@/components/markets/AssetDetailDrawer";
import MarketsLoading from "@/components/markets/MarketsLoading";
import MarketErrorState from "@/components/markets/MarketErrorState";

type TabType = 'stocks' | 'etfs' | 'crypto' | 'fx' | 'indices';

export default function MarketsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type') || 'stocks';
  
  const [activeTab, setActiveTab] = useState<TabType>(typeParam as TabType);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = useCallback(async (tab: TabType, refresh = false, pageArg = 1) => {
    if (!refresh) {
      setIsLoading(true);
    }
    setError(null);
    setIsConfigured(true);

    try {
      let endpoint = '';
      switch (tab) {
        case 'stocks':
          endpoint = `/api/markets/stocks?assetClass=stock&page=${pageArg}`;
          break;
        case 'etfs':
          endpoint = `/api/markets/stocks?assetClass=etf&page=${pageArg}`;
          break;
        case 'crypto':
          endpoint = `/api/markets/crypto?page=${pageArg}`;
          break;
        case 'fx':
          endpoint = '/api/markets/forex';
          break;
        case 'indices':
          endpoint = '/api/markets/indices';
          break;
        default:
          endpoint = `/api/markets/stocks?assetClass=stock&page=${pageArg}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'COINGECKO_MISSING_KEY' ||
            data.error?.code === 'TWELVEDATA_MISSING_KEY' ||
            data.error?.code === 'FINNHUB_MISSING_KEY') {
          setIsConfigured(false);
        }
        throw new Error(data.error?.message || data.error || 'Failed to fetch data');
      }

      const assetsData = data.data || data.assets || [];

      setAssets(assetsData);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      setIsConfigured(data.isConfigured !== false);
      setPage(pageArg);
      setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 1);
      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load market data');
      setAssets([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setActiveTab(typeParam as TabType);
    fetchData(typeParam as TabType, false, 1);
  }, [typeParam, fetchData]);

  const handleTabChange = (value: string) => {
    const tab = value as TabType;
    setActiveTab(tab);
    router.push(`/dashboard/markets?type=${tab}`);
    fetchData(tab, false, 1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(activeTab, true, page);
  };

  const canPaginate = activeTab === 'stocks' || activeTab === 'etfs' || activeTab === 'crypto';
  const canGoNext = activeTab === 'crypto' ? hasMore : page < totalPages;
  const handlePrevPage = () => { if (page > 1) fetchData(activeTab, false, page - 1); };
  const handleNextPage = () => { if (canGoNext) fetchData(activeTab, false, page + 1); };

  const handleSearch = async (query: string): Promise<MarketSearchResult[]> => {
    const response = await fetch(`/api/markets/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    const data = await response.json();
    return data.results || [];
  };

  const handleSearchSelect = (result: MarketSearchResult) => {
    const existing = assets.find((a: any) => a.symbol === result.symbol);
    if (existing) {
      setSelectedAsset(existing);
      setDrawerOpen(true);
    } else {
      router.push(`/dashboard/markets/${result.type}/${result.id}`);
    }
  };

  const handleAssetClick = (asset: any) => {
    if (activeTab === 'fx') {
      router.push(`/dashboard/markets/fx/${asset.id}`);
      return;
    }
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const getTabType = () => {
    if (activeTab === 'crypto') return 'crypto';
    if (activeTab === 'etfs') return 'etf';
    if (activeTab === 'fx' || activeTab === 'indices') return 'stock';
    return 'stock';
  };

  if (isLoading) {
    return <MarketsLoading />;
  }

  if (error && assets.length === 0) {
    const isConfig = error.includes('API key is not configured') || 
                     error.includes('not configured') ||
                     error.includes('key is not configured');
    return (
      <div className="space-y-6">
        <MarketsHeader
          lastUpdated={null}
          isRefreshing={false}
          onRefresh={() => {}}
          error={error}
        />
        <MarketErrorState 
          error={error}
          onRetry={() => fetchData(activeTab)}
          isConfig={isConfig}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MarketsHeader
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        error={error}
      />

      <AssetSearch onSearch={handleSearch} onSelect={handleSearchSelect} />

      <MarketTabs value={activeTab} onValueChange={handleTabChange} />

      <MarketSummaryCards assets={assets} type={activeTab} />

      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden">
        <div className="p-4">
          <AssetTable
            assets={assets}
            type={getTabType()}
            onAssetClick={handleAssetClick}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-t border-[#0B0F1A]">
          <p className="text-[10px] text-[#A1A7B3]">
            {assets.length} assets loaded from {activeTab === 'crypto' ? 'CoinGecko' : activeTab === 'fx' || activeTab === 'indices' ? 'Twelve Data' : 'Finnhub'}
            {canPaginate && ` · page ${page}${totalPages > 1 && activeTab !== 'crypto' ? ` of ${totalPages}` : ''}`}
          </p>
          {canPaginate && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={page <= 1 || isLoading}
                className="rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-[#A1A7B3] hover:text-white disabled:opacity-40 disabled:hover:text-[#A1A7B3]"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={!canGoNext || isLoading}
                className="rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-[#A1A7B3] hover:text-white disabled:opacity-40 disabled:hover:text-[#A1A7B3]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <AssetDetailDrawer
        asset={selectedAsset}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
