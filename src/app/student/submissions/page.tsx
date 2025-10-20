"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
import Link from "next/link";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Upload,
  MoreHorizontal,
  Eye,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import {
  useGetPapersByAuthorQuery,
  useGetAllAssignmentsQuery,
} from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useState, useMemo } from "react";
import { Paper } from "@/types/paperType";
import { Assignment } from "@/feature/paperSlice/papers";

interface PaperData {
  assignment: Assignment | undefined;
  adviserUuid: string | null;
}

export default function StudentSubmissionsPage() {
  const { data: userProfile } = useGetUserProfileQuery();
  const { data: authorPapers, isLoading: papersLoading } =
    useGetPapersByAuthorQuery({});
  const { data: assignmentData } = useGetAllAssignmentsQuery();

  const papers = useMemo(
    () => authorPapers?.papers.content || [],
    [authorPapers?.papers.content]
  );

  const assignments = useMemo(() => assignmentData || [], [assignmentData]);

  const [searchQuery, setSearchQuery] = useState("");

  // Create a mapping of paper UUID to assignment data
  const paperDataMap = useMemo(() => {
    return papers.reduce((acc, paper) => {
      const assignment = assignments.find(
        (assign) => assign.paperUuid === paper.uuid
      );
      acc[paper.uuid] = {
        assignment,
        adviserUuid: assignment?.adviserUuid || null,
      };
      return acc;
    }, {} as Record<string, PaperData>);
  }, [papers, assignments]);

  // Filter papers based on search query
  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstractText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.categoryNames
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="capitalize">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="default" className="capitalize bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
      case "ADMIN_REJECTED":
        return (
          <Badge variant="destructive" className="capitalize">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="capitalize">
            {status}
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout
      userRole="student"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Submissions
            </h1>
            <p className="text-muted-foreground">
              Manage your paper submissions and track their progress
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload New Paper</DialogTitle>
                <DialogDescription>
                  Submit your paper for mentor review and approval
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Paper Title</Label>
                  <Input id="title" placeholder="Enter your paper title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Computer Science, Biology, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    placeholder="Brief summary of your paper"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Paper File</Label>
                  <Input id="file" type="file" accept=".pdf,.doc,.docx" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Save as Draft</Button>
                <Button>Submit for Review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your submissions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              Track the status and progress of your submitted papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {papersLoading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Loading submissions...</p>
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto max-w-md space-y-2">
                  <h3 className="text-lg font-semibold">
                    {searchQuery ? "No results found" : "No submissions yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try adjusting your search query."
                      : "Upload your first paper to get started."}
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPapers.map((paper) => {
                    const paperData = paperDataMap[paper.uuid];
                    const assignment = paperData?.assignment;
                    const adviserUuid = paperData?.adviserUuid;

                    return (
                      <SubmissionRow
                        key={paper.uuid}
                        paper={paper}
                        assignment={assignment}
                        adviserUuid={adviserUuid}
                        getStatusBadge={getStatusBadge}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Separate component for each row to use hooks properly
function SubmissionRow({
  paper,
  assignment,
  adviserUuid,
  getStatusBadge,
}: {
  paper: Paper;
  assignment: Assignment | undefined;
  adviserUuid: string | null;
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  const { data: adviserData } = useGetUserByIdQuery(adviserUuid || "", {
    skip: !adviserUuid,
  });

  const handleDownload = () => {
    // Create a download link for the paper file
    if (paper.fileUrl) {
      const a = document.createElement("a");
      a.href = paper.fileUrl;
      a.download = `${paper.title
        .replace(/[^a-z0-9\-\s]/gi, "")
        .replace(/\s+/g, "-")}.pdf`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="max-w-xs">
          <div className="font-medium truncate p-2">
            <Link
              href={`/student/submissions/${paper.uuid}`}
              className="hover:underline"
            >
              {paper.title}
            </Link>
          </div>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(paper.status)}</TableCell>
      <TableCell>
        {Array.isArray(paper.categoryNames)
          ? paper.categoryNames.join(", ")
          : paper.categoryNames}
      </TableCell>
      <TableCell>
        {adviserData
          ? adviserData.fullName
          : assignment
          ? "Assigned"
          : "Not assigned"}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {paper.submittedAt || paper.createdAt}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/student/submissions/${paper.uuid}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            {paper.status === "REJECTED" && (
              <>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit & Resubmit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
