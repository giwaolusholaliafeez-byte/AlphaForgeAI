"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const assetClasses = [
  { label: "Stocks & ETFs", examples: "AAPL · NVDA · MSFT · SPY" },
  { label: "Cryptocurrency", examples: "BTC · ETH · SOL · XRP" },
  { label: "Foreign exchange", examples: "EUR/USD · GBP/USD · USD/JPY" },
  { label: "Indices", examples: "S&P 500 · Nasdaq · Dow · Russell" },
];

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
    <section className="border-t border-white/[0.06] bg-[#0B0F1A] py-20 sm:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="label-eyebrow">
              <span className="label-eyebrow-dot" />
              Coverage
            </div>
            <h2 className="text-section-title mt-4 text-white">
              Markets you can actually research
            </h2>
            <p className="mt-3 text-[#A1A7B3]">
              Coverage across the asset classes that matter, backed by live data providers.
            </p>
            <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06]">
              {assetClasses.map((asset, index) => (
                <div
                  key={asset.label}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    index !== assetClasses.length - 1 ? "border-b border-white/[0.06]" : ""
                  } ${index % 2 === 0 ? "bg-white/[0.015]" : ""}`}
                >
                  <span className="text-sm font-medium text-white">{asset.label}</span>
                  <span className="num text-xs text-[#5B6472]">{asset.examples}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="label-eyebrow">
              <span className="label-eyebrow-dot" />
              Workflow
            </div>
            <h2 className="text-section-title mt-4 text-white">
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
