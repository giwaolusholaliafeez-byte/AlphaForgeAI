"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AssetSearch from "@/components/markets/AssetSearch";
import type { MarketSearchResult } from "@/lib/market-data/types";

export interface CreateAlertPayload {
  assetType: string;
  assetId: string;
  symbol: string;
  condition: "above" | "below";
  target: number;
}

interface CreateAlertFormProps {
  onCancel: () => void;
  onCreate: (data: CreateAlertPayload) => Promise<{ error?: string } | void>;
  initialSelected?: MarketSearchResult | null;
}

const CONDITIONS = [
  { value: "above", label: "Price Above" },
  { value: "below", label: "Price Below" },
];

async function searchAssets(query: string): Promise<MarketSearchResult[]> {
  const res = await fetch(`/api/markets/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

export default function CreateAlertForm({ onCancel, onCreate, initialSelected = null }: CreateAlertFormProps) {
  const [selected, setSelected] = useState<MarketSearchResult | null>(initialSelected);
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selected) {
      setError("Search for and select an asset first");
      return;
    }

    const targetNum = parseFloat(target);
    if (isNaN(targetNum) || targetNum <= 0) {
      setError("Please enter a valid target value");
      return;
    }

    setIsLoading(true);
    try {
      const result = await onCreate({
        assetType: selected.type,
        assetId: selected.id,
        symbol: selected.symbol,
        condition,
        target: targetNum,
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create alert");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#1E293B] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Create Alert</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          aria-label="Close create alert form"
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset */}
        <div className="space-y-1.5">
          <Label htmlFor="asset" className="text-white text-sm">
            Asset <span className="text-red-500">*</span>
          </Label>
          {selected ? (
            <div className="flex items-center justify-between rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/[0.06] px-3 py-2">
              <div>
                <p className="text-sm font-medium text-white">{selected.symbol}</p>
                <p className="text-xs text-[#8B93A3]">{selected.name}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
                className="h-7 text-xs text-[#A1A7B3] hover:text-white"
              >
                Change
              </Button>
            </div>
          ) : (
            <AssetSearch id="asset" onSearch={searchAssets} onSelect={(result) => setSelected(result)} />
          )}
          <p className="text-[10px] text-[#A1A7B3]">Search by symbol or name, e.g. AAPL, Bitcoin</p>
        </div>

        {/* Condition */}
        <div className="space-y-1.5">
          <Label htmlFor="condition" className="text-white text-sm">
            Condition <span className="text-red-500">*</span>
          </Label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as "above" | "below")}
            className="w-full px-3 py-2 rounded-lg bg-[#0B0F1A] border border-[#0B0F1A] text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading}
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Target */}
        <div className="space-y-1.5">
          <Label htmlFor="target" className="text-white text-sm">
            Target Value <span className="text-red-500">*</span>
          </Label>
          <Input
            id="target"
            type="text"
            inputMode="decimal"
            placeholder="Enter target value"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading || !selected}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
          >
            {isLoading ? "Creating..." : "Create Alert"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-[#1E293B] text-white hover:bg-[#1E293B]"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
