"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { MarketAsset } from "@/lib/market-data/types";
import { ForexAsset } from "@/lib/market-data/forex";
import { formatPrice, formatChange, formatMarketCap, formatVolume } from "@/lib/market-data/normalizers";


type IndexAsset = MarketAsset;
interface AssetTableProps {
  assets: any[];
  type: 'stock' | 'etf' | 'crypto';
  onAssetClick?: (asset: any) => void;
}

type SortField = 'symbol' | 'name' | 'price' | 'changePercent' | 'marketCap' | 'volume' | 'pair';

export default function AssetTable({ assets, type, onAssetClick }: AssetTableProps) {
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortValue = (asset: any, field: SortField): string | number => {
    switch (field) {
      case 'symbol': return asset.symbol || asset.pair || '';
      case 'name': return asset.name || '';
      case 'pair': return asset.pair || '';
      case 'price': return asset.price || 0;
      case 'changePercent': return asset.changePercent || 0;
      case 'marketCap': return asset.marketCap || 0;
      case 'volume': return asset.volume || 0;
      default: return 0;
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    const aValue = getSortValue(a, sortField);
    const bValue = getSortValue(b, sortField);
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction;
    }
    return ((aValue as number) - (bValue as number)) * direction;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-3 w-3" /> : 
      <ChevronDown className="h-3 w-3" />;
  };

  const isCrypto = type === 'crypto';
  const isFx = assets.length > 0 && 'pair' in assets[0];
  const isIndex = assets.length > 0 && 'symbol' in assets[0] && assets[0].symbol?.startsWith('^');

  const getAssetRoute = (asset: any) => {
    if (isCrypto) {
      return `/dashboard/markets/crypto/${asset.id}`;
    }
    if (isFx || isIndex) {
      return '#';
    }
    return `/dashboard/markets/${type}/${asset.symbol}`;
  };

  const handleRowClick = (asset: any) => {
    if (onAssetClick && (isFx || isIndex || isCrypto)) {
      onAssetClick(asset);
    }
  };

  const getDisplaySymbol = (asset: any) => {
    if (isFx) return asset.pair || asset.symbol;
    return asset.symbol;
  };

  const getDisplayName = (asset: any) => {
    if (isFx) return `${asset.base}/${asset.quote}`;
    return asset.name;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#0B0F1A] text-[#A1A7B3]">
            {isCrypto && (
              <th className="text-left py-3 px-4 font-medium">Rank</th>
            )}
            <th 
              className="text-left py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort(isFx ? 'pair' : 'symbol')}
            >
              <div className="flex items-center space-x-1">
                <span>{isFx ? 'Pair' : isIndex ? 'Index' : 'Symbol'}</span>
                <SortIcon field={isFx ? 'pair' : 'symbol'} />
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Name</span>
                <SortIcon field="name" />
              </div>
            </th>
            <th 
              className="text-right py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>{isFx ? 'Rate' : isIndex ? 'Level' : 'Price'}</span>
                <SortIcon field="price" />
              </div>
            </th>
            <th 
              className="text-right py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('changePercent')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Daily Change</span>
                <SortIcon field="changePercent" />
              </div>
            </th>
            {isCrypto ? (
              <>
                <th 
                  className="text-right py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Market Cap</span>
                    <SortIcon field="marketCap" />
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Volume</span>
                    <SortIcon field="volume" />
                  </div>
                </th>
              </>
            ) : (
              <th className="text-right py-3 px-4 font-medium">Source</th>
            )}
            <th className="text-right py-3 px-4 font-medium">Provider</th>
          </tr>
        </thead>
        <tbody>
          {sortedAssets.map((asset) => {
            const isPositive = asset.change && asset.change > 0;
            const route = getAssetRoute(asset);
            const isClickable = route !== '#';
            
            return (
              <tr 
                key={asset.id || asset.symbol}
                onClick={() => isClickable ? null : handleRowClick(asset)}
                className={`border-b border-[#0B0F1A] hover:bg-[#1E293B]/50 transition-colors group ${!isClickable ? 'cursor-pointer' : ''}`}
              >
                {isCrypto && (
                  <td className="py-3 px-4 text-[#A1A7B3]">
                    {asset.rank || '—'}
                  </td>
                )}
                <td className="py-3 px-4 font-medium">
                  {isClickable ? (
                    <Link href={route} className="text-white hover:text-[#2563EB] transition-colors">
                      {getDisplaySymbol(asset)}
                    </Link>
                  ) : (
                    <span className="text-white">{getDisplaySymbol(asset)}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {isClickable ? (
                    <Link href={route} className="text-[#A1A7B3] hover:text-white transition-colors">
                      {getDisplayName(asset)}
                    </Link>
                  ) : (
                    <span className="text-[#A1A7B3]">{getDisplayName(asset)}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right text-white">
                  {isClickable ? (
                    <Link href={route} className="hover:text-[#2563EB] transition-colors">
                      {formatPrice(asset.price)}
                    </Link>
                  ) : (
                    <span>{formatPrice(asset.price)}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`flex items-center justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {formatChange(asset.changePercent)}
                  </span>
                </td>
                {isCrypto ? (
                  <>
                    <td className="py-3 px-4 text-right text-[#A1A7B3]">
                      {formatMarketCap(asset.marketCap)}
                    </td>
                    <td className="py-3 px-4 text-right text-[#A1A7B3]">
                      {formatVolume(asset.volume)}
                    </td>
                  </>
                ) : (
                  <td className="py-3 px-4 text-right text-[#A1A7B3] text-xs">
                    {asset.exchange || '—'}
                  </td>
                )}
                <td className="py-3 px-4 text-right text-[#A1A7B3] text-xs">
                  {asset.source}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {assets.length === 0 && (
        <div className="py-8 text-center text-[#A1A7B3]">
          No assets available
        </div>
      )}
    </div>
  );
}
