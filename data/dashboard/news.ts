import { NewsItem } from "@/types/dashboard";

// Mock data for interface preview only - not live financial data
export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve signals potential rate cuts in December amid cooling inflation",
    source: "Financial Times",
    time: "2h ago",
    category: "Central Banks",
    sentiment: "positive"
  },
  {
    id: "2",
    title: "NVIDIA AI chip demand surges 40% QoQ, exceeds analyst expectations",
    source: "Bloomberg",
    time: "3h ago",
    category: "Earnings",
    sentiment: "positive"
  },
  {
    id: "3",
    title: "Tech sector leads market rally as S&P 500 hits new record high",
    source: "Reuters",
    time: "4h ago",
    category: "Markets",
    sentiment: "positive"
  },
  {
    id: "4",
    title: "Oil prices decline 3% amid concerns over global demand and oversupply",
    source: "WSJ",
    time: "5h ago",
    category: "Commodities",
    sentiment: "negative"
  },
  {
    id: "5",
    title: "SEC announces new cryptocurrency regulation framework, industry reacts",
    source: "CoinDesk",
    time: "6h ago",
    category: "Regulation",
    sentiment: "neutral"
  },
];
