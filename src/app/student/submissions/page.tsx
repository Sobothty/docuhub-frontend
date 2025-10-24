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
import TableRowPlaceholder from "@/components/card/SubmissionPlaceholder";

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
              <Button className="text-white">
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

        {/* Edit Paper Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Paper</DialogTitle>
              <DialogDescription>
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
              <div className="py-12">
                <Table>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRowPlaceholder key={index} />
                    ))}
                  </TableBody>
                </Table>
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
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Publish</TableHead>
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
                        onEdit={() => handleEditClick(paper)}
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
          <Badge variant="default" className="capitalize bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </Badge>
        );
      case false:
        return (
          <Badge variant="secondary" className="capitalize">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  return (
    <TableRow>
      <TableCell>
        {paper.thumbnailUrl ? (
          <div className="relative w-16 h-10">
            <Image
              src={paper.thumbnailUrl}
              alt={paper.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        ) : (
          <div className="relative w-16 h-10">
            <Image
              src="/placeholder.svg"
              alt="Placeholder"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="w-36">
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
      <TableCell>{getStatusPublication(paper.isPublished)}</TableCell>
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
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem>
              <Link
                href={`/student/submissions/${paper.uuid}`}
                className="flex"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
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
      </TableCell>
    </TableRow>
  );
}
