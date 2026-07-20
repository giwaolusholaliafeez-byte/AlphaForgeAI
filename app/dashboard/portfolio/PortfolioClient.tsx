"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Portfolio, PortfolioHolding } from '@/types/portfolio';
import PortfolioLoadingState from '@/components/portfolio/PortfolioLoadingState';
import PortfolioEmptyState from '@/components/portfolio/PortfolioEmptyState';
import PortfolioSelector from '@/components/portfolio/PortfolioSelector';
import CreatePortfolioForm from '@/components/portfolio/CreatePortfolioForm';
import AddHoldingForm from '@/components/portfolio/AddHoldingForm';
import HoldingsTable from '@/components/portfolio/HoldingsTable';
import PortfolioSummaryCards from '@/components/portfolio/PortfolioSummaryCards';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { calculateAllocation, type ValuedHolding } from '@/lib/portfolio/valuation';
import { formatPortfolioDateTime } from '@/lib/format/date';
import { toFiniteNumber } from '@/lib/portfolio/normalizers';

interface PortfolioClientProps {
  user: User;
  isDemo: boolean;
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  holdings: PortfolioHolding[];
  tablesExist: boolean;
  requestedPortfolioId: string | null;
  generatedAt?: string;
}

export default function PortfolioClient({
  user,
  isDemo,
  portfolios: portfoliosProp,
  selectedPortfolio,
  holdings: holdingsProp,
  tablesExist,
  requestedPortfolioId,
  generatedAt,
}: PortfolioClientProps) {
  const router = useRouter();
  const [showAddHolding, setShowAddHolding] = useState(false);

  // Ensure arrays are always arrays
  const portfolios = Array.isArray(portfoliosProp) ? portfoliosProp : [];
  const savedHoldings = Array.isArray(holdingsProp) ? holdingsProp : [];


  const handlePortfolioSelect = (portfolioId: string) => {
    router.push(`/dashboard/portfolio?portfolio=${portfolioId}`);
  };

  const handleCreateSuccess = () => {
    router.refresh();
  };

  const handleAddHoldingSuccess = () => {
    setShowAddHolding(false);
    router.refresh();
  };

  const displayHoldings: ValuedHolding[] = savedHoldings.map((holding) => {
    const quantity = toFiniteNumber(holding.quantity, 0);
    const averageCost = toFiniteNumber(holding.averageCost, 0);

    return {
      holding,
      currentPrice: null,
      marketValue: null,
      costBasis: quantity * averageCost,
      unrealizedGain: null,
      returnPercentage: null,
      allocationPercentage: 0,
    };
  });

  // Calculate allocation from display holdings
  const allocation = displayHoldings.length > 0
    ? calculateAllocation(displayHoldings)
    : [];

  // Calculate safe summary values
  const cashBalance = toFiniteNumber(selectedPortfolio?.cashBalance, 0);
  const holdingsValue = displayHoldings.reduce(
    (total, item) => total + toFiniteNumber(item.marketValue, 0),
    0
  );
  const totalValue = cashBalance + holdingsValue;
  const totalUnrealizedGain = displayHoldings.reduce(
    (total, item) => total + toFiniteNumber(item.unrealizedGain, 0),
    0
  );


  // Demo account - read-only
  if (isDemo) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio</h1>
            <p className="text-sm text-[#A1A7B3]">Simulated demo portfolio</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#F4B000]/10 border border-[#F4B000]/20">
          <p className="text-sm text-[#F4B000]">
            🔒 Read-only simulated portfolio. This is a demo account with $2,500,000 in simulated holdings.
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-[#A1A7B3]">Demo portfolio with $2,500,000 simulated holdings</p>
          <p className="text-xs text-[#A1A7B3] mt-2">7 positions • Simulated for testing</p>
        </div>
      </div>
    );
  }

  // Database configuration required
  if (!tablesExist) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Database Configuration Required</h3>
          <p className="text-sm text-[#A1A7B3] max-w-2xl mb-6">
            The portfolio database tables have not been configured yet. Please run the SQL script from
            <code className="mx-1 px-2 py-1 bg-[#0B0F1A] rounded text-xs text-[#00C2A8]">
              supabase/portfolio-schema.sql
            </code>
            in your Supabase SQL Editor.
          </p>
        </div>
      </div>
    );
  }

  // Regular user - no portfolios yet
  if (portfolios.length === 0) {
    return (
      <div className="space-y-6">
        <PortfolioEmptyState onCreatePortfolio={handleCreateSuccess} />
      </div>
    );
  }

  // Regular user - has portfolios
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-sm text-[#A1A7B3]">Track your investments</p>
          {generatedAt && (
            <p className="text-xs text-[#A1A7B3]">
              Last updated: {formatPortfolioDateTime(generatedAt)}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <PortfolioSelector
            portfolios={portfolios}
            selectedId={selectedPortfolio?.id || null}
            onSelect={handlePortfolioSelect}
          />
          <CreatePortfolioForm onSuccess={handleCreateSuccess} />
        </div>
      </div>

      {/* Selected Portfolio Info */}
      {selectedPortfolio && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-lg bg-[#1E293B] border border-[#1E293B]">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-white">{selectedPortfolio.name}</h2>
              {selectedPortfolio.isDefault && (
                <span className="px-2 py-0.5 text-xs bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 rounded">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-[#A1A7B3]">
              Cash: ${selectedPortfolio.cashBalance.toFixed(2)} USD • {savedHoldings.length} holdings
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              onClick={() => setShowAddHolding(!showAddHolding)}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Holding
            </Button>
          </div>
        </div>
      )}

      {/* Add Holding Form */}
      {showAddHolding && selectedPortfolio && (
        <AddHoldingForm
          portfolioId={selectedPortfolio.id}
          onSuccess={handleAddHoldingSuccess}
          onCancel={() => setShowAddHolding(false)}
        />
      )}

      {/* Summary Cards - with safe values */}
      <PortfolioSummaryCards
        totalValue={totalValue}
        holdingsValue={holdingsValue}
        cashBalance={cashBalance}
        unrealizedGain={totalUnrealizedGain}
        isPositive={totalUnrealizedGain >= 0}
        holdingsCount={savedHoldings.length}
      />

      {/* Holdings Table - ALWAYS show if saved holdings exist */}
      {savedHoldings.length > 0 ? (
        <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden">
          <div className="p-4">
            <HoldingsTable
              holdings={displayHoldings}
              allocation={allocation}
              onRefresh={() => router.refresh()}
            />
          </div>
          <div className="px-4 py-2 border-t border-[#0B0F1A]">
            <p className="text-[10px] text-[#A1A7B3]">
              {savedHoldings.length} holdings • Last updated: {generatedAt ? formatPortfolioDateTime(generatedAt) : '—'}

            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-8 text-center">
          <p className="text-[#A1A7B3]">No holdings in this portfolio yet.</p>
          <p className="text-xs text-[#A1A7B3] mt-1">Click "Add Holding" to get started.</p>
        </div>
      )}
    </div>
  );
}
