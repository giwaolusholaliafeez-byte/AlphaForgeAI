"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { capabilities } from "@/data/capabilities";

export default function Capabilities() {
  return (
    <section id="markets" className="py-20 bg-[#0B0F1A]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Core capabilities for serious research
          </h2>
          <p className="text-[#A1A7B3] max-w-2xl mx-auto">
            Everything you need to research, monitor, and analyze financial markets in one platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1E293B] border-[#1E293B] hover:border-[#2563EB]/50 transition-colors h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-[#2563EB]/10">
                      <Icon className="h-5 w-5 text-[#2563EB]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{capability.title}</h3>
                    <p className="text-sm text-[#A1A7B3] leading-relaxed">
                      {capability.description}
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
