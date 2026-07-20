import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AssetNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1E293B] flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-[#A1A7B3]" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Asset Not Found</h3>
      <p className="text-sm text-[#A1A7B3] max-w-md mb-6">
        The asset you're looking for could not be found. It may have been delisted or the identifier may be incorrect.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/markets">
          <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="border-[#1E293B] text-white hover:bg-[#1E293B]">
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
