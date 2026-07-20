import { MarketIndex } from "@/types/dashboard";

// Mock data for interface preview only - not live financial data
export const marketIndices: MarketIndex[] = [
  { name: "S&P 500", symbol: "SPX", value: "5,892.45", change: "+0.82%", positive: true, category: "stock" },
  { name: "NASDAQ", symbol: "IXIC", value: "18,673.21", change: "+1.24%", positive: true, category: "stock" },
  { name: "DOW JONES", symbol: "DJI", value: "42,156.78", change: "-0.31%", positive: false, category: "stock" },
  { name: "BITCOIN", symbol: "BTC", value: "$68,234", change: "+2.15%", positive: true, category: "crypto" },
  { name: "ETHEREUM", symbol: "ETH", value: "$3,456", change: "+1.83%", positive: true, category: "crypto" },
  { name: "GOLD", symbol: "XAU", value: "$2,345", change: "+0.45%", positive: true, category: "commodity" },
];

export const chartData = {
  '1D': [
    { time: "9:30", value: 100 },
    { time: "10:00", value: 102 },
    { time: "10:30", value: 101 },
    { time: "11:00", value: 105 },
    { time: "11:30", value: 103 },
    { time: "12:00", value: 107 },
    { time: "12:30", value: 106 },
    { time: "13:00", value: 109 },
    { time: "13:30", value: 108 },
    { time: "14:00", value: 112 },
    { time: "14:30", value: 110 },
    { time: "15:00", value: 113 },
    { time: "15:30", value: 115 },
    { time: "16:00", value: 114 },
  ],
  '1W': [
    { time: "Mon", value: 100 },
    { time: "Tue", value: 98 },
    { time: "Wed", value: 102 },
    { time: "Thu", value: 105 },
    { time: "Fri", value: 108 },
    { time: "Sat", value: 107 },
    { time: "Sun", value: 114 },
  ],
  '1M': [
    { time: "Week 1", value: 100 },
    { time: "Week 2", value: 95 },
    { time: "Week 3", value: 103 },
    { time: "Week 4", value: 110 },
  ],
  '3M': [
    { time: "Month 1", value: 100 },
    { time: "Month 2", value: 92 },
    { time: "Month 3", value: 108 },
  ],
  '1Y': [
    { time: "Q1", value: 100 },
    { time: "Q2", value: 85 },
    { time: "Q3", value: 95 },
    { time: "Q4", value: 114 },
  ],
};

export const currentChartValue = "$24,682.40";
export const currentChartChange = "+$384.22";
export const currentChartChangePercent = "+1.58%";
export const chartPositive = true;
