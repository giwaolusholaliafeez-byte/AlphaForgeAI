// DEMO ACCOUNT DATA - Simulated for testing purposes only
// Not real money, live market data, or financial advice

import { Holding, WatchlistItem, MarketEvent, AIBrief } from "@/types/dashboard";

export const DEMO_PORTFOLIO_VALUE = 2500000;

export const demoHoldings: Holding[] = [
  { 
    symbol: "NVDA", 
    name: "NVIDIA", 
    shares: 4117.89, 
    price: 145.67, 
    value: 600000, 
    change: 8.42,
    allocation: 24.0
  },
  { 
    symbol: "AAPL", 
    name: "Apple", 
    shares: 2242.85, 
    price: 178.34, 
    value: 400000, 
    change: 1.10,
    allocation: 16.0
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft", 
    shares: 968.55, 
    price: 412.89, 
    value: 400000, 
    change: 0.85,
    allocation: 16.0
  },
  { 
    symbol: "AMZN", 
    name: "Amazon", 
    shares: 1581.68, 
    price: 189.67, 
    value: 300000, 
    change: 1.70,
    allocation: 12.0
  },
  { 
    symbol: "VOO", 
    name: "Vanguard S&P 500", 
    shares: 767.56, 
    price: 455.89, 
    value: 350000, 
    change: 0.62,
    allocation: 14.0
  },
  { 
    symbol: "BTC", 
    name: "Bitcoin", 
    shares: 3.66, 
    price: 68312.00, 
    value: 250000, 
    change: 2.15,
    allocation: 10.0
  },
  { 
    symbol: "CASH", 
    name: "Cash Reserve", 
    shares: 200000, 
    price: 1.00, 
    value: 200000, 
    change: 0.00,
    allocation: 8.0
  },
];

export const demoPortfolioSummary = {
  totalValue: "$2,500,000.00",
  todayChange: "+$31,420.00",
  todayChangePercent: "+1.27%",
  totalReturn: "+$418,600.00",
  totalReturnPercent: "+20.11%",
  investedValue: "$2,300,000.00",
  cashBalance: "$200,000.00",
  positive: true,
};

export const demoAllocationData = [
  { name: "NVIDIA", value: 24, color: "#2563EB" },
  { name: "Apple", value: 16, color: "#00C2A8" },
  { name: "Microsoft", value: 16, color: "#F4B000" },
  { name: "VOO", value: 14, color: "#3B82F6" },
  { name: "Amazon", value: 12, color: "#14B8A6" },
  { name: "Bitcoin", value: 10, color: "#F59E0B" },
  { name: "Cash", value: 8, color: "#A1A7B3" },
];

export const demoWatchlist: WatchlistItem[] = [
  { symbol: "NVDA", name: "NVIDIA", price: 145.67, change: 8.42, positive: true },
  { symbol: "AAPL", name: "Apple", price: 178.34, change: 1.10, positive: true },
  { symbol: "MSFT", name: "Microsoft", price: 412.89, change: 0.85, positive: true },
  { symbol: "AMZN", name: "Amazon", price: 189.67, change: 1.70, positive: true },
  { symbol: "META", name: "Meta", price: 356.78, change: 4.23, positive: true },
  { symbol: "GOOGL", name: "Alphabet", price: 175.45, change: 2.30, positive: true },
  { symbol: "TSLA", name: "Tesla", price: 267.45, change: 3.12, positive: true },
  { symbol: "AMD", name: "AMD", price: 156.23, change: 5.31, positive: true },
  { symbol: "NFLX", name: "Netflix", price: 489.67, change: 1.45, positive: true },
  { symbol: "JPM", name: "JPMorgan", price: 167.89, change: -0.32, positive: false },
  { symbol: "V", name: "Visa", price: 278.34, change: 0.56, positive: true },
  { symbol: "VOO", name: "Vanguard S&P 500", price: 455.89, change: 0.62, positive: true },
  { symbol: "BTC", name: "Bitcoin", price: 68312.00, change: 2.15, positive: true },
  { symbol: "ETH", name: "Ethereum", price: 3456.00, change: 1.83, positive: true },
];

export const demoAlerts: MarketEvent[] = [
  {
    id: "1",
    date: "Dec 15",
    time: "14:00 EST",
    event: "NVDA Price Movement Alert - 5% gain triggered",
    importance: "high",
    relatedAsset: "NVDA"
  },
  {
    id: "2",
    date: "Dec 18",
    time: "08:30 EST",
    event: "AAPL Earnings Reminder - Q4 report due",
    importance: "high",
    relatedAsset: "AAPL"
  },
  {
    id: "3",
    date: "Dec 20",
    time: "16:00 EST",
    event: "BTC Volatility Alert - 3% movement detected",
    importance: "medium",
    relatedAsset: "BTC"
  },
  {
    id: "4",
    date: "Dec 22",
    time: "08:30 EST",
    event: "Federal Reserve Policy Announcement",
    importance: "high",
    relatedAsset: "S&P 500"
  },
  {
    id: "5",
    date: "Dec 25",
    time: "09:30 EST",
    event: "VOO Market Movement - 0.5% deviation",
    importance: "low",
    relatedAsset: "VOO"
  },
  {
    id: "6",
    date: "Dec 28",
    time: "08:30 EST",
    event: "AMD Research Update - New analyst coverage",
    importance: "medium",
    relatedAsset: "AMD"
  },
];

export const demoChartData = {
  '1D': [
    { time: "9:30", value: 2475000 },
    { time: "10:00", value: 2482000 },
    { time: "10:30", value: 2485000 },
    { time: "11:00", value: 2490000 },
    { time: "11:30", value: 2487000 },
    { time: "12:00", value: 2492000 },
    { time: "12:30", value: 2495000 },
    { time: "13:00", value: 2498000 },
    { time: "13:30", value: 2493000 },
    { time: "14:00", value: 2499000 },
    { time: "14:30", value: 2496000 },
    { time: "15:00", value: 2500000 },
    { time: "15:30", value: 2502000 },
    { time: "16:00", value: 2500000 },
  ],
  '1W': [
    { time: "Mon", value: 2420000 },
    { time: "Tue", value: 2440000 },
    { time: "Wed", value: 2460000 },
    { time: "Thu", value: 2475000 },
    { time: "Fri", value: 2490000 },
    { time: "Sat", value: 2495000 },
    { time: "Sun", value: 2500000 },
  ],
  '1M': [
    { time: "Week 1", value: 2300000 },
    { time: "Week 2", value: 2350000 },
    { time: "Week 3", value: 2420000 },
    { time: "Week 4", value: 2500000 },
  ],
  '3M': [
    { time: "Month 1", value: 2200000 },
    { time: "Month 2", value: 2350000 },
    { time: "Month 3", value: 2500000 },
  ],
  '1Y': [
    { time: "Q1", value: 2100000 },
    { time: "Q2", value: 2150000 },
    { time: "Q3", value: 2300000 },
    { time: "Q4", value: 2500000 },
  ],
};

export const demoChartMetrics = {
  currentValue: "$2,500,000.00",
  change: "+$31,420.00",
  changePercent: "+1.27%",
  positive: true,
};

export const demoBrief: AIBrief = {
  id: "demo-1",
  timestamp: "Generated: Dec 14, 2024, 10:00 AM EST (Simulated)",
  insights: [
    "Your portfolio shows strong concentration in technology (NVIDIA, Apple, Microsoft), representing 56% of total allocation",
    "The VOO ETF position provides broad market diversification and stability",
    "Bitcoin exposure adds growth potential but increases volatility risk",
  ],
  risk: "High technology-sector concentration exposes portfolio to sector-specific downturns. Bitcoin volatility may impact overall performance significantly.",
  opportunity: "Consider rebalancing to reduce tech concentration. The $200,000 cash position provides flexibility for market opportunities.",
};
