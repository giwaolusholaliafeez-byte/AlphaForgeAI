import { notFound } from "next/navigation";
import { getAssetDetail } from "@/lib/market-data/asset-details";
import { validateAssetType, validateStockSymbol, validateCryptoId } from "@/lib/market-data/asset-validation";
import AssetHeader from "@/components/asset-details/AssetHeader";
import AssetPrice from "@/components/asset-details/AssetPrice";
import AssetChart from "@/components/asset-details/AssetChart";
import AssetStatistics from "@/components/asset-details/AssetStatistics";
import AssetOverview from "@/components/asset-details/AssetOverview";
import AssetActions from "@/components/asset-details/AssetActions";
import AssetDataStatus from "@/components/asset-details/AssetDataStatus";
import AssetUnavailable from "@/components/asset-details/AssetUnavailable";

type AssetPageParams = {
  assetType: string;
  assetId: string;
};

type AssetPageProps = {
  params: Promise<AssetPageParams>;
};

export default async function AssetPage({ params }: AssetPageProps) {
  const { assetType, assetId } = await params;

  // Validate asset type
  if (!validateAssetType(assetType)) {
    notFound();
  }

  // Validate asset ID based on type
  if (assetType === "stock" || assetType === "etf") {
    if (!validateStockSymbol(assetId)) {
      notFound();
    }
  } else if (assetType === "crypto") {
    if (!validateCryptoId(assetId)) {
      notFound();
    }
  } else {
    notFound();
  }

  // Fetch asset detail
  const result = await getAssetDetail(assetType, assetId);

  // Handle configuration error
  if (!result.isConfigured) {
    return (
      <div className="space-y-6">
        <AssetUnavailable
          message={result.error || "Provider not configured"}
          isConfig={true}
        />
      </div>
    );
  }

  // Handle not found or error
  if (!result.data || result.error) {
    notFound();
  }

  const asset = result.data;
  
  // Explicit null-safe boolean calculation
  const isPositive = typeof asset.change === "number"
    ? asset.change > 0
    : undefined;

  return (
    <div className="space-y-6">
      {/* Status */}
      <AssetDataStatus
        source={result.source}
        isDelayed={result.isDelayed}
        lastUpdated={result.lastUpdated}
        isConfigured={result.isConfigured}
      />

      {/* Header */}
      <AssetHeader asset={asset} />

      {/* Price & Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <AssetPrice asset={asset} />
        <AssetActions asset={asset} />
      </div>

      {/* Chart */}
      <AssetChart
        assetId={assetId}
        assetType={assetType}
        currentPrice={asset.price}
        isPositive={isPositive}
      />

      {/* Statistics */}
      <AssetStatistics asset={asset} />

      {/* Overview */}
      <AssetOverview asset={asset} />

      {/* Data Disclaimer */}
      <div className="p-4 rounded-lg bg-[#0B0F1A] border border-[#1E293B]">
        <p className="text-xs text-[#A1A7B3] text-center">
          Data provided by {result.source}. Market data may be delayed.
          This information is for research purposes only and does not constitute financial advice.
        </p>
      </div>
    </div>
  );
}
