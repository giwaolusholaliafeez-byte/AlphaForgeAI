"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BarChart3, BookmarkCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search or select an asset",
    description: "Enter any stock, ETF, cryptocurrency, or asset to begin your research journey."
  },
  {
    icon: BarChart3,
    title: "Review data and AI analysis",
    description: "Access market data, financials, news, and AI-generated insights in one place."
  },
  {
    icon: BookmarkCheck,
    title: "Save and monitor",
    description: "Add assets to your portfolio or watchlist and continue monitoring with alerts."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#0B0F1A]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            How AlphaForge AI works
          </h2>
          <p className="text-[#A1A7B3] max-w-2xl mx-auto">
            A straightforward workflow designed for efficient financial research
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1E293B] border-[#1E293B] relative h-full">
                  <CardContent className="pt-8 text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="mb-4 inline-flex p-3 rounded-full bg-[#2563EB]/10">
                      <Icon className="h-6 w-6 text-[#2563EB]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-sm text-[#A1A7B3] leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
