import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isDemoAccount } from "@/lib/demo-account";
import { getDefaultPortfolio, getPortfolioHoldings } from "@/lib/portfolio/queries";
import { calculatePortfolioValuation } from "@/lib/portfolio/valuation";
import { formatPortfolioDateTime } from "@/lib/format/date";
import { toFiniteNumber } from "@/lib/portfolio/normalizers";
import DashboardSectionHeader from "@/components/dashboard/overview/DashboardSectionHeader";
import MarketStatusStrip from "@/components/dashboard/overview/MarketStatusStrip";
import PortfolioOverviewCard from "@/components/dashboard/overview/PortfolioOverviewCard";
import AIInsightCard from "@/components/dashboard/overview/AIInsightCard";
import MarketMovers from "@/components/dashboard/overview/MarketMovers";
import WatchlistPreview from "@/components/dashboard/overview/WatchlistPreview";
import NewsPreview from "@/components/dashboard/overview/NewsPreview";

// Mock data - will be replaced with real data in later phases
const mockMarketItems = [
  { label: "S&P 500", symbol: "SPY", price: 589.45, change: 4.82, changePercent: 0.82 },
  { label: "NASDAQ", symbol: "QQQ", price: 467.33, change: 5.72, changePercent: 1.24 },
  { label: "Bitcoin", symbol: "BTC", price: 68234, change: 1436, changePercent: 2.15 },
  { label: "Gold", symbol: "XAU", price: 2345.67, change: 10.50, changePercent: 0.45 },
  { label: "VIX", symbol: "VIX", price: 15.30, change: -0.20, changePercent: -1.29 },
];

const mockGainers = [
  { symbol: "NVDA", name: "NVIDIA", price: "$145.67", change: "+8.42%", changePercent: 8.42, positive: true, href: "/dashboard/markets/stock/NVDA" },
  { symbol: "AMD", name: "AMD", price: "$156.23", change: "+5.31%", changePercent: 5.31, positive: true, href: "/dashboard/markets/stock/AMD" },
  { symbol: "META", name: "Meta", price: "$356.78", change: "+4.23%", changePercent: 4.23, positive: true, href: "/dashboard/markets/stock/META" },
];

const mockLosers = [
  { symbol: "INTC", name: "Intel", price: "$34.56", change: "-4.67%", changePercent: -4.67, positive: false, href: "/dashboard/markets/stock/INTC" },
  { symbol: "BA", name: "Boeing", price: "$178.90", change: "-3.45%", changePercent: -3.45, positive: false, href: "/dashboard/markets/stock/BA" },
];

const mockWatchlist = [
  { symbol: "NVDA", name: "NVIDIA", price: 145.67, change: 8.42, positive: true, href: "/dashboard/markets/stock/NVDA" },
  { symbol: "AAPL", name: "Apple", price: 178.34, change: 1.10, positive: true, href: "/dashboard/markets/stock/AAPL" },
  { symbol: "MSFT", name: "Microsoft", price: 412.89, change: 0.85, positive: true, href: "/dashboard/markets/stock/MSFT" },
  { symbol: "AMZN", name: "Amazon", price: 189.67, change: 1.70, positive: true, href: "/dashboard/markets/stock/AMZN" },
  { symbol: "GOOGL", name: "Alphabet", price: 175.45, change: 2.30, positive: true, href: "/dashboard/markets/stock/GOOGL" },
];

const mockNews = [
  { id: "1", title: "Federal Reserve signals potential rate cuts in December", source: "Financial Times", time: "2h ago", sentiment: "positive" as const, href: "#" },
  { id: "2", title: "NVIDIA AI chip demand surges 40% QoQ", source: "Bloomberg", time: "3h ago", sentiment: "positive" as const, href: "#" },
  { id: "3", title: "Tech sector leads market rally, S&P 500 hits new high", source: "Reuters", time: "4h ago", sentiment: "positive" as const, href: "#" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const isDemo = isDemoAccount(user.email);
  const generatedAt = new Date().toISOString();

  // Get portfolio data
  let portfolioData = null;
  let holdings = [];

  if (!isDemo) {
    const defaultPortfolio = await getDefaultPortfolio(user.id);
    if (defaultPortfolio) {
      holdings = await getPortfolioHoldings(defaultPortfolio.id, user.id);
      const valuation = await calculatePortfolioValuation(holdings, defaultPortfolio.cashBalance);
      
      portfolioData = {
        name: defaultPortfolio.name,
        totalValue: valuation.totalValue,
        cashBalance: defaultPortfolio.cashBalance,
        holdingsValue: valuation.holdingsValue,
        unrealizedGain: valuation.totalUnrealizedGain,
        isPositive: valuation.totalUnrealizedGain >= 0,
        holdingsCount: holdings.length,
        isDefault: defaultPortfolio.isDefault,
      };
    }
  }

  // For demo account, use the existing demo data
  const demoPortfolioData = {
    name: "Demo Portfolio",
    totalValue: 2500000,
    cashBalance: 200000,
    holdingsValue: 2300000,
    unrealizedGain: 418600,
    isPositive: true,
    holdingsCount: 7,
    isDefault: true,
    isDemo: true,
  };

  const displayPortfolio = isDemo ? demoPortfolioData : portfolioData;

  // Format market items
  const marketItems = mockMarketItems.map(item => ({
    label: item.label,
    symbol: item.symbol,
    price: item.price,
    change: item.change,
    changePercent: item.changePercent,
    href: `/dashboard/markets?type=${item.symbol === 'BTC' ? 'crypto' : 'stocks'}`,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          {isDemo ? "Market Overview" : "Dashboard"}
        </h1>
        <p className="text-sm text-[#A1A7B3]">
          {isDemo ? "Simulated market intelligence" : "Your financial intelligence command centre"}
        </p>
        <p className="text-xs text-[#A1A7B3] mt-0.5">
          Last updated: {formatPortfolioDateTime(generatedAt)}
        </p>
      </div>

      {/* Market Status Strip */}
      <MarketStatusStrip items={marketItems} />

      {/* Primary Section - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PortfolioOverviewCard
            totalValue={displayPortfolio?.totalValue || 0}
            cashBalance={displayPortfolio?.cashBalance || 0}
            holdingsValue={displayPortfolio?.holdingsValue || 0}
            unrealizedGain={displayPortfolio?.unrealizedGain || 0}
            holdingsCount={displayPortfolio?.holdingsCount || 0}
            isPositive={displayPortfolio?.isPositive || false}
            isDemo={isDemo}
            isLoading={!displayPortfolio && !isDemo}
          />
        </div>
        <div className="lg:col-span-1">
          <AIInsightCard isAvailable={false} />
        </div>
      </div>

      {/* Supporting Sections - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MarketMovers
          items={mockGainers}
          title="Top Gainers"
          viewAllHref="/dashboard/markets"
        />
        <MarketMovers
          items={mockLosers}
          title="Top Losers"
          viewAllHref="/dashboard/markets"
        />
      </div>

      {/* Watchlist and News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WatchlistPreview items={mockWatchlist} count={mockWatchlist.length} />
        <NewsPreview items={mockNews} />
      </div>
    </div>
  );
}
