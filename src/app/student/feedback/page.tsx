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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetAllFeedbackByAuthorQuery } from "@/feature/feedbackSlice/feedbackSlice";
import {
  useGetPaperByUuidQuery,
  useGetPapersByAuthorQuery,
} from "@/feature/paperSlice/papers";

// Separate component for each feedback item
function FeedbackItem({ feedback, index, isLast }: any) {
  const router = useRouter();
  const { data: paper } = useGetPaperByUuidQuery(feedback.paperUuid);

  return (
    <div key={feedback.paperUuid} className="flex gap-4">
      <div className="flex flex-col items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={feedback.adviserImageUrl || "/placeholder.svg"}
            alt={feedback.advisorName}
          />
          <AvatarFallback>
            {feedback.advisorName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {!isLast && <div className="w-px h-16 bg-border mt-2" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-medium">{feedback.advisorName}</h4>
          <Badge
            variant={
              feedback.status === "APPROVED"
                ? "default"
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
        <h5 className="font-medium text-sm mb-2">{paper?.title}</h5>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feedback.feedbackText}
        </p>

        {/* Action Buttons */}
        {feedback.fileUrl && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() =>
                router.push(`/student/feedback/${feedback.paperUuid}`)
              }
            >
              <Eye className="h-3 w-3" />
              View Annotated PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
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

  // Fetch author's papers
  const { data: authorPapers, isLoading: papersLoading } =
    useGetPapersByAuthorQuery({});

  const router = useRouter();

  const papers = authorPapers?.papers.content || [];
  const allFeedback = allFeedbackArray || [];

  return (
    <DashboardLayout
      userRole="student"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Feedback Timeline
          </h1>
          <p className="text-muted-foreground">
            Track all mentor feedback and comments on your submissions
          </p>
        </div>

        {/* Feedback Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allFeedback.length}</div>
              <p className="text-xs text-muted-foreground">Comments received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approvals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allFeedback.filter((fb) => fb.status === "APPROVED").length}
              </div>
              <p className="text-xs text-muted-foreground">Papers approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revisions</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allFeedback.filter((fb) => fb.status === "REVISION").length}
              </div>
              <p className="text-xs text-muted-foreground">Revision requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejections</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  allFeedback.filter(
                    (fb) =>
                      fb.status === "REJECTED" || fb.status === "ADMIN_REJECTED"
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Papers rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback History</CardTitle>
            <CardDescription>
              Chronological timeline of all mentor feedback and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackLoading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Loading feedback...</p>
              </div>
            ) : allFeedback.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No feedback received yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {allFeedback.map((feedback, index) => (
                  <FeedbackItem
                    key={feedback.paperUuid}
                    feedback={feedback}
                    index={index}
                    isLast={index === allFeedback.length - 1}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
