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
import FirstActionCard from "@/components/dashboard/FirstActionCard";
import type { UserType } from "@/lib/accounts/types";
import { getLiveDashboardMarketData } from "@/lib/dashboard/live-market";
import { getCurrentNews } from "@/lib/market-data/news";
import { getAssetDetail } from "@/lib/market-data/asset-details";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const isDemo = isDemoAccount(user.email);
  const generatedAt = new Date().toISOString();
  const liveMarket = await getLiveDashboardMarketData();
  const currentNews = await getCurrentNews('latest');
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("user_id", user.id).maybeSingle();
  const userType: UserType = profile?.user_type === "trader" || profile?.user_type === "exploring" ? profile.user_type : "investor";

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
  const hasPaperOrders = !isDemo ? Boolean((await supabase.from("paper_orders").select("id", { count: "exact", head: true }).eq("user_id", user.id)).count) : true;

  const { data: watchlistRows, count: watchlistCount } = await supabase
    .from("watchlist_items")
    .select("id,asset_type,asset_id,symbol,name", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const watchlistItems = (
    await Promise.all(
      (watchlistRows ?? []).map(async (row) => {
        const detail = await getAssetDetail(row.asset_type, row.asset_id).catch(() => null);
        if (!detail?.data || detail.data.price === null) return null;
        return {
          symbol: row.symbol,
          name: row.name,
          price: detail.data.price,
          change: detail.data.changePercent ?? 0,
          positive: (detail.data.changePercent ?? 0) >= 0,
          href: `/dashboard/markets/${row.asset_type}/${row.asset_id}`,
        };
      })
    )
  ).filter((item): item is NonNullable<typeof item> => item !== null);

  const marketItems = liveMarket.slice(0, 5);
  const moverItems = liveMarket.filter((item) => item.changePercent !== null && item.symbol !== "SPY" && item.symbol !== "QQQ" && item.symbol !== "VOO").sort((a, b) => (b.changePercent ?? 0) - (a.changePercent ?? 0));
  const toMover = (item: (typeof liveMarket)[number]) => ({ symbol: item.symbol, name: item.name, price: item.price === null ? "—" : `$${item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, change: item.changePercent === null ? "—" : `${item.changePercent >= 0 ? "+" : ""}${item.changePercent.toFixed(2)}%`, changePercent: item.changePercent ?? 0, positive: (item.changePercent ?? 0) >= 0, href: item.href });

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

      {!isDemo && ((userType === "investor" && !portfolioData) || (userType === "trader" && !hasPaperOrders) || userType === "exploring") && <FirstActionCard userType={userType} />}

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
          items={moverItems.filter((item) => (item.changePercent ?? 0) > 0).slice(0, 5).map(toMover)}
          title="Top Gainers"
          viewAllHref="/dashboard/markets"
        />
        <MarketMovers
          items={moverItems.filter((item) => (item.changePercent ?? 0) < 0).slice(-5).reverse().map(toMover)}
          title="Top Losers"
          viewAllHref="/dashboard/markets"
        />
      </div>

      {/* Watchlist and News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WatchlistPreview items={watchlistItems} count={watchlistCount ?? 0} />
        <NewsPreview items={currentNews.slice(0, 4).map((item) => ({ id: item.id, title: item.headline, source: item.source, time: new Date(item.datetime).toLocaleString(), href: item.url }))} />
      </div>
    </div>
  );
}
