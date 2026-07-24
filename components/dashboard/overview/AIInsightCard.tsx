"use client";

import Link from "next/link";
import { Sparkles, ChevronRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsightCardProps {
  isAvailable?: boolean;
  insight?: string;
  timestamp?: string;
}

export default function AIInsightCard({
  isAvailable = false,
  insight,
  timestamp,
}: AIInsightCardProps) {
  if (!isAvailable) {
    return (
      <div className="flex h-full flex-col justify-between rounded-lg border border-white/[0.06] bg-[#1E293B] p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/10">
              <Brain className="h-3.5 w-3.5 text-[#00C2A8]" />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-[#A1A7B3]">AI Research</span>
          </div>
          <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#0B0F1A]/60 p-3">
            <p className="text-[11px] text-[#5B6472]">Try asking</p>
            <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
              &ldquo;Summarize what&apos;s driving AAPL today, with sources.&rdquo;
            </p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#8B93A3]">
            Generate a sourced asset brief grounded in live price, fundamentals, and news.
          </p>
        </div>
        <Link href="/dashboard/research">
          <Button variant="ghost" size="sm" className="mt-3 px-0 text-xs text-[#00C2A8] hover:text-[#00C2A8]/80">
            Open Research
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#1A2538] rounded-lg border border-[#00C2A8]/10 p-5 h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#00C2A8]/10">
            <Sparkles className="h-4 w-4 text-[#00C2A8]" />
          </div>
          <span className="text-xs font-medium text-white">AI Market Insight</span>
        </div>
        {timestamp && (
          <span className="text-[10px] text-[#A1A7B3]">{timestamp}</span>
        )}
      </div>

      {insight ? (
        <>
          <p className="text-sm text-[#A1A7B3] leading-relaxed">{insight}</p>
          <Link href="/dashboard/research">
            <Button variant="ghost" size="sm" className="mt-3 text-[#00C2A8] hover:text-[#00C2A8]/80 text-xs px-0">
              Open Research
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </>
      ) : (
        <p className="text-sm text-[#A1A7B3]">No AI insights available at this time.</p>
      )}
    </div>
  );
}
