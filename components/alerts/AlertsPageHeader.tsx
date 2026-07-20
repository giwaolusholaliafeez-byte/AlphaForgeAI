"use client";

import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertsPageHeaderProps {
  title: string;
  description?: string;
  alertCount?: number;
  onCreateAlert: () => void;
  className?: string;
}

export default function AlertsPageHeader({
  title,
  description,
  alertCount,
  onCreateAlert,
  className,
}: AlertsPageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {alertCount !== undefined && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/[0.04] text-[#A1A7B3] border border-white/[0.06]">
              {alertCount}
            </span>
          )}
        </div>
        {description && <p className="text-sm text-[#A1A7B3]">{description}</p>}
      </div>
      <Button onClick={onCreateAlert} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
        <Bell className="h-4 w-4 mr-2" />
        Create Alert
      </Button>
    </div>
  );
}
