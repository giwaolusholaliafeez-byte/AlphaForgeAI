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
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5 h-full flex flex-col items-center justify-center text-center">
        <div className="p-3 rounded-full bg-[#00C2A8]/5 border border-[#00C2A8]/10 mb-3">
          <Brain className="h-6 w-6 text-[#00C2A8]" />
        </div>
        <h3 className="text-sm font-medium text-white mb-1">AI Research</h3>
        <p className="text-xs text-[#A1A7B3] max-w-xs">
          Generate a sourced asset brief from the AI Research workspace.
        </p>
        <Link href="/dashboard/research">
          <Button variant="ghost" size="sm" className="mt-3 text-[#00C2A8] hover:text-[#00C2A8]/80 text-xs">
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
