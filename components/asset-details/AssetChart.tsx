"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { AssetHistoricalPoint, AssetCandle } from "@/lib/market-data/types";
import { formatPrice } from "@/lib/market-data/normalizers";

const RANGES = [
  { label: '1D', value: '1D' },
  { label: '5D', value: '5D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: '5Y', value: '5Y' },
  { label: 'MAX', value: 'MAX' },
];
const INTERVALS = ['5m', '15m', '1H', '4H', '1D', '1W'];

interface AssetChartProps {
  assetId: string;
  assetType: string;
  currentPrice?: number | null;
  isPositive?: boolean;
}

export default function AssetChart({ assetId, assetType, currentPrice, isPositive }: AssetChartProps) {
  const [range, setRange] = useState('1D');
  const [data, setData] = useState<AssetHistoricalPoint[]>([]);
  const [candles, setCandles] = useState<AssetCandle[]>([]);
  const [interval, setInterval] = useState('1D');
  const [intradayAvailable, setIntradayAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [assetId, assetType, range, interval]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/assets/${assetType}/${assetId}/history?range=${range}&interval=${interval}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const result = await response.json();
      
      if (result.data && result.data.points) {
        setData(result.data.points);
        setCandles(result.data.candles ?? []);
        setIntradayAvailable(result.source !== 'frankfurter');
      } else {
        setData([]); setCandles([]); setIntradayAvailable(false);
      }
    } catch (err) {
      setError('Historical data unavailable');
      setData([]); setCandles([]); setIntradayAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    if (range === '1D') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (range === '1W' || range === '1M') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E293B] border border-[#0B0F1A] rounded-lg p-3">
          <p className="text-xs text-[#A1A7B3]">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-lg font-bold text-white">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartColor = isPositive ? '#2563EB' : '#EF4444';

  if (loading) {
    return (
      <div className="h-[300px] bg-[#1E293B] rounded-lg flex items-center justify-center">
        <p className="text-[#A1A7B3]">Loading chart data...</p>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="h-[300px] bg-[#1E293B] rounded-lg flex flex-col items-center justify-center">
        <p className="text-[#A1A7B3] mb-2">Historical data not available</p>
        <p className="text-xs text-[#A1A7B3]">
          Data may not be available for this asset or range
        </p>
        {currentPrice && (
          <p className="text-sm text-white mt-4">
            Current price: {formatPrice(currentPrice)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <Button
            key={r.value}
            variant={range === r.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRange(r.value)}
            className={range === r.value 
              ? 'bg-[#2563EB] text-white' 
              : 'border-[#1E293B] text-[#A1A7B3] hover:text-white hover:bg-[#1E293B]'
            }
          >
            {r.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
        <span className="mr-1 text-[11px] uppercase tracking-wider text-[#64748B]">Interval</span>
        {INTERVALS.map((value) => <Button key={value} size="sm" variant={interval === value ? 'default' : 'outline'} disabled={assetType !== 'stock' && assetType !== 'etf' && assetType !== 'fx' || (assetType === 'fx' && value !== '1D' && !intradayAvailable)} onClick={() => setInterval(value)} className={interval === value ? 'bg-[#00C2A8] text-[#071018]' : 'border-[#1E293B] text-[#A1A7B3]'}>{value}</Button>)}
      </div>

      <div className="h-[300px]">
        {candles.length > 0 ? <CandleChart candles={candles} /> : <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              tick={{ fill: '#A1A7B3', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => formatPrice(value)}
              tick={{ fill: '#A1A7B3', fontSize: 10 }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>}
      </div>
    </div>
  );
}

function CandleChart({ candles }: { candles: AssetCandle[] }) {
  const width = 900; const height = 300; const padding = 24; const min = Math.min(...candles.map((item) => item.low)); const max = Math.max(...candles.map((item) => item.high)); const scaleY = (value: number) => padding + (max === min ? 0.5 : (max - value) / (max - min)) * (height - padding * 2); const step = (width - padding * 2) / Math.max(candles.length, 1); const candleWidth = Math.max(2, Math.min(12, step * 0.62));
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Candlestick chart">{candles.map((candle, index) => { const x = padding + index * step + step / 2; const positive = candle.close >= candle.open; const color = positive ? '#00C2A8' : '#EF4444'; const bodyTop = scaleY(Math.max(candle.open, candle.close)); const bodyHeight = Math.max(1, Math.abs(scaleY(candle.open) - scaleY(candle.close))); return <g key={candle.timestamp}><title>{`${new Date(candle.timestamp).toLocaleString()} · O ${candle.open} H ${candle.high} L ${candle.low} C ${candle.close}`}</title><line x1={x} x2={x} y1={scaleY(candle.high)} y2={scaleY(candle.low)} stroke={color} strokeWidth="1" /><rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} /></g>; })}</svg>;
}
