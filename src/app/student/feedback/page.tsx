"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  MessageSquare,
  Edit,
  XCircle,
  Eye,
  Download,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetAllFeedbackByAuthorQuery } from "@/feature/feedbackSlice/feedbackSlice";
import { useGetPaperByUuidQuery } from "@/feature/paperSlice/papers";
import FeedbackCardPlaceholder from "@/components/card/FeedbackCardPlaceholder";
import { useApiNotification } from "@/components/ui/api-notification";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

// Add type definitions
interface Feedback {
  paperUuid: string;
  feedbackText: string;
  status: string;
  advisorName: string;
  adviserImageUrl?: string | null;
  fileUrl?: string | null;
  createdAt: string;
}

interface FeedbackItemProps {
  feedback: Feedback;
  isLast: boolean;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showLoading: (title: string, message: string) => void;
  closeNotification: () => void;
}

// Separate component for each feedback item
function FeedbackItem({
  feedback,
  isLast,
  showSuccess,
  showError,
  showLoading,
  closeNotification,
}: FeedbackItemProps) {
  const router = useRouter();
  const { data: paper } = useGetPaperByUuidQuery(feedback.paperUuid);

  const handleOnClick = (paperUuid: string) => {
    router.push(`/student/feedback/${paperUuid}`);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent div onClick

    if (!feedback.fileUrl) {
      showError("Download Failed", "No feedback file available to download");
      return;
    }

    // Show loading notification
    showLoading(
      "Preparing Download",
      "Please wait while we prepare your feedback file..."
    );

    try {
      // Create filename from paper title or use default
      const filename = paper?.paper.title
        ? `${paper.paper.title.replace(/[^a-z0-9]/gi, "_")}_feedback.pdf`
        : `feedback_${feedback.paperUuid}.pdf`;

      // Fetch the file as blob to force download
      const response = await fetch(feedback.fileUrl);
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      // Append to body, trigger click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);

      // Close loading and show success
      closeNotification();
      setTimeout(() => {
        showSuccess(
          "Download Complete!",
          "Your feedback file has been downloaded successfully."
        );
      }, 100);
    } catch (error) {
      closeNotification();
      setTimeout(() => {
        showError(
          "Download Failed",
          "Failed to download feedback file. Please try again."
        );
      }, 100);
    }
  };

  return (
    <div
      key={feedback.paperUuid}
      className="flex gap-4 hover:bg-muted/30 p-4 rounded-xl transition-all cursor-pointer"
      onClick={() => handleOnClick(feedback.paperUuid)}
    >
      <div className="flex flex-col items-center">
        <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-blue-800 shadow-md">
          <AvatarImage
            src={feedback.adviserImageUrl || "/placeholder.svg"}
            alt={feedback.advisorName}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
            {feedback.advisorName
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {!isLast && (
          <div className="w-0.5 h-16 bg-gradient-to-b from-blue-200 to-transparent dark:from-blue-800 mt-2" />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h4 className="font-semibold text-base">{feedback.advisorName}</h4>
          <Badge
            variant={
              feedback.status === "APPROVED"
                ? "approved"
                : feedback.status === "REJECTED" ||
                  feedback.status === "ADMIN_REJECTED"
                ? "destructive"
                : feedback.status === "REVISION"
                ? "outline"
                : "secondary"
            }
            className="capitalize"
          >
            {feedback.status === "APPROVED" && (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {feedback.status === "ADMIN_REJECTED" && (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {feedback.status === "REVISION" && (
              <Edit className="h-3 w-3 mr-1" />
            )}
            {feedback.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {feedback.createdAt}
          </span>
        </div>
        <h5 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">
          <strong>Paper: </strong>
          {paper?.paper.title}
        </h5>
        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">
          <strong>Feedback: </strong> {feedback.feedbackText}
        </p>

        {/* Action Buttons */}
        {feedback.fileUrl && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              onClick={() =>
                router.push(`/student/feedback/${feedback.paperUuid}`)
              }
            >
              <Eye className="h-4 w-4" />
              View Annotated PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download Feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentFeedbackPage() {
  // Fetch User Profile
  const { data: userProfile } = useGetUserProfileQuery();

  // Fetch all feedback for author's papers - returns array directly
  const { data: allFeedbackArray, isLoading: feedbackLoading } =
    useGetAllFeedbackByAuthorQuery();

  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort feedback by date from newest to oldest
  const filteredAndSortedFeedback = useMemo(() => {
    const feedbackArray = (allFeedbackArray || []) as Feedback[];

    // Filter by advisor name
    const filtered = feedbackArray.filter((feedback) => {
      const advisorName = (feedback.advisorName || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      return advisorName.includes(query);
    });

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [allFeedbackArray, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedback = filteredAndSortedFeedback.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Use all feedback for stats (not filtered)
  const allFeedback = useMemo(() => {
    const feedbackArray = (allFeedbackArray || []) as Feedback[];
    return feedbackArray;
  }, [allFeedbackArray]);

  // Notification hook
  const {
    showSuccess,
    showError,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  return (
    <DashboardLayout
      userRole="student"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="dashboard-header rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Feedback Timeline
          </h1>
          <p className="text-muted-foreground text-lg">
            Track all mentor feedback and comments on your submissions
          </p>
        </div>

        {/* Feedback Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Total Feedback
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {allFeedback.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Comments received
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Approvals</CardTitle>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {allFeedback.filter((fb) => fb.status === "APPROVED").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Papers approved
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Revisions</CardTitle>
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Edit className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {allFeedback.filter((fb) => fb.status === "REVISION").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Revision requests
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Rejections
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {
                  allFeedback.filter(
                    (fb) =>
                      fb.status === "REJECTED" || fb.status === "ADMIN_REJECTED"
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Papers rejected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modern Search Bar */}
        {allFeedback.length > 0 && (
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
                  placeholder="Search feedback by advisor name..."
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
                <span>Search by advisor name to filter feedback</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Timeline */}
        <Card className="dashboard-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl gradient-text">
                  Feedback History
                </CardTitle>
                <CardDescription className="text-base">
                  Chronological timeline of all mentor feedback and interactions
                </CardDescription>
              </div>
              {filteredAndSortedFeedback.length > 0 && (
                <Badge
                  className="text-sm font-semibold px-4 py-2"
                  style={{
                    background: "var(--color-secondary)",
                    color: "white",
                  }}
                >
                  {filteredAndSortedFeedback.length} Feedback
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {feedbackLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <FeedbackCardPlaceholder key={index} isLast={index === 2} />
                ))}
              </div>
            ) : allFeedback.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-lg">
                  No feedback received yet.
                </p>
              </div>
            ) : filteredAndSortedFeedback.length === 0 ? (
              <div className="py-16 text-center">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-lg mb-2">
                  No feedback found
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  No feedback matches your search criteria
                </p>
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="mt-2"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {currentFeedback.map((feedback: Feedback, index: number) => (
                    <FeedbackItem
                      key={feedback.paperUuid}
                      feedback={feedback}
                      isLast={index === currentFeedback.length - 1}
                      showSuccess={showSuccess}
                      showError={showError}
                      showLoading={showLoading}
                      closeNotification={closeNotification}
                    />
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
                          {Math.min(endIndex, filteredAndSortedFeedback.length)}{" "}
                          of {filteredAndSortedFeedback.length}
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
          </CardContent>
        </Card>
      </div>
      <NotificationComponent />
    </DashboardLayout>
  );
}
