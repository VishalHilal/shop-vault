export default function ProductSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="bg-dark-700 aspect-square" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-dark-700 rounded w-1/3" />
        <div className="h-4 bg-dark-700 rounded w-full" />
        <div className="h-4 bg-dark-700 rounded w-2/3" />
        <div className="h-3 bg-dark-700 rounded w-1/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-7 bg-dark-700 rounded w-16" />
          <div className="h-9 bg-dark-700 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}
