import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, TrendingUp, Rocket, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCalendarData } from "@/lib/market-data/calendar";
import TableEmptyState from "@/components/common/TableEmptyState";

function formatMoney(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

const HOUR_LABEL: Record<string, string> = { bmo: "Before open", amc: "After close", dmh: "During hours" };

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDateHeading(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; week?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const tab = params.tab === "ipos" ? "ipos" : "earnings";
  const weekOffset = Math.max(0, Math.min(3, Number(params.week) || 0));

  const today = new Date();
  today.setUTCDate(today.getUTCDate() + weekOffset * 7);
  const from = isoDate(today);
  const toDate = new Date(today);
  toDate.setUTCDate(toDate.getUTCDate() + 6);
  const to = isoDate(toDate);

  const calendar = await getCalendarData(from, to);

  const MAX_PER_DAY = 12;
  const sortedEarnings = [...calendar.earnings].sort((a, b) => (b.revenueEstimate ?? 0) - (a.revenueEstimate ?? 0));
  const earningsByDate = sortedEarnings.reduce<Record<string, { shown: typeof calendar.earnings; total: number }>>((acc, item) => {
    const bucket = (acc[item.date] ??= { shown: [], total: 0 });
    bucket.total += 1;
    if (bucket.shown.length < MAX_PER_DAY) bucket.shown.push(item);
    return acc;
  }, {});
  const orderedDates = Object.keys(earningsByDate).sort();

  return (
    <div className="space-y-6">
      <header>
        <div className="label-eyebrow">
          <span className="label-eyebrow-dot" />
          Scheduled events
        </div>
        <h1 className="text-page-title mt-1.5 text-white">Earnings &amp; IPO Calendar</h1>
        <p className="mt-1 text-sm text-[#A1A7B3]">
          Confirmed reporting dates and new listings, sourced from Finnhub.
        </p>
      </header>

      <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-xs text-[#8B93A3]">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#5B6472]" />
        Macro economic events (CPI, FOMC rate decisions, NFP, GDP) require a premium data plan not currently
        configured, so they aren&apos;t shown here — this calendar covers company earnings and IPOs only.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex gap-2" aria-label="Calendar type">
          <Link
            href="/dashboard/calendar?tab=earnings"
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              tab === "earnings" ? "border-[#00C2A8] bg-[#00C2A8]/10 text-[#00C2A8]" : "border-white/[0.08] text-[#A1A7B3] hover:text-white"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Earnings
          </Link>
          <Link
            href="/dashboard/calendar?tab=ipos"
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              tab === "ipos" ? "border-[#00C2A8] bg-[#00C2A8]/10 text-[#00C2A8]" : "border-white/[0.08] text-[#A1A7B3] hover:text-white"
            }`}
          >
            <Rocket className="h-3.5 w-3.5" />
            IPOs
          </Link>
        </nav>

        <nav className="flex items-center gap-1 text-sm" aria-label="Week">
          {[0, 1, 2, 3].map((week) => (
            <Link
              key={week}
              href={`/dashboard/calendar?tab=${tab}&week=${week}`}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                weekOffset === week ? "bg-white/[0.08] text-white" : "text-[#8B93A3] hover:text-white"
              }`}
            >
              {week === 0 ? "This week" : `+${week}w`}
            </Link>
          ))}
        </nav>
      </div>

      <p className="num text-xs text-[#5B6472]">
        {new Date(`${from}T00:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" })} –{" "}
        {new Date(`${to}T00:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" })}
      </p>

      {!calendar.isConfigured && (
        <TableEmptyState
          icon={<CalendarDays className="h-5 w-5" />}
          title="Calendar provider not configured"
          description="Set FINNHUB_API_KEY to enable the earnings and IPO calendar."
        />
      )}

      {calendar.isConfigured && tab === "earnings" && (
        Object.keys(earningsByDate).length === 0 ? (
          <TableEmptyState
            icon={<TrendingUp className="h-5 w-5" />}
            title="No earnings scheduled"
            description="No confirmed earnings reports for this date range yet — check back closer to the date."
          />
        ) : (
          <div className="space-y-5">
            {orderedDates.map((date) => {
              const { shown, total } = earningsByDate[date];
              return (
                <div key={date} className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                    <p className="text-sm font-medium text-white">{formatDateHeading(date)}</p>
                    <p className="text-xs text-[#5B6472]">
                      {total > shown.length ? `Showing ${shown.length} largest of ${total} reporting` : `${total} reporting`}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.05] text-left text-xs uppercase tracking-wide text-[#5B6472]">
                          <th className="px-4 py-2 font-medium">Symbol</th>
                          <th className="px-4 py-2 font-medium">Timing</th>
                          <th className="px-4 py-2 font-medium text-right">EPS Est.</th>
                          <th className="px-4 py-2 font-medium text-right">Revenue Est.</th>
                          <th className="px-4 py-2 font-medium text-right">Scale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {shown.map((item) => {
                          const isLargeCap = (item.revenueEstimate ?? 0) >= 10_000_000_000;
                          return (
                            <tr key={`${item.symbol}-${item.date}`} className="hover:bg-white/[0.02]">
                              <td className="px-4 py-2.5">
                                <Link href={`/dashboard/markets/stock/${item.symbol}`} className="font-medium text-white hover:text-[#00C2A8]">
                                  {item.symbol}
                                </Link>
                              </td>
                              <td className="px-4 py-2.5 text-[#A1A7B3]">{item.hour ? HOUR_LABEL[item.hour] ?? item.hour : "—"}</td>
                              <td className="num px-4 py-2.5 text-right text-[#A1A7B3]">{item.epsEstimate !== null ? item.epsEstimate.toFixed(2) : "—"}</td>
                              <td className="num px-4 py-2.5 text-right text-[#A1A7B3]">{formatMoney(item.revenueEstimate)}</td>
                              <td className="px-4 py-2.5 text-right">
                                {isLargeCap && (
                                  <span className="rounded-full border border-[#F4B000]/25 bg-[#F4B000]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#F4B000]">
                                    Large-cap
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {calendar.isConfigured && tab === "ipos" && (
        calendar.ipos.length === 0 ? (
          <TableEmptyState
            icon={<Rocket className="h-5 w-5" />}
            title="No IPOs scheduled"
            description="No expected listings for this date range yet."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] text-left text-xs uppercase tracking-wide text-[#5B6472]">
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Company</th>
                    <th className="px-4 py-2.5 font-medium">Exchange</th>
                    <th className="px-4 py-2.5 font-medium text-right">Price Range</th>
                    <th className="px-4 py-2.5 font-medium text-right">Deal Size</th>
                    <th className="px-4 py-2.5 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {calendar.ipos.map((ipo) => (
                    <tr key={`${ipo.name}-${ipo.date}`} className="hover:bg-white/[0.02]">
                      <td className="num px-4 py-2.5 text-[#A1A7B3]">
                        {new Date(`${ipo.date}T00:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" })}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-white">
                        {ipo.name}
                        {ipo.symbol && <span className="ml-2 text-xs text-[#5B6472]">{ipo.symbol}</span>}
                      </td>
                      <td className="px-4 py-2.5 text-[#A1A7B3]">{ipo.exchange ?? "—"}</td>
                      <td className="num px-4 py-2.5 text-right text-[#A1A7B3]">{ipo.priceRange ?? "—"}</td>
                      <td className="num px-4 py-2.5 text-right text-[#A1A7B3]">{formatMoney(ipo.totalSharesValue)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#8B93A3]">
                          {ipo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
