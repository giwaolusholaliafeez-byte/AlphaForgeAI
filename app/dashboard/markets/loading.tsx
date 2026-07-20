export default function MarketsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-[#1E293B] rounded" />
        <div className="h-4 w-48 bg-[#1E293B] rounded" />
        <div className="h-3 w-32 bg-[#1E293B] rounded" />
      </div>
      <div className="h-10 bg-[#1E293B] rounded-lg" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-[#1E293B] rounded" />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#1E293B] rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-[#1E293B] rounded-lg" />
    </div>
  );
}
