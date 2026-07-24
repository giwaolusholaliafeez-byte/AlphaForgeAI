"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Command } from "lucide-react";
import DashboardMobileNav from "./DashboardMobileNav";
import UserMenu from "./UserMenu";
import GlobalSearch from "./GlobalSearch";
import NotificationPermissionButton from "./NotificationPermissionButton";

interface DashboardHeaderProps {
  user: {
    email: string;
    fullName?: string;
  };
}

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Overview",
  markets: "Markets",
  portfolio: "Portfolio",
  intelligence: "Intelligence",
  watchlist: "Watchlist",
  research: "AI Research",
  news: "News Intelligence",
  alerts: "Alerts",
  accounts: "Accounts",
  activity: "Activity",
  paper: "Paper Trading",
  settings: "Settings",
};

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1) return "Overview";
    return SECTION_LABELS[segments[1]] ?? segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F1A]/80 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left - Page Title & Mobile Menu */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <DashboardMobileNav user={user} />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-white sm:text-base">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center - Search trigger */}
        <div className="mx-4 hidden max-w-sm flex-1 md:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-8 w-full items-center rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-left text-sm text-[#5B6472] transition-colors hover:border-white/[0.1] hover:bg-white/[0.05]"
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            <span className="ml-2 flex-1 truncate">Search assets, markets, news…</span>
            <span className="flex flex-shrink-0 items-center gap-0.5 rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-[#8B93A3]">
              <Command className="h-2.5 w-2.5" />K
            </span>
          </button>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <NotificationPermissionButton />

          <div className="w-px h-5 bg-white/[0.06] mx-1" />

          <UserMenu user={user} />
        </div>
      </div>

      {/* Mobile Search trigger */}
      <div className="px-4 pb-3 md:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-10 w-full items-center rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-left text-sm text-[#5B6472]"
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span className="ml-2">Search…</span>
        </button>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
