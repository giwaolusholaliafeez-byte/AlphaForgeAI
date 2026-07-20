"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  Brain, 
  Clock, 
  ChevronRight,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data - will be replaced with real research data in later phases
const mockResearchHistory = [
  {
    id: "1",
    title: "NVIDIA Market Analysis",
    asset: "NVDA",
    date: new Date().toISOString(),
    type: "Company Overview",
  },
  {
    id: "2",
    title: "Bitcoin Volatility Report",
    asset: "BTC",
    date: new Date().toISOString(),
    type: "Risk Analysis",
  },
];

interface ResearchResult {
  id: string;
  title: string;
  summary: string;
  sections: Array<{ title: string; content: string }>;
  sources: string[];
  confidence: number;
  generatedAt: string;
}

export default function ResearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [showHistory, setShowHistory] = useState(true);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    // Simulate research generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      id: Date.now().toString(),
      title: `Research: ${query}`,
      summary: "Analysis based on available market data and AI interpretation.",
      sections: [
        {
          title: "Executive Summary",
          content: "This is a simulated research summary. AI Research Copilot will be connected in a future phase with real market data integration."
        },
        {
          title: "Market Context",
          content: "Market data integration will provide real-time context and analysis."
        },
        {
          title: "Key Considerations",
          content: "Research capabilities will include financial analysis, risk assessment, and portfolio insights."
        }
      ],
      sources: ["Market Data Provider", "Historical Analysis"],
      confidence: 78,
      generatedAt: new Date().toISOString(),
    });
    
    setIsLoading(false);
    setShowHistory(false);
  };

  const handleNewResearch = () => {
    setResult(null);
    setQuery("");
    setShowHistory(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">AI Research</h1>
            <Badge className="bg-[#00C2A8]/10 text-[#00C2A8] border-[#00C2A8]/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Preview
            </Badge>
          </div>
          <p className="text-sm text-[#A1A7B3]">Research assets with AlphaForge AI intelligence</p>
        </div>
        {result && (
          <Button onClick={handleNewResearch} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
            <Brain className="h-4 w-4 mr-2" />
            New Research
          </Button>
        )}
      </div>

      {/* Research Input */}
      {!result && (
        <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5">
          <form onSubmit={handleResearch} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="research-query" className="text-white text-sm">
                What would you like to research?
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
                <Input
                  id="research-query"
                  type="text"
                  placeholder="E.g., Compare NVIDIA and AMD, Bitcoin market analysis"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Generating Research...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Research Asset
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-lg bg-[#F4B000]/5 border border-[#F4B000]/10">
            <p className="text-xs text-[#A1A7B3]">
              ⚠️ AI Research is currently in preview mode. Real-time market analysis and advanced research capabilities will be connected in a future phase.
            </p>
          </div>
        </div>
      )}

      {/* Research Result */}
      {result && (
        <div className="bg-[#1E293B] rounded-lg border border-[#00C2A8]/10 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{result.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-[#A1A7B3]">Generated: {new Date(result.generatedAt).toLocaleString()}</span>
                <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20">
                  Confidence: {result.confidence}%
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewResearch}
              className="text-[#A1A7B3] hover:text-white"
            >
              New <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0B0F1A] border border-white/[0.06]">
              <p className="text-sm text-[#A1A7B3]">{result.summary}</p>
            </div>

            {result.sections.map((section, index) => (
              <div key={index} className="space-y-1">
                <h4 className="text-sm font-medium text-white">{section.title}</h4>
                <p className="text-sm text-[#A1A7B3]">{section.content}</p>
              </div>
            ))}

            <div>
              <h4 className="text-sm font-medium text-white mb-2">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="text-[#A1A7B3] border-white/[0.06]">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
            <Button className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white text-sm">
              Save Research
            </Button>
            <Button variant="outline" className="border-[#1E293B] text-white hover:bg-[#1E293B] text-sm">
              Export
            </Button>
          </div>

          <p className="text-[10px] text-[#A1A7B3] text-center">
            ⚠️ Research information is for educational purposes only and not financial advice.
          </p>
        </div>
      )}

      {/* Research History */}
      {showHistory && !result && mockResearchHistory.length > 0 && (
        <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5">
          <h3 className="text-sm font-medium text-white mb-4">Recent Research</h3>
          <div className="divide-y divide-white/[0.04]">
            {mockResearchHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 hover:bg-white/[0.02] transition-colors px-2 -mx-2 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#A1A7B3]">{item.asset}</span>
                    <span className="text-xs text-[#A1A7B3]">•</span>
                    <span className="text-xs text-[#A1A7B3]">{item.type}</span>
                    <span className="text-xs text-[#A1A7B3]">•</span>
                    <span className="text-xs text-[#A1A7B3]">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[#A1A7B3] hover:text-white">
                  Open <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
