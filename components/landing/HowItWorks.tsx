"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Search or select an asset",
    description:
      "Pull up any stock, ETF, cryptocurrency, or forex pair with live pricing and history from the moment you land.",
  },
  {
    n: "02",
    title: "Review data and AI analysis",
    description:
      "See the chart, key levels, financials, and recent news alongside an AI read that's grounded in that same data — not a generic summary.",
  },
  {
    n: "03",
    title: "Save, monitor, and act",
    description:
      "Add it to a watchlist, set a price alert, or size a position in paper trading — all synced to your account.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/[0.06] bg-[#0B0F1A] py-20 sm:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="label-eyebrow">
              <span className="label-eyebrow-dot" />
              How it works
            </div>
            <h2 className="text-section-title mt-4 text-white">
              From question to conviction in three steps.
            </h2>
            <p className="mt-4 max-w-sm text-[#A1A7B3]">
              No setup, no wizard to configure. Every session starts the same
              way, whether you&apos;re checking one ticker or rebuilding a
              portfolio.
            </p>
          </motion.div>

          <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] lg:border-t-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 py-7 first:pt-0"
              >
                <span className="num flex-shrink-0 text-3xl font-semibold text-white/15 sm:text-4xl">
                  {step.n}
                </span>
                <div className="pt-0.5">
                  <h3 className="text-base font-semibold text-white sm:text-lg">{step.title}</h3>
                  <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[#A1A7B3]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
