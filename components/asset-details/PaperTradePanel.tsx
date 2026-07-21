"use client";

import { useState } from "react";
import { executePaperOrder, getPaperOrderPreview } from "@/lib/paper/actions";
import type { AssetDetail } from "@/lib/market-data/types";
import { Button } from "@/components/ui/button";

export default function PaperTradePanel({ asset }: { asset: AssetDetail }) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ price: number; orderValue: number; buyingPowerBefore: number; buyingPowerAfter: number; ownedQuantity: number; remainingQuantity: number } | null>(null);
  const price = typeof asset.price === 'number' && Number.isFinite(asset.price) ? asset.price : null;
  const amount = price && Number.isFinite(Number(quantity)) ? price * Number(quantity) : 0;
  const review = async () => {
    if (!price || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0) return;
    const result = await getPaperOrderPreview({ assetType: asset.type === 'etf' ? 'etf' : asset.type, assetId: asset.id, symbol: asset.symbol, side, quantity: Number(quantity) });
    if (!result.success) { setStatus(result.error ?? 'Paper order preview failed.'); setReviewing(false); return; }
    setPreview(result.preview ?? null); setStatus(null); setReviewing(true);
  };
  const execute = async () => {
    if (!price || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0) return;
    setStatus(null);
    const result = await executePaperOrder({ clientOrderId: crypto.randomUUID(), assetType: asset.type === 'etf' ? 'etf' : asset.type, assetId: asset.id, symbol: asset.symbol, side, quantity: Number(quantity) });
    setStatus(result.success ? 'Paper order filled.' : result.error ?? 'Paper order failed.');
    if (result.success) { setQuantity(''); setReviewing(false); setPreview(null); }
  };
  return <div className="mt-3 rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/5 p-4"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-[#60A5FA]">Paper trading</p><p className="mt-1 text-xs text-[#A1A7B3]">Virtual account · no real money</p></div><div className="flex gap-1"><Button type="button" size="sm" variant={side === 'buy' ? 'default' : 'outline'} onClick={() => setSide('buy')}>Buy</Button><Button type="button" size="sm" variant={side === 'sell' ? 'destructive' : 'outline'} onClick={() => setSide('sell')}>Sell</Button></div></div><div className="mt-3 flex gap-2"><input aria-label="Paper quantity" inputMode="decimal" value={quantity} onChange={(event) => { setQuantity(event.target.value); setReviewing(false); setPreview(null); }} placeholder="Quantity" className="min-w-0 flex-1 rounded-md border border-white/[0.08] bg-[#0B0F1A] px-3 text-sm text-white outline-none focus:border-[#2563EB]" /><Button type="button" variant="secondary" onClick={review} disabled={!price || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0}>Review</Button></div>{reviewing && preview && <div className="mt-3 rounded-lg bg-[#0B0F1A] p-3 text-sm"><p className="text-white">{side === 'buy' ? 'Buy' : 'Sell'} {quantity} {asset.symbol}</p><p className="mt-1 text-[#A1A7B3]">Verified execution price: ${preview.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</p><p className="mt-1 text-[#A1A7B3]">Order value: ${preview.orderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><p className="mt-1 text-[#A1A7B3]">Buying power: ${preview.buyingPowerBefore.toLocaleString(undefined, { maximumFractionDigits: 2 })} → ${preview.buyingPowerAfter.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>{side === 'sell' && <p className="mt-1 text-[#A1A7B3]">Owned: {preview.ownedQuantity} · Remaining: {preview.remainingQuantity}</p>}<Button type="button" className="mt-3 w-full" onClick={execute}>Confirm paper order</Button></div>}{status && <p className={`mt-3 text-sm ${status.includes('filled') ? 'text-[#00C2A8]' : 'text-red-400'}`}>{status}</p>}</div>;
}
