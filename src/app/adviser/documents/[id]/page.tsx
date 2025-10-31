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
  FileText,
  Mail,
} from "lucide-react";
import PDFEdit from "@/components/pdf/PDFEdit";
import { useGetPaperByUuidQuery } from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useCreateFeedbackMutation } from "@/feature/feedbackSlice/feedbackSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiNotification } from "@/components/ui/api-notification";

export default function AdviserDocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: paperUuid } = use(params);
  const router = useRouter();

  const [feedback, setFeedback] = useState("");
  const [decision, setDecision] = useState<"APPROVED" | "REVISION" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [customDeadline, setCustomDeadline] = useState<string>("");

  // API Notification hook
  const {
    showSuccess,
    showError,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

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
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-700 border-amber-500/20 backdrop-blur-sm"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="default"
            className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 backdrop-blur-sm"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
      case "ADMIN_REJECTED":
        return (
          <Badge
            variant="destructive"
            className="bg-rose-500/10 text-rose-700 border-rose-500/20 backdrop-blur-sm"
          >
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

    setIsSubmitting(true);
    showLoading(
      "Submitting Review",
      "Please wait while we submit your review to the student..."
    );

    try {
      // Use custom deadline if set, otherwise calculate automatically
      let finalDeadline = customDeadline;

      if (!finalDeadline) {
        // Calculate deadline: 30 days from now for revisions, 7 days for approved
        const deadlineDate = new Date();
        deadlineDate.setDate(
          deadlineDate.getDate() + (decision === "APPROVED" ? 7 : 30)
        );
        finalDeadline = deadlineDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      }

      // Create feedback with the uploaded file URL - using exact UUID from paper object
      const feedbackData = {
        paperUuid: paper.uuid,
        feedbackText: feedback.trim(),
        fileUrl: uploadedFileUrl,
        status: decision,
        advisorUuid: adviserProfile.user.uuid,
        deadline: finalDeadline,
      };
      console.log("Feedback Data: ", feedbackData);

      const result = await createFeedback(feedbackData).unwrap();
      console.log("Feedback API Response:", result);

      // If .unwrap() succeeds without throwing, the API call was successful (201/200)
      // The HTTP status code (201) is not part of the response body
      closeNotification();
      showSuccess(
        "Review Submitted Successfully",
        "Your feedback has been submitted and the student has been notified."
      );
      setTimeout(() => {
        router.push("/adviser/documents");
      }, 2000);
    } catch (error) {
      console.log("Error submitting feedback:", error);
      closeNotification();
      showError(
        "Submission Failed",
        "Failed to submit review. Please check your connection and try again."
      );
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
      <NotificationComponent />
      <div className="space-y-6 pb-8">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2563eb]/10 via-[#1951cc]/10 to-[#f59e0b]/10 border border-border/50 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <Button
              variant="ghost"
              onClick={() => router.push("/adviser/documents")}
              className="mb-4 hover:bg-card/80 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Documents
            </Button>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#2563eb] via-[#1951cc] to-[#f59e0b] bg-clip-text text-transparent">
                  {paper.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                    <User className="w-4 h-4 text-[#2563eb]" />
                    <span className="font-medium">
                      {studentLoading
                        ? "Loading..."
                        : studentData?.fullName || "Unknown Student"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                    <BookOpen className="w-4 h-4 text-[#1951cc]" />
                    <span className="font-medium">
                      {paper.categoryNames?.[0] || "N/A"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                    <Calendar className="w-4 h-4 text-[#f59e0b]" />
                    <span className="font-medium">
                      {new Date(paper.submittedAt).toLocaleDateString()}
                    </span>
                  </span>
                  {getStatusBadge(paper.status)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-[#2563eb]/5 via-[#1951cc]/5 to-[#f59e0b]/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#1951cc]">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Document Review</CardTitle>
                    <CardDescription className="mt-1">
                      Review and annotate the student document. Click
                      &quot;Upload to Student&quot; to save your annotations.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {uploadedFileUrl && (
                  <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm">
                    <p className="text-sm text-emerald-700 flex items-center gap-2 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Annotated PDF uploaded successfully! You can now submit
                      your review.
                    </p>
                  </div>
                )}
                <div className="rounded-xl overflow-hidden border border-border/50 shadow-inner">
                  <PDFEdit
                    pdfUri={paper.fileUrl}
                    onUploadSuccess={handleUploadSuccess}
                    showSuccess={showSuccess}
                    showError={showError}
                    showLoading={showLoading}
                    closeNotification={closeNotification}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-[#f59e0b]/5 via-[#e38519]/5 to-[#2563eb]/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#e38519]">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Review & Feedback</CardTitle>
                    <CardDescription className="mt-1">
                      Provide feedback and decision
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div>
                  <Label
                    htmlFor="feedback"
                    className="text-sm font-semibold mb-2 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-[#f59e0b]" />
                    Detailed Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide detailed feedback on the document..."
                    rows={6}
                    className="mt-2 border-border/50 focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Decision</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setDecision("APPROVED")}
                      variant={decision === "APPROVED" ? "default" : "outline"}
                      className={`h-auto py-4 transition-all duration-200 ${
                        decision === "APPROVED"
                          ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 border-0"
                          : "border-border/50 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                      }`}
                      disabled={isSubmitting}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Approve</span>
                      </div>
                    </Button>
                    <Button
                      onClick={() => setDecision("REVISION")}
                      variant={decision === "REVISION" ? "default" : "outline"}
                      className={`h-auto py-4 transition-all duration-200 ${
                        decision === "REVISION"
                          ? "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30 border-0"
                          : "border-border/50 hover:border-rose-500/50 hover:bg-rose-500/5"
                      }`}
                      disabled={isSubmitting}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        <span className="font-semibold">Revision</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Custom Deadline Picker */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Set Deadline (Optional)
                  </Label>
                  <div className="relative">
                    <input
                      type="date"
                      value={customDeadline}
                      onChange={(e) => setCustomDeadline(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-11 px-4 rounded-lg border border-border/50 bg-background focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/50 transition-all duration-200 text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {customDeadline ? (
                      <>
                        Deadline set to:{" "}
                        <span className="font-semibold text-foreground">
                          {new Date(customDeadline).toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      <>
                        Auto: {decision === "APPROVED" ? "7 days" : "30 days"}{" "}
                        from submission
                      </>
                    )}
                  </p>
                </div>

                {!uploadedFileUrl && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm">
                    <p className="text-sm text-amber-700 flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      Please upload the annotated PDF before submitting your
                      review
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleSubmitReview}
                  className="w-full h-12 bg-gradient-to-r from-[#2563eb] via-[#1951cc] to-[#f59e0b] hover:from-[#1951cc] hover:via-[#2563eb] hover:to-[#e38519] text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  disabled={
                    !decision ||
                    !feedback.trim() ||
                    !uploadedFileUrl ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-[#2563eb]/5 via-[#f59e0b]/5 to-[#1951cc]/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#f59e0b]">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Document Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="p-4 bg-gradient-to-br from-[#2563eb]/5 to-[#f59e0b]/5 rounded-xl border border-border/50">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Student
                  </div>
                  <div className="font-semibold flex items-center gap-3">
                    {studentLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      <>
                        {studentData?.imageUrl && (
                          <Image
                            src={studentData.imageUrl}
                            alt={studentData.fullName}
                            className="w-10 h-10 rounded-full border-2 border-[#2563eb]/20"
                            width={40}
                            height={40}
                            unoptimized
                          />
                        )}
                        <div>
                          <div className="text-foreground">
                            {studentData?.fullName || "Unknown Student"}
                          </div>
                          {studentData?.email && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {studentData.email}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {paper.categoryNames?.map((category, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-[#2563eb]/10 to-[#f59e0b]/10 border-[#2563eb]/20 text-[#1951cc]"
                      >
                        {category}
                      </Badge>
                    )) || <span className="text-sm">N/A</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#2563eb]/5 to-[#1951cc]/5 rounded-lg border border-border/50">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Submitted
                    </div>
                    <div className="font-semibold text-sm">
                      {new Date(paper.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-[#f59e0b]/5 to-[#e38519]/5 rounded-lg border border-border/50">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Status
                    </div>
                    <div>{getStatusBadge(paper.status)}</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#1951cc]/5 to-[#2563eb]/5 rounded-xl border border-border/50">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Abstract
                  </div>
                  <div className="text-sm leading-relaxed">
                    {paper.abstractText || "No description available"}
                  </div>
                </div>

                {paper.thumbnailUrl && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Document Preview
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-md group">
                      <Image
                        src={paper.thumbnailUrl}
                        alt={paper.title}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        width={700}
                        height={300}
                        unoptimized
                      />
                    </div>
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
