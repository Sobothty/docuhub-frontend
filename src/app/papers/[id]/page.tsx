"use client";

import { useState, useEffect, use } from "react";
import { useGetPaperByUuidQuery } from "@/feature/paperSlice/papers";
import { useGetUserByIdQuery } from "@/feature/users/usersSlice";
import { useGetAllPublishedPapersQuery } from "@/feature/paperSlice/papers";
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
  Share2,
  Bookmark,
  Reply,
  Link as LinkIcon,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/app/Loading";
import PaperCard from "@/components/card/PaperCard";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PDFViewer from "@/components/pdf/PDFView";

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
  onReplySubmit: (uuid: string) => void;
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
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={commentUser?.imageUrl || "/placeholder.svg"}
            alt={userName}
          />
          <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-sm">
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
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-accent"
                  aria-label="Comment actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onEdit(comment.uuid, comment.content)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(comment.uuid)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {editingId === comment.uuid ? (
            <div className="mt-2">
              <textarea
                className="w-full p-2 border border-border rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground mt-1">{comment.content}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.uuid)}
              className="text-muted-foreground hover:text-accent"
              aria-label="Reply to comment"
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
          {/* Reply Form */}
          {activeReplyId === comment.uuid && (
            <div className="ml-6 mt-4 flex items-start gap-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  className="w-full p-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
                    className="text-muted-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onReplySubmit(comment.uuid)}
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="ml-6 mt-4 space-y-4">
              {(showAllReplies
                ? comment.replies
                : comment.replies.slice(0, 2)
              ).map((reply) => (
                <ReplyItem key={reply.uuid} reply={reply} />
              ))}
              {comment.replies.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleReplies}
                  className="text-muted-foreground hover:text-accent"
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
function ReplyItem({ reply }: { reply: Comment }) {
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
      <Avatar className="h-6 w-6">
        <AvatarImage
          src={replyUser?.imageUrl || "/placeholder.svg"}
          alt={userName}
        />
        <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-sm">
              {userLoading ? "Loading..." : userName}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className="text-sm text-foreground mt-1">{reply.content}</p>
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

  // All useState hooks must be at the top level, before any conditional logic
  const [isBookmarked, setIsBookmarked] = useState(false);
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
  const { data: author, isLoading: authorLoading } = useGetUserByIdQuery(
    paper?.authorUuid || "",
    {
      skip: !paper?.authorUuid,
    }
  );
  // Prefer fullName, then first+last, then userName, then name
  const authorName =
    (author?.fullName && author.fullName.trim()) ||
    [author?.firstName, author?.lastName].filter(Boolean).join(" ").trim() ||
    (author?.userName && author.userName.trim());

  // Fetch related papers (similar papers)
  const { data: relatedPapersData } = useGetAllPublishedPapersQuery({
    page: 0,
    size: 4,
    sortBy: "publishedAt",
    direction: "desc",
  });
  const relatedPapers =
    relatedPapersData?.papers?.content
      ?.filter((p) => p.uuid !== id)
      ?.slice(0, 3) || [];

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
      console.error("No file URL available");
      alert("No feedback file available to download");
      return;
    }

    try {
      // Create filename from paper title or use default
      const filename = paper.fileUrl
        ? `${paper.title.replace(/[^a-z0-9]/gi, "_")}_document.pdf`
        : `_document_${paper.uuid}.pdf`;

      // Fetch the file as blob to force download
      const response = await fetch(paper.fileUrl);
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

      console.log(`Downloaded: ${filename}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handleViewPDFInNewTab = () => {
    if (paper?.fileUrl) {
      window.open(paper.fileUrl, "_blank");
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    console.log("Toggling bookmark for paper:", paper?.uuid);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = (platform: string) => {
    // Use window only on client side
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = paper?.title || "Paper";
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank", "noopener,noreferrer");
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        window.open(shareUrl, "_blank", "noopener,noreferrer");
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank", "noopener,noreferrer");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        console.log("Copied link:", url);
        break;
      default:
        return;
    }
    console.log(`Sharing paper ${paper?.uuid} on ${platform}`);
  };

  const handleAddComment = async () => {
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
    if (newReply[parentCommentUuid]?.trim()) {
      try {
        await createComment({
          content: newReply[parentCommentUuid],
          paperUuid: id,
          parentUuid: parentCommentUuid, // Reply to parent comment
        }).unwrap();
        setNewReply((prev) => ({ ...prev, [parentCommentUuid]: "" }));
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Back Button */}
          <div className="flex items-center mt-10 gap-2 text-sm text-muted-foreground">
            <Link
              href="#"
              className="hover:text-foreground flex items-center gap-2"
              onClick={handleOnClickBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Papers
            </Link>
            <span>/</span>
            <span>{paper.categoryNames?.[0] || "Research"}</span>
            <span>/</span>
            <span className="text-foreground">Paper Details</span>
          </div>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {paper.title}
                </h1>
                <Badge
                  variant={paper.isApproved ? "default" : "secondary"}
                  className="flex-shrink-0"
                >
                  {paper.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Link
                    href={
                      paper?.authorUuid ? `/users/${paper.authorUuid}` : "#"
                    }
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={author?.imageUrl || "/placeholder.svg"}
                        alt={authorName || "Author"}
                      />
                      <AvatarFallback className="text-xs">
                        {(authorName || "A")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hover:text-foreground">
                      {authorLoading
                        ? "Loading..."
                        : authorName || "Unknown Author"}
                    </span>
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Published:{" "}
                    {formatDate(
                      paper?.publishedAt ||
                        paper?.createdAt ||
                        new Date().toISOString()
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Submitted:{" "}
                    {formatDate(paper?.submittedAt || new Date().toISOString())}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(paper.categoryNames || []).map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
                <Badge variant={paper.isApproved ? "default" : "outline"}>
                  {paper.isApproved ? "Approved" : "Pending"}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    ({comments.length} comments)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-2 lg:w-48">
              <Button
                className="flex-1 lg:flex-none"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="flex-1 lg:flex-none bg-transparent"
                onClick={handleToggleBookmark}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${
                    isBookmarked ? "fill-accent text-accent" : ""
                  }`}
                />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 lg:flex-none bg-transparent"
                    aria-label="Share paper"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => handleShare("twitter")}>
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter/X
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.85-3.037-1.85 0-2.132 1.447-2.132 2.941v5.665H9.352V9h3.414v1.561h.048c.476-.9 1.636-1.85 3.365-1.85 3.602 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("email")}>
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.287L12 15l10-7.713V19H2z" />
                    </svg>
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("copy")}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1 rounded-lg gap-1">
                  <TabsTrigger
                    value="content"
                    className="font-semibold transition-all duration-300 ease-in-out data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-accent/50 data-[state=inactive]:text-muted-foreground rounded-md"
                  >
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="abstract"
                    className="font-semibold transition-all duration-300 ease-in-out data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-accent/50 data-[state=inactive]:text-muted-foreground rounded-md"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="comments"
                    className="font-semibold transition-all duration-300 ease-in-out data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-accent/50 data-[state=inactive]:text-muted-foreground rounded-md"
                  >
                    Comments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="abstract" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Abstract</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {paper?.abstractText || "No abstract available."}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(paper.categoryNames || []).map((category, index) => (
                          <Badge key={index} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardContent>
                      {pdfError ? (
                        <div className="text-center text-muted-foreground">
                          <p className="text-red-500 mb-4">{pdfError}</p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setPdfError(null);
                              }}
                            >
                              Retry Loading PDF
                            </Button>
                            <Button
                              variant="default"
                              onClick={handleViewPDFInNewTab}
                            >
                              Open PDF in New Tab
                            </Button>
                          </div>
                        </div>
                      ) : !isClient ? (
                        <div className="text-center text-muted-foreground py-8">
                          <p>Loading PDF viewer...</p>
                        </div>
                      ) : (
                        <div className="relative bg-card rounded-lg overflow-hidden">
                          <div className="rounded-lg">
                            <PDFViewer pdfUri={paper.fileUrl} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Comments & Reviews (
                        {commentsLoading ? "..." : comments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* New Comment Form */}
                      <div className="flex items-start gap-3 mb-6">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <textarea
                            className="w-full p-2 border border-border rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            rows={3}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button
                            className="mt-2"
                            size="sm"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                          >
                            Post Comment
                          </Button>
                        </div>
                      </div>

                      {/* Loading State */}
                      {commentsLoading && (
                        <div className="text-center py-8 text-muted-foreground">
                          Loading comments...
                        </div>
                      )}

                      {/* Error State */}
                      {commentsError && (
                        <div className="text-center py-8 text-red-500">
                          Failed to load comments
                        </div>
                      )}

                      {/* Comments List */}
                      {!commentsLoading && !commentsError && (
                        <div className="space-y-4">
                          {comments.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                              No comments yet. Be the first to comment!
                            </p>
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
                                  replyContent={newReply[comment.uuid] || ""}
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="citations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Citation Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">APA Citation</h4>
                        <div className="p-3 bg-muted rounded-lg text-sm font-mono">
                          {author?.fullName || "Unknown Author"} (
                          {new Date(
                            paper.publishedAt || paper.createdAt
                          ).getFullYear()}
                          ). {paper.title}. <em>IPUB Academic Platform</em>.
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">BibTeX</h4>
                        <div className="p-3 bg-muted rounded-lg text-sm font-mono">
                          @article{"{"}paper{paper.uuid?.slice(0, 8)},{"}"},
                          <br />
                          &nbsp;&nbsp;title={"{"} {paper.title} {"}"},<br />
                          &nbsp;&nbsp;author={"{"}{" "}
                          {author?.fullName || "Unknown Author"} {"}"},
                          <br />
                          &nbsp;&nbsp;year={"{"}{" "}
                          {new Date(
                            paper.publishedAt || paper.createdAt
                          ).getFullYear()}{" "}
                          {"}"},
                          <br />
                          &nbsp;&nbsp;abstract={"{"} {paper.abstractText} {"}"}
                          <br />
                          {"}"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6 mb-20">
              <Card>
                <CardHeader>
                  <CardTitle>Paper Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Comments</span>
                    </div>
                    <span className="font-medium">{comments.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Status</span>
                    </div>
                    <Badge variant={paper.isApproved ? "default" : "secondary"}>
                      {paper.status}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span>Published</span>
                    <span className="font-medium">
                      {formatDate(paper.publishedAt || paper.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Submitted</span>
                    <span className="font-medium">
                      {formatDate(paper.submittedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Categories</span>
                    <span className="font-medium">{paper.categoryNames}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={author?.imageUrl || "/placeholder.svg"}
                        alt={author?.fullName || "Author"}
                      />
                      <AvatarFallback>
                        {(author?.fullName || "U")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {authorLoading
                          ? "Loading..."
                          : author?.fullName || "Unknown Author"}
                      </h4>
                      <p className="text-sm text-muted-foreground">Author</p>
                    </div>
                  </div>
                  {author?.email && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {author.email}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    asChild
                    disabled={!author}
                  >
                    <Link href={`/users/${paper?.authorUuid || ""}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Related Papers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedPapers.length > 0 ? (
                      relatedPapers.map((relatedPaper) => (
                        <PaperCard
                          key={relatedPaper.uuid}
                          paper={relatedPaper}
                          onDownloadPDF={() =>
                            window.open(relatedPaper.fileUrl, "_blank")
                          }
                          onToggleBookmark={() =>
                            console.log(
                              `Toggle bookmark for paper ${relatedPaper.uuid}`
                            )
                          }
                          isBookmarked={false}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        No related papers found.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
