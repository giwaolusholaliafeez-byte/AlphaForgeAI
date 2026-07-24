"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio, PortfolioHolding } from '@/types/portfolio';
import { calculatePortfolioValuation, calculateAllocation } from '@/lib/portfolio/valuation';
import { formatPortfolioDateTime } from '@/lib/format/date';
import { toFiniteNumber } from '@/lib/portfolio/normalizers';
import {
  createPortfolio,
  renamePortfolio,
  updateCashBalance,
  setDefaultPortfolio,
  deletePortfolio,
} from '@/lib/portfolio/actions';
import PortfolioPageHeader from '@/components/portfolio/PortfolioPageHeader';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import HoldingsTable from '@/components/portfolio/HoldingsTable';
import AddHoldingForm from '@/components/portfolio/AddHoldingForm';
import PortfolioEmptyState from '@/components/portfolio/PortfolioEmptyState';
import CreatePortfolioForm from '@/components/portfolio/CreatePortfolioForm';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Lock } from 'lucide-react';
import type { PortfolioValuation } from '@/lib/portfolio/valuation';

interface PortfolioContentProps {
  portfolio: Portfolio | null;
  holdings: PortfolioHolding[];
  portfolios: Portfolio[];
  isDemo: boolean;
  tablesExist: boolean;
  generatedAt: string;
  requestedPortfolioId: string | null;
  valuation: PortfolioValuation | null;
}

export default function PortfolioContent({
  portfolio,
  holdings,
  portfolios,
  isDemo,
  tablesExist,
  generatedAt,
  requestedPortfolioId,
  valuation,
}: PortfolioContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showUpdateCash, setShowUpdateCash] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeHoldings = Array.isArray(holdings) ? holdings : [];
  const isDefault = portfolio?.isDefault || false;
// Build display holdings
  const valuationByHoldingId = new Map();
  if (valuation && valuation.valuedHoldings) {
    valuation.valuedHoldings.forEach((vh: any) => {
      if (vh && vh.holding && vh.holding.id) {
        valuationByHoldingId.set(vh.holding.id, vh);
      }
    });
  }

  const displayHoldings = safeHoldings.map((holding) => {
    const valuationResult = valuationByHoldingId.get(holding.id);
    if (valuationResult) return valuationResult;
    
    return {
      holding,
      currentPrice: null,
      marketValue: null,
      costBasis: toFiniteNumber(holding.quantity * holding.averageCost, 0),
      unrealizedGain: null,
      returnPercentage: null,
      allocationPercentage: 0,
    };
  });

  const allocation = displayHoldings.length > 0
    ? calculateAllocation(displayHoldings)
    : [];

  const cashBalance = toFiniteNumber(portfolio?.cashBalance, 0);
  const holdingsValue = displayHoldings.reduce(
    (total, item) => total + toFiniteNumber(item.marketValue, 0),
    0
  );
  const totalValue = cashBalance + holdingsValue;
  const totalUnrealizedGain = displayHoldings.reduce(
    (total, item) => total + toFiniteNumber(item.unrealizedGain, 0),
    0
  );

  const handleRefresh = () => {
    router.refresh();
  };

  const handleCreatePortfolio = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createPortfolio(formData);
      if (result.success) {
        router.refresh();
        setShowCreatePortfolio(false);
      } else {
        setError(result.error || 'Failed to create portfolio');
      }
    });
  };

  const handleRename = async (formData: FormData) => {
    if (!portfolio) return;
    startTransition(async () => {
      const result = await renamePortfolio(portfolio.id, formData);
      if (result.success) {
        router.refresh();
        setShowRename(false);
      } else {
        setError(result.error || 'Failed to rename portfolio');
      }
    });
  };

  const handleUpdateCash = async (formData: FormData) => {
    if (!portfolio) return;
    startTransition(async () => {
      const result = await updateCashBalance(portfolio.id, formData);
      if (result.success) {
        router.refresh();
        setShowUpdateCash(false);
      } else {
        setError(result.error || 'Failed to update cash balance');
      }
    });
  };

  const handleSetDefault = async () => {
    if (!portfolio) return;
    startTransition(async () => {
      const result = await setDefaultPortfolio(portfolio.id);
      if (result.success) {
        router.refresh();
        setShowDeleteConfirm(false);
      } else {
        setError(result.error || 'Failed to set default portfolio');
      }
    });
  };

  const handleDelete = async () => {
    if (!portfolio) return;
    startTransition(async () => {
      const result = await deletePortfolio(portfolio.id);
      if (result.success) {
        router.refresh();
        setShowDeleteConfirm(false);
      } else {
        setError(result.error || 'Failed to delete portfolio');
      }
    });
  };

  // Database tables not configured
  if (!tablesExist) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Database Configuration Required</h3>
          <p className="text-sm text-[#A1A7B3] max-w-2xl mb-6">
            The portfolio database tables have not been configured yet.
          </p>
        </div>
      </div>
    );
  }

  // Demo account
  if (isDemo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Demo Portfolio</h1>
            <p className="text-sm text-[#A1A7B3]">Simulated read-only portfolio</p>
          </div>
          <span className="px-3 py-1 text-xs rounded-full bg-[#F4B000]/10 text-[#F4B000] border border-[#F4B000]/20">
            Demo Account
          </span>
        </div>

        <div className="flex items-center gap-2 p-4 rounded-lg bg-[#F4B000]/5 border border-[#F4B000]/20">
          <Lock className="h-4 w-4 flex-shrink-0 text-[#F4B000]" />
          <p className="text-sm text-[#F4B000]">
            Read-only simulated portfolio with $2,500,000 in simulated holdings.
          </p>
        </div>

        <PortfolioHero
          totalValue={2500000}
          holdingsValue={2300000}
          cashBalance={200000}
          unrealizedGain={418600}
          isPositive={true}
          holdingsCount={7}
        />

        <div className="text-center py-12">
          <p className="text-[#A1A7B3]">Demo portfolio with 7 simulated positions</p>
          <p className="text-xs text-[#A1A7B3] mt-2">Simulated for testing • Read-only</p>
        </div>
      </div>
    );
  }

  // No portfolio
  if (!portfolio) {
    return (
      <div className="space-y-6">
        <PortfolioPageHeader portfolio={null} isDefault={false} onCreatePortfolio={() => {}} hideCreateAction />
        <div className="rounded-xl border border-white/[0.06] bg-[#1E293B] px-6 py-12">
          <PortfolioEmptyState onCreatePortfolio={() => router.refresh()} />
        </div>
      </div>
    );
  }

  // Has portfolio
  return (
    <div className="space-y-6">
      <PortfolioPageHeader
        portfolio={portfolio}
        isDefault={isDefault}
        onCreatePortfolio={() => setShowCreatePortfolio(true)}
        onRename={() => setShowRename(true)}
        onUpdateCash={() => setShowUpdateCash(true)}
        onSetDefault={handleSetDefault}
        onDelete={() => setShowDeleteConfirm(true)}
      />

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {showCreatePortfolio && (
        <CreatePortfolioForm
          open={showCreatePortfolio}
          onOpenChange={setShowCreatePortfolio}
          onSuccess={() => {
            setShowCreatePortfolio(false);
            handleRefresh();
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#A1A7B3]">
          Last updated: {formatPortfolioDateTime(generatedAt)}
        </p>
        <Button
          onClick={() => setShowAddHolding(!showAddHolding)}
          className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Holding
        </Button>
      </div>

      {showAddHolding && (
        <AddHoldingForm
          portfolioId={portfolio.id}
          onSuccess={handleRefresh}
          onCancel={() => setShowAddHolding(false)}
        />
      )}

      <PortfolioHero
        totalValue={totalValue}
        holdingsValue={holdingsValue}
        cashBalance={cashBalance}
        unrealizedGain={totalUnrealizedGain}
        isPositive={totalUnrealizedGain >= 0}
        holdingsCount={safeHoldings.length}
      />

      {safeHoldings.length > 0 ? (
        <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden">
          <div className="p-4">
            <HoldingsTable
              holdings={displayHoldings}
              allocation={allocation}
              onRefresh={handleRefresh}
            />
          </div>
          <div className="px-4 py-2 border-t border-white/[0.06]">
            <p className="text-[10px] text-[#A1A7B3]">
              {safeHoldings.length} holdings • {portfolio.baseCurrency}
              {valuation?.unavailablePrices && valuation.unavailablePrices.length > 0 && (
                <span className="ml-2 text-yellow-500">
                  • Prices unavailable for: {valuation.unavailablePrices.join(', ')}
                </span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-12 text-center">
          <p className="text-sm font-medium text-white">No holdings in this portfolio yet</p>
          <p className="mt-1 text-xs text-[#8B93A3]">Add a stock, ETF, or crypto position to start tracking performance.</p>
          <Button
            onClick={() => setShowAddHolding(true)}
            size="sm"
            className="mt-4 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Holding
          </Button>
        </div>
      )}
    </div>
  );
}
