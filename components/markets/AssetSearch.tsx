"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarketSearchResult } from "@/lib/market-data/types";

interface AssetSearchProps {
  onSearch: (query: string) => Promise<MarketSearchResult[]>;
  onSelect: (result: MarketSearchResult) => void;
  id?: string;
}

export default function AssetSearch({ onSearch, onSelect, id }: AssetSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MarketSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const searchResults = await onSearch(query);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } catch (err) {
        setError('Search failed. Please try again.');
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch]);

  const handleSelect = (result: MarketSearchResult) => {
    onSelect(result);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
        <Input
          id={id}
          type="text"
          placeholder="Search stocks, ETFs, crypto..."
          aria-label={id ? undefined : "Search for an asset"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="pl-9 pr-10 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A7B3] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] border border-[#0B0F1A] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.source}-${result.id}`}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-2 hover:bg-[#0B0F1A] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{result.symbol}</p>
                  <p className="text-xs text-[#A1A7B3]">{result.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#A1A7B3] capitalize">{result.type}</span>
                  <span className="text-xs text-[#A1A7B3]">{result.source}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] border border-[#0B0F1A] rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-[#A1A7B3] text-center">Searching...</p>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] border border-red-500/20 rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-red-500 text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
