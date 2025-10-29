"use client";

import { useState, useEffect, use } from "react";
import { useGetPaperByUuidQuery } from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import {
  useGetCommentsByPaperUuidQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/feature/commentSlice/commentSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  MessageSquare,
  Calendar,
  Reply,
  MoreHorizontal,
  ArrowLeft,
  FileText,
  User,
  Clock,
  CheckCircle2,
  Eye,
  BookOpen,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/app/Loading";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PDFViewer from "@/components/pdf/PDFView";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useApiNotification } from "@/components/ui/api-notification";

// Add type definitions
interface Comment {
  uuid: string;
  content: string;
  userUuid: string;
  paperUuid: string;
  parentUuid: string | null;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}

// Add a new component to render comments with user data
interface CommentItemProps {
  comment: Comment;
  onEdit: (uuid: string, content: string) => void;
  onDelete: (uuid: string) => void;
  onReply: (uuid: string) => void;
  activeReplyId: string | null;
  replyContent: string;
  onReplyChange: (uuid: string, content: string) => void;
  onReplySubmit: (parentUuid: string) => void;
  onReplyCancel: () => void;
  showAllReplies: boolean;
  onToggleReplies: () => void;
  editingId: string | null;
  editContent: string;
  onEditChange: (content: string) => void;
  onEditSave: (uuid: string) => void;
  onEditCancel: () => void;
}

function CommentItem({
  comment,
  onEdit,
  onDelete,
  onReply,
  activeReplyId,
  replyContent,
  onReplyChange,
  onReplySubmit,
  onReplyCancel,
  showAllReplies,
  onToggleReplies,
  editingId,
  editContent,
  onEditChange,
  onEditSave,
  onEditCancel,
}: CommentItemProps) {
  // Fetch user data for this comment
  const { data: commentUser, isLoading: userLoading } = useGetUserByIdQuery(
    comment.userUuid,
    {
      skip: !comment.userUuid,
    }
  );

  const userName =
    (commentUser?.fullName && commentUser.fullName.trim()) ||
    [commentUser?.firstName, commentUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    (commentUser?.userName && commentUser.userName.trim()) ||
    `User ${comment.userUuid.substring(0, 8)}`;

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="border-b border-border pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 border-2 border-border">
          <AvatarImage
            src={commentUser?.imageUrl || "/placeholder.svg"}
            alt={userName}
          />
          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm text-foreground">
                {userLoading ? "Loading..." : userName}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                  aria-label="Comment actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEdit(comment.uuid, comment.content)}
                  className="cursor-pointer"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(comment.uuid)}
                  className="cursor-pointer text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {editingId === comment.uuid ? (
            <div className="mt-2">
              <textarea
                className="w-full p-3 border border-border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-card"
                rows={3}
                value={editContent}
                onChange={(e) => onEditChange(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEditCancel}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => onEditSave(comment.uuid)}
                  disabled={!editContent.trim()}
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-hover))",
                  }}
                  className="text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground mt-2 leading-relaxed">
              {comment.content}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.uuid)}
              className="text-muted-foreground hover:text-secondary h-7 px-2"
              aria-label="Reply to comment"
            >
              <Reply className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">Reply</span>
            </Button>
          </div>
          {/* Reply Form */}
          {activeReplyId === comment.uuid && (
            <div className="ml-6 mt-4 flex items-start gap-3 p-3 rounded-lg paper-detail-reply-form">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-card"
                  rows={2}
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => onReplyChange(comment.uuid, e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReplyCancel}
                    className="text-muted-foreground h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onReplySubmit(comment.uuid)}
                    disabled={!replyContent.trim()}
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-hover))",
                    }}
                    className="text-white h-8"
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="ml-6 mt-4 space-y-4 border-l-2 pl-4 paper-detail-replies-border">
              {(showAllReplies
                ? comment.replies
                : comment.replies.slice(0, 2)
              ).map((reply) => (
                <ReplyItem
                  key={reply.uuid}
                  reply={reply}
                  parentCommentUuid={comment.uuid}
                  onReply={onReply}
                  activeReplyId={activeReplyId}
                  replyContent={replyContent}
                  onReplyChange={onReplyChange}
                  onReplySubmit={onReplySubmit}
                  onReplyCancel={onReplyCancel}
                />
              ))}
              {comment.replies.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleReplies}
                  className="text-secondary hover:text-secondary-hover font-medium"
                >
                  {showAllReplies
                    ? `Show Less`
                    : `Show ${comment.replies.length - 2} More Replies`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for reply items
interface ReplyItemProps {
  reply: Comment;
  parentCommentUuid: string;
  onReply: (uuid: string) => void;
  activeReplyId: string | null;
  replyContent: string;
  onReplyChange: (uuid: string, content: string) => void;
  onReplySubmit: (parentUuid: string) => void;
  onReplyCancel: () => void;
}

function ReplyItem({
  reply,
  parentCommentUuid,
  onReply,
  activeReplyId,
  replyContent,
  onReplyChange,
  onReplySubmit,
  onReplyCancel,
}: ReplyItemProps) {
  const { data: replyUser, isLoading: userLoading } = useGetUserByIdQuery(
    reply.userUuid,
    {
      skip: !reply.userUuid,
    }
  );

  const userName =
    (replyUser?.fullName && replyUser.fullName.trim()) ||
    [replyUser?.firstName, replyUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    (replyUser?.userName && replyUser.userName.trim()) ||
    `User ${reply.userUuid.substring(0, 8)}`;

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-7 w-7 border-2 border-border">
        <AvatarImage
          src={replyUser?.imageUrl || "/placeholder.svg"}
          alt={userName}
        />
        <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm text-foreground">
              {userLoading ? "Loading..." : userName}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className="text-sm text-foreground mt-2 leading-relaxed">
          {reply.content}
        </p>

        {/* Reply Button for child comments */}
        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(reply.uuid)}
            className="text-muted-foreground hover:text-secondary h-7 px-2"
            aria-label="Reply to comment"
          >
            <Reply className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs font-medium">Reply</span>
          </Button>
        </div>

        {/* Reply Form for child comments */}
        {activeReplyId === reply.uuid && (
          <div className="ml-6 mt-4 flex items-start gap-3 p-3 rounded-lg paper-detail-reply-form">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-card"
                rows={2}
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => onReplyChange(reply.uuid, e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReplyCancel}
                  className="text-muted-foreground h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => onReplySubmit(parentCommentUuid)}
                  disabled={!replyContent.trim()}
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-hover))",
                  }}
                  className="text-white h-8"
                >
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Notification hook
  const {
    showSuccess,
    showError,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  // All useState hooks must be at the top level, before any conditional logic
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  // Remove static comments state
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<
    string | null
  >(null);
  const [showAllReplies, setShowAllReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  // Set up PDF.js worker when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-pdf").then((pdfjs) => {
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
      });
    }
  }, []);

  // Fetch paper data using RTK Query - all hooks must be before conditionals
  const {
    data: paperData,
    isLoading: paperLoading,
    error: paperError,
  } = useGetPaperByUuidQuery(id);
  const paper = paperData?.paper; // Extract the actual paper object from the response

  const router = useRouter();

  // Fetch comments from API
  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetCommentsByPaperUuidQuery(id);

  // Comment mutations
  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // Extract comments from API response
  const comments = commentsData?.comments || [];

  // useEffect must also be before conditionals
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Loading and error states - now after all hooks
  if (paperLoading) return <Loading />;

  if (paperError || !paperData || !paper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500 text-center text-lg">Failed to load paper</p>
        <Link href="/papers">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Papers
          </Button>
        </Link>
      </div>
    );
  }

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent div onClick

    if (!paper.fileUrl) {
      showError("Download Failed", "No file available to download.");
      return;
    }

    // Show loading notification
    showLoading(
      "Downloading PDF",
      "Please wait while we prepare your document..."
    );

    try {
      // Create filename from paper title or use default
      const filename = paper.fileUrl
        ? `${paper.title.replace(/[^a-z0-9]/gi, "_")}_document.pdf`
        : `_document_${paper.uuid}.pdf`;

      // Fetch the file as blob to force download
      const response = await fetch(paper.fileUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

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
          `Your document "${paper.title}" has been downloaded successfully.`
        );
      }, 100);

      console.log(`Downloaded: ${filename}`);
    } catch (error) {
      console.error("Error downloading file:", error);

      // Close loading and show error
      closeNotification();
      setTimeout(() => {
        showError(
          "Download Failed",
          "Failed to download the file. Please check your connection and try again."
        );
      }, 100);
    }
  };

  const handleViewPDFInNewTab = () => {
    if (paper?.fileUrl) {
      window.open(paper.fileUrl, "_blank");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddComment = async () => {
    const token = await getSession();

    if (!token?.accessToken) {
      toast.error("You must login first");
      setTimeout(() => {
        router.push("/register");
      }, 1000); // Delay navigation to allow toast to show
      return;
    }

    if (newComment.trim()) {
      try {
        await createComment({
          content: newComment,
          paperUuid: id,
          parentUuid: null, // Top-level comment
        }).unwrap();
        setNewComment("");
        console.log("Comment added successfully");
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  const handleAddReply = async (parentCommentUuid: string) => {
    // Find the reply ID that was used to trigger this
    const replyCommentId = activeReplyCommentId;

    if (replyCommentId && newReply[replyCommentId]?.trim()) {
      try {
        await createComment({
          content: newReply[replyCommentId],
          paperUuid: id,
          parentUuid: parentCommentUuid, // Always use the top-level parent UUID
        }).unwrap();
        setNewReply((prev) => ({ ...prev, [replyCommentId]: "" }));
        setActiveReplyCommentId(null);
        console.log("Reply added successfully");
      } catch (error) {
        console.error("Failed to add reply:", error);
      }
    }
  };

  const handleReplyClick = (commentUuid: string) => {
    setActiveReplyCommentId(
      activeReplyCommentId === commentUuid ? null : commentUuid
    );
  };

  const handleEditComment = (commentUuid: string, content: string) => {
    setEditingCommentId(commentUuid);
    setEditCommentContent(content);
  };

  const handleSaveEditComment = async (commentUuid: string) => {
    if (editCommentContent.trim()) {
      try {
        await updateComment({
          uuid: commentUuid,
          content: editCommentContent,
        }).unwrap();
        setEditingCommentId(null);
        setEditCommentContent("");
        console.log("Comment updated successfully");
      } catch (error) {
        console.log("Failed to update comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentUuid: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentUuid).unwrap();
        console.log("Comment deleted successfully");
      } catch (error) {
        console.log("Failed to delete comment:", error);
      }
    }
  };

  const toggleShowReplies = (commentUuid: string) => {
    setShowAllReplies((prev) => ({
      ...prev,
      [commentUuid]: !prev[commentUuid],
    }));
  };

  const handleOnClickBack = () => {
    window.history.back();
  };

  return (
    <div className="paper-detail-page-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Back Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleOnClickBack}
              className="paper-detail-hero-card px-4 py-2 font-semibold hover:shadow-md transition-all"
              style={{ color: "var(--color-secondary)" }}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
          </div>

          {/* Hero Header Card */}
          <Card className="paper-detail-hero-card border-0 overflow-hidden">
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, var(--color-secondary), var(--color-accent))`,
              }}
            />
            <CardHeader className="pb-6 pt-8 px-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1 space-y-6">
                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-foreground">
                    {paper.title}
                  </h1>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    {paper.status === "APPROVED" && (
                      <Badge
                        className="px-4 py-2 text-sm font-bold shadow-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, #22c55e, #10b981)",
                          color: "white",
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        APPROVED
                      </Badge>
                    )}
                    {(paper.categoryNames || []).map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-4 py-2 text-sm font-semibold border-2 bg-accent/20"
                        style={{
                          borderColor: "var(--color-secondary)",
                          color: "var(--color-secondary)",
                        }}
                      >
                        <Tag className="w-3.5 h-3.5 mr-1.5" />
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 font-medium text-muted-foreground bg-accent/30 px-4 py-2 rounded-lg">
                      <Calendar
                        className="h-4 w-4"
                        style={{ color: "var(--color-secondary)" }}
                      />
                      <span className="font-semibold">Submitted:</span>
                      <span className="text-foreground">
                        {formatDate(
                          paper?.submittedAt || new Date().toISOString()
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-muted-foreground bg-accent/30 px-4 py-2 rounded-lg">
                      <MessageSquare
                        className="h-4 w-4"
                        style={{ color: "var(--color-secondary)" }}
                      />
                      <span className="font-semibold">Comments:</span>
                      <span className="text-foreground">{comments.length}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[220px]">
                  <Button
                    onClick={handleDownloadPDF}
                    className="flex-1 lg:flex-none font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 paper-detail-btn-primary"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleViewPDFInNewTab}
                    variant="outline"
                    className="flex-1 lg:flex-none font-bold transition-all paper-detail-btn-secondary"
                    size="lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Main Content Card */}
              <Card className="paper-detail-section-card border-0">
                <CardContent className="pt-6">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 p-1.5 rounded-xl gap-2 bg-accent">
                      <TabsTrigger
                        value="about"
                        className="paper-detail-tab font-bold rounded-lg transition-all duration-300"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        About
                      </TabsTrigger>
                      <TabsTrigger
                        value="files"
                        className="paper-detail-tab font-bold rounded-lg transition-all duration-300"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Files
                      </TabsTrigger>
                      <TabsTrigger
                        value="feedback"
                        className="paper-detail-tab font-bold rounded-lg transition-all duration-300"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Feedback ({comments.length})
                      </TabsTrigger>
                    </TabsList>

                    {/* About Tab */}
                    <TabsContent value="about" className="mt-6 space-y-6">
                      {/* Abstract Section */}
                      <div className="space-y-3 p-6 rounded-xl paper-detail-accent-bg">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor: "var(--color-secondary)",
                            }}
                          >
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground">
                            Abstract
                          </h3>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {paper?.abstractText || "No abstract available."}
                        </p>
                      </div>

                      <Separator />

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mentor Info */}
                        <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="p-2.5 rounded-lg"
                              style={{ backgroundColor: "#6b7280" }}
                            >
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              MENTOR
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11 border-2 border-border shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                                NA
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-foreground">
                              Not assigned
                            </span>
                          </div>
                        </div>

                        {/* Status Info */}
                        <div className="p-6 rounded-xl bg-card shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="p-2.5 rounded-lg animate-pulse"
                              style={{ backgroundColor: "#22c55e" }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              STATUS
                            </p>
                          </div>
                          <Badge
                            className="px-4 py-2 text-sm font-bold shadow-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, #22c55e, #10b981)",
                              color: "white",
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            APPROVED
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Files Tab */}
                    <TabsContent value="files" className="mt-6 space-y-4">
                      <div className="space-y-4">
                        {pdfError ? (
                          <div className="text-center text-muted-foreground p-12 rounded-xl paper-detail-accent-bg-light">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-red-500" />
                            <p className="text-red-500 mb-6 font-semibold text-lg">
                              {pdfError}
                            </p>
                            <div className="flex gap-3 justify-center">
                              <Button
                                variant="outline"
                                onClick={() => setPdfError(null)}
                                className="font-semibold"
                              >
                                Retry Loading PDF
                              </Button>
                              <Button
                                onClick={handleViewPDFInNewTab}
                                className="font-semibold text-white"
                                style={{
                                  background:
                                    "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-hover))",
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Open PDF in New Tab
                              </Button>
                            </div>
                          </div>
                        ) : !isClient ? (
                          <div className="text-center text-muted-foreground py-16 rounded-xl paper-detail-accent-bg-light">
                            <Clock
                              className="w-16 h-16 mx-auto mb-4 animate-spin"
                              style={{ color: "var(--color-secondary)" }}
                            />
                            <p className="font-semibold text-lg">
                              Loading PDF viewer...
                            </p>
                          </div>
                        ) : (
                          <div className="relative bg-card rounded-2xl overflow-hidden shadow-sm">
                            <PDFViewer pdfUri={paper.fileUrl} />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Feedback Tab */}
                    <TabsContent value="feedback" className="mt-6 space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                          <MessageSquare
                            className="w-5 h-5"
                            style={{ color: "var(--color-secondary)" }}
                          />
                          Feedback & Comments
                          <span className="text-muted-foreground text-base">
                            ({commentsLoading ? "..." : comments.length})
                          </span>
                        </h3>
                      </div>

                      {/* New Comment Form */}
                      <div className="flex items-start gap-3 mb-6 p-4 rounded-xl paper-detail-accent-bg">
                        <Avatar className="h-9 w-9 border-2 border-border">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            U
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <textarea
                            className="w-full p-3 border border-border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-card"
                            rows={3}
                            placeholder="Share your thoughts about this paper..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button
                            className="mt-3 font-semibold text-white shadow-md hover:shadow-lg transition-all"
                            size="sm"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            style={{
                              background:
                                "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-hover))",
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Post Comment
                          </Button>
                        </div>
                      </div>

                      {/* Loading State */}
                      {commentsLoading && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Clock
                            className="w-12 h-12 mx-auto mb-4 animate-spin"
                            style={{ color: "var(--color-secondary)" }}
                          />
                          <p className="font-medium">Loading comments...</p>
                        </div>
                      )}

                      {/* Error State */}
                      {commentsError && (
                        <div className="text-center py-12 text-red-500">
                          <p className="font-semibold">
                            Failed to load comments
                          </p>
                        </div>
                      )}

                      {/* Comments List */}
                      {!commentsLoading && !commentsError && (
                        <div className="space-y-6 bg-card p-6 rounded-xl shadow-sm">
                          {comments.length === 0 ? (
                            <div className="text-center py-12">
                              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-center text-muted-foreground font-medium">
                                No comments yet. Be the first to share your
                                thoughts!
                              </p>
                            </div>
                          ) : (
                            comments
                              .filter((comment) => !comment.parentUuid)
                              .map((comment) => (
                                <CommentItem
                                  key={comment.uuid}
                                  comment={comment}
                                  onEdit={handleEditComment}
                                  onDelete={handleDeleteComment}
                                  onReply={handleReplyClick}
                                  activeReplyId={activeReplyCommentId}
                                  replyContent={
                                    newReply[activeReplyCommentId || ""] || ""
                                  }
                                  onReplyChange={(uuid, content) =>
                                    setNewReply((prev) => ({
                                      ...prev,
                                      [uuid]: content,
                                    }))
                                  }
                                  onReplySubmit={handleAddReply}
                                  onReplyCancel={() =>
                                    setActiveReplyCommentId(null)
                                  }
                                  showAllReplies={
                                    showAllReplies[comment.uuid] || false
                                  }
                                  onToggleReplies={() =>
                                    toggleShowReplies(comment.uuid)
                                  }
                                  editingId={editingCommentId}
                                  editContent={editCommentContent}
                                  onEditChange={setEditCommentContent}
                                  onEditSave={handleSaveEditComment}
                                  onEditCancel={() => setEditingCommentId(null)}
                                />
                              ))
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Document Info Card */}
              <Card className="paper-detail-section-card border-0 sticky top-6">
                <CardHeader className="border-b paper-detail-accent-bg">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl shadow-md paper-detail-document-info-icon-bg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold paper-detail-document-info-title">
                        Document Info
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Key details at a glance
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="paper-detail-document-info-content space-y-5">
                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">
                      Category
                    </span>
                    <Badge
                      variant="outline"
                      className="px-3 py-1.5 font-semibold border-2"
                      style={{
                        borderColor: "var(--color-secondary)",
                        color: "var(--color-secondary)",
                        background: "rgba(37, 99, 235, 0.1)",
                      }}
                    >
                      {paper.categoryNames?.[0] || "General"}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Mentor */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">
                      Mentor
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      Not assigned
                    </span>
                  </div>

                  <Separator />

                  {/* Submitted */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">
                      Submitted
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {formatDate(paper.submittedAt)}
                    </span>
                  </div>

                  <Separator />

                  {/* Last updated */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">
                      Last updated
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {formatDate(paper.submittedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="paper-detail-section-card border-0">
                <CardHeader className="border-b paper-detail-accent-bg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg paper-detail-quick-actions-icon-bg">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold paper-detail-quick-actions-title">
                      Quick Actions
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="paper-detail-quick-actions-content space-y-3">
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all paper-detail-btn-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-semibold transition-all paper-detail-btn-secondary"
                    onClick={handleViewPDFInNewTab}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-semibold transition-all paper-detail-btn-secondary"
                    onClick={handleOnClickBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* API Notification Component */}
      <NotificationComponent />
    </div>
  );
}
