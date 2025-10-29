"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
  Sparkles,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import {
  useGetPapersByAuthorQuery,
  useGetAllAssignmentsQuery,
  useDeletePaperMutation,
  useUpdatePaperMutation,
  usePublishedPaperMutation,
} from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useState, useMemo } from "react";
import { Paper } from "@/types/paperType";
import { Assignment } from "@/feature/paperSlice/papers";
import { useGetCategoryNamesQuery } from "@/feature/categoriesSlice/categoriesSlices";
import {
  useCreateMediaMutation,
  useDeleteMediaMutation,
} from "@/feature/media/mediaSlice";
import Image from "next/image";
import { toast } from "sonner";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Filter and sort papers (latest first)
  const filteredAndSortedPapers = useMemo(() => {
    const filtered = papers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstractText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.categoryNames
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    // Sort by creation date - latest first
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [papers, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredAndSortedPapers.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="capitalize bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
      case "ADMIN_REJECTED":
        return (
          <Badge className="capitalize bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700 shadow-sm">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 shadow-sm">
            {status}
          </Badge>
        );
    }
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editPaper, setEditPaper] = useState<Paper | null>(null);

  // For edit form fields
  const [editTitle, setEditTitle] = useState("");
  const [editAbstract, setEditAbstract] = useState("");
  const [editFileUrl, setEditFileUrl] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const { data: categoryNames = [] } = useGetCategoryNamesQuery();
  const [updatePaper, { isLoading: isUpdating }] = useUpdatePaperMutation();
  const [createMedia, { isLoading: isUploading }] = useCreateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  // Open edit dialog and prefill fields
  const handleEditClick = (paper: Paper) => {
    setEditPaper(paper);
    setEditTitle(paper.title);
    setEditAbstract(paper.abstractText ?? "");
    setEditFileUrl(paper.fileUrl ?? "");
    setEditThumbnailUrl(paper.thumbnailUrl ?? "");
    setEditCategories(paper.categoryNames ?? []);
    setEditOpen(true);
  };

  // Generate preview URL for new file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  // Handle edit form submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPaper) return;
    try {
      let updatedFileUrl = editFileUrl;
      if (newFile) {
        const formData = new FormData();
        formData.append("file", newFile);
        const res = await createMedia(formData).unwrap();
        updatedFileUrl = res.data.uri || editFileUrl;
        // Clean up preview URL
        if (filePreviewUrl) {
          URL.revokeObjectURL(filePreviewUrl);
          setFilePreviewUrl(null);
        }
      }
      await updatePaper({
        uuid: editPaper.uuid,
        paperData: {
          title: editTitle,
          abstractText: editAbstract,
          fileUrl: updatedFileUrl,
          thumbnailUrl: editThumbnailUrl,
          categoryNames: editCategories,
        },
      }).unwrap();
      setEditOpen(false);
      setNewFile(null);
      toast.success("Paper updated successfully");
    } catch (err) {
      // Optionally handle error
      console.log("Update failed", err);
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
        <div className="dashboard-header rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                My Submissions
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your paper submissions and track their progress
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent className="max-w-2xl dashboard-card border-0">
                <DialogHeader>
                  <DialogTitle className="text-2xl gradient-text">
                    Upload New Paper
                  </DialogTitle>
                  <DialogDescription className="text-base">
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
        </div>

        {/* Edit Paper Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl dashboard-card border-0">
            <DialogHeader>
              <DialogTitle className="text-2xl gradient-text">
                Edit Paper
              </DialogTitle>
              <DialogDescription className="text-base">
                Update your paper details below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              {/* Abstract */}
              <div className="space-y-2">
                <Label htmlFor="edit-abstract">Abstract</Label>
                <Textarea
                  id="edit-abstract"
                  value={editAbstract}
                  onChange={(e) => setEditAbstract(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Thumbnail Upload + Preview */}
              <div className="space-y-2">
                <Label htmlFor="edit-thumbnail">Thumbnail</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="edit-thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await createMedia(formData).unwrap();
                        setEditThumbnailUrl(res.data.uri); // update to server URL
                      }
                    }}
                  />
                  {editThumbnailUrl && (
                    <div className="relative w-40 h-20">
                      <Image
                        src={editThumbnailUrl}
                        alt="thumbnail preview"
                        width={500}
                        height={500}
                        unoptimized
                        className="w-full h-full object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteMedia(editThumbnailUrl);
                          setEditThumbnailUrl("");
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload (PDF) */}
              <div className="space-y-2">
                <Label htmlFor="edit-file">Paper File</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="edit-file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <span className="text-xs text-muted-foreground">
                      Uploading...
                    </span>
                  )}
                </div>

                {/* File Info + Delete Button */}
                <div className="mt-2 flex items-center justify-between text-sm border rounded-md px-3 py-2 bg-muted/50">
                  {filePreviewUrl || editFileUrl ? (
                    <>
                      <span className="truncate w-[75%]">
                        {newFile?.name || editFileUrl.split("/").pop()}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={filePreviewUrl || editFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Preview
                        </a>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteMedia(editFileUrl);
                            setEditFileUrl("");
                            setNewFile(null);
                            setFilePreviewUrl(null);
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No file selected
                    </span>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="edit-categories">Category</Label>
                <select
                  id="edit-categories"
                  className="w-full border rounded px-2 py-1"
                  value={editCategories[0] || ""}
                  onChange={(e) => setEditCategories([e.target.value])}
                >
                  <option value="">Select category</option>
                  {categoryNames
                    .filter((cat) => cat !== "all")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              {/* Footer Buttons */}
              <DialogFooter>
                <Button type="submit" disabled={isUpdating || isUploading}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditOpen(false);
                    setNewFile(null);
                    setFilePreviewUrl(null);
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
                placeholder="Search your submissions by title, abstract, or category..."
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
              <span>
                Filter by title, abstract, category, or submission date
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Grid */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold gradient-text">
                All Submissions
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Track the status and progress of your submitted papers
              </p>
            </div>
            <Badge
              className="text-sm font-semibold px-4 py-2"
              style={{
                background: "var(--color-secondary)",
                color: "white",
              }}
            >
              {filteredAndSortedPapers.length} Papers
            </Badge>
          </div>

          {/* Loading State */}
          {papersLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SubmissionCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredAndSortedPapers.length === 0 ? (
            // Empty State
            <Card className="dashboard-card border-0">
              <CardContent className="py-16 text-center">
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <div className="mx-auto max-w-md space-y-2">
                  <h3 className="text-xl font-semibold">
                    {searchQuery ? "No results found" : "No submissions yet"}
                  </h3>
                  <p className="text-muted-foreground text-base">
                    {searchQuery
                      ? "Try adjusting your search query."
                      : "Upload your first paper to get started."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Submissions Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentPapers.map((paper) => {
                  const paperData = paperDataMap[paper.uuid];
                  const assignment = paperData?.assignment;
                  const adviserUuid = paperData?.adviserUuid;

                  return (
                    <SubmissionCard
                      key={paper.uuid}
                      paper={paper}
                      assignment={assignment}
                      adviserUuid={adviserUuid}
                      getStatusBadge={getStatusBadge}
                      onEdit={() => handleEditClick(paper)}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Card className="dashboard-card border-0 mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Page Info */}
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredAndSortedPapers.length)} of{" "}
                        {filteredAndSortedPapers.length} submissions
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="font-semibold"
                        >
                          Previous
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            ) {
                              return (
                                <Button
                                  key={page}
                                  variant={
                                    page === currentPage ? "default" : "outline"
                                  }
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className={
                                    page === currentPage
                                      ? "font-bold text-white"
                                      : "font-semibold"
                                  }
                                  style={
                                    page === currentPage
                                      ? { background: "var(--color-secondary)" }
                                      : {}
                                  }
                                >
                                  {page}
                                </Button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className="px-2">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        {/* Next Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="font-semibold"
                        >
                          Next
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
    </DashboardLayout>
  );
}

// Modern Card Component for each submission
function SubmissionCard({
  paper,
  assignment,
  adviserUuid,
  getStatusBadge,
  onEdit,
}: {
  paper: Paper;
  assignment: Assignment | undefined;
  adviserUuid: string | null;
  getStatusBadge: (status: string) => React.ReactNode;
  onEdit: () => void;
}) {
  const { data: adviserData } = useGetUserByIdQuery(adviserUuid || "", {
    skip: !adviserUuid,
  });

  // Use RTK mutation hook
  const [deletePaper, { isLoading: isDeleting }] = useDeletePaperMutation();
  const [createPublishedPaper] = usePublishedPaperMutation();

  const handleDeletePaper = async () => {
    try {
      await deletePaper(paper.uuid).unwrap();
    } catch (error) {
      console.log("Failed to delete paper:", error);
    }
  };

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

  const handlePublish = async () => {
    await createPublishedPaper(paper.uuid).unwrap();
  };

  const getStatusPublication = (isPublished: boolean) => {
    switch (isPublished) {
      case true:
        return (
          <Badge className="capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </Badge>
        );
      case false:
        return (
          <Badge className="capitalize bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  return (
    <Card className="dashboard-card border-0 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Top Accent Bar */}
      <div
        className="h-1.5"
        style={{
          background: "var(--color-secondary)",
        }}
      ></div>

      <CardContent className="p-6">
        {/* Thumbnail & Title Section */}
        <div className="space-y-4">
          {/* Thumbnail */}
          <Link href={`/student/submissions/${paper.uuid}`}>
            {paper.thumbnailUrl ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all">
                <Image
                  src={paper.thumbnailUrl}
                  alt={paper.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div
                className="relative w-full h-48 rounded-xl overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all"
                style={{
                  background: "var(--color-secondary)",
                  opacity: 0.8,
                }}
              >
                <Upload className="h-16 w-16 text-white" />
              </div>
            )}
          </Link>

          {/* Title & Status Row */}
          <div className="space-y-3">
            <Link href={`/student/submissions/${paper.uuid}`} className="block">
              <h3 className="text-xl font-bold text-card-foreground group-hover:text-blue-600 transition-colors line-clamp-2">
                {paper.title}
              </h3>
            </Link>

            {/* Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(paper.status)}
              {getStatusPublication(paper.isPublished)}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {Array.isArray(paper.categoryNames) ? (
              paper.categoryNames.map((category, index) => (
                <Badge
                  key={index}
                  className="text-xs font-semibold"
                  style={{
                    background: "var(--color-secondary)",
                    color: "white",
                  }}
                >
                  {category}
                </Badge>
              ))
            ) : (
              <Badge
                className="text-xs font-semibold"
                style={{
                  background: "var(--color-secondary)",
                  color: "white",
                }}
              >
                {paper.categoryNames}
              </Badge>
            )}
          </div>

          {/* Mentor & Date Info */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Mentor:</span>
              <span className="font-semibold text-card-foreground">
                {adviserData ? (
                  adviserData.fullName
                ) : assignment ? (
                  "Assigned"
                ) : (
                  <span className="text-muted-foreground italic">
                    Not assigned
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                Submitted:
              </span>
              <span className="font-semibold text-card-foreground">
                {paper.submittedAt || paper.createdAt}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              asChild
              className="flex-1 font-semibold text-white"
              style={{
                background: "var(--color-secondary)",
              }}
            >
              <Link href={`/student/submissions/${paper.uuid}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background shadow-lg"
              >
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                {paper.status === "APPROVED" && !paper.isPublished && (
                  <DropdownMenuItem onClick={handlePublish}>
                    <Edit className="h-4 w-4 mr-2" />
                    Publish
                  </DropdownMenuItem>
                )}
                {paper.status === "PENDING" && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleDeletePaper}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton component for loading state
function SubmissionCardSkeleton() {
  return (
    <Card className="dashboard-card border-0 overflow-hidden">
      {/* Top Accent Bar */}
      <div
        className="h-1.5 animate-pulse"
        style={{
          background: "var(--color-secondary)",
        }}
      ></div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Thumbnail Skeleton */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-accent/30 animate-pulse"></div>

          {/* Title Skeleton */}
          <div className="space-y-3">
            <div className="h-6 bg-accent/30 rounded w-3/4 animate-pulse"></div>

            {/* Status Badges Skeleton */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="h-6 w-20 bg-accent/30 rounded-full animate-pulse"></div>
              <div className="h-6 w-16 bg-accent/30 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Categories Skeleton */}
          <div className="flex flex-wrap gap-2">
            <div className="h-5 w-24 bg-accent/30 rounded animate-pulse"></div>
            <div className="h-5 w-28 bg-accent/30 rounded animate-pulse"></div>
          </div>

          {/* Mentor & Date Info Skeleton */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 bg-accent/30 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-accent/30 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-accent/30 rounded animate-pulse"></div>
              <div className="h-4 w-28 bg-accent/30 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-2 pt-4">
            <div className="flex-1 h-10 bg-accent/30 rounded-md animate-pulse"></div>
            <div className="h-10 w-10 bg-accent/30 rounded-md animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
