"use client";

import { cn } from "@/lib/utils";

export type MarketCategory = "stocks" | "etfs" | "crypto" | "fx" | "indices";

interface MarketCategoryTabsProps {
  categories: Array<{ id: MarketCategory; label: string }>;
  selected: MarketCategory;
  onSelect: (category: MarketCategory) => void;
  className?: string;
}

export default function MarketCategoryTabs({
  categories,
  selected,
  onSelect,
  className,
}: MarketCategoryTabsProps) {
  return (
    <div className={cn("flex gap-0.5 p-0.5 rounded-lg bg-[#0B0F1A] overflow-x-auto", className)}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "px-3.5 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap",
            selected === category.id
              ? "bg-[#2563EB] text-white"
              : "text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
          )}
          aria-current={selected === category.id ? "page" : undefined}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
