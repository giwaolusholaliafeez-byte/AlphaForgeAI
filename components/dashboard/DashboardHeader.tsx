"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardMobileNav from "./DashboardMobileNav";
import UserMenu from "./UserMenu";
import { cn } from "@/lib/utils";
import NotificationPermissionButton from "./NotificationPermissionButton";

interface DashboardHeaderProps {
  user: {
    email: string;
    fullName?: string;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1) return "Overview";
    return segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual-only search for now
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

        {/* Center - Search */}
        <div className="flex-1 max-w-sm mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <div className={cn(
              "flex items-center rounded-lg border transition-colors duration-200",
              isSearchFocused 
                ? "border-[#2563EB] bg-[#0B0F1A] ring-1 ring-[#2563EB]/20" 
                : "border-white/[0.06] bg-white/[0.03]"
            )}>
              <Search className="absolute left-3 h-4 w-4 text-[#A1A7B3]" />
              <Input
                type="text"
                placeholder="Search assets, markets, news..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-9 pr-20 h-8 bg-transparent border-none text-white placeholder:text-[#A1A7B3] text-sm focus:ring-0 focus:outline-none"
                aria-label="Global search"
              />
              <div className="absolute right-2 flex items-center space-x-1 text-[10px] text-[#A1A7B3] bg-white/[0.04] px-2 py-0.5 rounded">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <NotificationPermissionButton />
          
          <div className="w-px h-5 bg-white/[0.06] mx-1" />
          
          <UserMenu user={user} />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <div className={cn(
              "flex h-10 items-center rounded-lg border transition-colors duration-200",
            isSearchFocused 
              ? "border-[#2563EB] bg-[#0B0F1A] ring-1 ring-[#2563EB]/20" 
              : "border-white/[0.06] bg-white/[0.03]"
          )}>
            <Search className="absolute left-3 h-4 w-4 text-[#A1A7B3]" />
            <Input
              type="text"
              placeholder="Search..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="h-10 pl-9 bg-transparent border-none text-white placeholder:text-[#A1A7B3] text-sm focus:ring-0 focus:outline-none"
              aria-label="Global search"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
