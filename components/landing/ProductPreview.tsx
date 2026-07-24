"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Newspaper,
  Bookmark,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { marketOverview, chartData } from "@/data/marketData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProductPreview() {
  const { indices, portfolio, aiSummary, news, watchlist } = marketOverview;

  return (
    <section id="platform" className="py-20 sm:py-28 bg-[#0E1420]">
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
            Dashboard preview
          </div>
          <h2 className="text-section-title mt-4 text-white">
            Everything visible, nothing buried
          </h2>
          <p className="mt-4 text-[#A1A7B3]">
            Indices, portfolio health, watchlist moves, and AI context in one screen —
            the same layout you get inside the real dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-[#1E293B] border-[#1E293B]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-white">Market Overview</CardTitle>
                  <Badge variant="outline" className="text-xs text-[#00C2A8] border-[#00C2A8]/30">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {indices.map((index) => (
                    <div key={index.name} className="p-3 rounded-lg bg-[#0B0F1A]/50">
                      <p className="text-xs text-[#A1A7B3]">{index.name}</p>
                      <p className="text-sm font-semibold text-white font-mono">{index.value}</p>
                      <span className={`text-xs ${index.positive ? "text-[#00C2A8]" : "text-red-400"} flex items-center`}>
                        {index.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {index.change}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" tick={{ fill: "#A1A7B3", fontSize: 10 }} />
                      <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fill: "#A1A7B3", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #1E293B" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-[#1E293B] border-[#1E293B]">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-[#00C2A8]" />
                    <CardTitle className="text-sm font-medium text-white">AI Market Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-[#A1A7B3] leading-relaxed">
                    {aiSummary}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#1E293B] border-[#1E293B]">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Newspaper className="h-4 w-4 text-[#2563EB]" />
                    <CardTitle className="text-sm font-medium text-white">Recent News</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {news.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="text-white font-medium line-clamp-1">{item.title}</p>
                      <p className="text-[#A1A7B3] text-[10px]">{item.source} • {item.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="bg-[#1E293B] border-[#1E293B]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white">Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-[#F4B000] font-mono">{portfolio.totalValue}</p>
                    <span className={`text-sm ${portfolio.positive ? "text-[#00C2A8]" : "text-red-400"} flex items-center`}>
                      {portfolio.positive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {portfolio.dailyChange} ({portfolio.dailyChangePercent})
                    </span>
                  </div>
                  <Activity className="h-8 w-8 text-[#A1A7B3]" />
                </div>
                <Separator className="my-3 bg-[#0B0F1A]" />
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A7B3]">Positions</span>
                    <span className="font-medium text-white font-mono">24</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A7B3]">Today&apos;s P&amp;L</span>
                    <span className="text-[#00C2A8] font-mono">+$12,847.34</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-[#1E293B]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-white">Watchlist</CardTitle>
                  <Bookmark className="h-4 w-4 text-[#A1A7B3]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {watchlist.slice(0, 4).map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-white">{item.symbol}</span>
                      <span className="text-[#A1A7B3] ml-2">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-white">${item.price.toFixed(2)}</span>
                      <span className={item.change >= 0 ? "text-[#00C2A8]" : "text-red-400"}>
                        {item.change >= 0 ? "+" : ""}{item.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
        <p className="mt-6 text-center text-[11px] text-[#5B6472]">Illustrative dashboard preview</p>
      </div>
    </section>
  );
}
