"use client";

import { MarketAsset } from "@/lib/market-data/types";
import MetricCard from "@/components/dashboard/MetricCard";
import { TrendingUp, TrendingDown, BarChart3, Activity, Coins } from "lucide-react";

interface MarketSummaryCardsProps {
  assets: any[];
  type: string;
}

export default function MarketSummaryCards({ assets, type }: MarketSummaryCardsProps) {
  const positive = assets.filter((a: any) => a.change && a.change > 0);
  const negative = assets.filter((a: any) => a.change && a.change < 0);

  const getIcon = () => {
    switch (type) {
      case 'crypto': return <Coins className="h-5 w-5" />;
      case 'fx': return <Activity className="h-5 w-5" />;
      case 'indices': return <BarChart3 className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'crypto': return 'Crypto';
      case 'fx': return 'FX Pairs';
      case 'indices': return 'Indices & Proxies';
      case 'etfs': return 'ETFs';
      default: return 'Stocks';
    }
  };

  const getSource = () => {
    switch (type) {
      case 'crypto': return 'CoinGecko';
      case 'fx': return 'Frankfurter';
      case 'indices': return 'Finnhub (ETF Proxies)';
      default: return 'Finnhub';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label={`Tracked ${getLabel()}`}
        value={assets.length.toString()}
        icon={getIcon()}
      />
      <MetricCard
        label="Positive Movers"
        value={positive.length.toString()}
        icon={<TrendingUp className="h-5 w-5" />}
        changePositive={true}
      />
      <MetricCard
        label="Negative Movers"
        value={negative.length.toString()}
        icon={<TrendingDown className="h-5 w-5" />}
        changePositive={false}
      />
      <MetricCard
        label="Data Provider"
        value={getSource()}
        icon={<Activity className="h-5 w-5" />}
      />
    </div>
  );
}
