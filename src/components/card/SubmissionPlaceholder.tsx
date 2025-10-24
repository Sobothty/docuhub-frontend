import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

function TableRowPlaceholder() {
  return (
    <TableRow>
      {/* Thumbnail */}
      <TableCell>
        <div className="relative w-16 h-10 bg-slate-200 rounded-md animate-pulse" />
      </TableCell>

      {/* Title */}
      <TableCell>
        <div className="w-36">
          <div className="p-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          </div>
        </div>
      </TableCell>

      {/* Status Badge */}
      <TableCell>
        <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>

      {/* Publication Status */}
      <TableCell>
        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>

      {/* Categories */}
      <TableCell>
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
      </TableCell>

      {/* Adviser */}
      <TableCell>
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
      </TableCell>

      {/* Date */}
      <TableCell>
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="h-8 w-8 bg-slate-200 rounded animate-pulse ml-auto" />
      </TableCell>
    </TableRow>
  );
}

export default TableRowPlaceholder;