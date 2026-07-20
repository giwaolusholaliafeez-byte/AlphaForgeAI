import { AssetDetail } from "@/lib/market-data/types";
import { formatPrice, formatChange } from "@/lib/market-data/normalizers";
import { ArrowUp, ArrowDown } from "lucide-react";

interface AssetPriceProps {
  asset: AssetDetail;
}

export default function AssetPrice({ asset }: AssetPriceProps) {
  const isPositive = asset.change && asset.change > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline space-x-4">
        <span className="text-4xl font-bold text-white">
          {formatPrice(asset.price)}
        </span>
        <span className="text-sm text-[#A1A7B3]">{asset.currency}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          {formatChange(asset.changePercent)}
        </span>
        {asset.change !== null && (
          <span className={`${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{asset.change?.toFixed(2)}
          </span>
        )}
      </div>
      {asset.lastUpdated && (
        <p className="text-xs text-[#A1A7B3]">
          Last updated: {new Date(asset.lastUpdated).toLocaleString()}
          <span className="ml-2">(Data may be delayed)</span>
        </p>
      )}
      <p className="text-xs text-[#A1A7B3]">
        Data source: {asset.source}
      </p>
    </div>
  );
}
