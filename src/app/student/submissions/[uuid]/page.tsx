"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Download,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  FileText,
  Eye,
} from "lucide-react";
import {
  useGetPaperByUuidQuery,
  Assignment,
} from "@/feature/paperSlice/papers";
import { useGetAllAssignmentsQuery } from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetFeedbackByPaperUuidQuery } from "@/feature/feedbackSlice/feedbackSlice";
import { useApiNotification } from "@/components/ui/api-notification";

type BadgeVariant = "default" | "destructive" | "outline" | "secondary";

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "APPROVED":
        return {
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 shadow-sm px-3 py-1.5 text-sm font-semibold",
        };
      case "REJECTED":
      case "ADMIN_REJECTED":
        return {
          icon: <XCircle className="h-4 w-4 mr-1" />,
          className:
            "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700 shadow-sm px-3 py-1.5 text-sm font-semibold",
        };
      case "REVISION":
        return {
          icon: <Edit className="h-4 w-4 mr-1" />,
          className:
            "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 shadow-sm px-3 py-1.5 text-sm font-semibold",
        };
      case "PENDING":
        return {
          icon: <Clock className="h-4 w-4 mr-1" />,
          className:
            "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 shadow-sm px-3 py-1.5 text-sm font-semibold",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 mr-1" />,
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 shadow-sm px-3 py-1.5 text-sm font-semibold",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge className={`capitalize ${config.className}`}>
      {config.icon}
      {status}
    </Badge>
  );
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: userProfile } = useGetUserProfileQuery();
  const {
    showSuccess,
    showError,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  const submissionId = (params?.uuid as string) || "";

  // Fetch paper data
  const {
    data: paperData,
    isLoading: paperLoading,
    error: paperError,
  } = useGetPaperByUuidQuery(submissionId, {
    skip: !submissionId,
  });

  // Fetch assignments to get adviser info
  const { data: assignmentData } = useGetAllAssignmentsQuery();

  // Find the assignment for this paper
  const assignment = useMemo(() => {
    if (!assignmentData || !paperData) return null;
    return assignmentData.find(
      (assign: Assignment) => assign.paperUuid === paperData.paper.uuid
    );
  }, [assignmentData, paperData]);

  // Fetch adviser data
  const { data: adviserData } = useGetUserByIdQuery(
    assignment?.adviserUuid || "",
    {
      skip: !assignment?.adviserUuid,
    }
  );

  const { data: feedbackData } = useGetFeedbackByPaperUuidQuery(submissionId, {
    skip: !submissionId,
  });

  if (!submissionId) {
    return (
      <DashboardLayout
        userRole="student"
        userAvatar={userProfile?.user.imageUrl}
        userName={userProfile?.user.fullName}
      >
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/student/submissions")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to submissions
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Submission not found</CardTitle>
              <CardDescription>
                We couldn&apos;t find that document. It may have been moved or
                deleted.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (paperLoading) {
    return (
      <DashboardLayout
        userRole="student"
        userAvatar={userProfile?.user.imageUrl}
        userName={userProfile?.user.fullName}
      >
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading submission details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (paperError || !paperData) {
    return (
      <DashboardLayout
        userRole="student"
        userAvatar={userProfile?.user.imageUrl}
        userName={userProfile?.user.fullName}
      >
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/student/submissions")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to submissions
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Submission not found</CardTitle>
              <CardDescription>
                We couldn&apos;t find that document. It may have been moved or
                deleted.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const submission = paperData;
  const mentor = adviserData?.fullName || "Not assigned";
  const categories = Array.isArray(submission.paper.categoryNames)
    ? submission.paper.categoryNames.join(", ")
    : submission.paper.categoryNames || "Uncategorized";

  const handleDownload = async () => {
    const url = submission.paper.fileUrl;
    if (!url) {
      showError("Download Failed", "File not available for download");
      return;
    }

    // Show loading notification
    showLoading(
      "Preparing Download",
      "Please wait while we prepare your file..."
    );

    try {
      // Fetch the file to ensure it downloads instead of previewing
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${submission.paper.title
        .replace(/[^a-z0-9\-\s]/gi, "")
        .replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(downloadUrl);

      // Close loading and show success
      closeNotification();
      setTimeout(() => {
        showSuccess(
          "Download Complete!",
          "Your file has been downloaded successfully."
        );
      }, 100);
    } catch (error) {
      closeNotification();
      setTimeout(() => {
        showError(
          "Download Failed",
          "Failed to download file. Please try again."
        );
      }, 100);
    }
  };

  return (
    <DashboardLayout
      userRole="student"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        <div className="dashboard-header rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
                {submission.paper.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusBadge status={submission.paper.status} />
                <Separator orientation="vertical" className="h-5" />
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 px-3 py-1.5 shadow-sm font-semibold">
                  {categories}
                </Badge>
                <Separator orientation="vertical" className="h-5" />
                <span className="text-muted-foreground font-medium">
                  Submitted:{" "}
                  {submission.paper.submittedAt || submission.paper.createdAt}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/student/submissions")}
                className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors border-blue-200 dark:border-blue-800 font-semibold"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="dashboard-card border-0 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Overview
                </CardTitle>
                <CardDescription className="text-base">
                  A quick look at your document details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="about">
                  <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 rounded-xl shadow-sm">
                    <TabsTrigger
                      value="about"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-semibold"
                    >
                      About
                    </TabsTrigger>
                    <TabsTrigger
                      value="files"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-semibold"
                    >
                      Files
                    </TabsTrigger>
                    <TabsTrigger
                      value="feedback"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-semibold"
                    >
                      Feedback
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-foreground">
                        Abstract
                      </h3>
                      <p className="text-base text-muted-foreground leading-7 bg-muted/30 p-4 rounded-xl">
                        {submission.paper.abstractText ||
                          "No abstract provided."}
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-border/50 p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 hover:shadow-md transition-all">
                        <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">
                          Mentor
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-blue-500 shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                              {mentor
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-bold text-blue-900 dark:text-blue-100">
                            {mentor}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-border/50 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-all">
                        <div className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                          Status
                        </div>
                        <div className="mt-2">
                          <StatusBadge status={submission.paper.status} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="files" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      {/* File Info Card */}
                      <div className="rounded-xl border border-border/50 p-5 flex items-center justify-between bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-base font-bold text-foreground">
                              {submission.paper.title}.pdf
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                              Uploaded {submission.paper.createdAt}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleDownload}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all font-semibold"
                        >
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>

                      {/* PDF Preview */}
                      <div className="rounded-xl border border-border/50 overflow-hidden bg-white dark:bg-gray-900 shadow-md">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 px-4 py-3 border-b border-border/50">
                          <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-bold text-blue-900 dark:text-blue-100">
                              PDF Preview
                            </span>
                          </div>
                        </div>
                        <div
                          className="relative w-full"
                          style={{ height: "600px" }}
                        >
                          <iframe
                            src={submission.paper.fileUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                            style={{ border: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="feedback" className="space-y-4 mt-6">
                    <div className="rounded-xl border border-border/50 p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                      {feedbackData?.feedbackText ? (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <svg
                              className="h-5 w-5 text-blue-600 dark:text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            <span className="font-bold text-blue-900 dark:text-blue-100">
                              Mentor Feedback
                            </span>
                          </div>
                          <p className="text-base text-blue-800 dark:text-blue-200 leading-7">
                            {feedbackData.feedbackText}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg
                            className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <p className="text-base text-muted-foreground font-medium">
                            No mentor feedback yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-border/50 pb-4">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Activity
                </CardTitle>
                <CardDescription className="text-base">
                  Recent updates and comments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="mt-1 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base">
                        <span className="font-bold text-foreground">You</span>{" "}
                        <span className="text-muted-foreground">
                          submitted this document
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium mt-1">
                        {submission.paper.createdAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="mt-1 h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base text-foreground font-semibold">
                        Document last updated
                      </div>
                      <div className="text-sm text-muted-foreground font-medium mt-1">
                        {submission.paper.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="dashboard-card border-0 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-border/50 pb-4">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Document Info
                </CardTitle>
                <CardDescription className="text-base">
                  Key details at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Category
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 font-semibold">
                    {categories}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Mentor
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {mentor}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Submitted
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {submission.paper.createdAt}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Last updated
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {submission.paper.createdAt}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-border/50 pb-4">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/student/submissions")}
                  className="w-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to list
                </Button>
                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <NotificationComponent />
    </DashboardLayout>
  );
}
