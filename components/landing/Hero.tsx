"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { marketOverview, chartData } from "@/data/marketData";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B0F1A] pb-20 pt-36 sm:pt-40">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-40"
        style={{
          background:
            "radial-gradient(700px circle at 50% 0%, rgba(37,99,235,0.16), transparent 70%)",
        }}
      />
      <div className="container relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 border-[#00C2A8]/20 bg-[#00C2A8]/10 text-[#00C2A8]">
              Now in early access
            </Badge>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Market intelligence,
              <br />
              without the noise.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#A1A7B3]">
              AlphaForge AI puts live market data, AI-grounded research, portfolio
              analytics, news intelligence, and alerts in a single workspace —
              so you spend less time switching tabs and more time deciding.
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
                  See the platform
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-[#5B6472]">
              No credit card required · Live market data · AI research grounded in real data
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E1420] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>
                <span className="text-[11px] text-[#5B6472]">workspace.alphaforge</span>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-2">
                  {marketOverview.indices.slice(0, 4).map((index) => (
                    <div key={index.name} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
                      <p className="text-[10px] text-[#8B93A3]">{index.name}</p>
                      <p className="font-mono text-sm font-semibold text-white">{index.value}</p>
                      <span className={`text-[10px] font-medium ${index.positive ? "text-[#00C2A8]" : "text-red-400"}`}>
                        {index.change}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-[90px] rounded-lg border border-white/[0.05] bg-white/[0.02] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-[#00C2A8]/15 bg-[#00C2A8]/[0.05] p-3">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#00C2A8]" />
                  <p className="text-xs leading-relaxed text-[#CBD5E1]">
                    {marketOverview.aiSummary.split(". ")[0]}.
                  </p>
                </div>

                <div className="space-y-1.5">
                  {marketOverview.watchlist.slice(0, 3).map((item) => (
                    <div key={item.symbol} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white">{item.symbol}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#A1A7B3]">${item.price.toFixed(2)}</span>
                        <span className={`flex items-center ${item.change >= 0 ? "text-[#00C2A8]" : "text-red-400"}`}>
                          <ArrowUpRight className="h-3 w-3" />
                          {item.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-[#5B6472]">Illustrative workspace preview</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
