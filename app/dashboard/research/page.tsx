"use client";

import { useEffect, useState } from "react";
import { Brain, ChevronRight, ExternalLink, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SearchResult = { id: string; symbol: string; name: string; type: "stock" | "etf" | "crypto" };
type Source = { name: string; url: string | null; publishedAt: string | null; detail: string };
type Report = { title: string; summary: string; sections: Array<{ title: string; content: string }>; sources: Source[]; asOf: string; assetType: string; symbol: string; assetId: string };

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [asset, setAsset] = useState<SearchResult | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; title: string; symbol: string; summary: string; report_json: Report }>>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetch("/api/research").then((response) => response.ok ? response.json() : { reports: [] }).then((data) => setHistory(data.reports ?? [])).catch(() => setHistory([])); }, []);
  useEffect(() => {
    if (asset || query.trim().length < 2) { setResults([]); return; }
    const timer = window.setTimeout(() => fetch(`/api/markets/search?q=${encodeURIComponent(query)}`).then((response) => response.json()).then((data) => setResults(data.results ?? [])).catch(() => setResults([])), 250);
    return () => window.clearTimeout(timer);
  }, [query, asset]);

  async function generate(followUp?: string) {
    if (!asset) return;
    setLoading(true); setError(null);
    try {
      const response = await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetType: asset.type, assetId: asset.id, question: followUp || undefined }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "AI research is temporarily unavailable.");
      setReport(data.report);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "AI research is temporarily unavailable."); } finally { setLoading(false); }
  }

  async function saveReport() {
    if (!report) return;
    const response = await fetch("/api/research", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ report }) });
    if (response.ok) setError("Research saved to your private history."); else setError((await response.json()).error ?? "Research could not be saved.");
  }

  return <div className="space-y-6">
    <header><div className="flex items-center gap-3"><h1 className="text-2xl font-semibold text-white">AI Research</h1><Badge className="border-[#00C2A8]/20 bg-[#00C2A8]/10 text-[#00C2A8]"><Sparkles className="mr-1 h-3 w-3" />Evidence-based</Badge></div><p className="mt-1 text-sm text-[#A1A7B3]">Select a stock, ETF, or crypto asset for a sourced research brief. Missing provider data stays unavailable.</p></header>
    {!report && <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><label htmlFor="research-asset" className="text-sm font-medium text-white">Asset</label><div className="relative mt-2"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" /><input id="research-asset" value={asset ? `${asset.symbol} · ${asset.name}` : query} onChange={(event) => { setAsset(null); setQuery(event.target.value); }} placeholder="Search NVDA, SPY, Bitcoin..." className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0B0F1A] pl-10 pr-3 text-sm text-white outline-none focus:border-[#2563EB]" /></div>{results.length > 0 && <div className="mt-2 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B0F1A]">{results.map((item) => <button key={`${item.type}-${item.id}`} type="button" onClick={() => { setAsset(item); setQuery(""); }} className="flex w-full items-center justify-between px-3 py-3 text-left hover:bg-white/[0.04]"><span><span className="font-medium text-white">{item.symbol}</span><span className="ml-3 text-sm text-[#A1A7B3]">{item.name}</span></span><span className="text-[10px] uppercase tracking-wider text-[#64748B]">{item.type}</span></button>)}</div>}<Button type="button" className="mt-4" disabled={!asset || loading} onClick={() => generate()}><Brain className="mr-2 h-4 w-4" />{loading ? "Building brief..." : "Generate research brief"}</Button></section>}
    {error && <div className="rounded-lg border border-[#F4B000]/20 bg-[#F4B000]/5 p-3 text-sm text-[#F4B000]">{error}</div>}
    {report && <section className="space-y-5 rounded-xl border border-[#00C2A8]/20 bg-[#00C2A8]/5 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-xs uppercase tracking-wider text-[#00C2A8]">{report.assetType} research brief</p><h2 className="mt-1 text-xl font-semibold text-white">{report.title}</h2><p className="mt-1 text-xs text-[#A1A7B3]">As of {new Date(report.asOf).toLocaleString()} · {report.symbol}</p></div><Button variant="outline" onClick={() => { setReport(null); setAsset(null); setError(null); }} className="border-white/[0.1] text-white">New research</Button></div><div className="rounded-lg bg-[#0B0F1A] p-4 text-sm leading-6 text-[#CBD5E1]">{report.summary}</div><div className="grid gap-4 md:grid-cols-2">{report.sections.map((section) => <article key={section.title} className="rounded-lg border border-white/[0.06] bg-[#0B0F1A] p-4"><h3 className="font-medium text-white">{section.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#A1A7B3]">{section.content}</p></article>)}</div><div><h3 className="font-medium text-white">Sources and freshness</h3><div className="mt-2 space-y-2">{report.sources.map((source) => <div key={`${source.name}-${source.publishedAt}`} className="flex flex-wrap items-center gap-2 text-sm text-[#A1A7B3]"><span>{source.detail}</span>{source.publishedAt && <span>· {new Date(source.publishedAt).toLocaleString()}</span>}{source.url && <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[#60A5FA] hover:underline">Open source <ExternalLink className="ml-1 h-3 w-3" /></a>}</div>)}</div></div><div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-4"><Button onClick={saveReport} className="bg-[#00C2A8] text-[#0B0F1A] hover:bg-[#00C2A8]/90">Save to research history</Button><form onSubmit={(event) => { event.preventDefault(); const value = question.trim(); if (value) { setQuestion(""); generate(value); } }} className="flex min-w-[260px] flex-1 gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a follow-up about this asset..." className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#0B0F1A] px-3 text-sm text-white outline-none" /><Button type="submit" variant="outline" disabled={loading || !question.trim()}><ChevronRight className="h-4 w-4" /></Button></form></div><p className="text-center text-[11px] text-[#64748B]">Analysis is educational, source-grounded, and not investment advice.</p></section>}
    {!report && <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><h2 className="font-medium text-white">Private research history</h2>{history.length ? <div className="mt-3 divide-y divide-white/[0.06]">{history.map((item) => <button key={item.id} type="button" onClick={() => { setReport(item.report_json); setAsset({ id: item.report_json.assetId, symbol: item.symbol, name: item.symbol, type: item.report_json.assetType as SearchResult["type"] }); }} className="flex w-full items-center justify-between py-3 text-left hover:bg-white/[0.02]"><span><span className="font-medium text-white">{item.title}</span><span className="ml-2 text-xs text-[#64748B]">{item.symbol}</span></span><ChevronRight className="h-4 w-4 text-[#64748B]" /></button>)}</div> : <p className="mt-3 text-sm text-[#A1A7B3]">No saved reports yet.</p>}</section>}
  </div>;
}
