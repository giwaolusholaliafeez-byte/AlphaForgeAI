"use client";

import { MoreVertical, Plus, Pencil, DollarSign, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portfolio } from "@/types/portfolio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PortfolioPageHeaderProps {
  portfolio: Portfolio | null;
  isDefault?: boolean;
  onCreatePortfolio: () => void;
  onRename?: () => void;
  onUpdateCash?: () => void;
  onSetDefault?: () => void;
  onDelete?: () => void;
  className?: string;
  hideCreateAction?: boolean;
}

export default function PortfolioPageHeader({
  portfolio,
  isDefault,
  onCreatePortfolio,
  onRename,
  onUpdateCash,
  onSetDefault,
  onDelete,
  className,
  hideCreateAction,
}: PortfolioPageHeaderProps) {
  if (!portfolio) {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <div>
          <h1 className="text-page-title text-white">Portfolio</h1>
          <p className="text-sm text-[#A1A7B3]">Create your first portfolio to get started</p>
        </div>
        {!hideCreateAction && (
          <Button onClick={onCreatePortfolio} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Portfolio
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-xl font-semibold text-white truncate">{portfolio.name}</h1>
        {isDefault && (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 whitespace-nowrap">
            Default
          </span>
        )}
        <span className="text-xs text-[#A1A7B3] hidden sm:inline">
          {portfolio.baseCurrency}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onCreatePortfolio}
          variant="outline"
          size="sm"
          className="border-white/[0.06] text-white hover:bg-white/[0.04]"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
              aria-label="Portfolio actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-[#1E293B] border-white/[0.06] text-white shadow-xl"
          >
            {onRename && (
              <DropdownMenuItem
                onClick={onRename}
                className="cursor-pointer text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
            )}
            {onUpdateCash && (
              <DropdownMenuItem
                onClick={onUpdateCash}
                className="cursor-pointer text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Update Cash
              </DropdownMenuItem>
            )}
            {onSetDefault && !isDefault && (
              <DropdownMenuItem
                onClick={onSetDefault}
                className="cursor-pointer text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
              >
                <Star className="mr-2 h-4 w-4" />
                Set as Default
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-white/[0.04]"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Portfolio
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
