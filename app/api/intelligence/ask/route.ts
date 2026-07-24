import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getDefaultPortfolio, getPortfolioHoldings } from "@/lib/portfolio/queries";
import { calculatePortfolioValuation } from "@/lib/portfolio/valuation";
import { getLiveDashboardMarketData } from "@/lib/dashboard/live-market";
import { buildPortfolioIntelligence } from "@/lib/intelligence/calculations";
import { answerPortfolioQuestion } from "@/lib/intelligence/copilot";

const schema = z.object({ question: z.string().trim().min(1).max(500) });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Ask a question first." }, { status: 400 });

  const { data: usage, error: usageError } = await supabase.rpc("consume_ai_usage", { p_feature: "copilot" });
  if (!usageError && usage?.allowed === false) {
    return NextResponse.json({ error: "You have reached your AI copilot limit for this period. Upgrade to AlphaForge Pro for more." }, { status: 429 });
  }
  if (usageError) console.warn("AI usage tracking is unavailable; apply the copilot usage migration.", usageError.message);

  const portfolio = await getDefaultPortfolio(user.id);
  if (!portfolio) return NextResponse.json({ error: "Create a portfolio first to unlock the copilot." }, { status: 400 });

  const [holdings, liveMarket] = await Promise.all([
    getPortfolioHoldings(portfolio.id, user.id),
    getLiveDashboardMarketData(),
  ]);
  const valuation = await calculatePortfolioValuation(holdings, portfolio.cashBalance);
  const context = buildPortfolioIntelligence(valuation.valuedHoldings, portfolio.cashBalance, liveMarket);

  try {
    const answer = await answerPortfolioQuestion(context, parsed.data.question);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Copilot answer failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "AI copilot is temporarily unavailable." }, { status: 503 });
  }
}
