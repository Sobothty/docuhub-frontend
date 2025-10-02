'use client';

import { useState } from 'react';
import { 
  useGetPendingStudentsQuery, 
  useApproveStudentMutation, 
  useRejectStudentMutation 
} from '@/feature/apiSlice/studentApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { 
  GraduationCap, 
  Building, 
  BookOpen, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  User,
  AlertCircle,
  Clock
} from 'lucide-react';
import { StudentResponse } from '@/types/studentType';

interface PendingStudentsManagerProps {
  initialPage?: number;
  pageSize?: number;
}

export default function PendingStudentsManager({ 
  initialPage = 0, 
  pageSize = 10 
}: PendingStudentsManagerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // Fetch pending students
  const { 
    data: studentsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetPendingStudentsQuery({ 
    page: currentPage, 
    size: pageSize 
  });

  // Mutation hooks
  const [approveStudent, { isLoading: isApproving }] = useApproveStudentMutation();
  const [rejectStudent, { isLoading: isRejecting }] = useRejectStudentMutation();

  const students = studentsData?.students?.content || [];
  const totalPages = studentsData?.students?.totalPages || 0;
  const totalElements = studentsData?.students?.totalElements || 0;

  const handleApprove = async (student: StudentResponse) => {
    try {
      await approveStudent({ userUuid: student.userUuid }).unwrap();
      console.log('Student approved successfully:', student.userUuid);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to approve student:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedStudent || !rejectReason.trim()) return;

    try {
      await rejectStudent({
        userUuid: selectedStudent.userUuid,
        reason: rejectReason
      }).unwrap();
      
      console.log('Student rejected successfully:', selectedStudent.userUuid);
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedStudent(null);
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to reject student:', error);
    }
  };

  const openRejectDialog = (student: StudentResponse) => {
    setSelectedStudent(student);
    setShowRejectDialog(true);
  };

  const closeRejectDialog = () => {
    setShowRejectDialog(false);
    setRejectReason('');
    setSelectedStudent(null);
  };

  const openImageDialog = (student: StudentResponse) => {
    setSelectedStudent(student);
    setShowImageDialog(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pending students...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load pending students. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Pending Student Verifications
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Review and approve student verification requests
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-yellow-600">
                <Clock className="h-3 w-3 mr-1" />
                {totalElements} Pending
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {students.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Students</h3>
            <p className="text-muted-foreground">
              All student verification requests have been processed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Students Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Major</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Student Card</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.uuid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="Student" />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">Student</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {student.userUuid.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{student.university}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{student.major}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Year {student.yearsOfStudy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openImageDialog(student)}
                          className="h-8 px-2"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(student)}
                            disabled={isApproving}
                            className="h-8 px-3"
                          >
                            {isApproving ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white" />
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openRejectDialog(student)}
                            disabled={isRejecting}
                            className="h-8 px-3"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Reject Student Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Reject Student Verification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedStudent.university}</p>
                <p className="text-sm text-muted-foreground">{selectedStudent.major}</p>
                <p className="text-sm text-muted-foreground">Year {selectedStudent.yearsOfStudy}</p>
              </div>
            )}
            <div>
              <Label htmlFor="rejectReason">Rejection Reason *</Label>
              <Textarea
                id="rejectReason"
                placeholder="Please provide a clear reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={closeRejectDialog}
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
              >
                {isRejecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Student
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Card Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Student Card
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Student Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">University:</span>
                    <p className="font-medium">{selectedStudent.university}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Major:</span>
                    <p className="font-medium">{selectedStudent.major}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Year:</span>
                    <p className="font-medium">Year {selectedStudent.yearsOfStudy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="text-yellow-600">
                      Pending Review
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={selectedStudent.studentCardUrl}
                  alt="Student Card"
                  className="w-full max-h-96 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowImageDialog(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setShowImageDialog(false);
                    handleApprove(selectedStudent);
                  }}
                  disabled={isApproving}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowImageDialog(false);
                    openRejectDialog(selectedStudent);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}