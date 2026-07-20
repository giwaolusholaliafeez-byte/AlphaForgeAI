"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: {
    email: string;
    fullName?: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initials = user.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email.charAt(0).toUpperCase();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "flex items-center space-x-2 h-8 px-2 rounded-lg text-[#A1A7B3] hover:text-white hover:bg-white/[0.04] transition-all duration-150",
            isOpen && "bg-white/[0.04] text-white"
          )}
        >
          <div className="w-7 h-7 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-white text-xs font-medium ring-1 ring-[#2563EB]/20">
            {initials}
          </div>
          <span className="text-sm font-medium hidden sm:block">{user.fullName || "User"}</span>
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-150",
            isOpen && "rotate-180"
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-[#1E293B] border-white/[0.06] text-white shadow-xl"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium text-white">{user.fullName || "User"}</p>
            <p className="text-xs text-[#A1A7B3]">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuItem asChild className="focus:bg-white/[0.04] focus:text-white text-[#A1A7B3] cursor-pointer px-3 py-2">
          <Link href="/dashboard" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-white/[0.04] focus:text-white text-[#A1A7B3] cursor-pointer px-3 py-2">
          <Link href="/dashboard/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuItem asChild className="focus:bg-white/[0.04] focus:text-white text-[#A1A7B3] cursor-pointer px-3 py-2">
          <form action={signOut} className="w-full">
            <button type="submit" className="flex w-full items-center text-red-500 hover:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
