import { Card, CardHeader, CardContent} from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// ============================================
// Stats Card Skeleton
// ============================================
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

// ============================================
// Search Bar Skeleton
// ============================================
export function SearchBarSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// ============================================
// Single Table Row Skeleton
// ============================================
export function ResourceTableRowSkeleton() {
  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      {/* Resource Column */}
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-full max-w-md" />
        </div>
      </TableCell>

      {/* Type Column */}
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>

      {/* Category Column */}
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>

      {/* Status Column */}
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>

      {/* Downloads Column */}
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>

      {/* Upload Date Column */}
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>

      {/* Actions Column */}
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
      </TableCell>
    </TableRow>
  )
}

// ============================================
// Multiple Table Rows Skeleton
// ============================================
export function ResourceTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <ResourceTableRowSkeleton key={index} />
      ))}
    </>
  )
}

// ============================================
// Full Resources Table Card Skeleton
// ============================================
export function ResourcesTableCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ResourceTableSkeleton rows={5} />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ============================================
// Complete Page Skeleton
// ============================================
export function ResourcesPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Search and Filter Skeleton */}
      <SearchBarSkeleton />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Resources Table Skeleton */}
      <ResourcesTableCardSkeleton />
    </div>
  )
}


// ============================================
// Empty State Component (Bonus)
// ============================================
export function ResourcesEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 bg-muted rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No resources yet</h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          Start sharing educational materials and resources with your students by uploading your first resource.
        </p>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Upload Your First Resource
        </button>
      </CardContent>
    </Card>
  )
}
