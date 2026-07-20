import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ActivityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');
  const { data: events } = await supabase.from('activity_events').select('id,mode,event_type,description,amount,occurred_at').eq('user_id', user.id).order('occurred_at', { ascending: false }).limit(100);
  return <div className="space-y-6"><div><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Account activity</p><h1 className="mt-1 text-2xl font-semibold text-white">Activity</h1><p className="mt-1 text-sm text-[#A1A7B3]">Every event is explicitly labeled by account context.</p></div><section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">{events?.length ? <div className="divide-y divide-white/[0.06]">{events.map((event) => <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><span className="mr-3 rounded-full bg-[#2563EB]/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[#60A5FA]">{event.mode}</span><span className="text-sm text-white">{event.description}</span></div><div className="text-right"><p className="text-sm text-[#A1A7B3]">{event.amount == null ? '—' : `$${Number(event.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</p><p className="text-xs text-[#64748B]">{new Date(event.occurred_at).toLocaleString()}</p></div></div>)}</div> : <div className="py-12 text-center"><p className="text-white">No activity yet</p><p className="mt-1 text-sm text-[#A1A7B3]">Paper trades and connected sync events will appear here.</p></div>}</section></div>;
}
