import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetDetail } from "@/lib/market-data/types";
import { formatPrice, formatChange } from "@/lib/market-data/normalizers";
import SafeAssetLogo from "@/components/common/SafeAssetLogo";

interface AssetHeaderProps {
  asset: AssetDetail;
  onBack?: () => void;
}

export default function AssetHeader({ asset, onBack }: AssetHeaderProps) {
  const isPositive = asset.change && asset.change > 0;
  const typeMap = {
    stock: 'Stock',
    etf: 'ETF',
    crypto: 'Cryptocurrency',
    fx: 'Forex',
    index_proxy: 'Index proxy',
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-[#A1A7B3]">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/markets" className="hover:text-white transition-colors">
          Markets
        </Link>
        <span>/</span>
        <Link 
          href={`/dashboard/markets?type=${asset.type === 'etf' ? 'etfs' : asset.type === 'crypto' ? 'crypto' : 'stocks'}`}
          className="hover:text-white transition-colors"
        >
          {asset.type === 'etf' ? 'ETFs' : asset.type === 'crypto' ? 'Crypto' : 'Stocks'}
        </Link>
        <span>/</span>
        <span className="text-white">{asset.symbol}</span>
      </div>

      {/* Asset Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <SafeAssetLogo
            src={asset.logo}
            symbol={asset.symbol}
            name={asset.name}
            size={56}
            className="w-14 h-14"
          />
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
              <Badge className="bg-[#0B0F1A] text-[#A1A7B3]">
                {typeMap[asset.type] || asset.type}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-[#A1A7B3]">{asset.symbol}</span>
              {asset.exchange && (
                <>
                  <span className="text-[#1E293B]">•</span>
                  <span className="text-[#A1A7B3]">{asset.exchange}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/research?assetType=${asset.type}&assetId=${asset.id}`}>
            <Button variant="outline" className="border-[#1E293B] text-white hover:bg-[#1E293B]">
              Research Asset
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
