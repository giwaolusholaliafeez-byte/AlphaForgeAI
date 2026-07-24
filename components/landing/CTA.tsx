"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="final-cta" className="py-20 sm:py-28 bg-[#0B0F1A]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-14 text-center sm:px-14"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Build your research workspace
          </h2>
          <p className="mt-4 text-[#A1A7B3]">
            Free to start. Connect the markets you follow, ask the copilot a question,
            and see the full picture in one place.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="w-full bg-[#2563EB] px-8 text-base hover:bg-[#2563EB]/90 sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full border-white/[0.08] px-8 text-base text-white hover:bg-white/[0.06] sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
