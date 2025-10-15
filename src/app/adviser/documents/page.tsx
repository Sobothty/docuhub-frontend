'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  MessageSquare,
  Search,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import PDFEdit from '@/components/pdf/PDFEdit';
import { useGetUserProfileQuery } from '@/feature/profileSlice/profileSlice';
import {
  useGetAssignmentByAdviserWithPaginationQuery
} from '@/feature/adviserAssignment/AdviserAssignmentSlice';
import { useGetUserByIdQuery } from '@/feature/users/usersSlice';
import { Skeleton } from '@/components/ui/skeleton';

// Assignment Card Component with user fetching
function AssignmentCard({ assignment }: { assignment: any }) {
  const router = useRouter();
  const [reviewingProposal, setReviewingProposal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [showPdfEditor, setShowPdfEditor] = useState(false);

  // Fetch student data
  const { data: studentData, isLoading: studentLoading } = useGetUserByIdQuery(
    assignment.student.uuid,
    {
      skip: !assignment.student.uuid,
    }
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSubmitReview = () => {
    if (decision && feedback.trim()) {
      console.log(
        `${decision} assignment ${assignment.assignmentUuid} with feedback: ${feedback}`
      );
      // TODO: Implement review submission API
      setReviewingProposal(false);
      setFeedback('');
      setDecision(null);
    }
  };

  const handleReviewDocument = () => {
    setShowPdfEditor(true);
  };

  const handleClosePdfEditor = () => {
    setShowPdfEditor(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg truncate max-w-3xl">
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-lg"
                  onClick={() =>
                    router.push(`/adviser/documents/${assignment.paper.uuid}`)
                  }
                >
                  {assignment.paper.title}
                </Button>
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {studentLoading
                      ? 'Loading...'
                      : studentData?.fullName || assignment.student.fullName}
                  </span>
                  <span>Assigned: {assignment.assignedDate}</span>
                  <span>Deadline: {assignment.deadline}</span>
                </div>
              </CardDescription>
            </div>
            {getStatusBadge(assignment.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Student Info */}
            <div className="flex items-center gap-3">
              <img
                src={
                  studentData?.imageUrl ||
                  assignment.student.imageUrl ||
                  '/placeholder.svg'
                }
                alt={assignment.student.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">
                  {studentData?.fullName || assignment.student.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {studentData?.email || 'Student'}
                </p>
              </div>
            </div>

            {/* Thumbnail Preview */}
            {assignment.paper.thumbnailUrl && (
              <div>
                <img
                  src={assignment.paper.thumbnailUrl}
                  alt={assignment.paper.title}
                  className="w-full h-48 lg:h-72 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Review Actions */}
            {assignment.status === 'ASSIGNED' && (
              <div className="border-t pt-4">
                {reviewingProposal ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide detailed feedback on the document..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setDecision('approve');
                          handleSubmitReview();
                        }}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={!feedback.trim()}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          setDecision('reject');
                          handleSubmitReview();
                        }}
                        variant="destructive"
                        disabled={!feedback.trim()}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setReviewingProposal(false);
                          setFeedback('');
                          setDecision(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={handleReviewDocument}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Review Document
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PDF Editor Modal */}
      {showPdfEditor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">
                  {assignment.paper.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Student: {assignment.student.fullName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePdfEditor}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFEdit pdfUri={assignment.paper.fileUrl} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Loading Skeleton Component
function AssignmentCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default function MentorProposalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const { data: adviserProfile, isLoading: profileLoading } =
    useGetUserProfileQuery();

  // Fetch assignments with pagination
  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useGetAssignmentByAdviserWithPaginationQuery({
    page,
    size,
    sortBy: 'assignedDate',
    direction: 'desc',
  });

  const assignments = assignmentsData?.data?.content || [];
  const totalPages = assignmentsData?.data?.totalPages || 0;
  const totalElements = assignmentsData?.data?.totalElements || 0;

  // Filter assignments based on search
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.student.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user.fullName || 'Adviser Name'}
      userAvatar={adviserProfile?.user.imageUrl || undefined}
    >
      <div className="space-y-6">
        <PageHeader
          title="Student Documents"
          description="Review and provide feedback on student documents"
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignmentsLoading ? (
            <AssignmentCardSkeleton count={3} />
          ) : assignmentsError ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-red-500">Failed to load assignments</p>
              </CardContent>
            </Card>
          ) : filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'No documents match your search'
                    : 'No documents assigned yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.assignmentUuid}
                assignment={assignment}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {page * size + 1} to{' '}
              {Math.min((page + 1) * size, totalElements)} of {totalElements}{' '}
              assignments
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(i)}
                    className="w-8 h-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
