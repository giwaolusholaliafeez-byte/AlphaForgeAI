import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  const [{ data: paper }, { data: connections }] = await Promise.all([
    supabase.from("paper_accounts").select("cash_balance,is_open").eq("user_id", user.id).maybeSingle(),
    supabase.from("broker_connections").select("id,institution_name,status,last_synced_at").eq("user_id", user.id),
  ]);
  return <div className="space-y-6"><header><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Financial accounts</p><h1 className="mt-1 text-2xl font-semibold text-white">Accounts</h1><p className="mt-1 text-sm text-[#A1A7B3]">Paper, connected, and live balances are never mixed.</p></header><div className="grid gap-4 lg:grid-cols-3"><AccountCard title="AlphaForge Paper" badge="VIRTUAL" detail={paper?.is_open ? `$${Number(paper.cash_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} buying power` : "Not opened · $0.00"} link="/dashboard/paper" action={paper?.is_open ? "Open" : "Open account"} /><AccountCard title="Connected brokerage" badge="EXTERNAL" detail={connections?.length ? `${connections.length} connection${connections.length === 1 ? "" : "s"}` : "No brokerage connected"} action="Connect brokerage" /><AccountCard title="Live brokerage" badge="DISABLED" detail="Real-money trading is not currently available." action="Coming soon" /></div></div>;
}
function AccountCard({ title, badge, detail, link, action }: { title: string; badge: string; detail: string; link?: string; action: string }) { return <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><div className="flex items-center justify-between"><h2 className="font-medium text-white">{title}</h2><span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] tracking-wider text-[#A1A7B3]">{badge}</span></div><p className="mt-6 text-sm text-[#A1A7B3]">{detail}</p>{link ? <Button asChild className="mt-6"><Link href={link}>{action}</Link></Button> : <Button disabled variant="outline" className="mt-6">{action}</Button>}</section>; }
