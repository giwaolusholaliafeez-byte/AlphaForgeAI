import type { AssetDetail, AssetType } from "@/lib/market-data/types";

export interface ResearchSource {
  name: string;
  url: string | null;
  publishedAt: string | null;
  detail: string;
}

export interface ResearchContext {
  asset: AssetDetail;
  asOf: string;
  sources: ResearchSource[];
  historyAvailable: boolean;
}

export interface ResearchReport {
  title: string;
  summary: string;
  sections: Array<{ title: string; content: string }>;
  sources: ResearchSource[];
  asOf: string;
  assetType: AssetType;
  symbol: string;
  assetId: string;
}
