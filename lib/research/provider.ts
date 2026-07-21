import { getAssetDetail } from "@/lib/market-data/asset-details";
import { getCryptoHistory, getStockHistory } from "@/lib/market-data/asset-history";
import type { AssetType } from "@/lib/market-data/types";
import type { ResearchContext, ResearchReport, ResearchSource } from "./types";

const providerUrls: Record<string, string> = {
  finnhub: "https://finnhub.io/",
  coingecko: "https://www.coingecko.com/",
};

export async function buildResearchContext(assetType: AssetType, assetId: string): Promise<ResearchContext> {
  const detailResponse = await getAssetDetail(assetType, assetId);
  if (!detailResponse.data) throw new Error(detailResponse.error ?? "Asset data unavailable");

  const history = assetType === "crypto"
    ? await getCryptoHistory(assetId, "1M")
    : await getStockHistory(assetId, "1M");
  const source: ResearchSource = {
    name: detailResponse.source,
    url: providerUrls[detailResponse.source] ?? null,
    publishedAt: detailResponse.lastUpdated,
    detail: `${detailResponse.source} market data${detailResponse.isDelayed ? " (delayed)" : ""}`,
  };
  return { asset: detailResponse.data, asOf: detailResponse.lastUpdated ?? new Date().toISOString(), sources: [source], historyAvailable: Boolean(history?.points.length) };
}

function contextForModel(context: ResearchContext): Record<string, unknown> {
  const asset = context.asset;
  return {
    asset: {
      id: asset.id, symbol: asset.symbol, name: asset.name, type: asset.type,
      price: asset.price, change: asset.change, changePercent: asset.changePercent,
      currency: asset.currency, marketCap: asset.marketCap, volume: asset.volume,
      lastUpdated: asset.lastUpdated, source: asset.source,
      ...(asset.type === "crypto" ? { rank: asset.rank, circulatingSupply: asset.circulatingSupply } : {}),
      ...(asset.type !== "crypto" ? { exchange: asset.exchange, industry: asset.industry, country: asset.country } : {}),
    },
    asOf: context.asOf,
    historyAvailable: context.historyAvailable,
    sources: context.sources,
  };
}

export async function generateResearch(context: ResearchContext, question?: string): Promise<ResearchReport> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("AI research is temporarily unavailable.");
  const model = process.env.OPENAI_MODEL;
  if (!model) throw new Error("AI research is temporarily unavailable.");

  const instruction = question
    ? `Answer the follow-up question about this asset: ${question}`
    : "Create a structured asset research brief.";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: "You are AlphaForge Research. Use only the supplied structured data. Never invent financial facts, prices, news, earnings, ratings, or fundamentals. Mark unsupported fields as Data unavailable. Bull and bear cases are analysis, not predictions. Do not give buy or sell instructions. Return valid JSON with title, summary, and sections (title/content)." },
        { role: "user", content: `${instruction}\n\nStructured context:\n${JSON.stringify(contextForModel(context))}` },
      ],
      text: { format: { type: "json_object" } },
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("AI research is temporarily unavailable.");
  const payload = await response.json() as { output_text?: string };
  if (!payload.output_text) throw new Error("AI research is temporarily unavailable.");
  let parsed: { title?: unknown; summary?: unknown; sections?: unknown };
  try { parsed = JSON.parse(payload.output_text) as typeof parsed; } catch { throw new Error("AI research is temporarily unavailable."); }
  const sections = Array.isArray(parsed.sections) ? parsed.sections.filter((section): section is { title: string; content: string } => typeof section === "object" && section !== null && typeof (section as { title?: unknown }).title === "string" && typeof (section as { content?: unknown }).content === "string") : [];
  return {
    title: typeof parsed.title === "string" ? parsed.title : `${context.asset.name} research brief`,
    summary: typeof parsed.summary === "string" ? parsed.summary : "Data-backed interpretation is unavailable.",
    sections,
    sources: context.sources,
    asOf: context.asOf,
    assetType: context.asset.type,
    symbol: context.asset.symbol,
    assetId: context.asset.id,
  };
}
