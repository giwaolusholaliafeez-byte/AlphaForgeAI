"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AssetError({ error, reset }: AssetErrorProps) {
  useEffect(() => {
    console.error('Asset page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
      <p className="text-sm text-[#A1A7B3] max-w-md mb-6">
        We encountered an error while loading this asset. Please try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={reset} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
          Try Again
        </Button>
        <Link href="/dashboard/markets">
          <Button variant="outline" className="border-[#1E293B] text-white hover:bg-[#1E293B]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>
      </div>
    </div>
  );
}
