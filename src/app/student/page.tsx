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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText,
  CheckCircle,
  MessageSquare,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";
import HorizontalCard from "@/components/card/HorizontalCardForAuthor";
import { useState, useEffect } from "react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetPapersByAuthorQuery } from "@/feature/paperSlice/papers";
import {
  useGetUserStarsQuery,
  useGetStarCountQuery,
  StarResponse,
} from "@/feature/star/StarSlice";
import { useRouter } from "next/navigation";
import ProposalCardPlaceholder from "./proposals/PaperSkeleton";
import { useApiNotification } from "@/components/ui/api-notification";

// Type definitions
interface User {
  uuid: string;
  fullName: string;
  imageUrl?: string;
  isStudent: boolean;
}

interface UserProfileResponse {
  user: User;
}

interface Paper {
  uuid: string;
  title: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  isApproved: boolean;
  downloads?: number;
  authorUuid: string;
  categoryNames: string[];
  abstractText?: string;
  thumbnailUrl?: string;
  fileUrl?: string;
}

interface PapersResponse {
  papers: {
    content: Paper[];
  };
}

interface FilteredDocument {
  id: string;
  title: string;
  status: string;
  savedDate: string;
  feedback: string;
  progress: number;
  fileSize: string;
  downloads: number;
  isWishlist: boolean;
  authors: string[];
  journal: string;
  year: string;
  abstract?: string;
  tags: string[];
  image: string;
  starCount: number;
  fileUrl?: string;
}

// Add this above the main component
interface MentorInfo {
  fullName: string;
  imageUrl?: string;
  title?: string;
  university?: string;
  lastInteraction?: string;
  feedbackCount?: number;
  responseTime?: string;
  uuid?: string;
}

function MentorCard({ mentor }: { mentor: MentorInfo }) {
  return (
    <Card className="overview-section-card">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <CardTitle className="text-2xl gradient-text flex items-center gap-2">
          <svg
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Your Mentor
        </CardTitle>
        <CardDescription className="text-base">
          Connect with your assigned mentor
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mentor-profile-section">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="mentor-avatar">
              <AvatarImage
                src={mentor.imageUrl || "/placeholder.svg?height=48&width=48"}
                alt={mentor.fullName}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-lg">
                {mentor.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                {mentor.fullName}
              </h4>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {mentor.title || "Mentor"}
              </p>
              <p className="text-sm text-blue-500 dark:text-blue-400">
                {mentor.university || ""}
              </p>
            </div>
          </div>
        </div>
        <div className="mentor-info-card space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              Last interaction:
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {mentor.lastInteraction || "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="font-semibold text-gray-900 dark:text-white">
              Total feedback received:
            </span>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700 font-semibold"
            >
              {mentor.feedbackCount ?? "-"} comments
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              Response time:
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {mentor.responseTime || "-"}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/student/mentorship"
            className="mentor-action-button mentor-action-button-primary flex-1"
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </Link>
          <Link
            href={mentor.uuid ? `/mentors/${mentor.uuid}` : "#"}
            className="mentor-action-button mentor-action-button-secondary flex-1"
          >
            View Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentOverviewPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("documents");
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

  const { data: user } = useGetUserProfileQuery() as {
    data: UserProfileResponse | undefined;
  };

  // Get user's starred papers
  const { data: starData, isLoading: starLoading } = useGetUserStarsQuery(
    user?.user.uuid || "",
    { skip: !user?.user.uuid }
  );

  // Use useEffect to redirect if not a student (prevent SSR issues)
  useEffect(() => {
    if (user?.user.isStudent === false) {
      router.push("/");
    }
  }, [user?.user.isStudent, router]);

  // Fetch author's papers with pagination
  const { data: papersData, isLoading: papersLoading } =
    useGetPapersByAuthorQuery({
      page: 0,
      size: 10,
      sortBy: "createdAt",
      direction: "desc",
    }) as {
      data: PapersResponse | undefined;
      isLoading: boolean;
    };

  // Extract papers from the response
  const authorPapers: Paper[] = papersData?.papers?.content || [];

  // Filter documents based on search query
  const filteredDocuments: FilteredDocument[] = authorPapers
    .filter((paper: Paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((paper: Paper) => ({
      id: paper.uuid,
      title: paper.title,
      status: paper.status,
      savedDate: new Date(paper.createdAt).toLocaleDateString("en-US"),
      feedback: paper.isApproved ? "Approved" : "Under review",
      progress: paper.isApproved ? 100 : 75,
      fileSize: "2.4 MB",
      downloads: paper.downloads || 0,
      isWishlist: false,
      authors: [paper.authorUuid],
      journal: paper.categoryNames[0] || "N/A",
      year: new Date(paper.publishedAt || paper.createdAt)
        .getFullYear()
        .toString(),
      abstract: paper.abstractText,
      tags: paper.categoryNames,
      image: paper.thumbnailUrl || "/placeholder.svg?height=200&width=300",
      starCount: 0,
      fileUrl: paper.fileUrl,
    }));

  // Pagination calculations
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      userRole="student"
      userName={user?.user.fullName}
      userAvatar={
        user?.user.imageUrl ||
        "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg"
      }
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="dashboard-header rounded-3xl p-4 sm:p-6 md:p-8 mb-6 shadow-sm">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 items-start md:items-center">
            <div className="w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 sm:mb-3 tracking-tight">
                Student Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium">
                Track your academic journey and manage your research
              </p>
            </div>
            <div className="w-full flex gap-3 justify-start md:justify-end">
              <Button
                asChild
                size="lg"
                className="text-white shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                <Link href="/student/proposals">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  New Document
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card className="stat-card border-0 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Total Documents
              </CardTitle>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">
                {authorPapers.length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {papersLoading ? "Loading..." : "Papers submitted"}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Approved Papers
              </CardTitle>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">
                {authorPapers.filter((p: Paper) => p.isApproved).length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Published documents
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Total Downloads
              </CardTitle>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400 mb-1">
                {authorPapers.reduce(
                  (sum: number, p: Paper) => sum + (p.downloads || 0),
                  0
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                All time downloads
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Star Rating
              </CardTitle>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400 fill-orange-500/20" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400 mb-1">
                {starLoading
                  ? "..."
                  : (starData as StarResponse[])?.length || 0}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Academic impact
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          defaultValue={activeTab}
          className="space-y-4"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 gap-2 ">
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 rounded-xl font-bold text-base py-4 data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              My Papers
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 rounded-xl font-bold text-base py-4 data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Papers */}
              <Card className="overview-section-card">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Recent Papers
                  </CardTitle>
                  <CardDescription className="text-base">
                    Your recently submitted papers
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {papersLoading ? (
                    <div className="text-center py-4">Loading papers...</div>
                  ) : (
                    <div className="space-y-3">
                      {authorPapers.slice(0, 3).map((paper: Paper) => (
                        <PaperItemOverview key={paper.uuid} paper={paper} />
                      ))}
                    </div>
                  )}
                  <button className="view-all-button mt-6">
                    <Link
                      href="/student/proposals"
                      className="flex items-center justify-center gap-2"
                    >
                      View All Papers
                    </Link>
                  </button>
                </CardContent>
              </Card>

              {/* Mentor Information */}
              <MentorCard
                mentor={{
                  fullName: "Dr. Sarah Johnson",
                  imageUrl: "/placeholder.svg?height=48&width=48",
                  title: "Professor of Computer Science",
                  university: "Stanford University",
                  lastInteraction: "2 days ago",
                  feedbackCount: 8,
                  responseTime: "~24 hours",
                  uuid: "1", // Replace with real mentor uuid if available
                }}
              />
            </div>

            {/* Research Interests */}
            <Card className="overview-section-card">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                  <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Research Interests
                </CardTitle>
                <CardDescription className="text-base">
                  Your areas of academic focus and interest
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {[
                    "Machine Learning",
                    "Healthcare Technology",
                    "Data Analysis",
                    "Computer Vision",
                  ].map((interest: string, index: number) => (
                    <Badge
                      key={index}
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      {interest}
                    </Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-semibold"
                  >
                    <Link href="/student/settings">Edit Interests</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {/* Document Management */}
            <Card className="dashboard-card border-0 shadow-xl">
              <CardHeader className="papers-section-header">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl font-black gradient-text mb-2">
                      My Papers
                    </CardTitle>
                    <CardDescription className="text-base font-medium">
                      Manage your submitted academic papers
                    </CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search papers..."
                        className="pl-10 w-full md:w-72 h-11 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 font-medium"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSearchQuery(e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-xl border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-bold"
                    >
                      <Filter className="h-5 w-5 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {papersLoading ? (
                  <ProposalCardPlaceholder />
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="h-20 w-20 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-lg font-semibold text-muted-foreground">
                      No papers found. Start by submitting your first paper!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      {currentDocuments.map((doc: FilteredDocument) => (
                        <HorizontalCardWithStarCount
                          key={doc.id}
                          doc={doc}
                          onDownloadPDF={() =>
                            handleDownload(doc.fileUrl, doc.title)
                          }
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
                              {Math.min(endIndex, filteredDocuments.length)} of{" "}
                              {filteredDocuments.length} papers
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2">
                              {/* Previous Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
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
                                                  "linear-gradient(to right, #2563eb, #1951cc)",
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
          </TabsContent>
        </Tabs>
      </div>

      {/* API Notification */}
      <NotificationComponent />
    </DashboardLayout>
  );
}

// Component for Overview tab Recent Papers section
interface PaperItemOverviewProps {
  paper: Paper;
}

function PaperItemOverview({ paper }: PaperItemOverviewProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="capitalize bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 text-xs px-2 py-0.5">
            Approved
          </Badge>
        );
      case "REJECTED":
      case "ADMIN_REJECTED":
        return (
          <Badge className="capitalize bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700 text-xs px-2 py-0.5">
            Rejected
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge className="capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 text-xs px-2 py-0.5">
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge className="capitalize bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 text-xs px-2 py-0.5">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div
      className="recent-paper-item cursor-pointer"
      onClick={() => router.push(`/student/submissions/${paper.uuid}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="recent-paper-title mb-2 line-clamp-2">
            {paper.title}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <svg
                className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(paper.createdAt).toLocaleDateString()}
            </span>
            {paper.categoryNames && paper.categoryNames.length > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {paper.categoryNames[0]}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">{getStatusBadge(paper.status)}</div>
      </div>
    </div>
  );
}

// Component to wrap HorizontalCard with star count
interface HorizontalCardWithStarCountProps {
  doc: FilteredDocument;
  onDownloadPDF: () => void;
}

function HorizontalCardWithStarCount({
  doc,
  onDownloadPDF,
}: HorizontalCardWithStarCountProps) {
  const { data: starCount = 0, isLoading } = useGetStarCountQuery(doc.id);

  return (
    <HorizontalCard
      key={doc.id}
      id={doc.id}
      title={doc.title}
      journal={doc.journal}
      year={doc.year}
      downloads={doc.downloads.toString()}
      abstract={doc.abstract || ""}
      tags={doc.tags}
      image={doc.image}
      star={isLoading ? "..." : starCount.toString()}
      onDownloadPDF={onDownloadPDF}
    />
  );
}
