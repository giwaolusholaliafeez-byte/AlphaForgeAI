"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";

export default function AIDemo() {
  const query = "Compare NVIDIA and AMD based on growth, valuation, recent performance, and major risks.";

  return (
    <section id="research" className="py-20 bg-[#1E293B]/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge className="bg-[#00C2A8]/10 text-[#00C2A8] border-[#00C2A8]/20">
              AI Research Copilot
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Research with AI precision
          </h2>
          <p className="text-[#A1A7B3] max-w-2xl mx-auto">
            Get structured, data-driven analysis on any asset or market question
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-[#1E293B] border-[#1E293B] mb-4">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-sm text-[#A1A7B3] mb-1">You asked:</p>
                  <p className="text-sm font-medium text-white">{query}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#1E293B] border-[#00C2A8]/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00C2A8]/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-[#00C2A8]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-white">AI Research Copilot</span>
                    <Badge variant="outline" className="text-[10px] text-[#A1A7B3] border-[#1E293B]">
                      Research Summary
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider mb-1">Summary</h4>
                      <p className="text-sm text-[#A1A7B3] leading-relaxed">
                        NVIDIA maintains strong growth momentum driven by AI chip demand, while AMD shows solid growth but 
                        faces intense competition. NVIDIA's valuation is stretched but justified by superior growth metrics. 
                        AMD offers better value but carries higher risk due to competitive pressures.
                      </p>
                    </div>

                    <Separator className="bg-[#0B0F1A]" />

                    <div>
                      <h4 className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider mb-1">Growth</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A7B3]">NVIDIA: +45% YoY</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A7B3]">AMD: +28% YoY</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    </div>

                    <Separator className="bg-[#0B0F1A]" />

                    <div>
                      <h4 className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider mb-1">Valuation</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A7B3]">NVIDIA P/E: 62.4x</span>
                        <span className="text-[#F4B000]">Premium</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A7B3]">AMD P/E: 38.7x</span>
                        <span className="text-green-500">Attractive</span>
                      </div>
                    </div>

                    <Separator className="bg-[#0B0F1A]" />

                    <div>
                      <h4 className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider mb-1">Key Risks</h4>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          <span className="text-[#A1A7B3]">NVIDIA: Valuation compression risk, supply chain constraints</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          <span className="text-[#A1A7B3]">AMD: Competition risk, market share erosion</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#0B0F1A]" />

                    <div>
                      <h4 className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider mb-1">Research Note</h4>
                      <p className="text-xs text-[#A1A7B3] leading-relaxed">
                        Both companies offer compelling investment cases. NVIDIA is the AI leader with superior growth, 
                        while AMD offers better value. Consider your risk tolerance and investment horizon when choosing 
                        between them.
                      </p>
                      <p className="text-xs text-[#F4B000] mt-2">
                        ⚠️ This is research information and not financial advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
