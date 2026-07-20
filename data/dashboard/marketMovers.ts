// MOCK DATA - Simulated for interface preview only
// Not live financial data, market prices, or investment advice

import { MarketMover } from "@/types/dashboard";

// Top gainers with positive price movements
export const gainers: MarketMover[] = [
  { 
    symbol: "NVDA", 
    name: "NVIDIA", 
    price: "$145.67", 
    change: "+8.42%", 
    positive: true,
    volume: "45.2M"
  },
  { 
    symbol: "AMD", 
    name: "AMD", 
    price: "$156.23", 
    change: "+5.31%", 
    positive: true,
    volume: "32.8M"
  },
  { 
    symbol: "META", 
    name: "Meta", 
    price: "$356.78", 
    change: "+4.23%", 
    positive: true,
    volume: "28.1M"
  },
  { 
    symbol: "AMZN", 
    name: "Amazon", 
    price: "$189.67", 
    change: "+3.89%", 
    positive: true,
    volume: "34.5M"
  },
  { 
    symbol: "TSLA", 
    name: "Tesla", 
    price: "$267.45", 
    change: "+3.12%", 
    positive: true,
    volume: "41.3M"
  },
];

// Top losers with negative price movements
export const losers: MarketMover[] = [
  { 
    symbol: "INTC", 
    name: "Intel", 
    price: "$34.56", 
    change: "-4.67%", 
    positive: false,
    volume: "22.7M"
  },
  { 
    symbol: "BA", 
    name: "Boeing", 
    price: "$178.90", 
    change: "-3.45%", 
    positive: false,
    volume: "8.9M"
  },
  { 
    symbol: "WBA", 
    name: "Walgreens", 
    price: "$22.34", 
    change: "-2.89%", 
    positive: false,
    volume: "15.4M"
  },
  { 
    symbol: "NKE", 
    name: "Nike", 
    price: "$98.76", 
    change: "-2.34%", 
    positive: false,
    volume: "11.2M"
  },
  { 
    symbol: "DOW", 
    name: "Dow Inc", 
    price: "$56.78", 
    change: "-1.98%", 
    positive: false,
    volume: "6.8M"
  },
];

// Most active assets by trading volume
export const mostActive: MarketMover[] = [
  { 
    symbol: "NVDA", 
    name: "NVIDIA", 
    price: "$145.67", 
    change: "+8.42%", 
    positive: true,
    volume: "45.2M"
  },
  { 
    symbol: "TSLA", 
    name: "Tesla", 
    price: "$267.45", 
    change: "+3.12%", 
    positive: true,
    volume: "41.3M"
  },
  { 
    symbol: "AMZN", 
    name: "Amazon", 
    price: "$189.67", 
    change: "+3.89%", 
    positive: true,
    volume: "34.5M"
  },
  { 
    symbol: "AAPL", 
    name: "Apple", 
    price: "$178.34", 
    change: "+1.10%", 
    positive: true,
    volume: "33.8M"
  },
  { 
    symbol: "AMD", 
    name: "AMD", 
    price: "$156.23", 
    change: "+5.31%", 
    positive: true,
    volume: "32.8M"
  },
];
