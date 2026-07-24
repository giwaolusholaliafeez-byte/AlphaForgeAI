import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TableEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export default function TableEmptyState({ icon, title, description, action, className }: TableEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-14 text-center",
        className
      )}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#8B93A3]">
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-white">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#8B93A3]">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
