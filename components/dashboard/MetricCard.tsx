import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  change?: string;
  changePositive?: boolean;
  className?: string;
  valueClassName?: string;
  emphasis?: 'gold' | 'royal' | 'teal' | 'none';
}

export default function MetricCard({
  label,
  value,
  icon,
  change,
  changePositive,
  className,
  valueClassName,
  emphasis = 'none',
}: MetricCardProps) {
  const getEmphasisColor = () => {
    switch (emphasis) {
      case 'gold': return 'text-[#F4B000]';
      case 'royal': return 'text-[#2563EB]';
      case 'teal': return 'text-[#00C2A8]';
      default: return 'text-white';
    }
  };

  return (
    <Card className={cn("bg-[#1E293B] border-[#1E293B]", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-[#A1A7B3]">{label}</p>
          <div className="text-[#A1A7B3]">{icon}</div>
        </div>
        <p className={cn("text-2xl font-bold", getEmphasisColor(), valueClassName)}>
          {value}
        </p>
        {change && (
          <p className={cn(
            "text-xs mt-1",
            changePositive ? "text-green-500" : "text-red-500"
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
