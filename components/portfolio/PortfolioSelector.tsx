"use client";

import { Portfolio } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedId: string | null;
  onSelect: (portfolioId: string) => void;
}

export default function PortfolioSelector({
  portfolios,
  selectedId,
  onSelect,
}: PortfolioSelectorProps) {
  return (
    <select
      value={selectedId || ''}
      onChange={(e) => onSelect(e.target.value)}
      aria-label="Select portfolio"
      className="px-3 py-2 rounded-lg bg-[#0B0F1A] border border-[#1E293B] text-white focus:border-[#2563EB] focus:ring-[#2563EB] min-w-[180px]"
    >
      {portfolios.map((portfolio) => (
        <option key={portfolio.id} value={portfolio.id}>
          {portfolio.name} {portfolio.isDefault ? '⭐' : ''} - ${portfolio.cashBalance.toFixed(0)}
        </option>
      ))}
    </select>
  );
}
