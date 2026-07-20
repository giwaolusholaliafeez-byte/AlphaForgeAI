import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getCurrentPrices } from '@/lib/portfolio/prices';
import { calculateAllocation } from '@/lib/portfolio/valuation';
import type { PortfolioHolding } from '@/types/portfolio';
import ResetPaperAccountButton from '@/components/paper/ResetPaperAccountButton';
import PaperPerformanceChart from '@/components/paper/PaperPerformanceChart';

export default async function PaperPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const [{ data: account }, { data: positions }, { data: orders }, { data: transactions }] = await Promise.all([
    supabase.from('paper_accounts').select('cash_balance,starting_balance').eq('user_id', user.id).maybeSingle(),
    supabase.from('paper_positions').select('id,asset_type,asset_id,symbol,quantity,average_cost,realized_pnl').eq('user_id', user.id).order('symbol'),
    supabase.from('paper_orders').select('id,symbol,side,quantity,execution_price,gross_amount,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
    supabase.from('paper_transactions').select('cash_balance_after,created_at').eq('user_id', user.id).order('created_at', { ascending: true }).limit(60),
  ]);

  const paperHoldings: PortfolioHolding[] = (positions ?? []).map((position) => ({
    id: position.id,
    portfolioId: 'paper',
    userId: user.id,
    assetType: position.asset_type,
    assetId: position.asset_id,
    symbol: position.symbol,
    assetName: position.symbol,
    quantity: Number(position.quantity),
    averageCost: Number(position.average_cost),
    acquiredAt: null,
    notes: null,
    createdAt: '',
    updatedAt: '',
  }));
  const priceMap = await getCurrentPrices(paperHoldings);
  const valuedPositions = paperHoldings.map((holding) => {
    const currentPrice = priceMap.get(holding.id) ?? null;
    const marketValue = currentPrice ? holding.quantity * currentPrice : null;
    const costBasis = holding.quantity * holding.averageCost;
    return { holding, currentPrice, marketValue, costBasis, unrealizedGain: marketValue === null ? null : marketValue - costBasis, returnPercentage: marketValue === null || costBasis === 0 ? null : ((marketValue - costBasis) / costBasis) * 100, allocationPercentage: 0 };
  });
  const cash = Number(account?.cash_balance ?? 0);
  const holdingsValue = valuedPositions.reduce((sum, position) => sum + (position.marketValue ?? 0), 0);
  const totalValue = cash + holdingsValue;
  const realizedPnl = (positions ?? []).reduce((sum, position) => sum + Number(position.realized_pnl ?? 0), 0);
  const unrealizedPnl = valuedPositions.reduce((sum, position) => sum + (position.unrealizedGain ?? 0), 0);
  const allocation = calculateAllocation(valuedPositions);
  const chartData = (transactions ?? []).map((transaction) => ({ date: new Date(transaction.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), value: Number(transaction.cash_balance_after) })).slice(-30);

  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Paper · Virtual · Simulated</p><h1 className="mt-1 text-2xl font-semibold text-white">Paper portfolio</h1><p className="mt-1 text-sm text-[#A1A7B3]">Practice with virtual cash. No real money or securities are involved.</p></div><ResetPaperAccountButton /></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-5"><Metric label="Portfolio value" value={totalValue} /><Metric label="Buying power" value={cash} /><Metric label="Invested value" value={holdingsValue} /><Metric label="Unrealized P/L" value={unrealizedPnl} tone={unrealizedPnl >= 0 ? 'positive' : 'negative'} /><Metric label="Realized P/L" value={realizedPnl} tone={realizedPnl >= 0 ? 'positive' : 'negative'} /></div><div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]"><PaperPerformanceChart data={chartData} /><section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><div className="flex items-center justify-between"><h2 className="font-medium text-white">Position allocation</h2><span className="text-[10px] uppercase tracking-wider text-[#00C2A8]">Paper money</span></div>{allocation.length ? <div className="mt-4 space-y-3">{allocation.map((item) => <div key={item.assetType}><div className="flex justify-between text-sm"><span className="capitalize text-[#A1A7B3]">{item.assetType}</span><span className="text-white">{item.percentage.toFixed(1)}%</span></div><div className="mt-1 h-2 rounded-full bg-white/[0.06]"><div className="h-2 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} /></div></div>)}</div> : <p className="mt-4 text-sm text-[#A1A7B3]">Allocation appears after your first paper trade.</p>}</section></div><section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><div className="flex items-center justify-between"><h2 className="font-medium text-white">Positions</h2><span className="rounded-full bg-[#00C2A8]/10 px-2 py-1 text-[10px] uppercase tracking-wider text-[#00C2A8]">Virtual account</span></div>{valuedPositions.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{valuedPositions.map((position) => <div key={position.holding.id} className="rounded-lg border border-white/[0.06] bg-[#0B0F1A] p-4"><div className="flex justify-between"><span className="font-medium text-white">{position.holding.symbol}</span><span className="text-xs text-[#A1A7B3]">{position.holding.quantity.toLocaleString()} units</span></div><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-[#64748B]">Avg entry</p><p className="text-white">${position.holding.averageCost.toFixed(2)}</p></div><div><p className="text-xs text-[#64748B]">Current</p><p className="text-white">{position.currentPrice === null ? 'Unavailable' : `$${position.currentPrice.toFixed(2)}`}</p></div><div><p className="text-xs text-[#64748B]">Market value</p><p className="text-white">{position.marketValue === null ? 'Unavailable' : `$${position.marketValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</p></div><div><p className="text-xs text-[#64748B]">Gain/loss</p><p className={position.unrealizedGain !== null && position.unrealizedGain >= 0 ? 'text-[#00C2A8]' : 'text-red-400'}>{position.unrealizedGain === null ? 'Unavailable' : `$${position.unrealizedGain.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</p></div></div></div>)}</div> : <p className="mt-4 text-sm text-[#A1A7B3]">No paper positions yet. Use Paper Buy from an asset detail page.</p>}</section><section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><h2 className="font-medium text-white">Trade history</h2>{orders?.length ? <div className="mt-4 divide-y divide-white/[0.06]">{orders.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span className="text-white"><span className={order.side === 'buy' ? 'text-[#00C2A8]' : 'text-red-400'}>{String(order.side).toUpperCase()}</span> {order.quantity} {order.symbol}</span><span className="text-[#A1A7B3]">${Number(order.gross_amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} · {String(order.status).toUpperCase()}</span></div>)}</div> : <p className="mt-4 text-sm text-[#A1A7B3]">No paper trades yet.</p>}</section></div>;
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: 'positive' | 'negative' }) { return <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"><p className="text-[11px] text-[#A1A7B3]">{label}</p><p className={`mt-2 text-lg font-semibold tabular-nums ${tone === 'positive' ? 'text-[#00C2A8]' : tone === 'negative' ? 'text-red-400' : 'text-white'}`}>${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>; }
