import { AssetDetail, StockDetail, CryptoDetail, ForexDetail } from "@/lib/market-data/types";
import { formatPrice, formatMarketCap, formatVolume } from "@/lib/market-data/normalizers";

interface AssetStatisticsProps {
  asset: AssetDetail;
}

export default function AssetStatistics({ asset }: AssetStatisticsProps) {
  const isStock = asset.type === "stock" || asset.type === "etf";
  const stock = asset as StockDetail;
  const crypto = asset as CryptoDetail;
  const fx = asset as ForexDetail;

  const stats = [];

  if (asset.marketCap) {
    stats.push({ label: "Market Cap", value: formatMarketCap(asset.marketCap) });
  }

  if (asset.volume) {
    stats.push({ label: "24h Volume", value: formatVolume(asset.volume) });
  }

  if (asset.type === "fx") {
    if (fx.open) stats.push({ label: "Open", value: formatPrice(fx.open) });
    if (fx.dayHigh) stats.push({ label: "Day High", value: formatPrice(fx.dayHigh) });
    if (fx.dayLow) stats.push({ label: "Day Low", value: formatPrice(fx.dayLow) });
    if (fx.previousClose) stats.push({ label: "Previous Close", value: formatPrice(fx.previousClose) });
    if (fx.bid) stats.push({ label: "Bid", value: formatPrice(fx.bid) });
    if (fx.ask) stats.push({ label: "Ask", value: formatPrice(fx.ask) });
  } else if (isStock) {
    if (stock.previousClose) stats.push({ label: "Previous Close", value: formatPrice(stock.previousClose) });
    if (stock.open) stats.push({ label: "Open", value: formatPrice(stock.open) });
    if (stock.dayHigh) stats.push({ label: "Day High", value: formatPrice(stock.dayHigh) });
    if (stock.dayLow) stats.push({ label: "Day Low", value: formatPrice(stock.dayLow) });
    if (stock.week52High) stats.push({ label: "52-Week High", value: formatPrice(stock.week52High) });
    if (stock.week52Low) stats.push({ label: "52-Week Low", value: formatPrice(stock.week52Low) });
    if (stock.pe) stats.push({ label: "P/E Ratio", value: stock.pe.toFixed(2) });
    if (stock.eps) stats.push({ label: "EPS", value: `$${stock.eps.toFixed(2)}` });
    if (stock.beta) stats.push({ label: "Beta", value: stock.beta.toFixed(2) });
    if (stock.dividendYield) stats.push({ label: "Dividend Yield", value: `${stock.dividendYield.toFixed(2)}%` });
  } else if (asset.type === "crypto") {
    if (crypto.circulatingSupply) {
      stats.push({ label: "Circulating Supply", value: crypto.circulatingSupply.toLocaleString() });
    }
    if (crypto.totalSupply) {
      stats.push({ label: "Total Supply", value: crypto.totalSupply.toLocaleString() });
    }
    if (crypto.maxSupply) {
      stats.push({ label: "Max Supply", value: crypto.maxSupply.toLocaleString() });
    }
    if (crypto.fullyDilutedValuation) {
      stats.push({ label: "Fully Diluted Valuation", value: formatMarketCap(crypto.fullyDilutedValuation) });
    }
    if (crypto.allTimeHigh) stats.push({ label: "All-Time High", value: formatPrice(crypto.allTimeHigh) });
    if (crypto.allTimeLow) stats.push({ label: "All-Time Low", value: formatPrice(crypto.allTimeLow) });
  }

  if (stats.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-6 text-center">
        <p className="text-[#A1A7B3]">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-6">
      <h3 className="text-sm font-medium text-white mb-4">Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs text-[#A1A7B3]">{stat.label}</p>
            <p className="text-sm font-medium text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
