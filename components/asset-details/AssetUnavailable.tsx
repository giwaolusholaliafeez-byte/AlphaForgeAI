import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetUnavailableProps {
  message: string;
  isConfig?: boolean;
}

export default function AssetUnavailable({ message, isConfig }: AssetUnavailableProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {isConfig ? 'Configuration Required' : 'Asset Unavailable'}
      </h3>
      <p className="text-sm text-[#A1A7B3] max-w-md mb-6">
        {message}
      </p>
      <Link href="/dashboard/markets">
        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Markets
        </Button>
      </Link>
    </div>
  );
}
