import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  action?: ReactNode;
}

export default function DashboardCard({
  title,
  icon,
  children,
  className,
  headerClassName,
  contentClassName,
  action,
}: DashboardCardProps) {
  return (
    <Card className={cn("bg-[#1E293B] border-[#1E293B]", className)}>
      <CardHeader className={cn("flex flex-row items-center justify-between pb-2", headerClassName)}>
        <CardTitle className="text-sm font-medium text-white flex items-center space-x-2">
          {icon && <span className="text-[#A1A7B3]">{icon}</span>}
          <span>{title}</span>
        </CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className={cn("pt-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
