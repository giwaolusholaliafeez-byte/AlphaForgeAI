"use client";

import { Bell, BellOff, Pause, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AlertItem {
  id: string;
  assetSymbol: string;
  assetName: string;
  condition: string;
  target: number | null;
  currentValue: number | null;
  status: "active" | "paused" | "triggered";
  lastTriggered: string | null;
  createdAt: string;
}

interface AlertsTableProps {
  items: AlertItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export default function AlertsTable({ items, onToggle, onDelete, className }: AlertsTableProps) {
  const statusColors = {
    active: "text-[#00C2A8] bg-[#00C2A8]/10 border-[#00C2A8]/20",
    paused: "text-[#F4B000] bg-[#F4B000]/10 border-[#F4B000]/20",
    triggered: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20",
  };

  const statusLabels = {
    active: "Active",
    paused: "Paused",
    triggered: "Triggered",
  };

  if (items.length === 0) {
    return (
      <div className={cn("bg-[#1E293B] rounded-lg border border-[#1E293B] p-8 text-center", className)}>
        <p className="text-[#A1A7B3]">No alerts configured</p>
        <p className="text-xs text-[#A1A7B3] mt-1">Create your first alert to start monitoring</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[#A1A7B3]">
              <th className="text-left py-3 px-4 font-medium">Asset</th>
              <th className="text-left py-3 px-4 font-medium">Condition</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">Target</th>
              <th className="text-right py-3 px-4 font-medium tabular-nums">Current</th>
              <th className="text-center py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Created</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-white">{item.assetSymbol}</p>
                    <p className="text-xs text-[#A1A7B3]">{item.assetName}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#A1A7B3]">{item.condition}</td>
                <td className="py-3 px-4 text-right text-white tabular-nums">
                  {item.target !== null ? `$${item.target.toFixed(2)}` : "—"}
                </td>
                <td className="py-3 px-4 text-right text-white tabular-nums">
                  {item.currentValue !== null ? `$${item.currentValue.toFixed(2)}` : "Unavailable"}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge className={cn("border", statusColors[item.status])}>
                    {statusLabels[item.status]}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right text-[#A1A7B3] text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggle(item.id)}
                      className="h-8 w-8 text-[#A1A7B3] hover:text-white"
                      aria-label={item.status === "active" ? "Pause alert" : "Resume alert"}
                    >
                      {item.status === "active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      aria-label="Delete alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
