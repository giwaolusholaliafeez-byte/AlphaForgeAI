import { ExternalLink, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FinnhubClient } from "@/lib/market-data/finnhub";
import type { AssetNewsItem } from "@/lib/market-data/types";
import { redirect } from "next/navigation";

async function loadNews(): Promise<AssetNewsItem[]> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return [];
  const client = new FinnhubClient(key);
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dates = { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
  const results = await Promise.all(["SPY", "NVDA", "AAPL"].map((symbol) => client.getCompanyNews(symbol, dates.from, dates.to).catch(() => [])));
  return results.flat().sort((a, b) => b.datetime.localeCompare(a.datetime)).slice(0, 30);
}

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  const news = await loadNews();
  return <div className="space-y-6"><header><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Sourced market news</p><h1 className="mt-1 text-2xl font-semibold text-white">Market News</h1><p className="mt-1 text-sm text-[#A1A7B3]">Recent provider-sourced articles. Headlines are never generated or substituted with demo content.</p></header>{news.length ? <div className="space-y-3">{news.map((item) => <article key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-medium text-white">{item.headline}</h2><p className="mt-2 text-sm leading-6 text-[#A1A7B3]">{item.summary || "Summary unavailable."}</p><p className="mt-3 text-xs text-[#64748B]">{item.source} · {new Date(item.datetime).toLocaleString()}</p></div><a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.headline}`} className="shrink-0 text-[#60A5FA] hover:text-white"><ExternalLink className="h-4 w-4" /></a></div></article>)}</div> : <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-10 text-center"><Newspaper className="mx-auto h-8 w-8 text-[#64748B]" /><h2 className="mt-3 font-medium text-white">News unavailable</h2><p className="mt-1 text-sm text-[#A1A7B3]">A configured news provider did not return current articles. Try again when market data is available.</p></section>}</div>;
}
