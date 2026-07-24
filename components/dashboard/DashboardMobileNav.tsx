"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, LayoutDashboard, BarChart3, Wallet, Bookmark,
  Brain, Sparkles, Newspaper, CalendarDays, Bell, Landmark, Activity, Settings, LogOut
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

interface DashboardMobileNavProps {
  user: {
    email: string;
    fullName?: string;
  };
}

export default function DashboardMobileNav({ user }: DashboardMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-10 w-10 shrink-0 text-white md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-[18px] w-[18px]" />
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-[100dvh] w-[min(86vw,320px)] overscroll-contain border-r border-white/[0.06] bg-[#0B0F1A] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06]">
            <div className="flex items-center space-x-2.5">
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
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-[#A1A7B3] hover:text-white h-8 w-8"
              aria-label="Close navigation menu"
            >
              <X className="h-[18px] w-[18px]" />
            </Button>
          </div>

          {/* User Info */}
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <p className="text-sm font-medium text-white">
              {user.fullName || "User"}
            </p>
            <p className="text-xs text-[#A1A7B3] truncate">{user.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Mobile navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                    isActive
                      ? "bg-[#2563EB]/10 text-[#2563EB]"
                      : "text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors duration-150",
                    isActive ? "text-[#2563EB]" : "text-[#A1A7B3]"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="px-3 py-3.5 border-t border-white/[0.06]">
            <form action={signOut}>
              <Button 
                type="submit"
                variant="ghost" 
                className="w-full justify-start text-[#A1A7B3] hover:text-white hover:bg-white/[0.04] text-sm h-9 px-3"
                onClick={() => setOpen(false)}
              >
                <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
