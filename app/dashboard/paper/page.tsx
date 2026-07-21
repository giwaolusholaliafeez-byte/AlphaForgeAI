import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentPrices } from '@/lib/portfolio/prices';
import OpenPaperAccountButton from '@/components/paper/OpenPaperAccountButton';
import ResetPaperAccountButton from '@/components/paper/ResetPaperAccountButton';
import PaperLiveRefresh from '@/components/paper/PaperLiveRefresh';
import PaperTerminal from '@/components/paper/PaperTerminal';
import { markPaperPositions, calculatePaperEquity } from '@/lib/paper/valuation';

export default async function PaperPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/sign-in');
  const [{ data: account }, { data: rawPositions }, { data: rawOrders }, { data: rawSnapshots }] = await Promise.all([
    supabase.from('paper_accounts').select('cash_balance,starting_balance,is_open').eq('user_id', user.id).maybeSingle(),
    supabase.from('paper_positions').select('id,asset_type,asset_id,symbol,quantity,average_cost').eq('user_id', user.id).order('symbol'),
    supabase.from('paper_orders').select('id,symbol,side,quantity,execution_price,gross_amount,realized_pnl,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
    supabase.from('paper_equity_snapshots').select('equity,recorded_at').eq('user_id', user.id).order('recorded_at', { ascending: true }).limit(100),
  ]);
  if (!account?.is_open) return <div className="mx-auto max-w-2xl space-y-5 py-12"><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Paper · Virtual · Simulated</p><h1 className="text-3xl font-semibold text-white">Open your simulated trading account</h1><p className="text-sm leading-6 text-[#A1A7B3]">No paper account is funded yet. Opening creates one canonical $100,000 virtual account.</p><section className="rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/10 p-5"><div className="grid gap-4 sm:grid-cols-4"><Metric label="Starting balance" value={100000} /><Metric label="Cash" value={0} /><Metric label="Equity" value={0} /><Metric label="Positions" value={0} /></div><div className="mt-5"><OpenPaperAccountButton /></div></section></div>;
  const positions = (rawPositions ?? []).map((item) => ({ ...item, quantity: Number(item.quantity), average: Number(item.average_cost) }));
  const holdings = positions.map((item) => ({ id: item.id, portfolioId: 'paper', userId: user.id, assetType: item.asset_type, assetId: item.asset_id, symbol: item.symbol, assetName: item.symbol, quantity: item.quantity, averageCost: item.average, acquiredAt: null, notes: null, createdAt: '', updatedAt: '' }));
  const prices = await getCurrentPrices(holdings); const marked = markPaperPositions(positions.map((item) => ({ id: item.id, assetType: item.asset_type, assetId: item.asset_id, symbol: item.symbol, quantity: item.quantity, averageCost: item.average })), prices); const markedPositions = marked.map((item) => ({ ...item, asset_type: item.assetType, asset_id: item.assetId, average: item.averageCost, price: item.currentPrice, value: item.marketValue, pnl: item.unrealizedPnl, pnlPercent: item.unrealizedPnlPercent }));
  const buyingPower = Number(account.cash_balance); const invested = markedPositions.reduce((sum, item) => sum + (item.value ?? 0), 0); const unrealized = markedPositions.reduce((sum, item) => sum + (item.pnl ?? 0), 0); const equity = calculatePaperEquity(buyingPower, marked); const realized = (rawOrders ?? []).reduce((sum, item) => sum + Number(item.realized_pnl ?? 0), 0); const balance = buyingPower + markedPositions.reduce((sum, item) => sum + item.quantity * item.average, 0); const returnPercent = Number(account.starting_balance) ? ((equity - Number(account.starting_balance)) / Number(account.starting_balance)) * 100 : 0;
  return <div className="space-y-5"><PaperLiveRefresh /><header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Paper · Simulated</p><h1 className="mt-1 text-2xl font-semibold text-white">Trading Terminal</h1><p className="mt-1 text-sm text-[#A1A7B3]">Verified paper quotes, atomic order execution, and live mark-to-market values.</p></div><ResetPaperAccountButton /></header><PaperTerminal account={{ balance, equity, buyingPower, invested, unrealized, realized, returnPercent }} positions={markedPositions} orders={(rawOrders ?? []).map((item) => ({ ...item, quantity: Number(item.quantity), execution_price: Number(item.execution_price), gross_amount: Number(item.gross_amount) }))} snapshots={(rawSnapshots ?? []).map((item) => ({ date: new Date(item.recorded_at).toLocaleString(), value: Number(item.equity) }))} /></div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"><p className="text-[11px] text-[#A1A7B3]">{label}</p><p className="mt-2 text-lg font-semibold tabular-nums text-white">{label === 'Positions' ? value : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p></div>; }
