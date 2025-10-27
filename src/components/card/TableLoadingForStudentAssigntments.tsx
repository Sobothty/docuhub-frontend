import { Skeleton } from "../ui/skeleton"
import { TableRow, TableCell } from "../ui/table"

export function TableRowSkeleton() {
  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      {/* Student Info Column */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </TableCell>

      {/* Paper Title Column */}
      <TableCell className="max-w-xs">
        <Skeleton className="h-4 w-48" />
      </TableCell>

      {/* Status Column */}
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>

      {/* Deadline Column */}
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
// Multiple Rows Skeleton (use this in your table)
// ============================================
export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={index} />
      ))}
    </>
  )
}