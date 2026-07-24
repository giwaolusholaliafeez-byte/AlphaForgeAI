"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateAlertFormProps {
  onCancel: () => void;
  onCreate: (data: any) => Promise<void>;
  initialAsset?: string;
}

const CONDITIONS = [
  { value: "above", label: "Price Above" },
  { value: "below", label: "Price Below" },
];

export default function CreateAlertForm({ onCancel, onCreate, initialAsset = "" }: CreateAlertFormProps) {
  const [asset, setAsset] = useState(initialAsset);
  const [condition, setCondition] = useState("above");
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!asset || !target) {
      setError("Please fill in all required fields");
      return;
    }

    const targetNum = parseFloat(target);
    if (isNaN(targetNum) || targetNum <= 0) {
      setError("Please enter a valid target value");
      return;
    }

    setIsLoading(true);
    try {
      await onCreate({
        asset,
        condition,
        target: targetNum,
      });
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create alert");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Create Alert</h3>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset */}
        <div className="space-y-1.5">
          <Label htmlFor="asset" className="text-white text-sm">
            Asset <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
            <Input
              id="asset"
              type="text"
              placeholder="Search and select asset"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="pl-9 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
              disabled={isLoading}
              required
            />
          </div>
          <p className="text-[10px] text-[#A1A7B3]">Enter asset symbol (e.g., AAPL, BTC)</p>
        </div>

        {/* Condition */}
        <div className="space-y-1.5">
          <Label htmlFor="condition" className="text-white text-sm">
            Condition <span className="text-red-500">*</span>
          </Label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
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
            disabled={isLoading}
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

      <div className="mt-4 p-3 rounded-lg bg-[#F4B000]/5 border border-[#F4B000]/10">
        <p className="text-xs text-[#A1A7B3]">
          ⚠️ Alert creation is currently in preview. Real-time notifications will be connected in a future phase.
        </p>
      </div>
    </div>
  );
}
