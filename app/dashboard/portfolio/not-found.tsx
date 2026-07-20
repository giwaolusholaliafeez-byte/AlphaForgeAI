import Link from 'next/link';
import { FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortfolioNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1E293B] flex items-center justify-center mb-4">
        <FolderOpen className="h-8 w-8 text-[#A1A7B3]" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Portfolio Not Found</h3>
      <p className="text-sm text-[#A1A7B3] max-w-md mb-6">
        The portfolio you're looking for could not be found or you don't have access to it.
      </p>
      <Link href="/dashboard/portfolio">
        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Button>
      </Link>
    </div>
  );
}
