"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { marketCoverage } from "@/data/marketCoverage";

const capabilityList = [
  "Real-time market data across stocks, ETFs, crypto, and forex",
  "AI research grounded in live market, portfolio, and news context",
  "Persistent watchlists and price alerts, synced to your account",
  "Portfolio analytics — allocation, exposure, and performance",
  "News scored for sentiment and portfolio relevance",
  "Risk-free paper trading to test ideas before committing capital",
];

export default function Capabilities() {
  return (
    <section className="py-20 sm:py-24 bg-[#0B0F1A]">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Markets you can actually research
            </h2>
            <p className="mt-3 text-[#A1A7B3]">
              Coverage across the asset classes that matter, backed by live data providers.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {marketCoverage.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <Icon className="h-4 w-4 text-[#2563EB]" />
                    <p className="mt-2.5 text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#8B93A3]">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Built for the full research workflow
            </h2>
            <p className="mt-3 text-[#A1A7B3]">
              Not a single-purpose tool — everything a research session needs, connected.
            </p>
            <ul className="mt-8 space-y-4">
              {capabilityList.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/10">
                    <Check className="h-3 w-3 text-[#00C2A8]" />
                  </span>
                  <span className="text-sm leading-relaxed text-[#CBD5E1]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
