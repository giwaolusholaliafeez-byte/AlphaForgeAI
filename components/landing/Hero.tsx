"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Sparkles, Bell } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { chartExample, copilotExample } from "@/data/showcase";

const chartSeries = chartExample.series.map((value, i) => ({ i, value }));

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B0F1A] pb-24 pt-32 sm:pt-40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-grid-fine opacity-[0.55]"
        style={{
          maskImage: "radial-gradient(ellipse 900px 500px at 30% 0%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 900px 500px at 30% 0%, black 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-40"
        style={{
          background: "radial-gradient(680px circle at 18% 0%, rgba(37,99,235,0.18), transparent 70%)",
        }}
      />

      <div className="container relative">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_0.92fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:pt-6"
          >
            <div className="label-eyebrow">
              <span className="label-eyebrow-dot" />
              Live markets · AI research · your portfolio
            </div>

            <h1 className="text-display mt-6 max-w-xl text-white">
              Market research that knows what you actually hold.
            </h1>

            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-[#A1A7B3]">
              AlphaForge AI reads live prices across stocks, crypto, and forex
              alongside your real portfolio and watchlist — so every answer,
              chart, and alert is grounded in your positions, not a generic
              chatbot bolted onto a stock screener.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up">
                <Button size="lg" className="w-full bg-[#2563EB] px-8 text-base hover:bg-[#2563EB]/90 sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#showcase">
                <Button size="lg" variant="outline" className="w-full border-white/[0.08] px-8 text-base text-white hover:bg-white/[0.06] sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-6 text-xs text-[#5B6472]">
              <span>No credit card required</span>
              <span className="h-1 w-1 rounded-full bg-[#2D3748]" />
              <span>Real data — Finnhub, CoinGecko, Twelve Data</span>
              <span className="h-1 w-1 rounded-full bg-[#2D3748]" />
              <span>Live trading disabled by default</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto w-full max-w-[440px] pb-8 pt-4 lg:mx-0 lg:mt-2"
          >
            {/* Back panel — watchlist ticker, offset behind/above the main panel */}
            <div className="absolute -top-4 right-2 z-0 w-[78%] rotate-[1.5deg] rounded-xl border border-white/[0.07] bg-[#0E1420] p-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] sm:right-6">
              <div className="flex items-center justify-between text-[10px] text-[#5B6472]">
                <span>NVDA · NVIDIA Corp</span>
                <span className="flex items-center gap-1 text-[#00C2A8]">
                  <ArrowUpRight className="h-3 w-3" />
                  {chartExample.changePercent}%
                </span>
              </div>
              <div className="mt-1 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartSeries}>
                    <Line type="monotone" dataKey="value" stroke="#00C2A8" strokeWidth={1.75} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Front panel — Ask AlphaForge conversation */}
            <div className="relative z-10 mt-14 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0E1420] shadow-[0_28px_90px_-24px_rgba(0,0,0,0.65)]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-medium text-white">
                  <Sparkles className="h-3.5 w-3.5 text-[#00C2A8]" />
                  Ask AlphaForge
                </div>
                <span className="font-mono text-[10px] text-[#5B6472]">grounded in live data</span>
              </div>

              <div className="space-y-3 p-4">
                <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-white/[0.06] px-3 py-2 text-[12px] leading-relaxed text-white">
                  {copilotExample.question}
                </div>
                <div className="max-w-[92%] rounded-lg rounded-tl-sm border border-[#00C2A8]/15 bg-[#00C2A8]/[0.06] px-3 py-2.5 text-[12px] leading-relaxed text-[#CBD5E1]">
                  {copilotExample.answer}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {chartExample.levels.map((level) => (
                    <div key={level.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                      <p className="text-[9px] uppercase tracking-wide text-[#5B6472]">{level.label}</p>
                      <p className="num text-[13px] font-semibold text-white">${level.value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating alert chip */}
            <div className="absolute -bottom-5 -left-4 z-20 flex items-center gap-2 rounded-lg border border-[#F4B000]/25 bg-[#0E1420] px-3 py-2 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] sm:-left-8">
              <Bell className="h-3.5 w-3.5 flex-shrink-0 text-[#F4B000]" />
              <div>
                <p className="text-[11px] font-medium leading-none text-white">NVDA crossed $150</p>
                <p className="mt-0.5 text-[10px] text-[#5B6472]">Alert triggered · 2m ago</p>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-[#5B6472] sm:text-left">
              Illustrative product composition · not live data
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
