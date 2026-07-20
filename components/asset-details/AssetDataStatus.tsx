import { Badge } from "@/components/ui/badge";

interface AssetDataStatusProps {
  source: string;
  isDelayed: boolean;
  lastUpdated: string | null;
  isConfigured: boolean;
}

export default function AssetDataStatus({
  source,
  isDelayed,
  lastUpdated,
  isConfigured,
}: AssetDataStatusProps) {
  if (!isConfigured) {
    return (
      <div className="flex items-center space-x-2 text-xs text-[#A1A7B3]">
        <Badge variant="outline" className="text-yellow-500 border-yellow-500/20">
          Not Configured
        </Badge>
        <span>Provider key missing</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-xs text-[#A1A7B3]">
      <Badge variant="outline" className="text-[#00C2A8] border-[#00C2A8]/20">
        {source}
      </Badge>
      {isDelayed && (
        <span>Data may be delayed</span>
      )}
      {lastUpdated && (
        <span>• Updated: {new Date(lastUpdated).toLocaleString()}</span>
      )}
    </div>
  );
}
