"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit,
  MessageSquare,
  Download,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetFeedbackByPaperUuidQuery } from "@/feature/feedbackSlice/feedbackSlice";
import { useGetPaperByUuidQuery } from "@/feature/paperSlice/papers";
import PDFViewer from "@/components/pdf/PDFView";

export default function StudentFeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();

  const paperUuid = (params?.uuid as string) || "";
  console.log("Paper UUID:", paperUuid);

  // Fetch user profile
  const { data: userProfile } = useGetUserProfileQuery();

  const { data: feedbackData, isLoading: feedbackLoading } =
    useGetFeedbackByPaperUuidQuery(paperUuid);
    console.log("Feedback Data:", feedbackData);

  const { data: paperData } = useGetPaperByUuidQuery(paperUuid);
  console.log("Paper Data:", paperData);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "APPROVED":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REVISION":
        return (
          <Badge variant="outline">
            <Edit className="w-3 h-3 mr-1" />
            Revision Required
          </Badge>
        );
      case "REJECTED":
      case "ADMIN_REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  return (
    <DashboardLayout
      userRole="student"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/student/feedback")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Feedback
            </Button>
            <h1 className="text-2xl font-bold mt-2">Feedback Details</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {getTypeIcon(feedbackData?.status || "")}
              </span>
              <span>From: {feedbackData?.advisorName}</span>
              <span>{feedbackData?.createdAt}</span>
              {getStatusBadge(feedbackData?.status || "")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Annotated Document</CardTitle>
                <CardDescription>
                  View your document with mentor annotations and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                {feedbackData?.fileUrl ? (
                  <div>
                    <div className="flex items-center justify-center gap-4 mb-4 rounded-lg">
                      <PDFViewer pdfUri={feedbackData?.fileUrl || ""} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No annotated PDF available for this feedback.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Feedback</CardTitle>
                <CardDescription>
                  Detailed feedback from your mentor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        feedbackData?.adviserImageUrl || "/placeholder.svg"
                      }
                      alt={feedbackData?.advisorName}
                    />
                    <AvatarFallback>
                      {feedbackData?.advisorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">
                      {feedbackData?.advisorName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {feedbackData?.adviserImageUrl}
                    </div>
                  </div>
                  {getStatusBadge(feedbackData?.status || "")}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Feedback</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedbackData?.feedbackText ||
                      "No feedback text provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Document Title
                  </div>
                  <div className="font-medium">
                    {paperData?.paper.title}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mentor</div>
                  <div className="font-medium">
                    {feedbackData?.advisorName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Review Date
                  </div>
                  <div className="font-medium">
                    {feedbackData?.createdAt}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div>{getStatusBadge(feedbackData?.status || "")}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
