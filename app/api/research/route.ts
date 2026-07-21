import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { buildResearchContext, generateResearch } from "@/lib/research/provider";

const requestSchema = z.object({ assetType: z.enum(["stock", "etf", "crypto"]), assetId: z.string().trim().min(1).max(100), question: z.string().trim().max(1000).optional() });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid stock, ETF, or crypto asset." }, { status: 400 });
  const { data: usage, error: usageError } = await supabase.rpc("consume_ai_usage", { p_feature: "research" });
  if (!usageError && usage?.allowed === false) return NextResponse.json({ error: "You have reached your research limit for this period. Upgrade to AlphaForge Pro for more research." }, { status: 429 });
  if (usageError) console.warn("AI usage tracking is unavailable; apply the product-completion migration.", usageError.message);

  const context = await buildResearchContext(parsed.data.assetType, parsed.data.assetId).catch((error: unknown) => {
    console.error("Research context failed", error);
    return null;
  });
  if (!context) return NextResponse.json({ error: "Current market data is unavailable for this asset." }, { status: 503 });
  try {
    const report = await generateResearch(context, parsed.data.question);
    await supabase.from("activity_events").insert({ user_id: user.id, mode: "paper", event_type: "research_generated", description: `Generated research for ${report.symbol}`, metadata: { asset_type: report.assetType, asset_id: report.assetId } });
    return NextResponse.json({ report });
  } catch (error) {
    console.error("Research generation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "AI research is temporarily unavailable." }, { status: 503 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("research_reports").select("id,asset_type,asset_id,symbol,title,summary,report_json,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
  if (error) return NextResponse.json({ reports: [] });
  return NextResponse.json({ reports: data ?? [] });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { report?: unknown } | null;
  const report = body?.report;
  if (!report || typeof report !== "object") return NextResponse.json({ error: "Invalid report." }, { status: 400 });
  const value = report as Record<string, unknown>;
  const required = ["assetType", "assetId", "symbol", "title", "summary"];
  if (!required.every((key) => typeof value[key] === "string")) return NextResponse.json({ error: "Invalid report." }, { status: 400 });
  const { error } = await supabase.from("research_reports").insert({ user_id: user.id, asset_type: value.assetType, asset_id: value.assetId, symbol: value.symbol, title: value.title, summary: value.summary, report_json: report });
  if (error) return NextResponse.json({ error: "Research could not be saved. Apply the research migration first." }, { status: 503 });
  return NextResponse.json({ success: true });
}
