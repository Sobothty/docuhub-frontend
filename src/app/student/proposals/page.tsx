"use client";

import React, { useRef, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  X,
  RefreshCwOff,
  ScanSearch,
  Plus,
  MessageSquare,
  Upload,
  Calendar,
  User,
  AlertCircle,
  ImageIcon,
  Sparkles,
  TrendingUp,
  Eye,
  ChevronRight,
  Search,
} from "lucide-react";
import { useGetAllCategoriesQuery } from "@/feature/categoriesSlice/categoriesSlices";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useCreateMediaMutation } from "@/feature/media/mediaSlice";
import {
  Assignment,
  useCreatePaperMutation,
  useGetAllAssignmentsQuery,
  useGetPapersByAuthorQuery,
} from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useGetFeedbackByPaperUuidQuery } from "@/feature/feedbackSlice/feedbackSlice";
import { Paper } from "@/types/paperType";
import ProposalCardPlaceholder from "./PaperSkeleton";
import Image from "next/image";
import Link from "next/link";
import { useApiNotification } from "@/components/ui/api-notification";

export default function StudentProposalsPage() {
  const {
    showSuccess,
    showError,
    showWarning,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  const [showNewProposal, setShowNewProposal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    thumbnailUrl: "",
    category: [] as string[],
  });

  const { data: categories, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery();

  const { data: user } = useGetUserProfileQuery();

  const [uploadMedia, { isLoading: isUploading }] = useCreateMediaMutation();
  const [createPaper, { isLoading: isCreatingPaper }] =
    useCreatePaperMutation();

  const { data: authorPapers, isLoading: papersLoading } =
    useGetPapersByAuthorQuery(
      {},
      {
        pollingInterval: 30000, // Refetch every 30 seconds
        refetchOnMountOrArgChange: true, // Refetch when component mounts
        refetchOnFocus: true, // Refetch when window regains focus
      }
    );

  const papers = useMemo(
    () => authorPapers?.papers.content || [],
    [authorPapers?.papers.content]
  );

  const { data: assignmentData } = useGetAllAssignmentsQuery(undefined, {
    pollingInterval: 30000, // Refetch every 30 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const assignments = useMemo(() => assignmentData || [], [assignmentData]);

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

  const [thumbnailFile, setThumbnailFile] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<string>("");

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // Create a mapping of paper UUID to feedback and adviser data
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
    }, {} as Record<string, { assignment: Assignment | undefined; adviserUuid: string | null }>);
  }, [papers, assignments]);

  // Helper to format filename
  const getFileName = (url: string) => {
    try {
      return decodeURIComponent(url.split("/").pop()?.split("?")[0] || "");
    } catch {
      return "Unknown file";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_admin":
      case "PENDING":
        return (
          <Badge
            className="text-white border-0 px-4 py-2 text-sm font-bold shadow-xl"
            style={{
              background: "var(--color-accent)",
            }}
          >
            <Clock className="w-4 h-4 mr-2" />
            Pending Review
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge
            className="text-white border-0 px-4 py-2 text-sm font-bold shadow-xl animate-pulse"
            style={{
              background: "var(--color-secondary)",
            }}
          >
            <ScanSearch className="w-4 h-4 mr-2" />
            Under Review
          </Badge>
        );
      case "approved":
      case "APPROVED":
        return (
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white border-0 px-4 py-2 text-sm font-bold shadow-xl">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved
          </Badge>
        );
      case "rejected":
      case "REJECTED":
      case "ADMIN_REJECTED":
        return (
          <Badge className="bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-500 dark:to-pink-500 text-white border-0 px-4 py-2 text-sm font-bold shadow-xl">
            <XCircle className="w-4 h-4 mr-2" />
            Rejected
          </Badge>
        );
      case "REVISION":
        return (
          <Badge
            className="text-white border-0 px-4 py-2 text-sm font-bold shadow-xl"
            style={{
              background: "var(--color-accent-hover)",
            }}
          >
            <RefreshCwOff className="w-4 h-4 mr-2" />
            Needs Revision
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm font-bold shadow-lg"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Unknown
          </Badge>
        );
    }
  };

  const handleAddSubject = (value: string) => {
    if (value && !formData.category.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, value],
      }));
    }
    setSelectedCategory("");
  };

  // Removes a subject from the selected categories
  const handleRemoveSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((s) => s !== subject),
    }));
  };

  const handleThumbnailFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await uploadMedia(data).unwrap();
      if (!response?.data?.uri) throw new Error("No URI returned from upload.");

      setThumbnailFile(response.data.uri);
      setFormData((prev) => ({ ...prev, thumbnailUrl: response.data.uri }));

      showSuccess(
        "Thumbnail Uploaded!",
        "Your thumbnail image has been uploaded successfully."
      );
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      showError(
        "Upload Failed",
        "Failed to upload thumbnail image. Please try again."
      );
    }
  };

  const handlePdfFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await uploadMedia(data).unwrap();
      if (!response?.data?.uri) throw new Error("No URI returned from upload.");

      setPdfFile(response.data.uri);
      setFormData((prev) => ({ ...prev, fileUrl: response.data.uri }));

      showSuccess(
        "PDF Uploaded!",
        "Your PDF document has been uploaded successfully."
      );
    } catch (error) {
      console.error("PDF upload failed:", error);
      showError(
        "Upload Failed",
        "Failed to upload PDF document. Please try again."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.fileUrl ||
      !formData.thumbnailUrl ||
      formData.category.length === 0
    ) {
      showWarning(
        "Missing Information",
        "Please fill in all required fields and upload both thumbnail and PDF files."
      );
      return;
    }

    // Show loading notification
    showLoading(
      "Creating Document",
      "Please wait while we submit your document..."
    );

    try {
      const result = await createPaper({
        title: formData.title,
        abstractText: formData.description,
        fileUrl: formData.fileUrl,
        thumbnailUrl: formData.thumbnailUrl,
        categoryNames: formData.category,
      }).unwrap();

      console.log("Paper created successfully:", result);

      // Close loading and show success
      closeNotification();
      setTimeout(() => {
        showSuccess(
          "Document Submitted!",
          "Your document has been successfully submitted for review. You'll be notified once it's reviewed."
        );
      }, 100);

      // Reset form
      setFormData({
        title: "",
        description: "",
        fileUrl: "",
        thumbnailUrl: "",
        category: [],
      });
      setThumbnailFile("");
      setPdfFile("");
      setShowNewProposal(false);
    } catch (error) {
      console.log("Failed to create paper - Full Error:", error);

      // Close loading and show error
      closeNotification();
      setTimeout(() => {
        showError(
          "Submission Failed",
          "Failed to submit your document. Please check your inputs and try again."
        );
      }, 100);
    }
  };

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.user.fullName}
      userAvatar={
        user?.user.imageUrl ||
        "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg"
      }
    >
      <div className="min-h-screen pb-8">
        {/* Redesigned Modern Header */}
        <div className="mb-8">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: "var(--color-secondary)",
                }}
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      Total Documents
                    </p>
                    <h3
                      className="text-3xl font-bold"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {papers?.length || 0}
                    </h3>
                  </div>
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      background: "rgba(37, 99, 235, 0.1)",
                    }}
                  >
                    <FileText
                      className="w-8 h-8"
                      style={{ color: "var(--color-secondary)" }}
                    />
                  </div>
                </div>
                <div
                  className="mt-3 flex items-center gap-1 text-xs"
                  style={{ color: "var(--color-secondary)" }}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-medium">Active submissions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: "var(--color-accent)",
                }}
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-bold mb-1"
                      style={{
                        color: "var(--color-accent-hover)",
                      }}
                    >
                      Approved
                    </p>
                    <h3
                      className="text-3xl font-black"
                      style={{ color: "var(--color-accent-hover)" }}
                    >
                      {papers?.filter((p) => p.status === "APPROVED").length ||
                        0}
                    </h3>
                  </div>
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      background: "rgba(245, 158, 11, 0.15)",
                    }}
                  >
                    <CheckCircle
                      className="w-8 h-8"
                      style={{ color: "var(--color-accent-hover)" }}
                    />
                  </div>
                </div>
                <div
                  className="mt-3 flex items-center gap-1 text-xs"
                  style={{ color: "var(--color-accent-hover)" }}
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="font-bold">Successfully reviewed</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: "var(--color-secondary)",
                }}
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      Under Review
                    </p>
                    <h3
                      className="text-3xl font-bold"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {papers?.filter(
                        (p) =>
                          p.status === "UNDER_REVIEW" || p.status === "PENDING"
                      ).length || 0}
                    </h3>
                  </div>
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      background: "rgba(37, 99, 235, 0.1)",
                    }}
                  >
                    <Eye
                      className="w-8 h-8"
                      style={{ color: "var(--color-secondary)" }}
                    />
                  </div>
                </div>
                <div
                  className="mt-3 flex items-center gap-1 text-xs"
                  style={{ color: "var(--color-secondary)" }}
                >
                  <Clock className="w-3 h-3 animate-pulse" />
                  <span className="font-medium">In progress</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Header Card */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <div
              className="relative p-8"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">
                      Document Management
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
                    My Documents
                  </h1>
                  <p className="text-white/80 text-base sm:text-lg max-w-2xl">
                    Create, submit, and track all your academic documents in one
                    place
                  </p>
                </div>
                <Button
                  onClick={() => setShowNewProposal(true)}
                  size="lg"
                  className="shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold px-8 py-6 rounded-2xl text-white backdrop-blur-sm group"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Document
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Redesigned Create New Document Form */}
        {showNewProposal && (
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden mb-8">
            <div
              className="relative p-8 border-b"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      New Submission
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Create New Document
                  </h2>
                  <p className="text-white/80 text-sm max-w-2xl">
                    Submit your document proposal and PDF for admin review. A
                    mentor will be assigned after approval.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewProposal(false)}
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Document Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: "rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      <FileText
                        className="w-6 h-6"
                        style={{ color: "var(--color-secondary)" }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Document Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Basic details about your document
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        Document Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter your document title"
                        required
                        className="h-11 rounded-xl border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="subject"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        Subject Area <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={handleAddSubject}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-2">
                          <SelectValue placeholder="Select subject areas" />
                        </SelectTrigger>
                        <SelectContent className="bg-card text-foreground">
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          ) : (Array.isArray(categories?.content) &&
                              categories?.content?.length) ||
                            0 > 0 ? (
                            categories?.content.map((category) => (
                              <SelectItem
                                value={category.name}
                                key={category.uuid}
                                disabled={formData.category.includes(
                                  category.name
                                )}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-categories" disabled>
                              No categories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>

                      {formData.category.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted/50 rounded-xl">
                          {formData.category.map((subject) => (
                            <Badge
                              key={subject}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              {subject}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSubject(subject);
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your document topic and research question in detail..."
                      rows={5}
                      required
                      className="rounded-xl border-2 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      <Upload
                        className="w-6 h-6"
                        style={{ color: "var(--color-accent)" }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">File Uploads</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your document and thumbnail image
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thumbnail Upload */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Document Thumbnail{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative group">
                        <div className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 cursor-pointer">
                          <Input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailFileChange}
                            className="hidden"
                            required
                          />
                          {!thumbnailFile ? (
                            <div
                              onClick={() => thumbnailInputRef.current?.click()}
                            >
                              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                className="mb-2 border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              >
                                Choose Image
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Image
                                src={thumbnailFile}
                                alt="Thumbnail preview"
                                className="max-w-full h-auto max-h-40 mx-auto rounded-xl border-2 border-border object-cover shadow-lg"
                                width={300}
                                height={200}
                                unoptimized
                              />
                              <p className="text-xs text-foreground font-medium truncate">
                                {getFileName(thumbnailFile)}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  thumbnailInputRef.current?.click()
                                }
                                className="text-xs"
                              >
                                Change Image
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PDF Upload */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Document PDF <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative group">
                        <div className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-6 text-center hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all duration-300 cursor-pointer">
                          <Input
                            ref={pdfInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfFileChange}
                            className="hidden"
                            required
                          />
                          {!pdfFile ? (
                            <div onClick={() => pdfInputRef.current?.click()}>
                              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                className="mb-2 border-2 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                                disabled={isUploading}
                              >
                                {isUploading ? "Uploading..." : "Choose PDF"}
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">
                                PDF up to 50MB
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="mx-auto w-20 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl flex items-center justify-center shadow-lg">
                                <FileText className="w-10 h-10 text-red-600 dark:text-red-400" />
                              </div>
                              <p className="text-xs text-foreground font-medium truncate">
                                {getFileName(pdfFile)}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => pdfInputRef.current?.click()}
                                className="text-xs"
                                disabled={isUploading}
                              >
                                Change PDF
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2">
                  <Button
                    type="submit"
                    className="flex-1 h-14 text-base font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl group relative overflow-hidden"
                    style={{
                      background: "var(--color-secondary)",
                    }}
                    disabled={isCreatingPaper || isUploading}
                    onMouseEnter={(e) => {
                      if (!isCreatingPaper && !isUploading) {
                        e.currentTarget.style.background =
                          "var(--color-secondary-hover)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-secondary)";
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isCreatingPaper ? (
                        <>
                          <RefreshCwOff className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          Submit for Review
                        </>
                      )}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProposal(false)}
                    className="h-14 px-10 text-base font-bold rounded-2xl border-2 hover:bg-muted transition-all duration-300"
                    disabled={isCreatingPaper || isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Redesigned Documents List Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-black mb-1">My Submissions</h2>
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedPapers.length > 0 ? (
                  <>
                    {searchQuery
                      ? `Found ${filteredAndSortedPapers.length} of ${papers.length}`
                      : `Manage and track your ${filteredAndSortedPapers.length}`}{" "}
                    {filteredAndSortedPapers.length === 1
                      ? "document"
                      : "documents"}
                  </>
                ) : (
                  "Your submitted documents will appear here"
                )}
              </p>
            </div>
            {papers.length > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(37, 99, 235, 0.1)",
                }}
              >
                <FileText
                  className="w-4 h-4"
                  style={{ color: "var(--color-secondary)" }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {papers.length} Total
                </span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {papers.length > 0 && (
            <Card className="dashboard-card border-0 shadow-lg mb-6">
              <CardContent className="p-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    type="text"
                    placeholder="Search by title, description, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base rounded-xl border-2 focus:border-[var(--color-secondary)] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {papersLoading ? (
              <ProposalCardPlaceholder />
            ) : papers.length === 0 ? (
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="py-24">
                  <div className="max-w-lg mx-auto text-center space-y-8">
                    <div className="relative inline-block">
                      <div
                        className="absolute inset-0 blur-3xl opacity-30"
                        style={{
                          background:
                            "radial-gradient(circle, var(--color-secondary), var(--color-accent))",
                        }}
                      />
                      <div
                        className="relative w-40 h-40 mx-auto rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(245, 158, 11, 0.1))",
                        }}
                      >
                        <FileText
                          className="h-20 w-20"
                          style={{ color: "var(--color-secondary)" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black">Ready to Start?</h3>
                      <p className="text-muted-foreground text-base max-w-md mx-auto">
                        Create your first document submission and begin your
                        academic journey. Your documents will be reviewed by our
                        expert mentors.
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowNewProposal(true)}
                      size="lg"
                      className="text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl font-bold px-8 py-6 group"
                      style={{
                        background: "var(--color-secondary)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--color-secondary-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "var(--color-secondary)")
                      }
                    >
                      <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Create First Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : filteredAndSortedPapers.length === 0 ? (
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="py-16">
                  <div className="max-w-md mx-auto text-center space-y-4">
                    <Search className="w-16 h-16 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-bold">No documents found</h3>
                    <p className="text-muted-foreground">
                      No documents match your search criteria. Try adjusting
                      your search terms.
                    </p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {currentPapers.map((proposal) => {
                  const paperData = paperDataMap[proposal.uuid];
                  const adviserUuid = paperData?.adviserUuid;

                  return (
                    <PaperCard
                      key={proposal.uuid}
                      proposal={proposal}
                      adviserUuid={adviserUuid}
                      getStatusBadge={getStatusBadge}
                    />
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Card className="dashboard-card border-0 mt-6">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Results Info */}
                        <div className="text-sm text-muted-foreground font-medium">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, filteredAndSortedPapers.length)}{" "}
                          of {filteredAndSortedPapers.length} submissions
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
                          <div className="hidden sm:flex items-center gap-1">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => {
                              // Show first page, last page, and pages around current page
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
                                      page === currentPage
                                        ? "default"
                                        : "outline"
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
                                        ? {
                                            background:
                                              "var(--color-secondary)",
                                          }
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
      </div>

      {/* API Notification Component */}
      <NotificationComponent />
    </DashboardLayout>
  );
}

// Create a separate component for each paper card to properly use hooks
function PaperCard({
  proposal,
  adviserUuid,
  getStatusBadge,
}: {
  proposal: Paper;
  adviserUuid: string | null;
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  // Now we can safely use hooks for each paper
  const { data: adviserData } = useGetUserByIdQuery(adviserUuid || "", {
    skip: !adviserUuid,
  });

  const { data: feedbackData } = useGetFeedbackByPaperUuidQuery(proposal.uuid);

  return (
    <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
      {/* Redesigned Card Header */}
      <div className="relative">
        {/* Status Indicator Strip */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background:
              "linear-gradient(to right, var(--color-secondary), var(--color-accent))",
          }}
        />

        <CardHeader className="pb-6 pt-8">
          <div className="flex flex-col gap-6">
            {/* Top Row: Title and Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl sm:text-3xl font-black mb-3 group-hover:text-[var(--color-secondary)] transition-colors duration-300">
                  {proposal.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  {proposal.categoryNames?.map(
                    (category: string, index: number) => (
                      <Badge
                        key={index}
                        className="font-semibold px-4 py-1.5 rounded-full border-2 hover:scale-105 transition-transform"
                        style={{
                          background: "rgba(37, 99, 235, 0.1)",
                          borderColor: "var(--color-secondary)",
                          color: "var(--color-secondary)",
                        }}
                      >
                        {category}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(proposal.status)}
              </div>
            </div>
          </div>
        </CardHeader>
      </div>

      <CardContent className="space-y-6 pt-0">
        {/* Enhanced Description Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Document Description
          </h4>
          <p className="text-base leading-relaxed text-foreground font-medium bg-muted/30 p-4 rounded-xl border">
            {proposal.abstractText || "No description available"}
          </p>
        </div>

        {/* Redesigned Metadata Section - Enhanced Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="flex items-center gap-4 px-5 py-4 rounded-2xl border-2"
            style={{
              background: "rgba(37, 99, 235, 0.12)",
              borderColor: "rgba(37, 99, 235, 0.4)",
            }}
          >
            <div
              className="p-3 rounded-xl shadow-lg"
              style={{
                backgroundColor: "var(--color-secondary)",
              }}
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-black uppercase tracking-wider mb-1"
                style={{
                  color: "var(--color-secondary)",
                }}
              >
                Submitted Date
              </p>
              <p
                className="text-lg font-black"
                style={{ color: "var(--color-secondary)" }}
              >
                {proposal.submittedAt}
              </p>
            </div>
          </div>

          {adviserData && (
            <div
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border-2"
              style={{
                background: "rgba(227, 133, 25, 0.12)",
                borderColor: "rgba(227, 133, 25, 0.4)",
              }}
            >
              <div
                className="p-3 rounded-xl shadow-lg"
                style={{
                  backgroundColor: "var(--color-accent-hover)",
                }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs font-black uppercase tracking-wider mb-1"
                  style={{
                    color: "var(--color-accent-hover)",
                  }}
                >
                  Assigned Mentor
                </p>
                <p
                  className="text-lg font-black truncate"
                  style={{ color: "var(--color-accent-hover)" }}
                  title={adviserData.fullName}
                >
                  {adviserData.fullName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Feedback Section - Better Visibility */}
        {feedbackData && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 border-2 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(37, 99, 235, 0.06))",
              borderColor: "var(--color-secondary)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
              style={{
                backgroundColor: "var(--color-secondary)",
                opacity: 0.15,
              }}
            />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl shadow-lg flex-shrink-0"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                  }}
                >
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4
                    className="text-base font-black mb-3 uppercase tracking-wide"
                    style={{
                      color: "var(--color-secondary)",
                    }}
                  >
                    📝 Feedback from Mentor
                  </h4>
                  <p className="text-base leading-relaxed font-medium text-foreground bg-background/50 p-4 rounded-xl">
                    {feedbackData.feedbackText}
                  </p>
                </div>
              </div>
              {feedbackData.deadline && (
                <div
                  className="flex items-center gap-3 pt-4 border-t-2 px-4 py-3 rounded-xl"
                  style={{
                    borderColor: "var(--color-secondary)",
                    background: "rgba(37, 99, 235, 0.08)",
                  }}
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                    }}
                  >
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-0.5"
                      style={{
                        color: "var(--color-secondary)",
                        opacity: 0.8,
                      }}
                    >
                      Deadline
                    </p>
                    <p
                      className="text-base font-black"
                      style={{
                        color: "var(--color-secondary)",
                      }}
                    >
                      {feedbackData.deadline}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status-specific Actions and Messages */}
        {proposal.status === "APPROVED" && (
          <Link
            href={`/student/submissions/${proposal.uuid}`}
            className="block"
          >
            <Button className="w-full h-14 text-base font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View Document Details
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </Link>
        )}

        {proposal.status === "PENDING" && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 border-2"
            style={{
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.03))",
              borderColor: "var(--color-accent)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 rounded-2xl animate-pulse"
                style={{
                  backgroundColor: "var(--color-accent)",
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                }}
              >
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4
                  className="text-base font-bold mb-1"
                  style={{
                    color: "var(--color-accent-hover)",
                  }}
                >
                  Awaiting Admin Review
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your document is in queue for admin review. Check back soon!
                </p>
              </div>
            </div>
          </div>
        )}

        {proposal.status === "REVISION" && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 border-2"
            style={{
              background:
                "linear-gradient(135deg, rgba(227, 133, 25, 0.08), rgba(227, 133, 25, 0.03))",
              borderColor: "var(--color-accent-hover)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 rounded-2xl"
                style={{
                  backgroundColor: "var(--color-accent-hover)",
                  boxShadow: "0 0 20px rgba(227, 133, 25, 0.3)",
                }}
              >
                <RefreshCwOff className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4
                  className="text-base font-bold mb-1"
                  style={{
                    color: "var(--color-accent-hover)",
                  }}
                >
                  Revision Required
                </h4>
                <p className="text-sm text-muted-foreground">
                  Please revise and resubmit based on the feedback provided.
                </p>
              </div>
            </div>
          </div>
        )}

        {proposal.status === "ADMIN_REJECTED" && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 p-6 border-2 border-red-300 dark:border-red-700">
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 rounded-2xl bg-red-500 dark:bg-red-600"
                style={{
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
                }}
              >
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-red-900 dark:text-red-100 mb-1">
                  Document Rejected
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Please review the feedback and resubmit with necessary
                  changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {proposal.status === "UNDER_REVIEW" && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 border-2"
            style={{
              background:
                "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.03))",
              borderColor: "var(--color-secondary)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 rounded-2xl animate-pulse"
                style={{
                  backgroundColor: "var(--color-secondary)",
                  boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)",
                }}
              >
                <ScanSearch className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4
                  className="text-base font-bold mb-1"
                  style={{
                    color: "var(--color-secondary)",
                  }}
                >
                  Under Adviser Review
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your adviser is currently reviewing your document. Please
                  check back later.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
