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
  FileText,
  Download,
  MoreHorizontal,
  Eye,
  Trash2,
  X,
  Loader2,
  ImageIcon,
  File,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import {
  useGetPapersByAuthorQuery,
  useCreatePaperMutation,
} from "@/feature/paperSlice/papers";
import {
  useCreateMediaMutation,
  useDeleteMediaMutation,
} from "@/feature/media/mediaSlice";
import { useGetAllCategoriesQuery } from "@/feature/categoriesSlice/categoriesSlices";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filterCategories = ["All", "Guide", "Template", "Reference", "Tutorial"];

export default function MentorResourcesPage() {
  const { data: adviserProfile } = useGetUserProfileQuery();
  const {
    data: papersData,
    error: papersError,
    isLoading: papersLoading,
  } = useGetPapersByAuthorQuery({
    page: 0,
    size: 10,
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
      toast.error(
          `Failed to upload ${isThumb ? "thumbnail" : "file"}`
      );
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
      toast.error(
          `Failed to delete ${isThumb ? "thumbnail" : "file"}`
      );
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
        toast.error("Title is required");
        return;
      }
      if (!formData.fileUrl.trim()) {
        toast.error("Please upload a file");
        return;
      }

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

      toast.success(
        isDraft
          ? "Paper saved as draft successfully!"
          : "Paper published successfully!"
      );

      // Reset form and close dialog
      resetForm();
    } catch (error) {
      console.log("Error creating paper:", error);
      toast.error("Failed to create paper. Please try again."
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

  const resources =
    papersData?.papers?.content?.map((paper) => ({
      id: paper.uuid,
      title: paper.title,
      description: paper.abstractText || "No description available",
      type: "PDF",
      size: "Unknown", // API doesn't provide file size
      uploadDate: new Date(paper.createdAt).toISOString().split("T")[0],
      downloads: paper.downloads || 0,
      category: paper.categoryNames?.[0] || "Uncategorized",
      fileUrl: paper.fileUrl,
      thumbnailUrl: paper.thumbnailUrl,
      status: paper.status,
      isPublished: paper.isPublished,
    })) || [];

  if (papersLoading) {
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user.fullName || "Adviser Name"}
        userAvatar={adviserProfile?.user.imageUrl || undefined}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading resources...</div>
        </div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resources</h1>
            <p className="text-muted-foreground">
              Share materials and resources with your students
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Upload New Resource
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Share educational materials and resources with your students
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Title and Description */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="res-title"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="res-title"
                      placeholder="Enter a descriptive title for your resource"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="res-desc" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="res-desc"
                      placeholder="Provide a detailed description of the resource content..."
                      value={formData.abstractText}
                      onChange={(e) =>
                        handleInputChange("abstractText", e.target.value)
                      }
                      className="min-h-[100px] border-2 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    {categoriesLoading ? (
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md">
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
                        <SelectTrigger className="border-2 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Select a category for your resource" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesData?.content?.map((category) => (
                            <SelectItem key={category.uuid} value={category.uuid}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{category.name}</span>
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
                      <div className="text-xs text-muted-foreground">
                        Selected: {formData.categoryNames[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      Document File <span className="text-red-500">*</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        (PDF, DOC, DOCX - Max 10MB)
                      </span>
                    </Label>

                    {!uploadedFile ? (
                      <div
                        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-6 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-blue-50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <File className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Click to upload document
                            </p>
                            <p className="text-xs text-gray-500">
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
                      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <File className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-900">
                                {uploadedFile.name}
                              </p>
                              <p className="text-xs text-green-600">
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
                    <Label className="text-sm font-medium">
                      Thumbnail Image{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        (Optional - JPG, PNG, WebP - Max 10MB)
                      </span>
                    </Label>

                    {!uploadedThumbnail ? (
                      <div
                        className="border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-lg p-4 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-purple-50"
                        onClick={() => thumbnailInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <ImageIcon className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Upload thumbnail
                            </p>
                            <p className="text-xs text-gray-500">
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
                      <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <ImageIcon className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-purple-900">
                                {uploadedThumbnail.name}
                              </p>
                              <p className="text-xs text-purple-600">
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
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading file..." : "Deleting file..."}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 pt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={
                    isCreating || isUploading || isDeleting || !selectedCategoryUuid
                  }
                  className="border-2 hover:bg-gray-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save as Draft"
                  )}
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={
                    isCreating || isUploading || isDeleting || !selectedCategoryUuid
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Resource"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                {filterCategories.map((category) => (
                  <Button
                    key={category}
                    variant={category === "All" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Upload Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resources
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">Shared materials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.reduce(
                  (sum, resource) => sum + resource.downloads,
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Popular
              </CardTitle>
              <Badge variant="secondary" className="text-xs" />
                {resources.length > 0
                  ? resources
                      .reduce((prev, current) =>
                        prev.downloads > current.downloads ? prev : current
                      )
                      .title.substring(0, 10)
                  : "N/A"}
              </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.length > 0
                  ? Math.max(...resources.map((r) => r.downloads))
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Resources</CardTitle>
            <CardDescription>
              Manage your shared materials and track their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {papersError && (
              <div className="text-red-500 mb-4">
                Error loading resources. Please try again.
              </div>
            )}
            {resources.length === 0 && !papersLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                No resources uploaded yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {resource.description.length > 100
                              ? `${resource.description.substring(0, 100)}...`
                              : resource.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{resource.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            resource.isPublished ? "default" : "secondary"
                          }
                        >
                          {resource.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {resource.downloads}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {resource.uploadDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
