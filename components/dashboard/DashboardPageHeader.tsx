import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  lastUpdated?: string;
  status?: "live" | "delayed" | "offline";
}

export default function DashboardPageHeader({
  title,
  description,
  action,
  className,
  lastUpdated,
  status,
}: DashboardPageHeaderProps) {
  const statusColors = {
    live: "text-[#00C2A8]",
    delayed: "text-[#F4B000]",
    offline: "text-[#A1A7B3]",
  };

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div className="space-y-0.5">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
          {status && (
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border",
              status === "live" && "border-[#00C2A8]/30 bg-[#00C2A8]/10 text-[#00C2A8]",
              status === "delayed" && "border-[#F4B000]/30 bg-[#F4B000]/10 text-[#F4B000]",
              status === "offline" && "border-white/[0.06] bg-white/[0.04] text-[#A1A7B3]"
            )}>
              {status}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-[#A1A7B3]">{description}</p>
        )}
        {lastUpdated && (
          <p className="text-xs text-[#A1A7B3]">Last updated: {lastUpdated}</p>
        )}
      </div>
      {action && <div className="flex items-center space-x-2">{action}</div>}
    </div>
  );
}
