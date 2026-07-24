import { LineChart, Bitcoin, Landmark, Globe2 } from "lucide-react";

export const marketCoverage = [
  {
    id: "stocks-etfs",
    icon: LineChart,
    title: "Stocks & ETFs",
    description: "Live quotes, fundamentals, and history for equities and exchange-traded funds.",
  },
  {
    id: "crypto",
    icon: Bitcoin,
    title: "Cryptocurrency",
    description: "Spot prices and OHLC candles across major coins and tokens.",
  },
  {
    id: "forex",
    icon: Globe2,
    title: "Foreign Exchange",
    description: "Major and minor currency pairs with historical rate series.",
  },
  {
    id: "indices",
    icon: Landmark,
    title: "Indices",
    description: "Benchmark index tracking through their most liquid ETF proxies.",
  },
];
