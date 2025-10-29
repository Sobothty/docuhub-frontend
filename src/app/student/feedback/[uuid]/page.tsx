"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit,
  MessageSquare,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetFeedbackByPaperUuidQuery } from "@/feature/feedbackSlice/feedbackSlice";
import { useGetPaperByUuidQuery } from "@/feature/paperSlice/papers";
import PDFViewer from "@/components/pdf/PDFView";
import FeedbackDetailsPlaceholder from "@/components/card/FeedbackCardPlaceHolderByUuid";

export default function StudentFeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();

  const paperUuid = (params?.uuid as string) || "";
  console.log("Paper UUID:", paperUuid);

  // Fetch user profile
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useGetUserProfileQuery();
  const { data: feedbackData, isLoading: isFeedbackLoading } =
    useGetFeedbackByPaperUuidQuery(paperUuid);
  const { data: paperData, isLoading: isPaperLoading } =
    useGetPaperByUuidQuery(paperUuid);

  const isLoading = isUserProfileLoading || isFeedbackLoading || isPaperLoading;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="feedback-detail-status-approved flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "revision":
        return (
          <span className="feedback-detail-status-revision flex items-center gap-1">
            <Edit className="w-3 h-3" />
            Revision Required
          </span>
        );
      case "rejected":
      case "admin_rejected":
        return (
          <span className="feedback-detail-status-rejected flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="feedback-detail-status-revision flex items-center gap-1">
            {status}
          </span>
        );
    }
  };

  const getTypeIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "revision":
        return <Edit className="h-4 w-4" />;
      case "rejected":
      case "admin_rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        userRole="student"
        userAvatar={userProfile?.user.imageUrl}
        userName={userProfile?.user.fullName}
      >
        <FeedbackDetailsPlaceholder />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole="student"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="dashboard-background min-h-screen py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <div>
            <Button
              onClick={() => router.push("/student/feedback")}
              variant="outline"
              className="px-6 py-2 rounded-xl font-semibold bg-card hover:bg-accent text-card-foreground border-2 border-border advisor-profile-btn-secondary"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Feedback
            </Button>
          </div>

          {/* Hero Header */}
          <div className="feedback-detail-hero-card">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold gradient-text mb-4">
                  Feedback Details
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-base">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      {getTypeIcon(feedbackData?.status || "")}
                    </div>
                    <span className="font-semibold text-foreground">
                      Status: {getStatusBadge(feedbackData?.status || "")}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-500">
                      <AvatarImage
                        src={
                          feedbackData?.adviserImageUrl || "/placeholder.svg"
                        }
                        alt={feedbackData?.advisorName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-xs">
                        {feedbackData?.advisorName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-muted-foreground">
                      From:{" "}
                      <span className="text-foreground font-semibold">
                        {feedbackData?.advisorName}
                      </span>
                    </span>
                  </div>
                  <div className="h-6 w-px bg-border"></div>
                  <span className="text-muted-foreground font-medium">
                    {feedbackData?.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PDF Viewer */}
            <div className="lg:col-span-2">
              <Card className="feedback-detail-section-card border-0">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl gradient-text">
                        Annotated Document
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        View your document with mentor annotations and feedback
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {feedbackData?.fileUrl ? (
                    <div>
                      <div className="flex items-center justify-center gap-4 mb-4 rounded-lg">
                        <PDFViewer pdfUri={feedbackData?.fileUrl || ""} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">
                        No annotated PDF available for this feedback.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Feedback Panel */}
            <div className="space-y-6">
              <Card className="feedback-detail-section-card border-0">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl gradient-text">
                        Mentor Feedback
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Detailed feedback from your mentor
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="feedback-mentor-info-box flex items-start gap-4">
                    <Avatar className="h-14 w-14 ring-4 ring-blue-500 shadow-lg">
                      <AvatarImage
                        src={
                          feedbackData?.adviserImageUrl || "/placeholder.svg"
                        }
                        alt={feedbackData?.advisorName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg">
                        {feedbackData?.advisorName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-foreground mb-1">
                        {feedbackData?.advisorName}
                      </div>
                      <div className="mb-2">
                        {getStatusBadge(feedbackData?.status || "")}
                      </div>
                    </div>
                  </div>

                  <div className="feedback-message-box">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 feedback-message-title">
                      <MessageSquare className="h-5 w-5" />
                      Feedback Message
                    </h4>
                    <p className="text-base text-foreground leading-relaxed">
                      {feedbackData?.feedbackText ||
                        "No feedback text provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="feedback-detail-section-card border-0">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl gradient-text">
                        Document Info
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Key details at a glance
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <div className="feedback-detail-info-row">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      Document Title
                    </div>
                    <div className="font-bold text-base text-foreground">
                      {paperData?.paper.title}
                    </div>
                  </div>
                  <div className="feedback-detail-info-row">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      Mentor
                    </div>
                    <div className="font-bold text-base text-foreground">
                      {feedbackData?.advisorName}
                    </div>
                  </div>
                  <div className="feedback-detail-info-row">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      Review Date
                    </div>
                    <div className="font-bold text-base text-foreground">
                      {feedbackData?.createdAt}
                    </div>
                  </div>
                  <div className="feedback-detail-info-row">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      Status
                    </div>
                    <div>{getStatusBadge(feedbackData?.status || "")}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
