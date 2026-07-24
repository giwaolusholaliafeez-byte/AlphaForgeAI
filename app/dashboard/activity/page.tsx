import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Activity } from 'lucide-react';
import TableEmptyState from '@/components/common/TableEmptyState';

export default async function ActivityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');
  const { data: events } = await supabase.from('activity_events').select('id,mode,event_type,description,amount,occurred_at').eq('user_id', user.id).order('occurred_at', { ascending: false }).limit(100);
  return (
    <div className="space-y-6">
      <div>
        <div className="label-eyebrow">
          <span className="label-eyebrow-dot" />
          Account activity
        </div>
        <h1 className="text-page-title mt-1.5 text-white">Activity</h1>
        <p className="mt-1 text-sm text-[#A1A7B3]">Every event is explicitly labeled by account context.</p>
      </div>
      {events?.length ? (
        <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="divide-y divide-white/[0.06]">
            {events.map((event) => (
              <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <span className="mr-3 rounded-full bg-[#2563EB]/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[#60A5FA]">{event.mode}</span>
                  <span className="text-sm text-white">{event.description}</span>
                </div>
                <div className="text-right">
                  <p className="num text-sm text-[#A1A7B3]">{event.amount == null ? '—' : `$${Number(event.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</p>
                  <p className="num text-xs text-[#64748B]">{new Date(event.occurred_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <TableEmptyState
          icon={<Activity className="h-5 w-5" />}
          title="No activity yet"
          description="Paper trades and connected sync events will appear here as you use AlphaForge."
        />
      )}
    </div>
  );
}
