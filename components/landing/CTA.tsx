"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export default function CTA() {
  return (
    <section id="final-cta" className="py-20 bg-[#0B0F1A]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Create your financial research workspace
          </h2>
          <p className="text-[#A1A7B3] text-lg mb-10">
            Join thousands of investors and analysts who use AlphaForge AI to make informed decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#product-preview">
              <Button size="lg" className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-base px-8">
                Start Researching
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#product-preview">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#1E293B] text-white hover:bg-[#1E293B] text-base px-8">
                <Play className="mr-2 h-4 w-4 text-[#00C2A8]" />
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
