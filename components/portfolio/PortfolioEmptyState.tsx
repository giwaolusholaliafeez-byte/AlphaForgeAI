"use client";

import { FolderOpen } from "lucide-react";
import CreatePortfolioForm from "./CreatePortfolioForm";

interface PortfolioEmptyStateProps {
  onCreatePortfolio?: () => void;
}

export default function PortfolioEmptyState({ onCreatePortfolio }: PortfolioEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#0B0F1A] flex items-center justify-center mb-4">
        <FolderOpen className="h-8 w-8 text-[#A1A7B3]" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No Portfolios Yet</h3>
      <p className="text-sm text-[#A1A7B3] max-w-md mb-6">
        Create your first portfolio to start tracking your investments.
      </p>
      <CreatePortfolioForm onSuccess={onCreatePortfolio} />
    </div>
  );
}
