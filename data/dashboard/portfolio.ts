import { Holding } from "@/types/dashboard";

// Mock data for interface preview only - not live financial data
export const portfolioSummary = {
  totalValue: "$24,682.40",
  todayChange: "+$384.22",
  todayChangePercent: "+1.58%",
  totalReturn: "+18.4%",
  totalReturnValue: "+$3,842.90",
  positive: true,
};

export const holdings: Holding[] = [
  { symbol: "NVDA", name: "NVIDIA", shares: 45, price: 145.67, value: 6555.15, change: 8.42 },
  { symbol: "AAPL", name: "Apple", shares: 30, price: 178.34, value: 5350.20, change: 1.10 },
  { symbol: "MSFT", name: "Microsoft", shares: 12, price: 412.89, value: 4954.68, change: 0.85 },
  { symbol: "AMD", name: "AMD", shares: 40, price: 156.23, value: 6249.20, change: 5.31 },
  { symbol: "TSLA", name: "Tesla", shares: 8, price: 267.45, value: 2139.60, change: 3.12 },
];

export const allocationData = [
  { name: "Technology", value: 45, color: "#2563EB" },
  { name: "Consumer", value: 25, color: "#00C2A8" },
  { name: "Finance", value: 15, color: "#F4B000" },
  { name: "Healthcare", value: 10, color: "#A1A7B3" },
  { name: "Other", value: 5, color: "#1E293B" },
];
