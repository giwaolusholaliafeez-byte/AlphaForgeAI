"use client";

import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment?: "positive" | "negative" | "neutral";
  href: string;
}

interface NewsPreviewProps {
  items: NewsItem[];
}

export default function NewsPreview({ items }: NewsPreviewProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-[#0B0F1A]">
            <Newspaper className="h-5 w-5 text-[#A1A7B3]" />
          </div>
        </div>
        <h3 className="text-sm font-medium text-white mb-1">No News Available</h3>
        <p className="text-xs text-[#A1A7B3]">Market news will appear here once connected</p>
      </div>
    );
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive": return "text-green-500 bg-green-500/10";
      case "negative": return "text-red-500 bg-red-500/10";
      default: return "text-[#A1A7B3] bg-white/[0.04]";
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-[#A1A7B3]" />
          <span className="text-xs font-medium text-[#A1A7B3] uppercase tracking-wider">Market News</span>
        </div>
        <Link href="/dashboard/news">
          <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#2563EB]/80 text-xs h-7 px-2">
            View All
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block px-4 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white line-clamp-2">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#A1A7B3]">{item.source}</span>
                  <span className="w-1 h-1 rounded-full bg-[#A1A7B3]" />
                  <span className="text-xs text-[#A1A7B3]">{item.time}</span>
                  {item.sentiment && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded",
                      getSentimentColor(item.sentiment)
                    )}>
                      {item.sentiment}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#A1A7B3] flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
