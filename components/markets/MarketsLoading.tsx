export default function MarketsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#A1A7B3]">Loading market data...</p>
      </div>
    </div>
  );
}
