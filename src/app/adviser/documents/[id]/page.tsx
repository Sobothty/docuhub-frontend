"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  Calendar,
  Loader2,
} from "lucide-react";
import PDFEdit from "@/components/pdf/PDFEdit";
import { useGetPaperByUuidQuery } from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useCreateFeedbackMutation } from "@/feature/feedbackSlice/feedbackSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

export default function AdviserDocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: paperUuid } = use(params);
  const router = useRouter();

  const [feedback, setFeedback] = useState("");
  const [decision, setDecision] = useState<"approved" | "revision" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  // Fetch adviser profile
  const { data: adviserProfile } = useGetUserProfileQuery();

  // Fetch paper data
  const {
    data: paperData,
    isLoading: paperLoading,
    error: paperError,
  } = useGetPaperByUuidQuery(paperUuid);

  const paper = paperData?.paper;

  // Fetch student/author data
  const { data: studentData, isLoading: studentLoading } = useGetUserByIdQuery(
    paper?.authorUuid || "",
    {
      skip: !paper?.authorUuid,
    }
  );

  // Add feedback mutation
  const [createFeedback] = useCreateFeedbackMutation();

  // Handle file upload success
  const handleUploadSuccess = (fileUri: string) => {
    console.log("Uploaded file URI:", fileUri);
    setUploadedFileUrl(fileUri);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
      case "UNDER_REVIEW":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
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

  const handleSubmitReview = async () => {
    if (!decision || !feedback.trim()) {
      alert("Please provide feedback and select a decision");
      return;
    }

    if (!uploadedFileUrl) {
      alert("Please upload the annotated PDF first");
      return;
    }

    if (!adviserProfile?.user?.uuid) {
      alert("Unable to identify adviser. Please try logging in again.");
      return;
    }

    // Verify paper exists before submitting
    if (!paper || !paper.uuid) {
      alert(
        "Paper information is missing. Please refresh the page and try again."
      );
      return;
    }

    // Debug logging with exact UUIDs
    console.log("=== DEBUGGING FEEDBACK SUBMISSION ===");
    console.log("URL Parameter paperUuid:", paperUuid);
    console.log("Paper object UUID:", paper.uuid);
    console.log("Paper object:", paper);
    console.log("Adviser UUID:", adviserProfile.user.uuid);
    console.log("Decision:", decision);
    console.log(
      "Status to send:",
      decision === "approved" ? "APPROVED" : "REVISION"
    );

    setIsSubmitting(true);
    try {
      // Create feedback with the uploaded file URL - using exact UUID from paper object
      const feedbackData = {
        paperUuid: paper.uuid, // This should be "b34f8df2-cbf9-42c4-b4f9-582b5110fd95"
        feedbackText: feedback.trim(),
        fileUrl: uploadedFileUrl,
        status: decision === "approved" ? "APPROVED" : "REVISION",
        advisorUuid: adviserProfile.user.uuid,
        deadline: decision === "approved" ? "" : "2025-12-31", // Empty string for approved, future date for revision
      };

      const result = await createFeedback(feedbackData).unwrap();
      if(result.status === 201){
        toast.success("Feedback submitted successfully");
      }

      router.push("/adviser/documents");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (paperLoading) {
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user.fullName || "Adviser Name"}
        userAvatar={adviserProfile?.user.imageUrl || undefined}
      >
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[600px] w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (paperError || !paper) {
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user.fullName || "Adviser Name"}
        userAvatar={adviserProfile?.user.imageUrl || undefined}
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-500 text-center text-lg">
            Failed to load document
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/adviser/documents")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
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
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/adviser/documents")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Documents
            </Button>
            <h1 className="text-2xl font-bold mt-2">{paper.title}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {studentLoading
                  ? "Loading..."
                  : studentData?.fullName || "Unknown Student"}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {paper.categoryNames?.[0] || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Submitted: {new Date(paper.submittedAt).toLocaleDateString()}
              </span>
              {getStatusBadge(paper.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Review</CardTitle>
                <CardDescription>
                  Review and annotate the student document. Click &quot;Upload to
                  Student&quot; to save your annotations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden">
                  <PDFEdit
                    pdfUri={paper.fileUrl}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </div>
                {uploadedFileUrl && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Annotated PDF uploaded successfully! You can now submit
                      your review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Feedback</CardTitle>
                <CardDescription>Provide feedback and decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Detailed Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide detailed feedback on the document..."
                    rows={6}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setDecision("approved")}
                    className={`flex-1 ${
                      decision === "approved"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approved
                  </Button>
                  <Button
                    onClick={() => setDecision("revision")}
                    className={`flex-1 ${
                      decision === "revision"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Revision
                  </Button>
                </div>
                {!uploadedFileUrl && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Please upload the annotated PDF before submitting your
                      review
                    </p>
                  </div>
                )}
                <Button
                  onClick={handleSubmitReview}
                  className="w-full"
                  disabled={
                    !decision ||
                    !feedback.trim() ||
                    !uploadedFileUrl ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Student</div>
                  <div className="font-medium flex items-center gap-2">
                    {studentLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      <>
                        {studentData?.imageUrl && (
                          <Image
                            src={studentData.imageUrl}
                            alt={studentData.fullName}
                            className="w-6 h-6 rounded-full"
                            width={24}
                            height={24}
                            unoptimized
                          />
                        )}
                        {studentData?.fullName || "Unknown Student"}
                      </>
                    )}
                  </div>
                  {studentData?.email && (
                    <div className="text-sm text-muted-foreground">
                      {studentData.email}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Categories
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {paper.categoryNames?.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    )) || <span className="text-sm">N/A</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Submitted</div>
                  <div className="font-medium">
                    {new Date(paper.submittedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="mt-1">{getStatusBadge(paper.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Description
                  </div>
                  <div className="text-sm mt-1">
                    {paper.abstractText || "No description available"}
                  </div>
                </div>
                {paper.thumbnailUrl && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Thumbnail
                    </div>
                    <Image
                      src={paper.thumbnailUrl}
                      alt={paper.title}
                      className="w-full rounded-lg object-cover"
                      width={700}
                      height={300}
                      unoptimized
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
