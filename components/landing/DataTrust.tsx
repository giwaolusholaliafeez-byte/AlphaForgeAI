"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Database, KeyRound, Ban } from "lucide-react";

const points = [
  {
    icon: Database,
    title: "Real market data providers",
    description: "Prices, history, and news are sourced from Finnhub, CoinGecko, Twelve Data, and Frankfurter — not simulated.",
  },
  {
    icon: KeyRound,
    title: "Secrets never reach the browser",
    description: "API keys and provider secrets stay server-side. Your session is handled through Supabase auth.",
  },
  {
    icon: Ban,
    title: "Live trading is off by default",
    description: "Brokerage connections run in sandbox mode until you explicitly enable live execution.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, access-controlled",
    description: "Row-level security scopes every portfolio, watchlist, and alert to its owner.",
  },
];

export default function DataTrust() {
  return (
    <section className="py-20 sm:py-24 bg-[#0E1420]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Built on real data, kept secure
          </h2>
          <p className="mt-4 text-[#A1A7B3]">
            No synthetic prices, no client-side secrets, no surprise live orders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <Icon className="h-5 w-5 text-[#00C2A8]" />
                <p className="mt-3 text-sm font-medium text-white">{point.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#8B93A3]">{point.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
