import { AssetDetail, StockDetail, CryptoDetail } from "@/lib/market-data/types";

interface AssetOverviewProps {
  asset: AssetDetail;
}

export default function AssetOverview({ asset }: AssetOverviewProps) {
  const isStock = asset.type === 'stock' || asset.type === 'etf';
  const stock = asset as StockDetail;
  const crypto = asset as CryptoDetail;

  const details = [];

  if (isStock) {
    if (stock.industry) details.push({ label: 'Industry', value: stock.industry });
    if (stock.country) details.push({ label: 'Country', value: stock.country });
    if (stock.exchange) details.push({ label: 'Exchange', value: stock.exchange });
    if (stock.currency) details.push({ label: 'Currency', value: stock.currency });
    if (stock.ipoDate) details.push({ label: 'IPO Date', value: stock.ipoDate });
    if (stock.website) {
      details.push({ 
        label: 'Website', 
        value: (
          <a 
            href={stock.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:text-[#2563EB]/80"
          >
            {stock.website}
          </a>
        )
      });
    }
  } else if (asset.type === 'crypto') {
    if (crypto.categories && crypto.categories.length > 0) {
      details.push({ 
        label: 'Categories', 
        value: crypto.categories.join(', ') 
      });
    }
    if (crypto.homepage) {
      details.push({ 
        label: 'Website', 
        value: (
          <a 
            href={crypto.homepage} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:text-[#2563EB]/80"
          >
            {crypto.homepage}
          </a>
        )
      });
    }
  }

  if (details.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-6 text-center">
        <p className="text-[#A1A7B3]">No additional information available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-6">
      <h3 className="text-sm font-medium text-white mb-4">Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs text-[#A1A7B3]">{detail.label}</p>
            <p className="text-sm text-white">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
