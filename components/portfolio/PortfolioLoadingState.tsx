export default function PortfolioLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-[#1E293B] rounded"></div>
        <div className="h-10 w-32 bg-[#1E293B] rounded"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#1E293B] rounded-lg"></div>
        ))}
      </div>
      <div className="h-[300px] bg-[#1E293B] rounded-lg"></div>
      <div className="h-[400px] bg-[#1E293B] rounded-lg"></div>
    </div>
  );
}
