"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertsPageHeader from "@/components/alerts/AlertsPageHeader";
import AlertsTable from "@/components/alerts/AlertsTable";
import CreateAlertForm from "@/components/alerts/CreateAlertForm";
import { AlertItem } from "@/components/alerts/AlertsTable";

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => { fetch("/api/alerts").then((response) => response.json()).then((data) => setAlerts((data.alerts ?? []).map((item: { id: string; symbol: string; target: number; condition: string; status: string; triggered_at: string | null; created_at: string }) => ({ id: item.id, assetSymbol: item.symbol, assetName: item.symbol, condition: item.condition === "above" ? "Price Above" : "Price Below", target: Number(item.target), currentValue: null, status: item.status === "disabled" ? "paused" : item.status as "active" | "triggered", lastTriggered: item.triggered_at, createdAt: item.created_at })))).catch(() => setAlerts([])); }, []);

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

  const handleCreate = async (data: any) => {
    const search = await fetch(`/api/markets/search?q=${encodeURIComponent(data.asset)}`).then((response) => response.json());
    const result = search.results?.[0];
    if (!result) return;
    const response = await fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetType: result.type, assetId: result.id, symbol: result.symbol, condition: data.condition, target: Number(data.target) }) });
    if (!response.ok) return;
    const saved = await response.json();
    setAlerts((current) => [{ id: saved.alert.id, assetSymbol: saved.alert.symbol, assetName: saved.alert.symbol, condition: data.condition === "above" ? "Price Above" : "Price Below", target: Number(saved.alert.target), currentValue: null, status: "active", lastTriggered: null, createdAt: saved.alert.created_at }, ...current]);
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      <AlertsPageHeader
        title="Alerts"
        description="Monitor price movements and market conditions"
        alertCount={alerts.length}
        onCreateAlert={() => setShowCreateForm(true)}
      />

      {showCreateForm && (
        <CreateAlertForm
          onCancel={() => setShowCreateForm(false)}
          onCreate={handleCreate}
        />
      )}

      <AlertsTable
        items={alerts}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      <div className="text-center text-[10px] text-[#A1A7B3]">
        Alert notifications will be connected in a future phase
      </div>
    </div>
  );
}
