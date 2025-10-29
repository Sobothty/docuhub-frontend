"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import {
  useGetUserStarsQuery,
  useGetStarCountQuery,
} from "@/feature/star/StarSlice";
import {
  Paper,
  useGetAllPublishedPapersQuery,
} from "@/feature/paperSlice/papers";
import HorizontalCard from "@/components/card/HorizontalCardForAuthor";
import PaperCardPlaceholder from "@/components/card/FavoriteCardPlaceholder";
import { Search, Star, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApiNotification } from "@/components/ui/api-notification";

export default function MyDownloads() {
  const { data: userProfile, isLoading: isProfileLoading } =
    useGetUserProfileQuery();
  const { data: userStars, isLoading: isStarsLoading } = useGetUserStarsQuery(
    userProfile?.user.uuid || ""
  );
  const { data: papers, isLoading: isPapersLoading } =
    useGetAllPublishedPapersQuery({
      page: 0,
      size: 100,
    });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const router = useRouter();

  // Initialize API notification
  const {
    showSuccess,
    showError,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  const papersWithStars: Paper[] | undefined = papers?.papers.content.filter(
    (paper) => userStars?.some((star) => star.paperUuid === paper.uuid)
  );

  // Filter and sort papers (latest first)
  const filteredAndSortedPapers = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    const filtered = !q
      ? papersWithStars
      : papersWithStars?.filter((paper) => {
          const title = (paper.title ?? "").toLowerCase();
          const abstractText = (paper.abstractText ?? "").toLowerCase();
          const categories = (paper.categoryNames ?? [])
            .join(" ")
            .toLowerCase();
          const year = (paper.publishedAt ?? "").toString().toLowerCase();
          return (
            title.includes(q) ||
            abstractText.includes(q) ||
            categories.includes(q) ||
            year.includes(q)
          );
        });

    // Sort by published date or created date - latest first
    return filtered?.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [papersWithStars, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(
    (filteredAndSortedPapers?.length || 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredAndSortedPapers?.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const isLoading = isProfileLoading || isStarsLoading || isPapersLoading;

  // Handle direct file download
  const handleDownload = async (fileUrl: string | undefined, title: string) => {
    try {
      if (!fileUrl) {
        showError("Download Failed", "No file URL available for this paper");
        return;
      }

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
      a.download = `${title
        .replace(/[^a-z0-9\-\s]/gi, "")
        .replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      // Close loading and show success
      closeNotification();
      showSuccess("Download Started!", "Your paper file is now downloading");
    } catch (error) {
      console.log("Failed to download:", error);
      closeNotification();
      showError(
        "Download Failed",
        "Failed to download paper. Please try again."
      );
    }
  };

  return (
    <DashboardLayout
      userRole="public"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        <div className="dashboard-header rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            My Favorite Papers
          </h1>
          <p className="text-muted-foreground text-lg">
            Papers you&apos;ve saved from the platform
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
                placeholder="Search favorites by title, abstract, category or year..."
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
                Try searching by title, abstract, category, or publication year
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Favorites List */}
        <div className="space-y-6">
          {/* Header with count */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                All Favorites
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Your starred papers collection
              </p>
            </div>
            {filteredAndSortedPapers && filteredAndSortedPapers.length > 0 && (
              <Badge
                className="text-sm font-semibold px-4 py-2"
                style={{
                  background: "var(--color-secondary)",
                  color: "white",
                }}
              >
                {filteredAndSortedPapers.length} Papers
              </Badge>
            )}
          </div>

          {/* Papers Display */}
          {isLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <PaperCardPlaceholder key={index} />
              ))}
            </div>
          ) : !filteredAndSortedPapers ||
            filteredAndSortedPapers.length === 0 ? (
            <Card className="dashboard-card border-0">
              <CardContent className="py-16 text-center">
                <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery
                    ? "No matching favorites"
                    : "No favorite papers yet"}
                </h3>
                <p className="text-muted-foreground text-base">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "Start adding papers to your favorites to see them here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-5">
                {currentPapers?.map((paper) => (
                  <HorizontalCardWithStarCount
                    key={paper.uuid}
                    paper={paper}
                    onViewPaper={() => router.push(`/papers/${paper.uuid}`)}
                    onDownloadPDF={() =>
                      handleDownload(paper.fileUrl, paper.title)
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Card className="dashboard-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Page Info */}
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredAndSortedPapers.length)} of{" "}
                        {filteredAndSortedPapers.length} favorites
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

      {/* API Notification */}
      <NotificationComponent />
    </DashboardLayout>
  );
}

// Component to wrap HorizontalCard with star count
interface HorizontalCardWithStarCountProps {
  paper: Paper;
  onViewPaper: () => void;
  onDownloadPDF?: () => void;
}

function HorizontalCardWithStarCount({
  paper,
  onViewPaper,
  onDownloadPDF,
}: HorizontalCardWithStarCountProps) {
  const { data: starCount = 0, isLoading } = useGetStarCountQuery(paper.uuid);

  return (
    <HorizontalCard
      key={paper.uuid}
      id={paper.uuid}
      title={paper.title}
      journal={paper.categoryNames.join(", ")}
      year={paper.publishedAt || "N/A"}
      downloads={paper.downloads?.toString() || "0"}
      abstract={paper.abstractText || ""}
      tags={paper.categoryNames}
      image={paper.thumbnailUrl || "/placeholder.svg"}
      star={isLoading ? "..." : starCount.toString()}
      onViewPaper={onViewPaper}
      onDownloadPDF={onDownloadPDF}
    />
  );
}
