"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetAssignmentByAdviserQuery } from "@/feature/adviserAssignment/AdviserAssignmentSlice";
import Image from "next/image";
import { TableLoadingSkeleton } from "@/components/card/TableLoadingForStudentAssigntments";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

// Define types
interface Student {
  uuid: string;
  fullName: string;
  imageUrl?: string | null;
}

interface Paper {
  uuid: string;
  title: string;
  status: string;
  deadline: string;
}

interface StudentTableRow {
  id: string;
  studentUuid: string;
  studentName: string;
  studentImage: string | null | undefined;
  paperUuid: string;
  paperTitle: string;
  status: string;
  deadline: string;
  papersCount: number;
}

export default function MentorStudentsPage() {
  const router = useRouter();

  // ✅ Adviser info
  const { data: adviserProfile } = useGetUserProfileQuery();

  // ✅ Fetch adviser's assigned students
  const { data, error, isLoading } = useGetAssignmentByAdviserQuery();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  // Transform data for table
  const tableData = useMemo(() => {
    const assignments = data?.data?.content || [];
    const rows: StudentTableRow[] = [];

    // Group by student to get paper count
    const studentPaperCount = new Map<string, number>();
    assignments.forEach((assignment) => {
      const count = studentPaperCount.get(assignment.student.uuid) || 0;
      studentPaperCount.set(assignment.student.uuid, count + 1);
    });

    // Create table rows
    assignments.forEach((assignment) => {
      rows.push({
        id: `${assignment.student.uuid}-${assignment.paper.uuid}`,
        studentUuid: assignment.student.uuid,
        studentName: assignment.student.fullName,
        studentImage: assignment.student.imageUrl,
        paperUuid: assignment.paper.uuid,
        paperTitle: assignment.paper.title || "Untitled Paper",
        status: assignment.status || "ASSIGNED",
        deadline: assignment.deadline,
        papersCount: studentPaperCount.get(assignment.student.uuid) || 0,
      });
    });

    // Sort by deadline - latest first (most recent data first)
    rows.sort((a, b) => {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateB - dateA; // Descending order (latest deadline first)
    });

    return rows;
  }, [data]);

  // Helper functions
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysToDeadline = (deadlineString: string) => {
    if (!deadlineString) return null;
    const deadline = new Date(deadlineString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (daysRemaining: number | null) => {
    if (daysRemaining === null) return "text-muted-foreground";
    if (daysRemaining < 0) return "text-red-600 dark:text-red-400"; // Overdue
    if (daysRemaining === 0) return "text-red-600 dark:text-red-400"; // Today
    if (daysRemaining <= 3) return "text-orange-600 dark:text-orange-400"; // Urgent
    if (daysRemaining <= 7) return "text-yellow-600 dark:text-yellow-500"; // Soon
    return "text-green-600 dark:text-green-400"; // On track
  };

  const getDeadlineBadge = (daysRemaining: number | null) => {
    if (daysRemaining === null) return null;
    if (daysRemaining < 0) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          Overdue
        </Badge>
      );
    }
    if (daysRemaining === 0) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          Due Today
        </Badge>
      );
    }
    if (daysRemaining <= 3) {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
          Urgent ({daysRemaining}d)
        </Badge>
      );
    }
    if (daysRemaining <= 7) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800">
          {daysRemaining} days
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
        {daysRemaining} days
      </Badge>
    );
  };

  // Define columns
  const columnHelper = createColumnHelper<StudentTableRow>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("studentName", {
        header: "Student",
        cell: (info) => (
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              router.push(`/students/${info.row.original.studentUuid}`)
            }
          >
            <Image
              src={info.row.original.studentImage || "/placeholder.svg"}
              alt={info.getValue()}
              className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: "var(--color-secondary)" }}
              unoptimized
              width={40}
              height={40}
            />
            <div>
              <div className="font-semibold text-foreground">
                {info.getValue()}
              </div>
              <div className="text-xs text-muted-foreground">
                {info.row.original.papersCount}{" "}
                {info.row.original.papersCount === 1 ? "paper" : "papers"}
              </div>
            </div>
          </div>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("paperTitle", {
        header: "Paper Title",
        cell: (info) => (
          <div className="max-w-xs">
            <div className="font-medium text-foreground truncate">
              {info.getValue()}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      columnHelper.accessor("deadline", {
        header: "Deadline",
        cell: (info) => {
          const daysRemaining = getDaysToDeadline(info.getValue());
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(info.getValue())}
              </div>
              {getDeadlineBadge(daysRemaining)}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/adviser/documents/${info.row.original.paperUuid}`
                    )
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Paper
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/students/${info.row.original.studentUuid}`)
                  }
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStudentId(info.row.original.studentUuid);
                    setIsMessageOpen(true);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }),
    ],
    [router]
  );

  // Create table instance
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Get unique students count
  const uniqueStudents = useMemo(() => {
    const studentSet = new Set(tableData.map((row) => row.studentUuid));
    return studentSet.size;
  }, [tableData]);

  // Get statistics
  const stats = useMemo(() => {
    const approved = tableData.filter(
      (row) => row.status === "APPROVED"
    ).length;
    const pending = tableData.filter((row) => row.status === "ASSIGNED").length;
    const revision = tableData.filter(
      (row) => row.status === "REVISION"
    ).length;

    return { approved, pending, revision };
  }, [tableData]);

  const sendMessage = () => {
    if (!selectedStudentId) return;
    // Here you can send message via API call later
    setIsMessageOpen(false);
    setMessageText("");
  };

  if (error)
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user?.fullName || "Adviser"}
        userAvatar={adviserProfile?.user?.imageUrl || "/placeholder.svg"}
      >
        <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
          Failed to load student assignments.
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user?.fullName || "Adviser"}
      userAvatar={adviserProfile?.user?.imageUrl || "/placeholder.svg"}
    >
      <div className="space-y-6 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="dashboard-header rounded-2xl p-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Assigned Students
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and review papers from your assigned students
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="adviser-students-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: "#2563eb" }}
                >
                  {uniqueStudents}
                </div>
                <CardTitle className="adviser-students-stat-label">
                  Students
                </CardTitle>
              </div>
              <div className="adviser-students-stat-icon-bg-blue">
                <Users className="h-7 w-7" style={{ color: "#2563eb" }} />
              </div>
            </CardHeader>
          </Card>

          <Card className="adviser-students-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: "#f59e0b" }}
                >
                  {tableData.length}
                </div>
                <CardTitle className="adviser-students-stat-label">
                  Total Papers
                </CardTitle>
              </div>
              <div className="adviser-students-stat-icon-bg-gray">
                <FileText className="adviser-students-stat-icon-gray" />
              </div>
            </CardHeader>
          </Card>

          <Card className="adviser-students-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: "#10b981" }}
                >
                  {stats.approved}
                </div>
                <CardTitle className="adviser-students-stat-label">
                  Approved
                </CardTitle>
              </div>
              <div className="adviser-students-stat-icon-bg-green">
                <CheckCircle className="h-7 w-7" style={{ color: "#10b981" }} />
              </div>
            </CardHeader>
          </Card>

          <Card className="adviser-students-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: "#f97316" }}
                >
                  {stats.revision}
                </div>
                <CardTitle className="adviser-students-stat-label">
                  Needs Review
                </CardTitle>
              </div>
              <div className="adviser-students-stat-icon-bg-orange">
                <AlertCircle className="h-7 w-7" style={{ color: "#f97316" }} />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Table Card */}
        <Card className="dashboard-card border-0 overflow-hidden">
          <div
            className="h-1"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Student Papers</CardTitle>
                <CardDescription className="text-base mt-1">
                  Review progress and manage submissions
                </CardDescription>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student or paper..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto lg:overflow-x-visible -mx-4 sm:mx-0">
              <div className="min-w-[800px] lg:min-w-0 px-4 sm:px-0">
                {isLoading ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Paper Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableLoadingSkeleton rows={10} />
                    </TableBody>
                  </Table>
                ) : table.getRowModel().rows.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}
                    >
                      <Users
                        className="h-10 w-10"
                        style={{ color: "var(--color-secondary)" }}
                      />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                      {searchQuery
                        ? "No results found"
                        : "No assigned students"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search"
                        : "Students will appear here once assigned"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 mb-2 border-b">
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-muted-foreground">
                          ID
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Name
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Paper Title
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Deadline & Days Left
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Status
                        </span>
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Action
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {table.getRowModel().rows.map((row, index) => (
                        <div
                          key={row.id}
                          className="group bg-background rounded-lg border border-gray-50 dark:border-gray-900 p-4 hover:shadow-xl hover:scale-[1.01] hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer relative overflow-hidden hover:border-l-4 hover:border-l-blue-500"
                          style={{
                            backgroundColor:
                              index === 0
                                ? "var(--color-secondary)"
                                : undefined,
                          }}
                        >
                          {/* Hover background overlay */}
                          {index !== 0 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          )}
                          <div className="grid grid-cols-12 gap-4 items-center relative z-10">
                            {/* ID Column */}
                            <div className="col-span-1">
                              <span
                                className={`text-sm font-medium transition-all duration-200 ${
                                  index === 0
                                    ? "text-white"
                                    : "text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:font-bold"
                                }`}
                              >
                                #
                                {index +
                                  1 +
                                  table.getState().pagination.pageIndex *
                                    table.getState().pagination.pageSize}
                              </span>
                            </div>

                            {/* Student Column */}
                            <div className="col-span-3">
                              <div
                                className="flex items-center gap-3 hover:opacity-80 transition-all duration-200"
                                onClick={() =>
                                  router.push(
                                    `/students/${row.original.studentUuid}`
                                  )
                                }
                              >
                                <Image
                                  src={
                                    row.original.studentImage ||
                                    "/placeholder.svg"
                                  }
                                  alt={row.original.studentName}
                                  className={`w-10 h-10 rounded-full object-cover border-2 transition-all duration-200 ${
                                    index !== 0
                                      ? "group-hover:scale-110 group-hover:border-blue-400"
                                      : ""
                                  }`}
                                  style={{
                                    borderColor:
                                      index === 0
                                        ? "white"
                                        : "var(--color-secondary)",
                                  }}
                                  unoptimized
                                  width={40}
                                  height={40}
                                />
                                <div>
                                  <div
                                    className={`font-semibold transition-colors duration-200 ${
                                      index === 0
                                        ? "text-white"
                                        : "text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    }`}
                                  >
                                    {row.original.studentName}
                                  </div>
                                  <div
                                    className={`text-xs ${
                                      index === 0
                                        ? "text-white/80"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {row.original.papersCount}{" "}
                                    {row.original.papersCount === 1
                                      ? "paper"
                                      : "papers"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Paper Title Column */}
                            <div className="col-span-3">
                              <div
                                className={`font-medium truncate transition-colors duration-200 ${
                                  index === 0
                                    ? "text-white"
                                    : "text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                }`}
                              >
                                {row.original.paperTitle}
                              </div>
                            </div>

                            {/* Deadline Column */}
                            <div className="col-span-2">
                              <div className="flex flex-col gap-1">
                                <div
                                  className={`flex items-center gap-2 text-sm ${
                                    index === 0
                                      ? "text-white/90"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(row.original.deadline)}
                                </div>
                                {index === 0 ? (
                                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm w-fit">
                                    {(() => {
                                      const days = getDaysToDeadline(
                                        row.original.deadline
                                      );
                                      if (days === null) return null;
                                      if (days < 0) return "Overdue";
                                      if (days === 0) return "Due Today";
                                      if (days <= 3) return `Urgent (${days}d)`;
                                      return `${days} days`;
                                    })()}
                                  </Badge>
                                ) : (
                                  getDeadlineBadge(
                                    getDaysToDeadline(row.original.deadline)
                                  )
                                )}
                              </div>
                            </div>

                            {/* Status Column */}
                            <div className="col-span-2">
                              {index === 0 ? (
                                <Badge className="bg-white text-blue-600 border-0">
                                  {row.original.status === "APPROVED" && (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </>
                                  )}
                                  {row.original.status === "REVISION" && (
                                    <>
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Revision
                                    </>
                                  )}
                                  {row.original.status === "REJECTED" && (
                                    <>
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejected
                                    </>
                                  )}
                                  {row.original.status === "ASSIGNED" && (
                                    <>
                                      <Clock className="h-3 w-3 mr-1" />
                                      Assigned
                                    </>
                                  )}
                                </Badge>
                              ) : (
                                getStatusBadge(row.original.status)
                              )}
                            </div>

                            {/* Actions Column */}
                            <div className="col-span-1 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 ${
                                      index === 0
                                        ? "text-white hover:bg-white/20"
                                        : ""
                                    }`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/adviser/documents/${row.original.paperUuid}`
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Paper
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/students/${row.original.studentUuid}`
                                      )
                                    }
                                  >
                                    <Users className="h-4 w-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedStudentId(
                                        row.original.studentUuid
                                      );
                                      setIsMessageOpen(true);
                                    }}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {table.getPageCount() > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="text-sm text-muted-foreground">
                          Showing{" "}
                          {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}{" "}
                          to{" "}
                          {Math.min(
                            (table.getState().pagination.pageIndex + 1) *
                              table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                          )}{" "}
                          of {table.getFilteredRowModel().rows.length} entries
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>

                          <div className="flex gap-1">
                            {Array.from(
                              { length: table.getPageCount() },
                              (_, i) => i + 1
                            ).map((page) => (
                              <Button
                                key={page}
                                variant={
                                  table.getState().pagination.pageIndex + 1 ===
                                  page
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => table.setPageIndex(page - 1)}
                                className={
                                  table.getState().pagination.pageIndex + 1 ===
                                  page
                                    ? "text-white border-0"
                                    : ""
                                }
                                style={
                                  table.getState().pagination.pageIndex + 1 ===
                                  page
                                    ? {
                                        backgroundColor:
                                          "var(--color-secondary)",
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
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="gap-1"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Dialog */}
        {isMessageOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
              className="bg-background border-2 rounded-2xl w-full max-w-lg p-6 shadow-2xl mx-4"
              style={{ borderColor: "var(--color-secondary)" }}
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold gradient-text mb-2">
                  Send Message
                </h2>
                <p className="text-sm text-muted-foreground">
                  To:{" "}
                  <span className="font-medium text-foreground">
                    {
                      tableData.find(
                        (row) => row.studentUuid === selectedStudentId
                      )?.studentName
                    }
                  </span>
                </p>
              </div>
              <div>
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="rounded-lg h-12"
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMessageOpen(false);
                    setMessageText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="text-white border-0"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
