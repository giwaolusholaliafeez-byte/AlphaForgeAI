"use client";
import { useState } from 'react';
import { closePaperPosition } from '@/lib/paper/actions';
import { Button } from '@/components/ui/button';
export default function ClosePositionButton({ assetType, assetId, symbol }: { assetType: 'stock' | 'etf' | 'crypto' | 'fx'; assetId: string; symbol: string }) {
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState<string | null>(null);
  async function closePosition() { if (!window.confirm(`Close the entire ${symbol} paper position at the verified live price?`)) return; setBusy(true); setMessage(null); const result = await closePaperPosition({ assetType, assetId, symbol }); setBusy(false); setMessage(result.success ? 'Closed' : result.error ?? 'Could not close'); }
  return <div className="mt-3 flex items-center gap-2"><Button type="button" size="sm" variant="destructive" onClick={closePosition} disabled={busy}>{busy ? 'Closing…' : 'Close Position'}</Button>{message && <span className={`text-xs ${message === 'Closed' ? 'text-[#00C2A8]' : 'text-red-400'}`}>{message}</span>}</div>;
}
