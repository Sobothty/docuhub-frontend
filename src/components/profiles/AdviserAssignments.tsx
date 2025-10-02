'use client';

import { useGetAdviserAssignmentsQuery } from '@/feature/apiSlice/adviserDetailApiSlice';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function AdviserAssignments() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { data, isLoading, error } = useGetAdviserAssignmentsQuery({ page, size });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-800">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading assignments...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load assignments. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.content || data.content.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No assignments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Paper Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((assignment) => (
              <TableRow key={assignment.uuid}>
                <TableCell className="font-medium">{assignment.studentName}</TableCell>
                <TableCell>{assignment.paperTitle}</TableCell>
                <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                <TableCell>{new Date(assignment.assignedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.pageable && data.pageable.totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(0, page - 1))}
                    disabled={page === 0}
                  />
                </PaginationItem>
                
                {[...Array(data.pageable.totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={page === index}
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(data.pageable.totalPages - 1, page + 1))}
                    disabled={page === data.pageable.totalPages - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}