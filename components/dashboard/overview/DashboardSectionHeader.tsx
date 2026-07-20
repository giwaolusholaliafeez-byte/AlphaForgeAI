import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function DashboardSectionHeader({
  title,
  description,
  action,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h2 className="text-sm font-medium text-white">{title}</h2>
        {description && (
          <p className="text-xs text-[#A1A7B3]">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
