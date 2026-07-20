"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  GraduationCap,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react";

const userTypes = [
  { icon: User, label: "Individual Investors" },
  { icon: Briefcase, label: "Financial Researchers" },
  { icon: Users, label: "Analysts" },
  { icon: GraduationCap, label: "Finance Students" },
  { icon: Building2, label: "Startup Founders" },
  { icon: TrendingUp, label: "Market Enthusiasts" },
];

export default function BuiltFor() {
  return (
    <section className="py-20 bg-[#1E293B]/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Built for serious research
          </h2>
          <p className="text-[#A1A7B3] max-w-2xl mx-auto">
            Whether you're a beginner or experienced professional, AlphaForge AI adapts to your research needs
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1E293B] border-[#1E293B] text-center hover:border-[#2563EB]/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Icon className="h-6 w-6 text-[#2563EB] mb-2" />
                      <span className="text-xs font-medium text-white">{type.label}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-[#A1A7B3] max-w-2xl mx-auto">
            <span className="text-white font-medium">Beginners</span> can understand the information while{" "}
            <span className="text-white font-medium">experienced users</span> can research efficiently.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
