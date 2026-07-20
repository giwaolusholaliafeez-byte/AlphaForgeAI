import { WatchlistItem } from "@/types/dashboard";

// Mock data for interface preview only - not live financial data
export const watchlistItems: WatchlistItem[] = [
  { symbol: "NVDA", name: "NVIDIA", price: 145.67, change: 8.42, positive: true },
  { symbol: "AAPL", name: "Apple", price: 178.34, change: 1.10, positive: true },
  { symbol: "MSFT", name: "Microsoft", price: 412.89, change: 0.85, positive: true },
  { symbol: "AMD", name: "AMD", price: 156.23, change: 5.31, positive: true },
  { symbol: "TSLA", name: "Tesla", price: 267.45, change: 3.12, positive: true },
  { symbol: "GOOGL", name: "Alphabet", price: 175.45, change: 2.30, positive: true },
  { symbol: "AMZN", name: "Amazon", price: 189.67, change: 1.70, positive: true },
  { symbol: "META", name: "Meta", price: 356.78, change: 4.23, positive: true },
];
