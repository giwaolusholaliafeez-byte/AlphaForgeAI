"use client";

import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, Ban, Check } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "Your data, access-controlled",
    description: "Row-level security scopes every portfolio, watchlist, and alert to its owner — server-enforced, not just UI-hidden.",
  },
  {
    icon: KeyRound,
    title: "Secrets never reach the browser",
    description: "Provider API keys and billing secrets stay server-side. Your session is handled through Supabase auth.",
  },
  {
    icon: Ban,
    title: "Live trading is off by default",
    description: "Brokerage connections run sandboxed until execution is explicitly and separately enabled.",
  },
];

interface ProviderStatus {
  finnhub: boolean;
  coingecko: boolean;
  twelveData: boolean;
  openai: boolean;
}

export default function DataTrust({ providerStatus }: { providerStatus: ProviderStatus }) {
  const statusFeed = [
    { label: "Finnhub", detail: "Stocks & ETFs, news", state: providerStatus.finnhub ? ("live" as const) : ("off" as const) },
    { label: "CoinGecko", detail: "Crypto quotes & OHLC", state: providerStatus.coingecko ? ("live" as const) : ("off" as const) },
    { label: "Twelve Data", detail: "Forex intraday", state: providerStatus.twelveData ? ("live" as const) : ("off" as const) },
    { label: "Frankfurter", detail: "Forex daily rates", state: "live" as const },
    { label: "OpenAI", detail: "Research & copilot", state: providerStatus.openai ? ("live" as const) : ("off" as const) },
    { label: "Live order execution", detail: "Brokerage trading", state: "off" as const },
  ];

  return (
    <section className="border-t border-white/[0.06] bg-[#0E1420] py-20 sm:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="label-eyebrow">
              <span className="label-eyebrow-dot" />
              Data & security
            </div>
            <h2 className="text-section-title mt-4 max-w-md text-white">
              Built on real data, kept honest about what&apos;s simulated.
            </h2>
            <p className="mt-4 max-w-md text-[#A1A7B3]">
              No synthetic prices dressed up as live quotes, no client-side
              secrets, no surprise live orders.
            </p>

            <div className="mt-8 space-y-6">
              {points.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                      <Icon className="h-4 w-4 text-[#00C2A8]" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{point.title}</p>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-[#8B93A3]">{point.description}</p>
                    </div>
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
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0F1A]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B93A3]">Provider status</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#00C2A8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C2A8]" />
                Live
              </span>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {statusFeed.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-white">{row.label}</p>
                    <p className="text-xs text-[#5B6472]">{row.detail}</p>
                  </div>
                  {row.state === "live" ? (
                    <span className="flex items-center gap-1.5 rounded-full border border-[#00C2A8]/25 bg-[#00C2A8]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#00C2A8]">
                      <Check className="h-3 w-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#5B6472]">
                      Disabled
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
