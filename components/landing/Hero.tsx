"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#0B0F1A]">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-[#00C2A8]/10 text-[#00C2A8] border-[#00C2A8]/20">
              AI-Powered Financial Intelligence
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Turn market noise into{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#00C2A8] bg-clip-text text-transparent">
              investment intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#A1A7B3] max-w-2xl mx-auto mb-10"
          >
            AlphaForge AI combines market data, AI research, portfolio monitoring, 
            news intelligence, and asset analysis in one powerful workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="#product-preview">
              <Button size="lg" className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-base px-8">
                Start Researching
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#product-preview">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#1E293B] text-white hover:bg-[#1E293B] text-base px-8">
                <Play className="mr-2 h-4 w-4 text-[#00C2A8]" />
                Explore the Platform
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs text-[#A1A7B3]"
          >
            Built for investors, analysts, researchers, and financially curious users
          </motion.p>
        </div>
      </div>
    </section>
  );
}
