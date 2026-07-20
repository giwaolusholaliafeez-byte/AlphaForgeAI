export default function AssetDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-[#1E293B]"></div>
        <div className="space-y-2">
          <div className="h-6 w-32 bg-[#1E293B] rounded"></div>
          <div className="h-4 w-24 bg-[#1E293B] rounded"></div>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="h-10 w-40 bg-[#1E293B] rounded"></div>
        <div className="h-4 w-24 bg-[#1E293B] rounded"></div>
      </div>

      {/* Chart */}
      <div className="h-[300px] bg-[#1E293B] rounded-lg"></div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-[#1E293B] rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}
