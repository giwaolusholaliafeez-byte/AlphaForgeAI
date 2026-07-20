import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserType } from "@/lib/accounts/types";

const actions: Record<UserType, { eyebrow: string; title: string; description: string; href: string; label: string; icon: typeof BriefcaseBusiness }> = {
  investor: { eyebrow: "Investor path", title: "Build your first portfolio", description: "Add the assets you care about and start tracking long-term performance.", href: "/dashboard/portfolio", label: "Create first portfolio", icon: BriefcaseBusiness },
  trader: { eyebrow: "Trader path", title: "Start with $100K paper money", description: "Practice market orders with virtual cash before risking real capital.", href: "/dashboard/paper", label: "Open paper trading", icon: LineChart },
  exploring: { eyebrow: "Explore path", title: "Browse markets and build a watchlist", description: "Find assets, compare movement, and follow the markets at your pace.", href: "/dashboard/markets", label: "Explore markets", icon: BarChart3 },
};

export default function FirstActionCard({ userType }: { userType: UserType }) {
  const action = actions[userType];
  const Icon = action.icon;
  return <section className="overflow-hidden rounded-xl border border-[#2563EB]/25 bg-gradient-to-br from-[#2563EB]/15 to-[#00C2A8]/5 p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/20 text-[#60A5FA]"><Icon className="h-5 w-5" /></div><div><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#60A5FA]">{action.eyebrow}</p><h2 className="mt-1 text-lg font-semibold text-white">{action.title}</h2><p className="mt-1 max-w-xl text-sm text-[#A1A7B3]">{action.description}</p></div></div><Button asChild className="w-full shrink-0 sm:w-auto"><Link href={action.href}>{action.label}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></section>;
}
