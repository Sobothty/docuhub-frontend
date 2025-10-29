"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetAssignmentByAdviserWithPaginationQuery } from "@/feature/adviserAssignment/AdviserAssignmentSlice";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import Image from "next/image";
import FeedbackCardPlaceholder from "@/components/card/FeedbackCardPlaceholder";

// Extended Assignment type with student details
interface AssignmentWithStudent {
  uuid?: string;
  paperUuid?: string;
  adviserUuid?: string;
  adminUuid?: string;
  updateDate?: string | null;
  status?: string;
  student: {
    uuid: string;
    fullName: string;
    imageUrl?: string | null;
  };
  paper: {
    uuid: string;
    title: string;
    thumbnailUrl?: string | null;
    Status: string;
  };
  assignmentUuid: string;
  assignedDate: string;
  deadline: string;
}

// Helper function to calculate days until deadline
function calculateDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Helper function to get deadline status
function getDeadlineStatus(deadline: string): {
  status: "overdue" | "urgent" | "upcoming" | "ok";
  message: string;
  color: string;
} {
  const daysUntil = calculateDaysUntilDeadline(deadline);

  if (daysUntil < 0) {
    return {
      status: "overdue",
      message: `Overdue by ${Math.abs(daysUntil)} day${
        Math.abs(daysUntil) !== 1 ? "s" : ""
      }`,
      color: "#dc2626",
    };
  } else if (daysUntil === 0) {
    return {
      status: "urgent",
      message: "Due today",
      color: "#f59e0b",
    };
  } else if (daysUntil <= 3) {
    return {
      status: "urgent",
      message: `Due in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
      color: "#f59e0b",
    };
  } else if (daysUntil <= 7) {
    return {
      status: "upcoming",
      message: `Due in ${daysUntil} days`,
      color: "#f59e0b",
    };
  } else {
    return {
      status: "ok",
      message: `Due in ${daysUntil} days`,
      color: "#10b981",
    };
  }
}

// Assignment Card Component with user fetching
function AssignmentCard({ assignment }: { assignment: AssignmentWithStudent }) {
  const router = useRouter();

  // Fetch student data
  const { data: studentData, isLoading: studentLoading } = useGetUserByIdQuery(
    assignment.student.uuid,
    {
      skip: !assignment.student.uuid,
    }
  );

  // Get deadline status
  const deadlineInfo = getDeadlineStatus(assignment.deadline);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return (
          <div className="adviser-documents-badge-pending">
            <Clock className="w-3 h-3" />
            Pending Review
          </div>
        );
      case "APPROVED":
        return (
          <div className="adviser-documents-badge-approved">
            <CheckCircle className="w-3 h-3" />
            Approved
          </div>
        );
      case "REJECTED":
      case "REVISION":
        return (
          <div className="adviser-documents-badge-rejected">
            <XCircle className="w-3 h-3" />
            {status === "REVISION" ? "Needs Revision" : "Rejected"}
          </div>
        );
      default:
        return <div className="adviser-documents-badge-pending">{status}</div>;
    }
  };

  return (
    <div className="adviser-documents-card">
      <div className="adviser-documents-accent-bar" />
      <div className="adviser-documents-card-header">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3
              className="adviser-documents-card-title cursor-pointer mb-3"
              onClick={() =>
                router.push(`/adviser/documents/${assignment.paper.uuid}`)
              }
            >
              {assignment.paper.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="adviser-documents-meta-item">
                <User className="w-4 h-4" style={{ color: "#2563eb" }} />
                {studentLoading
                  ? "Loading..."
                  : studentData?.fullName || assignment.student.fullName}
              </div>
              <div className="adviser-documents-meta-item">
                <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} />
                Assigned: {assignment.assignedDate}
              </div>
              <div className="adviser-documents-meta-item">
                <CheckCircle className="w-4 h-4" style={{ color: "#10b981" }} />
                Deadline: {assignment.deadline}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getStatusBadge(assignment.paper.Status)}
            {/* Deadline Indicator - Only show for papers under review */}
            {(assignment.paper.Status === "ASSIGNED" ||
              assignment.paper.Status === "UNDER_REVIEW" ||
              assignment.paper.Status === "PENDING") && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{
                  backgroundColor:
                    deadlineInfo.status === "overdue"
                      ? "rgba(220, 38, 38, 0.1)"
                      : deadlineInfo.status === "urgent"
                      ? "rgba(245, 158, 11, 0.1)"
                      : "rgba(16, 185, 129, 0.1)",
                  border: `1px solid ${deadlineInfo.color}`,
                  color: deadlineInfo.color,
                }}
              >
                {deadlineInfo.status === "overdue" ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                {deadlineInfo.message}
              </div>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Student Info */}
          <div
            className="adviser-documents-student-info cursor-pointer"
            onClick={() =>
              router.push(`/adviser/documents/${assignment.paper.uuid}`)
            }
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={
                    studentData?.imageUrl ||
                    assignment.student.imageUrl ||
                    "/placeholder.svg"
                  }
                  alt={assignment.student.fullName}
                  className="w-14 h-14 rounded-full object-cover border-4"
                  style={{ borderColor: "#2563eb" }}
                  width={56}
                  height={56}
                  unoptimized
                />
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                  style={{ backgroundColor: "#10b981" }}
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg" style={{ color: "#2563eb" }}>
                  {studentData?.fullName || assignment.student.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {studentData?.email || "Student"}
                </p>
              </div>
            </div>
          </div>

          {/* Thumbnail Preview */}
          {assignment.paper.thumbnailUrl && (
            <div
              className="adviser-documents-thumbnail cursor-pointer"
              onClick={() =>
                router.push(`/adviser/documents/${assignment.paper.uuid}`)
              }
            >
              <Image
                src={assignment.paper.thumbnailUrl}
                alt={assignment.paper.title}
                className="w-full h-48 lg:h-72 object-cover"
                width={800}
                height={600}
                unoptimized
              />
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}

export default function MentorProposalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const { data: adviserProfile } = useGetUserProfileQuery();

  // Fetch assignments with pagination
  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useGetAssignmentByAdviserWithPaginationQuery({
    page,
    size,
    sortBy: "assignedDate",
    direction: "desc",
  });

  const assignments = (assignmentsData?.data?.content ||
    []) as AssignmentWithStudent[];
  const totalPages = assignmentsData?.data?.totalPages || 0;
  const totalElements = assignmentsData?.data?.totalElements || 0;

  // Filter and sort assignments based on search (including deadline status)
  const filteredAssignments = useMemo(() => {
    const filtered = assignments.filter((assignment: AssignmentWithStudent) => {
      const searchLower = searchTerm.toLowerCase();
      const deadlineInfo = getDeadlineStatus(assignment.deadline);

      return (
        assignment.paper.title.toLowerCase().includes(searchLower) ||
        assignment.student.fullName.toLowerCase().includes(searchLower) ||
        deadlineInfo.message.toLowerCase().includes(searchLower) ||
        deadlineInfo.status.toLowerCase().includes(searchLower) ||
        assignment.deadline.toLowerCase().includes(searchLower)
      );
    });

    // Sort by assigned date - latest first
    return filtered.sort((a, b) => {
      const dateA = new Date(a.assignedDate).getTime();
      const dateB = new Date(b.assignedDate).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [assignments, searchTerm]);

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user.fullName || "Adviser Name"}
      userAvatar={adviserProfile?.user.imageUrl || undefined}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="adviser-documents-header">
          <div className="adviser-documents-accent-bar" />
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Student Documents
          </h1>
          <p className="text-muted-foreground text-lg">
            Review and provide feedback on student documents
          </p>
        </div>

        {/* Modern Search Bar */}
        <Card className="dashboard-card border-0">
          <CardContent className="p-6">
            <div className="relative group">
              {/* Search icon with animated background */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{
                      background: "linear-gradient(to right, #2563eb, #f59e0b)",
                    }}
                  ></div>
                  <div
                    className="relative p-2 rounded-full shadow-lg"
                    style={{
                      background: "linear-gradient(to right, #2563eb, #f59e0b)",
                    }}
                  >
                    <Search className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Search input */}
              <Input
                placeholder="Search by document title, student name, or deadline status..."
                className="pl-16 pr-12 py-7 text-base bg-card text-card-foreground border-border rounded-xl focus:shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Clear button (shows when there's text) */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200"
                  style={{
                    background: "#f59e0b",
                    color: "white",
                  }}
                  aria-label="Clear search"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search suggestions/info */}
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#2563eb" }} />
              <span>
                Filter by title, student name, or track assignments approaching
                deadlines
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignmentsLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <FeedbackCardPlaceholder key={index} isLast={index === 3} />
              ))}
            </div>
          ) : assignmentsError ? (
            <div className="adviser-documents-empty-state">
              <XCircle
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "#ef4444" }}
              />
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "#dc2626" }}
              >
                Failed to load assignments
              </h3>
              <p className="text-muted-foreground">
                Please try refreshing the page or contact support if the issue
                persists.
              </p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="adviser-documents-empty-state">
              {searchTerm ? (
                <>
                  <Search
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: "#2563eb" }}
                  />
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#2563eb" }}
                  >
                    No documents match your search
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </>
              ) : (
                <>
                  <Clock
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: "#f59e0b" }}
                  />
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#f59e0b" }}
                  >
                    No documents assigned yet
                  </h3>
                  <p className="text-muted-foreground">
                    Documents will appear here once they are assigned to you
                  </p>
                </>
              )}
            </div>
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
          <div className="adviser-documents-card p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-semibold" style={{ color: "#2563eb" }}>
                Showing {page * size + 1} to{" "}
                {Math.min((page + 1) * size, totalElements)} of {totalElements}{" "}
                assignments
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="adviser-documents-pagination-btn"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`adviser-documents-pagination-btn w-10 h-10 p-0 ${
                        page === i ? "adviser-documents-pagination-active" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page === totalPages - 1}
                  className="adviser-documents-pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
