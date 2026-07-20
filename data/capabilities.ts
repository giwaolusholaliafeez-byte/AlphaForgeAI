import {
  Brain,
  BarChart3,
  Wallet,
  TrendingUp,
  Newspaper,
  ListChecks,
} from "lucide-react";

export const capabilities = [
  {
    id: "market-intelligence",
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Real-time market data, index tracking, and sector analysis to keep you informed of market movements and trends."
  },
  {
    id: "ai-research-copilot",
    icon: Brain,
    title: "AI Research Copilot",
    description: "Ask complex financial questions and receive structured analysis, comparisons, and research insights powered by AI."
  },
  {
    id: "portfolio-monitoring",
    icon: Wallet,
    title: "Portfolio Monitoring",
    description: "Track your investments, analyze performance, and monitor portfolio health with real-time metrics and visualizations."
  },
  {
    id: "asset-analysis",
    icon: BarChart3,
    title: "Asset Analysis",
    description: "Deep-dive into any asset with fundamental analysis, technical indicators, and comprehensive financial data."
  },
  {
    id: "news-intelligence",
    icon: Newspaper,
    title: "News Intelligence",
    description: "Stay ahead with curated financial news, sentiment analysis, and market-moving headlines from trusted sources."
  },
  {
    id: "smart-watchlists",
    icon: ListChecks,
    title: "Smart Watchlists",
    description: "Create intelligent watchlists that alert you to price movements, news events, and key technical levels."
  }
];
