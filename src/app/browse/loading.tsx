import { LoadingCard } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted animate-pulse rounded w-64" />
        <div className="h-4 bg-muted animate-pulse rounded w-96" />
      </div>

      <div className="h-48 bg-muted animate-pulse rounded-lg" />

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>

      <LoadingCard title="Loading Publications" description="Discovering academic papers for you..." />
    </div>
  )
}
