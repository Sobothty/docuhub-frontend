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
} from "lucide-react";
import {
  useGetPaperByUuidQuery,
  Assignment,
} from "@/feature/paperSlice/papers";
import { useGetAllAssignmentsQuery } from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetFeedbackByPaperUuidQuery } from "@/feature/feedbackSlice/feedbackSlice";

type BadgeVariant = "default" | "destructive" | "outline" | "secondary";

function StatusBadge({ status }: { status: string }) {
  const icon =
    status === "APPROVED" ? (
      <CheckCircle className="h-3 w-3 mr-1" />
    ) : status === "REJECTED" || status === "ADMIN_REJECTED" ? (
      <XCircle className="h-3 w-3 mr-1" />
    ) : status === "REVISION" ? (
      <Edit className="h-3 w-3 mr-1" />
    ) : (
      <Clock className="h-3 w-3 mr-1" />
    );

  const variant: BadgeVariant =
    status === "APPROVED"
      ? "default"
      : status === "REJECTED" || status === "ADMIN_REJECTED"
      ? "destructive"
      : status === "REVISION"
      ? "outline"
      : "secondary";

  return (
    <Badge variant={variant} className="capitalize">
      {icon}
      {status}
    </Badge>
  );
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: userProfile } = useGetUserProfileQuery();

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

  const handleDownload = () => {
    if (submission.paper.fileUrl) {
      const a = document.createElement("a");
      a.href = submission.paper.fileUrl;
      a.download = `${submission.paper.title
        .replace(/[^a-z0-9\-\s]/gi, "")
        .replace(/\s+/g, "-")}.pdf`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <DashboardLayout
      userRole="student"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {submission.paper.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <StatusBadge status={submission.paper.status} />
                <Separator orientation="vertical" className="h-4" />
                <span>
                  Category:{" "}
                  <span className="font-medium text-foreground">
                    {categories}
                  </span>
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>
                  Submitted:{" "}
                  {submission.paper.submittedAt || submission.paper.createdAt}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>Updated: {submission.paper.createdAt}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/student/submissions")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  A quick look at your document details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="about">
                  <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold">Abstract</h3>
                      <p className="text-sm text-muted-foreground leading-6">
                        {submission.paper.abstractText ||
                          "No abstract provided."}
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border p-4">
                        <div className="text-xs text-muted-foreground">
                          Mentor
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {mentor
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-medium">{mentor}</div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border p-4">
                        <div className="text-xs text-muted-foreground">
                          Status
                        </div>
                        <div className="mt-1">
                          <StatusBadge status={submission.paper.status} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="files" className="space-y-3">
                    <div className="rounded-lg border border-border p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <div>
                          <div className="text-sm font-medium">
                            {submission.paper.title}.pdf
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Uploaded {submission.paper.createdAt}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="feedback" className="space-y-3">
                    <div className="rounded-lg border border-border p-4">
                      {feedbackData?.feedbackText ? (
                        <div className="text-sm text-muted-foreground">
                          {feedbackData.feedbackText}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No mentor feedback yet.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent updates and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">You</span> submitted this
                        document
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {submission.paper.createdAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm">Document last updated</div>
                      <div className="text-xs text-muted-foreground">
                        {submission.paper.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Info</CardTitle>
                <CardDescription>Key details at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="text-sm font-medium">{categories}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Mentor</div>
                  <div className="text-sm font-medium">{mentor}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Submitted</div>
                  <div className="text-sm font-medium">
                    {submission.paper.createdAt}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last updated
                  </div>
                  <div className="text-sm font-medium">
                    {submission.paper.createdAt}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/student/submissions")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to list
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
