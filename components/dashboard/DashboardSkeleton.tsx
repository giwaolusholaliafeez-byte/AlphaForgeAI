import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-white/[0.04] rounded-lg", className)} />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24 mb-1.5" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function MetricCardGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-10 rounded" />
          ))}
        </div>
      </div>
      <Skeleton className="h-[220px] w-full rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] overflow-hidden">
      <div className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex space-x-4 pb-2 border-b border-white/[0.06]">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              {Array.from({ length: cols }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HoldingsTableSkeleton() {
  return <TableSkeleton rows={4} cols={7} />;
}
