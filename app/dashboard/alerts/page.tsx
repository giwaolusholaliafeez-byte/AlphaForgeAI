"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import AlertsPageHeader from "@/components/alerts/AlertsPageHeader";
import AlertsTable from "@/components/alerts/AlertsTable";
import CreateAlertForm, { CreateAlertPayload } from "@/components/alerts/CreateAlertForm";
import { AlertItem } from "@/components/alerts/AlertsTable";
import type { MarketSearchResult } from "@/lib/market-data/types";

interface RawAlert {
  id: string;
  symbol: string;
  target: number;
  condition: string;
  status: string;
  triggered_at: string | null;
  trigger_price: number | null;
  created_at: string;
}

function mapAlert(item: RawAlert): AlertItem {
  return {
    id: item.id,
    assetSymbol: item.symbol,
    assetName: item.symbol,
    condition: item.condition === "above" ? "Price Above" : "Price Below",
    target: Number(item.target),
    currentValue: item.trigger_price !== null ? Number(item.trigger_price) : null,
    status: item.status === "disabled" ? "paused" : (item.status as "active" | "triggered"),
    lastTriggered: item.triggered_at,
    createdAt: item.created_at,
  };
}

export default function AlertsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const deepLinkAsset: MarketSearchResult | null = useMemo(() => {
    const assetType = searchParams.get("assetType");
    const assetId = searchParams.get("assetId");
    const symbol = searchParams.get("symbol");
    if (!assetType || !assetId || !symbol) return null;
    return {
      id: assetId,
      symbol,
      name: searchParams.get("name") ?? symbol,
      type: assetType as MarketSearchResult["type"],
      source: "deep-link",
    };
  }, [searchParams]);

  const loadAlerts = () => {
    fetch("/api/alerts")
      .then((response) => response.json())
      .then((data) => setAlerts((data.alerts ?? []).map(mapAlert)))
      .catch(() => setAlerts([]));
  };

  useEffect(() => {
    // Evaluate active alerts against live prices, then load the latest state.
    fetch("/api/alerts/evaluate", { method: "POST" })
      .catch(() => {})
      .finally(loadAlerts);
    if (deepLinkAsset) setShowCreateForm(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (id: string) => {
    const current = alerts.find((alert) => alert.id === id);
    if (!current) return;
    const status = current.status === "active" ? "disabled" : "active";
    fetch("/api/alerts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }).then((response) => { if (response.ok) setAlerts((items) => items.map((alert) => alert.id === id ? { ...alert, status: status === "disabled" ? "paused" : "active" } : alert)); });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this alert?")) {
      fetch(`/api/alerts?id=${encodeURIComponent(id)}`, { method: "DELETE" }).then((response) => { if (response.ok) setAlerts((current) => current.filter(alert => alert.id !== id)); });
      router.refresh();
    }
  };

  const handleCreate = async (data: CreateAlertPayload): Promise<{ error?: string } | void> => {
    const response = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { error: body?.error ?? "Failed to create alert." };
    }
    setAlerts((current) => [mapAlert(body.alert), ...current]);
  };

  return (
    <div className="space-y-6">
      <AlertsPageHeader
        title="Alerts"
        description="Monitor price movements and market conditions"
        alertCount={alerts.length}
        onCreateAlert={() => setShowCreateForm(true)}
      />

      <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-[#8B93A3]">
        <Bell className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#5B6472]" />
        Alerts are checked against live prices whenever this page loads and marked triggered here — email and push delivery are not wired up yet.
      </div>

      {showCreateForm && (
        <CreateAlertForm
          onCancel={() => setShowCreateForm(false)}
          onCreate={handleCreate}
          initialSelected={deepLinkAsset}
        />
      )}

      <AlertsTable
        items={alerts}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}
