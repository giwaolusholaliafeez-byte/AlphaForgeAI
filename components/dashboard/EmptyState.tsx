import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="bg-[#1E293B] border-[#1E293B]">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-[#0B0F1A] text-[#A1A7B3]">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-[#A1A7B3] max-w-md mx-auto mb-4">{description}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
