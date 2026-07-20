import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketErrorStateProps {
  error: string;
  onRetry?: () => void;
  isConfig?: boolean;
}

export default function MarketErrorState({ error, onRetry, isConfig }: MarketErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {isConfig ? 'Configuration Required' : 'Error Loading Data'}
      </h3>
      <p className="text-sm text-[#A1A7B3] max-w-md mb-6">
        {error}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
