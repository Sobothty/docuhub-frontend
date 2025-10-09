interface PaperCardSkeletonProps {
  count?: number
}

export function PaperCardSkeleton({ count = 3 }: PaperCardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-card rounded-xl border border-border shadow-sm animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Title skeleton */}
          <div className="h-6 bg-muted rounded-md w-3/4 mb-3" />

          {/* Authors skeleton */}
          <div className="flex gap-2 mb-4">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-28" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>

          {/* Abstract skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>

          {/* Metadata skeleton */}
          <div className="flex items-center gap-4 text-sm">
            <div className="h-3 bg-muted rounded w-20" />
            <div className="h-3 bg-muted rounded w-16" />
            <div className="h-3 bg-muted rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
