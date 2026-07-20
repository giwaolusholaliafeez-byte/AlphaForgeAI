"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertsPageHeader from "@/components/alerts/AlertsPageHeader";
import AlertsTable from "@/components/alerts/AlertsTable";
import CreateAlertForm from "@/components/alerts/CreateAlertForm";
import { AlertItem } from "@/components/alerts/AlertsTable";

// Mock data - will be replaced with real alerts data in later phases
const mockAlerts: AlertItem[] = [
  {
    id: "1",
    assetSymbol: "NVDA",
    assetName: "NVIDIA",
    condition: "Price Above",
    target: 150.00,
    currentValue: 145.67,
    status: "active",
    lastTriggered: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    assetSymbol: "AAPL",
    assetName: "Apple",
    condition: "Price Below",
    target: 170.00,
    currentValue: 178.34,
    status: "active",
    lastTriggered: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    assetSymbol: "BTC",
    assetName: "Bitcoin",
    condition: "Percentage Decrease",
    target: 5.00,
    currentValue: 2.15,
    status: "triggered",
    lastTriggered: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleToggle = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: alert.status === "active" ? "paused" : "active" as const }
        : alert
    ));
    router.refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this alert?")) {
      setAlerts(alerts.filter(alert => alert.id !== id));
      router.refresh();
    }
  };

  const handleCreate = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAlert: AlertItem = {
      id: Date.now().toString(),
      assetSymbol: data.asset.toUpperCase(),
      assetName: data.asset.toUpperCase(),
      condition: data.condition === "above" ? "Price Above" : "Price Below",
      target: data.target,
      currentValue: null,
      status: "active",
      lastTriggered: null,
      createdAt: new Date().toISOString(),
    };
    setAlerts([...alerts, newAlert]);
    router.refresh();
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
