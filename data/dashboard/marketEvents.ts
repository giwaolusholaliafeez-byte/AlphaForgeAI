import { MarketEvent } from "@/types/dashboard";

// Mock data for interface preview only - not live financial data
export const marketEvents: MarketEvent[] = [
  {
    id: "1",
    date: "Dec 15",
    time: "14:00 EST",
    event: "Federal Reserve Policy Announcement",
    importance: "high",
    relatedAsset: "S&P 500"
  },
  {
    id: "2",
    date: "Dec 18",
    time: "08:30 EST",
    event: "US CPI Inflation Report",
    importance: "high",
    relatedAsset: "Treasury"
  },
  {
    id: "3",
    date: "Dec 20",
    time: "16:00 EST",
    event: "NVIDIA Q4 Earnings Call",
    importance: "high",
    relatedAsset: "NVDA"
  },
  {
    id: "4",
    date: "Dec 22",
    time: "16:00 EST",
    event: "Apple Q4 Earnings Call",
    importance: "medium",
    relatedAsset: "AAPL"
  },
  {
    id: "5",
    date: "Dec 28",
    time: "08:30 EST",
    event: "US Jobs Report - December",
    importance: "medium",
    relatedAsset: "Dollar"
  },
];
