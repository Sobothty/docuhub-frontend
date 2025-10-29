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
  FileText,
  Download,
  MoreHorizontal,
  Eye,
  Trash2,
  X,
  XCircle,
  Loader2,
  ImageIcon,
  File,
  Sparkles,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import {
  useGetPapersByAuthorQuery,
  useCreatePaperMutation,
  useDeletePaperMutation,
  usePublishedPaperMutation,
} from "@/feature/paperSlice/papers";
import {
  useCreateMediaMutation,
  useDeleteMediaMutation,
} from "@/feature/media/mediaSlice";
import { useGetAllCategoriesQuery } from "@/feature/categoriesSlice/categoriesSlices";
import { useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourcesPageSkeleton } from "@/components/card/TablePlaceHolderAdviserResource";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useApiNotification } from "@/components/ui/api-notification";

export default function MentorResourcesPage() {
  const router = useRouter();

  // Initialize API notification
  const {
    showSuccess,
    showError,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  const { data: adviserProfile } = useGetUserProfileQuery();

  // Pagination and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    data: papersData,
    error: papersError,
    isLoading: papersLoading,
  } = useGetPapersByAuthorQuery({
    page: 0,
    size: 100, // Get more items for client-side filtering and pagination
    sortBy: "createdAt",
    direction: "desc",
  });

  // Fetch categories
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetAllCategoriesQuery();

  const [createPaper, { isLoading: isCreating }] = useCreatePaperMutation();
  const [uploadFile, { isLoading: isUploading }] = useCreateMediaMutation();
  const [deleteFile, { isLoading: isDeleting }] = useDeleteMediaMutation();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    abstractText: "",
    categoryNames: [""],
    fileUrl: "",
    thumbnailUrl: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategoryUuid, setSelectedCategoryUuid] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    url: string;
    size: number;
    type: string;
    mediaId?: string;
  } | null>(null);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<{
    name: string;
    url: string;
    size: number;
    type: string;
    mediaId?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = async (file: File, isThumb: boolean = false) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);

      const uploadResult = await uploadFile(formData).unwrap();

      if (isThumb) {
        setUploadedThumbnail({
          name: file.name,
          url: uploadResult.data.uri,
          size: file.size,
          type: file.type,
          mediaId: uploadResult.data.name, // Store media ID for deletion
        });
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: uploadResult.data.uri,
        }));
      } else {
        setUploadedFile({
          name: file.name,
          url: uploadResult.data.uri,
          size: file.size,
          type: file.type,
          mediaId: uploadResult.data.name, // Store media ID for deletion
        });
        setFormData((prev) => ({ ...prev, fileUrl: uploadResult.data.uri }));
      }

      toast.success(`${isThumb ? "Thumbnail" : "File"} uploaded successfully!`);
    } catch (error) {
      console.log("Upload error:", error);
      toast.error(`Failed to upload ${isThumb ? "thumbnail" : "file"}`);
    }
  };

  // Handle file delete
  const handleFileDelete = async (isThumb: boolean = false) => {
    try {
      const fileToDelete = isThumb ? uploadedThumbnail : uploadedFile;
      if (!fileToDelete?.mediaId) {
        toast.error("No file to delete");
        return;
      }

      await deleteFile(fileToDelete.mediaId).unwrap();

      if (isThumb) {
        setUploadedThumbnail(null);
        setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
      } else {
        setUploadedFile(null);
        setFormData((prev) => ({ ...prev, fileUrl: "" }));
      }

      toast.success(`${isThumb ? "Thumbnail" : "File"} deleted successfully!`);
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(`Failed to delete ${isThumb ? "thumbnail" : "file"}`);
    }
  };

  // Handle file input change
  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isThumb: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = isThumb
        ? ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        : [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type. Please select a ${
            isThumb ? "image" : "document"
          } file.`
        );
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      handleFileUpload(file, isThumb);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle category selection
  const handleCategorySelect = (categoryUuid: string) => {
    setSelectedCategoryUuid(categoryUuid);
    const selectedCategory = categoriesData?.content.find(
      (cat) => cat.uuid === categoryUuid
    );
    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        categoryNames: [selectedCategory.name],
      }));
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      title: "",
      abstractText: "",
      categoryNames: [""],
      fileUrl: "",
      thumbnailUrl: "",
    });
    setSelectedCategoryUuid("");
    setUploadedFile(null);
    setUploadedThumbnail(null);
    setIsDialogOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        showError("Validation Error", "Title is required");
        return;
      }
      if (!formData.fileUrl.trim()) {
        showError("Validation Error", "Please upload a file");
        return;
      }

      // Show loading notification
      showLoading(
        "Publishing Resource",
        "Please wait while we publish your resource..."
      );

      const paperData = {
        title: formData.title.trim(),
        abstractText: formData.abstractText.trim() || undefined,
        fileUrl: formData.fileUrl.trim(),
        thumbnailUrl: formData.thumbnailUrl.trim(),
        categoryNames: formData.categoryNames.filter(
          (cat) => cat.trim() !== ""
        ),
      };

      await createPaper(paperData).unwrap();

      // Close loading and show success
      closeNotification();
      showSuccess(
        "Resource Published!",
        isDraft
          ? "Your paper has been saved as draft successfully"
          : "Your resource has been published and is now available to students"
      );

      // Reset form and close dialog
      resetForm();
    } catch (error) {
      console.log("Error creating paper:", error);
      closeNotification();
      showError(
        "Publishing Failed",
        "Failed to publish resource. Please try again."
      );
    }
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form when dialog is closed
      resetForm();
    }
  };

  // Transform and memoize resources
  const allResources = useMemo(
    () =>
      papersData?.papers?.content?.map((paper) => ({
        id: paper.uuid,
        title: paper.title,
        description: paper.abstractText || "No description available",
        type: "PDF",
        size: "Unknown", // API doesn't provide file size
        uploadDate: new Date(paper.createdAt).toISOString().split("T")[0],
        createdAt: paper.createdAt,
        downloads: paper.downloads || 0,
        category: paper.categoryNames?.[0] || "Uncategorized",
        fileUrl: paper.fileUrl,
        thumbnailUrl: paper.thumbnailUrl,
        status: paper.status,
        isPublished: paper.isPublished,
        isApproved: paper.isApproved,
      })) || [],
    [papersData?.papers?.content]
  );

  // Filter and sort resources (latest first)
  const filteredAndSortedResources = useMemo(() => {
    const filtered = allResources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.uploadDate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by creation date - latest first
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [allResources, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedResources.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = filteredAndSortedResources.slice(
    startIndex,
    endIndex
  );

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [deletePaper] = useDeletePaperMutation();
  const [createPublishedPaper] = usePublishedPaperMutation();

  const handleDeletePaper = async (uuid: string) => {
    try {
      showLoading(
        "Deleting Resource",
        "Please wait while we delete this resource..."
      );
      await deletePaper(uuid).unwrap();
      closeNotification();
      showSuccess(
        "Resource Deleted!",
        "The resource has been successfully removed from your library"
      );
    } catch (error) {
      console.log("Failed to delete paper:", error);
      closeNotification();
      showError(
        "Delete Failed",
        "Failed to delete resource. Please try again."
      );
    }
  };

  const handleDownload = async (fileUrl: string) => {
    try {
      // Create a download link for the paper file
      if (fileUrl) {
        showLoading(
          "Preparing Download",
          "Please wait while we prepare your file..."
        );

        // Fetch the file as a blob to force download
        const response = await fetch(fileUrl);
        const blob = await response.blob();

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${fileUrl
          .split("/")
          .pop()!
          .replace(/[^a-z0-9\-\s]/gi, "")
          .replace(/\s+/g, "-")}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        // Close loading and show success
        closeNotification();
        showSuccess(
          "Download Started!",
          "Your resource file is now downloading"
        );
      }
    } catch (error) {
      console.log("Failed to download:", error);
      closeNotification();
      showError(
        "Download Failed",
        "Failed to download resource. Please try again."
      );
    }
  };

  const handlePublish = async (uuid: string) => {
    try {
      showLoading(
        "Publishing Resource",
        "Please wait while we publish this resource..."
      );
      await createPublishedPaper(uuid).unwrap();
      closeNotification();
      showSuccess(
        "Resource Published!",
        "Your resource is now published and available to students"
      );
    } catch (error) {
      console.log("Failed to publish paper:", error);
      closeNotification();
      showError(
        "Publishing Failed",
        "Failed to publish resource. Please try again."
      );
    }
  };

  const handlePreview = (uuid: string) => {
    router.push(`/adviser/documents/${uuid}`);
  };

  if (papersLoading) {
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user.fullName || "Adviser Name"}
        userAvatar={adviserProfile?.user.imageUrl || undefined}
      >
        <ResourcesPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user.fullName || "Adviser Name"}
      userAvatar={adviserProfile?.user.imageUrl || undefined}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="adviser-resources-page-header">
          <div className="adviser-resources-accent-bar" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Resources
              </h1>
              <p className="text-muted-foreground text-lg">
                Share materials and resources with your students
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <button className="adviser-resources-upload-btn flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Resource
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto w-[95vw]">
                {/* Custom Gradient Header */}
                <div className="upload-modal-header">
                  <h2 className="upload-modal-title">Upload New Resource</h2>
                  <p className="upload-modal-subtitle">
                    Share educational materials and resources with your students
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Title and Description */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="res-title" className="upload-modal-label">
                        Title <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <Input
                        id="res-title"
                        placeholder="Enter a descriptive title for your resource"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="upload-modal-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="res-desc" className="upload-modal-label">
                        Description
                      </label>
                      <Textarea
                        id="res-desc"
                        placeholder="Provide a detailed description of the resource content..."
                        value={formData.abstractText}
                        onChange={(e) =>
                          handleInputChange("abstractText", e.target.value)
                        }
                        className="upload-modal-textarea"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="upload-modal-label">
                        Category <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      {categoriesLoading ? (
                        <div className="flex items-center gap-2 p-3 rounded-md">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Loading categories...
                          </span>
                        </div>
                      ) : categoriesError ? (
                        <div className="p-3 border border-red-200 rounded-md bg-red-50">
                          <span className="text-sm text-red-600">
                            Failed to load categories
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={selectedCategoryUuid}
                          onValueChange={handleCategorySelect}
                        >
                          <SelectTrigger className="upload-modal-input">
                            <SelectValue placeholder="Select a category for your resource" />
                          </SelectTrigger>
                          <SelectContent className="bg-card text-foreground">
                            {categoriesData?.content?.map((category) => (
                              <SelectItem
                                key={category.uuid}
                                value={category.uuid}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {category.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({category.slug})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {selectedCategoryUuid && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Selected: {formData.categoryNames[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="upload-modal-label">
                        Document File{" "}
                        <span style={{ color: "#ef4444" }}>*</span>
                        <span
                          className="text-xs font-normal"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          (PDF, DOC, DOCX - Max 10MB)
                        </span>
                      </label>

                      {!uploadedFile ? (
                        <div
                          className="upload-modal-file-area"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="upload-modal-file-icon">
                              <File className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "var(--foreground)" }}
                              >
                                Click to upload document
                              </p>
                              <p className="text-xs text-muted-foreground">
                                or drag and drop your file here
                              </p>
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileInputChange(e, false)}
                          />
                        </div>
                      ) : (
                        <div className="upload-modal-success-area">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #10b981, #059669)",
                                }}
                              >
                                <File className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "#065f46" }}
                                >
                                  {uploadedFile.name}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#059669" }}
                                >
                                  {formatFileSize(uploadedFile.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFileDelete(false)}
                              disabled={isDeleting}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-3">
                      <label className="upload-modal-label">
                        Thumbnail Image{" "}
                        <span
                          className="text-xs font-normal"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          (Optional - JPG, PNG, WebP - Max 10MB)
                        </span>
                      </label>

                      {!uploadedThumbnail ? (
                        <div
                          className="upload-modal-file-area"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(37, 99, 235, 0.05))",
                            borderColor: "rgba(245, 158, 11, 0.3)",
                          }}
                          onClick={() => thumbnailInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="upload-modal-thumbnail-icon">
                              <ImageIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "var(--foreground)" }}
                              >
                                Upload thumbnail
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Preview image for your resource
                              </p>
                            </div>
                          </div>
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileInputChange(e, true)}
                          />
                        </div>
                      ) : (
                        <div className="upload-modal-success-area">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #10b981, #059669)",
                                }}
                              >
                                <ImageIcon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "#065f46" }}
                                >
                                  {uploadedThumbnail.name}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#059669" }}
                                >
                                  {formatFileSize(uploadedThumbnail.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFileDelete(true)}
                              disabled={isDeleting}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Status */}
                  {(isUploading || isDeleting) && (
                    <div
                      className="flex items-center gap-2 text-sm p-3 rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(245, 158, 11, 0.1))",
                        color: "#2563eb",
                        border: "1px solid rgba(37, 99, 235, 0.2)",
                      }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isUploading ? "Uploading file..." : "Deleting file..."}
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 pt-6">
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={
                      isCreating ||
                      isUploading ||
                      isDeleting ||
                      !selectedCategoryUuid
                    }
                    className="upload-modal-publish-btn flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Publish Resource
                      </>
                    )}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                placeholder="Search your resources by title, description, or category..."
                className="pl-16 pr-12 py-7 text-base bg-card text-card-foreground border-border rounded-xl focus:shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Clear button (shows when there's text) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
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
                Filter by title, description, category, or upload date
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upload Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Resources */}
          <div className="adviser-resources-stat-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Total Resources
              </h3>
              <div className="adviser-resources-stat-icon-blue">
                <FileText className="h-5 w-5" style={{ color: "#2563eb" }} />
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: "#2563eb" }}>
              {filteredAndSortedResources.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Filtered results" : "Shared materials"}
            </p>
          </div>

          {/* Total Downloads */}
          <div className="adviser-resources-stat-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Total Downloads
              </h3>
              <div className="adviser-resources-stat-icon-green">
                <Download className="h-5 w-5" style={{ color: "#10b981" }} />
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: "#10b981" }}>
              {filteredAndSortedResources.reduce(
                (sum, resource) => sum + resource.downloads,
                0
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              <span style={{ color: "#10b981", fontWeight: "600" }}>+12</span>{" "}
              this week
            </p>
          </div>

          {/* Most Popular */}
          <div className="adviser-resources-stat-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Most Popular
              </h3>
              <div className="adviser-resources-stat-icon-orange">
                <FileText className="h-5 w-5" style={{ color: "#f59e0b" }} />
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: "#f59e0b" }}>
              {filteredAndSortedResources.length > 0
                ? Math.max(
                    ...filteredAndSortedResources.map((r) => r.downloads)
                  )
                : 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredAndSortedResources.length > 0
                ? filteredAndSortedResources
                    .reduce((prev, current) =>
                      prev.downloads > current.downloads ? prev : current
                    )
                    .title.substring(0, 20) + "..."
                : "No resources yet"}
            </p>
          </div>
        </div>

        {/* Resources Table */}
        <div className="adviser-resources-table-card">
          <div className="adviser-resources-table-header">
            <h2 className="text-2xl font-bold gradient-text">
              Uploaded Resources
            </h2>
            <p className="text-muted-foreground text-base mt-1">
              Manage your shared materials and track their usage
            </p>
          </div>
          <CardContent className="p-6">
            {papersError && (
              <div className="adviser-resources-empty-state">
                <XCircle
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: "#ef4444" }}
                />
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#dc2626" }}
                >
                  Error loading resources
                </h3>
                <p className="text-muted-foreground">
                  Please try again later or contact support if the issue
                  persists.
                </p>
              </div>
            )}
            {filteredAndSortedResources.length === 0 &&
            !papersLoading &&
            !papersError ? (
              <div className="adviser-resources-empty-state">
                {searchQuery ? (
                  <>
                    <Search
                      className="w-16 h-16 mx-auto mb-4"
                      style={{ color: "#2563eb" }}
                    />
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "#2563eb" }}
                    >
                      No resources match your search
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters
                    </p>
                  </>
                ) : (
                  <>
                    <Upload
                      className="w-16 h-16 mx-auto mb-4"
                      style={{ color: "#2563eb" }}
                    />
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "#2563eb" }}
                    >
                      No resources uploaded yet
                    </h3>
                    <p className="text-muted-foreground">
                      Start sharing educational materials with your students by
                      uploading your first resource.
                    </p>
                  </>
                )}
              </div>
            ) : filteredAndSortedResources.length > 0 ? (
              <>
                {/* Resources Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentResources.map((resource) => (
                    <Card
                      key={resource.id}
                      className="dashboard-card overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      style={{ border: "1px solid rgba(229, 231, 235, 0.5)" }}
                    >
                      {/* Top Accent Bar */}
                      <div
                        className="h-1.5"
                        style={{
                          background:
                            "linear-gradient(to right, #2563eb, #f59e0b)",
                        }}
                      ></div>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Thumbnail */}
                          <div
                            onClick={() => handlePreview(resource.id)}
                            className="cursor-pointer"
                          >
                            {resource.thumbnailUrl ? (
                              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all">
                                <Image
                                  src={resource.thumbnailUrl}
                                  alt={resource.title}
                                  fill
                                  className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div
                                className="relative w-full h-48 rounded-xl overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #2563eb, #1951cc)",
                                  opacity: 0.9,
                                }}
                              >
                                <FileText className="h-16 w-16 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Title & Status Row */}
                          <div className="space-y-3">
                            <div
                              onClick={() => handlePreview(resource.id)}
                              className="block cursor-pointer"
                            >
                              <h3 className="text-xl font-bold text-card-foreground group-hover:text-blue-600 transition-colors line-clamp-2">
                                {resource.title}
                              </h3>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <div
                                className={
                                  resource.isPublished
                                    ? "adviser-resources-badge-published"
                                    : "adviser-resources-badge-draft"
                                }
                              >
                                {resource.isPublished ? "Published" : "Draft"}
                              </div>
                              <Badge
                                className="text-xs font-semibold"
                                style={{
                                  background: "#2563eb",
                                  color: "white",
                                }}
                              >
                                {resource.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {resource.description}
                          </p>

                          {/* Stats & Date Info */}
                          <div className="space-y-3 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground font-medium">
                                Downloads:
                              </span>
                              <span className="font-semibold text-card-foreground flex items-center gap-1">
                                <Download
                                  className="h-3.5 w-3.5"
                                  style={{ color: "#10b981" }}
                                />
                                {resource.downloads}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground font-medium">
                                Uploaded:
                              </span>
                              <span className="font-semibold text-card-foreground">
                                {resource.uploadDate}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4">
                            <button
                              onClick={() => handlePreview(resource.id)}
                              className="flex-1 font-semibold text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                              style={{
                                background:
                                  "linear-gradient(135deg, #2563eb, #1951cc)",
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="border-2 border-border hover:bg-accent p-2 rounded-lg transition-all">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-background shadow-lg"
                              >
                                {!resource.isPublished && (
                                  <DropdownMenuItem
                                    onClick={() => handlePublish(resource.id)}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownload(resource.fileUrl)
                                  }
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeletePaper(resource.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Card className="dashboard-card border-0 mt-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        {/* Page Info */}
                        <div className="text-sm text-muted-foreground">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(
                            endIndex,
                            filteredAndSortedResources.length
                          )}{" "}
                          of {filteredAndSortedResources.length} resources
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2">
                          {/* Previous Button */}
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="adviser-documents-pagination-btn"
                          >
                            Previous
                          </button>

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
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`adviser-documents-pagination-btn w-10 h-10 p-0 ${
                                      page === currentPage
                                        ? "adviser-documents-pagination-active"
                                        : ""
                                    }`}
                                  >
                                    {page}
                                  </button>
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
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="adviser-documents-pagination-btn"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : null}
          </CardContent>
        </div>
      </div>

      {/* API Notification */}
      <NotificationComponent />
    </DashboardLayout>
  );
}
