"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Command, CornerDownLeft, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { MarketSearchResult } from "@/lib/market-data/types";

const TYPE_LABEL: Record<string, string> = {
  stock: "Stock",
  etf: "ETF",
  crypto: "Crypto",
  fx: "Forex",
  index: "Index",
};

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MarketSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/markets/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const navigateTo = useCallback(
    (result: MarketSearchResult) => {
      onOpenChange(false);
      router.push(`/dashboard/markets/${result.type}/${result.id}`);
    },
    [onOpenChange, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = results[activeIndex];
      if (chosen) navigateTo(chosen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#111827] shadow-[0_32px_100px_-24px_rgba(0,0,0,0.75)]">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
          <Search className="h-4 w-4 flex-shrink-0 text-[#5B6472]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search stocks, crypto, forex…"
            className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#5B6472] focus:outline-none"
            aria-label="Global asset search"
          />
          {loading && <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-[#5B6472]" />}
          <kbd className="hidden flex-shrink-0 items-center gap-0.5 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#5B6472] sm:flex">
            ESC
          </kbd>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2">
          {query.trim().length < 2 && (
            <div className="px-3 py-10 text-center">
              <p className="text-sm text-[#8B93A3]">Search across stocks, ETFs, crypto, and forex.</p>
              <p className="mt-1 text-xs text-[#5B6472]">Type at least 2 characters to see results.</p>
            </div>
          )}

          {query.trim().length >= 2 && !loading && results.length === 0 && (
            <div className="px-3 py-10 text-center">
              <p className="text-sm text-[#8B93A3]">No matches for &ldquo;{query}&rdquo;.</p>
              <p className="mt-1 text-xs text-[#5B6472]">Try a ticker symbol like AAPL, BTC, or EUR/USD.</p>
            </div>
          )}

          {results.map((result, index) => (
            <button
              key={`${result.source}-${result.type}-${result.id}`}
              onClick={() => navigateTo(result)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                index === activeIndex ? "bg-[#2563EB]/10" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.03] font-mono text-[10px] font-semibold text-[#A1A7B3]">
                  {result.symbol.slice(0, 4).replace("/", "")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{result.symbol}</p>
                  <p className="truncate text-xs text-[#5B6472]">{result.name}</p>
                </div>
              </div>
              <span className="ml-3 flex-shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#8B93A3]">
                {TYPE_LABEL[result.type] ?? result.type}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-[#5B6472] sm:flex">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            <ArrowDown className="h-3 w-3" />
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" />
            Select
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Command className="h-3 w-3" />K to toggle
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
