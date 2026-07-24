"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  Bookmark,
  Brain,
  Sparkles,
  Newspaper,
  CalendarDays,
  Bell,
  Landmark,
  Activity,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Markets", icon: BarChart3, href: "/dashboard/markets" },
  { label: "Portfolio", icon: Wallet, href: "/dashboard/portfolio" },
  { label: "Intelligence", icon: Sparkles, href: "/dashboard/intelligence" },
  { label: "Watchlist", icon: Bookmark, href: "/dashboard/watchlist" },
  { label: "AI Research", icon: Brain, href: "/dashboard/research" },
  { label: "News Intelligence", icon: Newspaper, href: "/dashboard/news" },
  { label: "Calendar", icon: CalendarDays, href: "/dashboard/calendar" },
  { label: "Alerts", icon: Bell, href: "/dashboard/alerts" },
  { label: "Accounts", icon: Landmark, href: "/dashboard/accounts" },
  { label: "Activity", icon: Activity, href: "/dashboard/activity" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-[#0B0F1A] border-r border-white/[0.06] z-30">
      {/* Logo */}
      <div className="flex items-center h-14 px-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <Image
            src="/alphaforge-icon.png"
            alt="AlphaForge AI logo"
            width={28}
            height={28}
            className="h-7 w-auto"
          />
          <span className="text-sm font-medium tracking-tight">
            <span className="text-white">ALPHA</span>
            <span className="text-[#F4B000]">FORGE</span>
            <span className="text-[#00C2A8]">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 group",
                isActive
                  ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : "text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Icon className={cn(
                "h-[18px] w-[18px] transition-colors duration-150 flex-shrink-0",
                isActive ? "text-[#2563EB]" : "text-[#A1A7B3] group-hover:text-white"
              )} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="w-1 h-6 bg-[#2563EB] rounded-full flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-2">
        <div className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#A1A7B3]">Plan</p>
              <p className="text-sm font-medium text-white">Free</p>
            </div>
            <Button asChild
              size="sm" 
              variant="outline" 
              className="h-7 px-2.5 text-[10px] border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-md"
            >
              <Link href="/pricing"><Crown className="h-3 w-3 mr-1" />Upgrade</Link>
            </Button>
          </div>
        </div>
        
        <form action={signOut}>
          <Button 
            type="submit"
            variant="ghost" 
            className="w-full justify-start text-[#A1A7B3] hover:text-white hover:bg-white/[0.04] text-sm h-9 px-3"
          >
            <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
