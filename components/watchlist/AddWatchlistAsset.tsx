"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "etf" | "crypto" | "fx";
  source: string;
}

interface AddWatchlistAssetProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onAdd: (result: SearchResult) => Promise<void>;
  onCancel: () => void;
  existingSymbols?: string[];
}

export default function AddWatchlistAsset({
  onSearch,
  onAdd,
  onCancel,
  existingSymbols = [],
}: AddWatchlistAssetProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await onSearch(searchQuery);
      setResults(results);
    } catch (err) {
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  const handleAdd = async () => {
    if (!selectedResult) return;
    
    // Check for duplicate
    if (existingSymbols.includes(selectedResult.symbol)) {
      setError("This asset is already in your watchlist.");
      return;
    }

    setIsAdding(true);
    setError(null);
    try {
      await onAdd(selectedResult);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add asset");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setSelectedResult(result);
    setQuery("");
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelectedResult(null);
    setError(null);
  };

  const typeLabels: Record<string, string> = {
    stock: "Stock",
    etf: "ETF",
    crypto: "Crypto",
    fx: "Forex",
  };

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Add to Watchlist</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 text-[#A1A7B3] hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
        <Input
          type="text"
          placeholder="Search stocks, ETFs, crypto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-10 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
          disabled={!!selectedResult}
          autoComplete="off"
        />
        {query && !selectedResult && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A7B3] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3] animate-spin" />
        )}
      </div>

      {/* Results */}
      {results.length > 0 && !selectedResult && (
        <div className="max-h-48 overflow-y-auto rounded-lg bg-[#0B0F1A] border border-[#1E293B] divide-y divide-white/[0.04]">
          {results.map((result) => (
            <button
              key={`${result.source}-${result.id}`}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{result.symbol}</p>
                  <p className="text-xs text-[#A1A7B3]">{result.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#A1A7B3] capitalize">{typeLabels[result.type] || result.type}</span>
                  <span className="text-xs text-[#A1A7B3]">{result.source}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.length === 0 && query.length >= 2 && !isLoading && !selectedResult && (
        <div className="p-4 text-center bg-[#0B0F1A] rounded-lg">
          <p className="text-sm text-[#A1A7B3]">No results found for "{query}"</p>
        </div>
      )}

      {/* Selected Asset Preview */}
      {selectedResult && (
        <div className="p-3 rounded-lg bg-[#0B0F1A] border border-[#2563EB]/20 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{selectedResult.symbol}</p>
              <p className="text-xs text-[#A1A7B3]">{selectedResult.name}</p>
              <p className="text-[10px] text-[#A1A7B3] capitalize">{selectedResult.type} • {selectedResult.source}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedResult(null)}
              className="text-[#A1A7B3] hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleAdd}
          disabled={!selectedResult || isAdding}
          className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? "Adding..." : "Add to Watchlist"}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isAdding}
          className="border-[#1E293B] text-white hover:bg-[#1E293B]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
