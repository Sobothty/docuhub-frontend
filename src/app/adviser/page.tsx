"use client";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAssignmentByAdviserQuery } from "@/feature/adviserAssignment/AdviserAssignmentSlice";
import { AssignmentItem } from "@/feature/adviserAssignment/adviserAssignmentType";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import Image from "next/image";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Users,
  Eye,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Define types based on actual API response
interface Student {
  uuid: string;
  fullName: string;
  imageUrl?: string | null;
}

interface Paper {
  uuid: string;
  title: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
  Status: string; // Note: Capital 'S' as per API response
}

interface StudentAssignment {
  student: Student;
  papers: Paper[];
  statuses: string[];
  deadlines: string[];
}

// Helper function to format date for Cambodia (dd/MM/yyyy format)
const formatCambodiaDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to check if deadline is approaching or passed
const getDeadlineStatus = (deadline: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: "overdue", days: Math.abs(diffDays), color: "red" };
  } else if (diffDays === 0) {
    return { status: "today", days: 0, color: "orange" };
  } else if (diffDays <= 3) {
    return { status: "urgent", days: diffDays, color: "orange" };
  } else if (diffDays <= 7) {
    return { status: "upcoming", days: diffDays, color: "blue" };
  } else {
    return { status: "normal", days: diffDays, color: "green" };
  }
};

// Helper function to get deadline badge
const getDeadlineBadge = (deadline: string) => {
  const { status, days } = getDeadlineStatus(deadline);

  if (status === "overdue") {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
        <Calendar className="h-3 w-3 mr-1" />
        Overdue ({days} days ago)
      </Badge>
    );
  } else if (status === "today") {
    return (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
        <Calendar className="h-3 w-3 mr-1" />
        Due Today
      </Badge>
    );
  } else if (status === "urgent") {
    return (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
        <Clock className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
  } else if (status === "upcoming") {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
        <Calendar className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
        <Calendar className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
  }
};

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "REVISION":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Revision
        </Badge>
      );
    case "ADMIN_REJECTED":
    case "REJECTED":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case "ASSIGNED":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          Assigned
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
  }
};

export default function MentorOverviewPage() {
  // ✅ Fetch adviser profile
  const { data: adviserProfile } = useGetUserProfileQuery();

  // ✅ Fetch adviser assignments
  const { data, error, isLoading } = useGetAssignmentByAdviserQuery();

  // ✅ Search and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Handle download with notification
  const handleDownload = (paperTitle: string, fileUrl?: string) => {
    if (!fileUrl) {
      showToast("Paper file is not available", "error");
      return;
    }

    try {
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.download = `${paperTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success notification
      showToast(`Downloading "${paperTitle}"`, "success");
    } catch {
      showToast("Failed to download the paper. Please try again.", "error");
    }
  };

  // ✅ Extract and transform assignment data
  const rawContent = data?.data?.content || [];

  console.log("Raw API Response:", rawContent);

  // Check if API returns grouped data (StudentAssignment[]) or flat data (AssignmentItem[])
  let studentAssignments: StudentAssignment[];

  if (rawContent.length > 0 && "papers" in rawContent[0]) {
    // Already grouped by student
    studentAssignments = rawContent as unknown as StudentAssignment[];
  } else {
    // Flat structure - need to group by student
    const studentMap = new Map<string, StudentAssignment>();

    (rawContent as AssignmentItem[]).forEach((item: AssignmentItem) => {
      const studentUuid = item.student.uuid;
      if (!studentMap.has(studentUuid)) {
        studentMap.set(studentUuid, {
          student: item.student,
          papers: [],
          statuses: [],
          deadlines: [],
        });
      }

      const existing = studentMap.get(studentUuid)!;
      existing.papers.push(item.paper);
      existing.statuses.push(item.status);
      existing.deadlines.push(item.deadline);
    });

    studentAssignments = Array.from(studentMap.values());
  }

  console.log("Processed Student Assignments:", studentAssignments);

  // ✅ Filter students by name
  const filteredStudents = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return studentAssignments;

    return studentAssignments.filter((assignment) => {
      const studentName = (assignment.student.fullName ?? "").toLowerCase();
      return studentName.includes(q);
    });
  }, [studentAssignments, searchQuery]);

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Calculate totals (from all data, not filtered)
  const totalAssignedStudents = studentAssignments.length;
  const totalAssignedPapers = studentAssignments.reduce(
    (sum, assignment) => sum + assignment.papers.length,
    0
  );

  // Count statuses across all assignments
  let approvedCount = 0;
  let revisionCount = 0;

  studentAssignments.forEach((assignment) => {
    assignment.papers.forEach((paper) => {
      const status = paper.Status;
      if (status === "APPROVED") approvedCount++;
      else if (status === "REVISION") revisionCount++;
    });
  });

  // Handle loading and error states
  if (isLoading)
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user?.fullName || "Adviser"}
        userAvatar={adviserProfile?.user?.imageUrl || undefined}
      >
        <div className="flex justify-center items-center h-screen text-lg font-semibold">
          Loading...
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user?.fullName || "Adviser"}
        userAvatar={adviserProfile?.user?.imageUrl || undefined}
      >
        <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
          Failed to load assignments
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user?.fullName || "Adviser"}
      userAvatar={adviserProfile?.user?.imageUrl || undefined}
    >
      <div className="space-y-6">
        {/* 🧭 Header Section */}
        <div className="dashboard-header rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Mentor Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Overview of students assigned for your review
          </p>
        </div>

        {/* 📊 Overview Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Assigned Students
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {totalAssignedStudents}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Students under your mentorship
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Total Papers
              </CardTitle>
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#f59e0b" }}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "#f59e0b" }}>
                {totalAssignedPapers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Papers assigned to review
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Approved Papers
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {approvedCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully reviewed
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Needs Revision
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {revisionCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires updates
              </p>
            </CardContent>
          </Card>
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
                      background:
                        "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
                    }}
                  ></div>
                  <div
                    className="relative p-2 rounded-full shadow-lg"
                    style={{
                      background:
                        "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
                    }}
                  >
                    <Search className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Search input */}
              <Input
                placeholder="Search students by name..."
                className="pl-16 pr-4 py-7 text-base bg-card text-card-foreground border-border rounded-xl focus:shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Clear button (shows when there's text) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-accent hover:bg-accent/80 text-accent-foreground transition-all duration-200"
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
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: "var(--color-secondary)" }}
              />
              <span>Search for students by their name</span>
            </div>
          </CardContent>
        </Card>

        {/* 👨‍🎓 Student Overview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">
              Assigned Students ({filteredStudents.length}
              {searchQuery && ` of ${studentAssignments.length}`})
            </h2>
          </div>

          {filteredStudents.length === 0 ? (
            <Card className="dashboard-card border-0">
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg font-semibold mb-2">
                  {searchQuery
                    ? "No students found"
                    : "No assigned students yet"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Students will appear here once they are assigned to you"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-6">
                {currentStudents.map((assignment) => {
                  const { student, papers } = assignment;

                  return (
                    <Card
                      key={student.uuid}
                      className="dashboard-card overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                      {/* Student Header */}
                      <CardHeader className=" border-b border-gray-50 dark:border-gray-800/30">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Image
                              src={student.imageUrl || "/placeholder.svg"}
                              alt={student.fullName}
                              width={64}
                              height={64}
                              className="rounded-full object-cover w-16 h-16 border border-gray-50 dark:border-gray-700/30 shadow-sm"
                              unoptimized
                            />
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                              {papers.length}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-card-foreground">
                              {student.fullName}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                              {papers.length} paper
                              {papers.length > 1 ? "s" : ""} assigned
                            </p>
                          </div>
                          <Link href={`/students/${student.uuid}`}>
                            <Button
                              size="sm"
                              className="gap-2 text-white border-0"
                              style={{
                                backgroundColor: "var(--color-secondary)",
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>

                      {/* Papers List */}
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {papers.map((paper, index) => {
                            const deadline = assignment.deadlines[index];
                            return (
                              <div
                                key={paper.uuid}
                                className="flex items-start gap-4 p-4 rounded-lg border border-gray-50 dark:border-gray-800/30 bg-card hover:bg-accent/50 transition-all duration-300 ease-in-out"
                              >
                                {/* Paper Thumbnail */}
                                <div className="flex-shrink-0">
                                  <Image
                                    src={
                                      paper.thumbnailUrl || "/placeholder.svg"
                                    }
                                    alt={paper.title}
                                    width={80}
                                    height={100}
                                    className="rounded-md object-cover border border-gray-50 dark:border-gray-700/30 shadow-sm"
                                    unoptimized
                                  />
                                </div>

                                {/* Paper Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="font-semibold text-lg text-card-foreground line-clamp-2">
                                      {paper.title}
                                    </h4>
                                    {getStatusBadge(paper.Status)}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
                                    <div className="flex items-center gap-1.5">
                                      <FileText className="h-4 w-4" />
                                      <span className="font-medium">
                                        Paper #{index + 1}
                                      </span>
                                    </div>

                                    {/* Deadline Display */}
                                    {deadline && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">
                                          •
                                        </span>
                                        {getDeadlineBadge(deadline)}
                                        <span className="text-xs text-muted-foreground">
                                          ({formatCambodiaDate(deadline)})
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 mt-4">
                                    <Link href={`/papers/${paper.uuid}`}>
                                      <Button
                                        size="sm"
                                        className="gap-2 text-white border-0"
                                        style={{
                                          backgroundColor:
                                            "var(--color-secondary)",
                                        }}
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                        View Paper
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleDownload(
                                          paper.title,
                                          paper.fileUrl
                                        )
                                      }
                                      className="gap-2"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                      Download PDF
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Card className="dashboard-card border-0 mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredStudents.length)} of{" "}
                        {filteredStudents.length} students
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={
                                currentPage === page
                                  ? "text-white border-0"
                                  : ""
                              }
                              style={
                                currentPage === page
                                  ? {
                                      backgroundColor: "var(--color-secondary)",
                                    }
                                  : {}
                              }
                            >
                              {page}
                            </Button>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="gap-1"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
          style={{
            backgroundColor:
              toast.type === "success"
                ? "var(--color-secondary)"
                : "rgb(239, 68, 68)",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-white" />
          ) : (
            <XCircle className="h-5 w-5 text-white" />
          )}
          <p className="text-white font-medium text-sm">{toast.message}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
