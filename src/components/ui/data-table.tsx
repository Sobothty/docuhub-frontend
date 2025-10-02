'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { EmptyState } from './empty-state';

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  // Constrain T to Record<string, unknown>
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  sortable = true,
  pagination = true,
  pageSize = 10,
  emptyState,
  actions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query
  const filteredData = searchQuery
    ? data.filter((row) =>
        Object.values(row).some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = (column: keyof T) => {
    if (!sortable) return;

    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-10"
                disabled
              />
            </div>
          )}
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    style={{ width: column.width }}
                  >
                    {column.title}
                  </TableHead>
                ))}
                {actions && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (data.length === 0 && !loading) {
    return emptyState ? (
      <EmptyState
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
      />
    ) : (
      <EmptyState
        title="No data available"
        description="There are no items to display at the moment."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredData.length !== data.length && (
            <Badge variant="outline">
              {filteredData.length} of {data.length} items
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={
                    sortable && column.sortable !== false
                      ? 'cursor-pointer hover:bg-muted/50'
                      : ''
                  }
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {sortable &&
                      column.sortable !== false &&
                      sortColumn === column.key &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? '')}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} items
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
