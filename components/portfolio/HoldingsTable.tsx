"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValuedHolding } from "@/lib/portfolio/valuation";
import { removeHolding } from "@/lib/portfolio/actions";
import EditHoldingForm from "./EditHoldingForm";

interface HoldingsTableProps {
  holdings?: ValuedHolding[];
  allocation?: Array<{ assetType: string; value: number; percentage: number; color: string }>;
  onRefresh: () => void;
}

export default function HoldingsTable({
  holdings: holdingsProp = [],
  allocation: allocationProp = [],
  onRefresh,
}: HoldingsTableProps) {
  const [editingHoldingId, setEditingHoldingId] = useState<string | null>(null);

  const holdings = Array.isArray(holdingsProp) ? holdingsProp : [];
  const allocation = Array.isArray(allocationProp) ? allocationProp : [];

  const handleRemove = async (holdingId: string) => {
    if (!confirm("Remove this holding from your portfolio?")) return;

    const result = await removeHolding(holdingId);
    if (result.success) {
      onRefresh();
    } else {
      alert(result.error || "Failed to remove holding");
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getAssetRoute = (holding: ValuedHolding) => {
    const h = holding.holding;
    switch (h.assetType) {
      case "stock":
        return `/dashboard/markets/stock/${h.symbol}`;
      case "etf":
        return `/dashboard/markets/etf/${h.symbol}`;
      case "crypto":
        return `/dashboard/markets/crypto/${h.assetId}`;
      case "index_proxy":
        return `/dashboard/markets/etf/${h.symbol}`;
      default:
        return "#";
    }
  };

  if (editingHoldingId) {
    const holding = holdings.find((h) => h.holding.id === editingHoldingId);
    if (holding) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Edit Holding</h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingHoldingId(null)}
              className="text-[#A1A7B3] hover:text-white"
            >
              Cancel
            </Button>
          </div>
          <EditHoldingForm
            holding={holding.holding}
            onSuccess={() => {
              setEditingHoldingId(null);
              onRefresh();
            }}
            onCancel={() => setEditingHoldingId(null)}
          />
        </div>
      );
    }
  }

  if (holdings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#A1A7B3]">No holdings in this portfolio yet.</p>
        <p className="text-xs text-[#A1A7B3] mt-1">Click "Add Holding" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allocation.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
          {allocation.slice(0, 5).map((item) => (
            <div key={item.assetType} className="p-2 rounded-lg bg-[#0B0F1A]">
              <p className="text-xs text-[#A1A7B3] capitalize">{item.assetType}</p>
              <p className="text-sm font-medium text-white">{item.percentage.toFixed(1)}%</p>
            </div>
          ))}
        </div>
      )}

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#0B0F1A] text-[#A1A7B3]">
              <th className="text-left py-3 px-4 font-medium">Asset</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-right py-3 px-4 font-medium">Quantity</th>
              <th className="text-right py-3 px-4 font-medium">Avg Cost</th>
              <th className="text-right py-3 px-4 font-medium">Price</th>
              <th className="text-right py-3 px-4 font-medium">Market Value</th>
              <th className="text-right py-3 px-4 font-medium">Cost Basis</th>
              <th className="text-right py-3 px-4 font-medium">Gain/Loss</th>
              <th className="text-right py-3 px-4 font-medium">Return</th>
              <th className="text-right py-3 px-4 font-medium">Allocation</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((vh) => {
              const h = vh.holding;
              const isPositive = vh.unrealizedGain !== null && vh.unrealizedGain >= 0;
              const route = getAssetRoute(vh);

              return (
                <tr
                  key={h.id}
                  className="border-b border-[#0B0F1A] hover:bg-[#0B0F1A]/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{h.symbol}</p>
                      <p className="text-xs text-[#A1A7B3]">{h.assetName}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#A1A7B3] capitalize">{h.assetType}</td>
                  <td className="py-3 px-4 text-right text-white">
                    {h.quantity.toFixed(h.assetType === "crypto" ? 4 : 2)}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {formatCurrency(h.averageCost)}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {vh.currentPrice !== null ? formatCurrency(vh.currentPrice) : "Unavailable"}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {vh.marketValue !== null ? formatCurrency(vh.marketValue) : "Unavailable"}
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {formatCurrency(vh.costBasis)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
                      {vh.unrealizedGain !== null ? formatCurrency(vh.unrealizedGain) : "Unavailable"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
                      {formatPercent(vh.returnPercentage)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-white">
                    {vh.allocationPercentage.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {route !== "#" && (
                        <Link href={route} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A1A7B3] hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingHoldingId(h.id)}
                        className="h-8 w-8 text-[#A1A7B3] hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(h.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {holdings.map((vh) => {
          const h = vh.holding;
          const isPositive = vh.unrealizedGain !== null && vh.unrealizedGain >= 0;

          return (
            <div key={h.id} className="bg-[#0B0F1A] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{h.symbol}</p>
                  <p className="text-xs text-[#A1A7B3]">{h.assetName}</p>
                </div>
                <span className="text-xs text-[#A1A7B3] capitalize">{h.assetType}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-[#A1A7B3]">Quantity</p>
                  <p className="text-white">{h.quantity.toFixed(h.assetType === "crypto" ? 4 : 2)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A7B3]">Market Value</p>
                  <p className="text-white">
                    {vh.marketValue !== null ? formatCurrency(vh.marketValue) : "Unavailable"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A7B3]">Gain/Loss</p>
                  <p className={isPositive ? "text-green-500" : "text-red-500"}>
                    {vh.unrealizedGain !== null ? formatCurrency(vh.unrealizedGain) : "Unavailable"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#A1A7B3]">Return</p>
                  <p className={isPositive ? "text-green-500" : "text-red-500"}>
                    {formatPercent(vh.returnPercentage)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-1 pt-2 border-t border-[#1E293B]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingHoldingId(h.id)}
                  className="text-[#A1A7B3] hover:text-white"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(h.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
