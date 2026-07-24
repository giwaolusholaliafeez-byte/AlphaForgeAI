"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BellRing,
  BellDot,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  showcaseTabs,
  copilotExample,
  chartExample,
  portfolioExample,
  newsExample,
  alertsExample,
} from "@/data/showcase";

type TabId = (typeof showcaseTabs)[number]["id"];

const sentimentStyles: Record<string, string> = {
  bullish: "text-[#00C2A8] bg-[#00C2A8]/10 border-[#00C2A8]/20",
  bearish: "text-red-400 bg-red-500/10 border-red-500/20",
  neutral: "text-[#A1A7B3] bg-white/[0.04] border-white/[0.08]",
};

function CopilotPanel() {
  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-white">
            Q
          </div>
          <p className="text-sm text-white">{copilotExample.question}</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/10 text-[#00C2A8]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-[#CBD5E1]">{copilotExample.answer}</p>
            <div className="flex flex-wrap gap-2">
              {copilotExample.citations.map((c) => (
                <span key={c} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-[#8B93A3]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-[#5B6472]">
        Illustrative example · grounded in your live portfolio, market, and news data · not financial advice
      </p>
    </div>
  );
}

function ChartPanel() {
  const data = chartExample.series.map((value, i) => ({ i, value }));
  const positive = chartExample.change >= 0;
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#8B93A3]">{chartExample.name}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold text-white">${chartExample.price.toFixed(2)}</span>
            <span className={`flex items-center text-sm font-medium ${positive ? "text-[#00C2A8]" : "text-red-400"}`}>
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {chartExample.changePercent}%
            </span>
          </div>
        </div>
        <div className="text-right text-[11px] text-[#8B93A3]">
          {chartExample.levels.map((level) => (
            <p key={level.label}>
              {level.label} <span className="font-mono text-white">${level.value.toFixed(2)}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke="#00C2A8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#00C2A8]" />
        <p className="text-xs leading-relaxed text-[#A1A7B3]">{chartExample.aiNote}</p>
      </div>
    </div>
  );
}

function PortfolioPanel() {
  const positive = portfolioExample.dailyChange >= 0;
  return (
    <div className="flex h-full flex-col gap-5">
      <div>
        <p className="text-xs text-[#8B93A3]">Total value</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-semibold text-white">
            ${portfolioExample.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`flex items-center text-sm font-medium ${positive ? "text-[#00C2A8]" : "text-red-400"}`}>
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {portfolioExample.dailyChangePercent}%
          </span>
        </div>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
        {portfolioExample.allocation.map((a) => (
          <div key={a.label} style={{ width: `${a.percent}%`, backgroundColor: a.color }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {portfolioExample.allocation.map((a) => (
          <div key={a.label} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
            <span className="text-[#A1A7B3]">{a.label}</span>
            <span className="ml-auto font-mono text-white">{a.percent}%</span>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#00C2A8]" />
        <p className="text-xs leading-relaxed text-[#A1A7B3]">{portfolioExample.aiNote}</p>
      </div>
    </div>
  );
}

function NewsPanel() {
  return (
    <div className="flex h-full flex-col gap-3">
      {newsExample.map((item) => (
        <div key={item.title} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-snug text-white">{item.title}</p>
            <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${sentimentStyles[item.sentiment]}`}>
              {item.sentiment}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#8B93A3]">
            <span>{item.source} · {item.time}</span>
            <span>{item.impact}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsPanel() {
  return (
    <div className="flex h-full flex-col gap-3">
      {alertsExample.map((alert) => (
        <div key={`${alert.symbol}-${alert.condition}`} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-3">
            {alert.status === "triggered" ? (
              <BellDot className="h-4 w-4 text-[#F4B000]" />
            ) : (
              <BellRing className="h-4 w-4 text-[#A1A7B3]" />
            )}
            <div>
              <p className="text-sm font-medium text-white">{alert.symbol}</p>
              <p className="text-xs text-[#8B93A3]">{alert.condition}</p>
            </div>
          </div>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${alert.status === "triggered" ? "border-[#F4B000]/30 bg-[#F4B000]/10 text-[#F4B000]" : "border-white/[0.08] bg-white/[0.03] text-[#8B93A3]"}`}>
            {alert.status}
          </span>
        </div>
      ))}
    </div>
  );
}

const panels: Record<TabId, () => React.JSX.Element> = {
  copilot: CopilotPanel,
  charting: ChartPanel,
  portfolio: PortfolioPanel,
  news: NewsPanel,
  alerts: AlertsPanel,
};

export default function PlatformShowcase() {
  const [active, setActive] = useState<TabId>("copilot");
  const ActivePanel = panels[active];

  return (
    <section id="showcase" className="py-20 sm:py-28 bg-[#0E1420]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <div className="label-eyebrow justify-center">
            <span className="label-eyebrow-dot" />
            The workspace
          </div>
          <h2 className="text-section-title mt-4 text-white">
            One workspace, every part of the workflow
          </h2>
          <p className="mt-4 text-[#A1A7B3]">
            Copilot, charting, portfolio, news, and alerts — built to work together instead of living in separate tabs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {showcaseTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  isActive
                    ? "border-[#00C2A8]/30 bg-[#00C2A8]/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-[#00C2A8]" : "text-[#8B93A3] group-hover:text-white"}`} />
                <div>
                  <p className={`text-sm font-medium ${isActive ? "text-white" : "text-[#CBD5E1]"}`}>{tab.label}</p>
                  <p className="mt-0.5 hidden text-xs text-[#8B93A3] lg:block">{tab.summary}</p>
                </div>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E1420]"
        >
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="min-h-[280px] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ActivePanel />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
