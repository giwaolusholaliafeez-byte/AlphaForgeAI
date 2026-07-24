import {
  Brain,
  LineChart,
  Wallet,
  Newspaper,
  BellRing,
} from "lucide-react";

export const showcaseTabs = [
  {
    id: "copilot",
    label: "AI Copilot",
    icon: Brain,
    summary: "Ask a question, get a structured answer grounded in live data.",
  },
  {
    id: "charting",
    label: "Asset Analysis",
    icon: LineChart,
    summary: "Price action, key levels, and AI context on any asset.",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: Wallet,
    summary: "Allocation, exposure, and performance in one view.",
  },
  {
    id: "news",
    label: "News Intelligence",
    icon: Newspaper,
    summary: "Headlines scored for sentiment and portfolio relevance.",
  },
  {
    id: "alerts",
    label: "Watchlists & Alerts",
    icon: BellRing,
    summary: "Track assets and get notified the moment levels are hit.",
  },
] as const;

export const copilotExample = {
  question: "What's driving NVDA today, and does it change my risk?",
  answer:
    "NVDA is up on renewed AI-capex commentary from hyperscalers. Momentum is intact but volatility is elevated into next week's earnings print — your portfolio's tech weighting is above your typical range, so size any new entries accordingly.",
  citations: ["Market data · Finnhub", "News · last 24h", "Portfolio · your holdings"],
};

export const chartExample = {
  symbol: "NVDA",
  name: "NVIDIA Corp",
  price: 145.67,
  change: 4.52,
  changePercent: 3.2,
  levels: [
    { label: "Resistance", value: 149.8 },
    { label: "Support", value: 138.2 },
  ],
  aiNote:
    "Trading above the 20-day average with rising volume. Watch the 149.80 level — a close above it opens room toward recent highs.",
  series: [128, 131, 129, 134, 133, 138, 136, 140, 139, 143, 141, 145.67],
};

export const portfolioExample = {
  totalValue: 84250.32,
  dailyChange: 1247.18,
  dailyChangePercent: 1.5,
  allocation: [
    { label: "Technology", percent: 42, color: "#2563EB" },
    { label: "Healthcare", percent: 18, color: "#00C2A8" },
    { label: "Financials", percent: 15, color: "#F4B000" },
    { label: "Crypto", percent: 12, color: "#8B5CF6" },
    { label: "Cash", percent: 13, color: "#475569" },
  ],
  aiNote: "Tech exposure is 12pts above your target band — consider trimming into strength or adding a defensive hedge.",
};

export const newsExample = [
  {
    title: "Fed officials signal patience on rate cuts despite cooling inflation",
    source: "Reuters",
    time: "2h ago",
    sentiment: "neutral" as const,
    impact: "Broad market · rate-sensitive sectors",
  },
  {
    title: "NVIDIA suppliers report accelerating order volumes into Q1",
    source: "Bloomberg",
    time: "4h ago",
    sentiment: "bullish" as const,
    impact: "Affects: NVDA, semiconductor supply chain",
  },
  {
    title: "Regional bank downgrades cite deposit cost pressure",
    source: "Financial Times",
    time: "6h ago",
    sentiment: "bearish" as const,
    impact: "Affects: Regional financials",
  },
];

export const alertsExample = [
  { symbol: "NVDA", condition: "Above $150.00", status: "armed" as const },
  { symbol: "BTC", condition: "Below $58,000.00", status: "armed" as const },
  { symbol: "EUR/USD", condition: "Above 1.0950", status: "triggered" as const },
];
