"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Newspaper, 
  RefreshCw, 
  ExternalLink, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPortfolioDateTime } from "@/lib/format/date";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  category: string;
  sentiment: "positive" | "negative" | "neutral";
  url: string;
  image?: string;
  relatedAssets?: string[];
}

// Mock data - will be replaced with real news data in later phases
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve signals potential rate cuts in December amid cooling inflation",
    source: "Financial Times",
    time: "2h ago",
    summary: "Fed officials indicated a dovish shift as inflation shows signs of moderation, with markets pricing in a 65% probability of a rate cut.",
    category: "Economy",
    sentiment: "positive",
    url: "#",
    relatedAssets: ["SPY", "QQQ"],
  },
  {
    id: "2",
    title: "NVIDIA AI chip demand surges 40% QoQ, exceeds analyst expectations",
    source: "Bloomberg",
    time: "3h ago",
    summary: "NVIDIA's AI chip division reported record revenue, driven by strong enterprise demand and cloud provider adoption.",
    category: "Earnings",
    sentiment: "positive",
    url: "#",
    relatedAssets: ["NVDA", "AMD"],
    image: "/alphaforge-icon.png",
  },
  {
    id: "3",
    title: "Tech sector leads market rally as S&P 500 hits new record high",
    source: "Reuters",
    time: "4h ago",
    summary: "The S&P 500 closed at a fresh all-time high, led by technology stocks and strong earnings reports from major tech companies.",
    category: "Markets",
    sentiment: "positive",
    url: "#",
    relatedAssets: ["SPY", "QQQ", "AAPL", "MSFT"],
  },
  {
    id: "4",
    title: "Oil prices decline 3% amid concerns over global demand and oversupply",
    source: "WSJ",
    time: "5h ago",
    summary: "Crude oil prices fell sharply as demand concerns outweighed supply cuts, with Brent crude dropping below $80 per barrel.",
    category: "Commodities",
    sentiment: "negative",
    url: "#",
  },
  {
    id: "5",
    title: "SEC announces new cryptocurrency regulation framework, industry reacts",
    source: "CoinDesk",
    time: "6h ago",
    summary: "The SEC unveiled a comprehensive regulatory framework for digital assets, aiming to provide clarity while maintaining investor protection.",
    category: "Regulation",
    sentiment: "neutral",
    url: "#",
    relatedAssets: ["BTC", "ETH"],
  },
];

const categories = ["All", "Markets", "Economy", "Earnings", "Commodities", "Regulation", "Crypto"];

export default function NewsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLastUpdated(formatPortfolioDateTime(new Date().toISOString()));
  }, []);

  const filteredNews = selectedCategory === "All" 
    ? mockNews 
    : mockNews.filter(item => item.category === selectedCategory);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(formatPortfolioDateTime(new Date().toISOString()));
      setIsRefreshing(false);
    }, 800);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-500 bg-green-500/10";
      case "negative": return "text-red-500 bg-red-500/10";
      default: return "text-[#A1A7B3] bg-white/[0.04]";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="h-3 w-3" />;
      case "negative": return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Market News</h1>
          <p className="text-sm text-[#A1A7B3]">Financial news and market intelligence</p>
          {lastUpdated && (
            <p className="text-xs text-[#A1A7B3] mt-0.5">Updated: {lastUpdated}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-white/[0.06] text-white hover:bg-white/[0.04]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5 mr-2", isRefreshing && "animate-spin")} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all duration-150",
              selectedCategory === category
                ? "bg-[#2563EB] text-white"
                : "text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="space-y-3">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-4 hover:border-white/[0.08] transition-all duration-150"
            >
              <div className="flex items-start gap-4">
                {item.image && (
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="w-20 h-20 rounded-lg bg-[#0B0F1A] overflow-hidden flex items-center justify-center">
                      <span className="text-2xl">📰</span>
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-white hover:text-[#2563EB] transition-colors">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="line-clamp-2">
                          {item.title}
                        </a>
                      </h3>
                      <p className="text-xs text-[#A1A7B3] mt-1 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-[#A1A7B3] hover:text-white transition-colors"
                      aria-label="Read full article"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs text-[#A1A7B3]">{item.source}</span>
                    <span className="text-xs text-[#A1A7B3]">•</span>
                    <span className="text-xs text-[#A1A7B3]">{item.time}</span>
                    <span className="text-xs text-[#A1A7B3]">•</span>
                    <Badge className="text-[10px] bg-white/[0.04] text-[#A1A7B3] border-white/[0.06]">
                      {item.category}
                    </Badge>
                    <Badge className={cn("text-[10px] border-none", getSentimentColor(item.sentiment))}>
                      {getSentimentIcon(item.sentiment)}
                      <span className="ml-1 capitalize">{item.sentiment}</span>
                    </Badge>
                    {item.relatedAssets && item.relatedAssets.length > 0 && (
                      <>
                        <span className="text-xs text-[#A1A7B3]">•</span>
                        <div className="flex gap-1">
                          {item.relatedAssets.map((asset) => (
                            <Badge
                              key={asset}
                              variant="outline"
                              className="text-[10px] text-[#2563EB] border-[#2563EB]/20 hover:bg-[#2563EB]/10 cursor-pointer"
                              onClick={() => router.push(`/dashboard/markets/stock/${asset}`)}
                            >
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-8 text-center">
          <Newspaper className="h-8 w-8 text-[#A1A7B3] mx-auto mb-3" />
          <h3 className="text-sm font-medium text-white mb-1">No News Available</h3>
          <p className="text-xs text-[#A1A7B3]">No news found for this category</p>
        </div>
      )}

      <div className="text-center text-[10px] text-[#A1A7B3]">
        News provided by market data sources. Live integration coming in a future phase.
      </div>
    </div>
  );
}
