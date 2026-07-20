"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "etf" | "crypto" | "fx" | "index_proxy";
  source: string;
}

interface MarketSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSelect: (result: SearchResult) => void;
  className?: string;
}

export default function MarketSearch({ onSearch, onSelect, className }: MarketSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  const typeColors: Record<string, string> = {
    stock: "text-[#2563EB]",
    etf: "text-[#00C2A8]",
    crypto: "text-[#F4B000]",
    fx: "text-[#A1A7B3]",
    index_proxy: "text-[#3B82F6]",
  };

  const typeLabels: Record<string, string> = {
    stock: "Stock",
    etf: "ETF",
    crypto: "Crypto",
    fx: "FX",
    index_proxy: "Proxy",
  };

  const showResults = isFocused && (results.length > 0 || isLoading || error);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center rounded-lg border transition-all duration-200",
          isFocused
            ? "border-[#2563EB] bg-[#0B0F1A] ring-1 ring-[#2563EB]/20"
            : "border-white/[0.06] bg-white/[0.03]"
        )}
      >
        <Search className="absolute left-3 h-4 w-4 text-[#A1A7B3]" />
        <Input
          type="text"
          placeholder="Search stocks, ETFs, crypto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-9 pr-20 h-9 bg-transparent border-none text-white placeholder:text-[#A1A7B3] text-sm focus:ring-0 focus:outline-none"
          aria-label="Search markets"
        />
        <div className="absolute right-2 flex items-center space-x-1">
          {isLoading && <Loader2 className="h-3.5 w-3.5 text-[#A1A7B3] animate-spin" />}
          {query && !isLoading && (
            <button
              onClick={handleClear}
              className="p-1 rounded hover:bg-white/[0.04] text-[#A1A7B3] hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="text-[10px] text-[#A1A7B3] bg-white/[0.04] px-2 py-0.5 rounded ml-1 hidden sm:flex items-center gap-1">
            <Command className="h-3 w-3" />
            K
          </span>
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1E293B] border border-white/[0.06] rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
          {error && (
            <div className="p-4 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          {isLoading && (
            <div className="p-4 text-center">
              <p className="text-sm text-[#A1A7B3]">Searching...</p>
            </div>
          )}
          {results.length > 0 && !isLoading && (
            <div className="divide-y divide-white/[0.04]">
              {results.map((result) => (
                <button
                  key={`${result.source}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div>
                        <p className="text-sm font-medium text-white">{result.symbol}</p>
                        <p className="text-xs text-[#A1A7B3] truncate">{result.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn("text-xs font-medium capitalize", typeColors[result.type])}>
                        {typeLabels[result.type] || result.type}
                      </span>
                      <span className="text-xs text-[#A1A7B3]">{result.source}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {results.length === 0 && query.length >= 2 && !isLoading && !error && (
            <div className="p-4 text-center">
              <p className="text-sm text-[#A1A7B3]">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
