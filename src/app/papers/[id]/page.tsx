'use client';

import { useState, useEffect, use } from 'react';
import { useGetPaperByIdQuery, useGetUserByIdQuery, useGetPapersQuery } from '@/feature/apiSlice/paperApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  Eye,
  MessageSquare,
  Calendar,
  Star,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Reply,
  Link as LinkIcon,
  MoreHorizontal,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import Loading from '@/app/Loading';
import PaperCard from '@/components/card/PaperCard';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(
  () => import('react-pdf').then((mod) => ({ default: mod.Document })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center text-muted-foreground py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        Loading PDF viewer...
      </div>
    ),
  }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => ({ default: mod.Page })),
  {
    ssr: false,
  }
);

// Static data removed - now using real API data

interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
  rating: number;
  likes: number;
  replies: {
    id: number;
    author: string;
    date: string;
    content: string;
    likes: number;
  }[];
}

const initialComments: Comment[] = [
  {
    id: 1,
    author: 'Dr. Alex Kumar',
    date: '2024-01-20',
    content:
      'Excellent comprehensive guide! The section on CNN architectures was particularly insightful.',
    rating: 5,
    likes: 12,
    replies: [
      {
        id: 101,
        author: 'Jane Doe',
        date: '2024-01-21',
        content: 'Totally agree! The CNN section was a highlight for me too.',
        likes: 3,
      },
      {
        id: 102,
        author: 'User',
        date: '2024-01-22',
        content: 'Really helped me understand CNNs better!',
        likes: 2,
      },
      {
        id: 103,
        author: 'Bob Smith',
        date: '2024-01-23',
        content: 'Great point about the architectures!',
        likes: 1,
      },
    ],
  },
  {
    id: 2,
    author: 'User',
    date: '2024-01-18',
    content:
      'Very helpful for understanding the fundamentals. Would love to see more practical examples.',
    rating: 4,
    likes: 8,
    replies: [],
  },
  {
    id: 3,
    author: 'Prof. David Brown',
    date: '2024-01-16',
    content:
      'Well-structured paper with clear explanations. Great resource for both beginners and intermediate learners.',
    rating: 5,
    likes: 15,
    replies: [
      {
        id: 104,
        author: 'Emily Smith',
        date: '2024-01-17',
        content: 'This helped me a lot in my ML course. Thanks for sharing!',
        likes: 5,
      },
    ],
  },
];

export default function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  // All useState hooks must be at the top level, before any conditional logic
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState<{ [key: number]: string }>({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<
    number | null
  >(null);
  const [likedComments, setLikedComments] = useState<{
    [key: number]: boolean;
  }>({});
  const [likedReplies, setLikedReplies] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [commentLikes, setCommentLikes] = useState<{ [key: number]: number }>(
    initialComments.reduce(
      (acc, comment) => ({ ...acc, [comment.id]: comment.likes }),
      {}
    )
  );
  const [replyLikes, setReplyLikes] = useState<{ [key: number]: number }>(
    initialComments
      .flatMap((comment) => comment.replies)
      .reduce((acc, reply) => ({ ...acc, [reply.id]: reply.likes }), {})
  );
  const [showAllReplies, setShowAllReplies] = useState<{
    [key: number]: boolean;
  }>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  
  // Set up PDF.js worker when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-pdf').then((pdfjs) => {
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
      });
    }
  }, []);
  
  // Fetch paper data using RTK Query - all hooks must be before conditionals
  const { data: paperData, isLoading: paperLoading, error: paperError } = useGetPaperByIdQuery(id);
  const paper = paperData?.paper; // Extract the actual paper object from the response
  const { data: author, isLoading: authorLoading } = useGetUserByIdQuery(paper?.authorUuid || '', {
    skip: !paper?.authorUuid,
  });
  // Prefer fullName, then first+last, then userName, then name
  const authorName = (author?.fullName && author.fullName.trim())
    || ([author?.firstName, author?.lastName].filter(Boolean).join(' ').trim())
    || (author?.userName && author.userName.trim())
    || (author?.name && author.name.trim())
    || '';
  
  // Fetch related papers (similar papers)
  const { data: relatedPapersData } = useGetPapersQuery();
  const relatedPapers = relatedPapersData?.papers?.content?.filter(p => p.uuid !== id)?.slice(0, 3) || [];
  
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

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for paper:', paper?.uuid);
    const link = document.createElement('a');
    link.href = paper?.fileUrl || '';
    link.download = `${paper?.title || 'paper'}.pdf`;
    link.target = '_blank';
    link.click();
  };

  const handleViewPDFInNewTab = () => {
    if (paper?.fileUrl) {
      window.open(paper.fileUrl, '_blank');
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    console.log('Toggling bookmark for paper:', paper?.uuid);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = paper?.title || 'Paper';
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        console.log('Copied link:', url);
        break;
      default:
        return;
    }
    console.log(`Sharing paper ${paper?.uuid} on ${platform}`);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        author: 'User',
        date: new Date().toISOString().split('T')[0],
        content: newComment,
        rating: 0,
        likes: 0,
        replies: [],
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      console.log('Adding comment:', newComment);
    }
  };

  const handleAddReply = (commentId: number) => {
    if (newReply[commentId]?.trim()) {
      const newReplyObj = {
        id:
          Math.max(...comments.flatMap((c) => c.replies.map((r) => r.id)), 0) +
          1,
        author: 'User',
        date: new Date().toISOString().split('T')[0],
        content: newReply[commentId],
        likes: 0,
      };
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReplyObj] }
            : comment
        )
      );
      setNewReply((prev) => ({ ...prev, [commentId]: '' }));
      setActiveReplyCommentId(null);
      console.log(
        'Adding reply to comment',
        commentId,
        ':',
        newReply[commentId]
      );
    }
  };

  const handleLikeComment = (commentId: number) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: likedComments[commentId]
        ? (prev[commentId] || 0) - 1
        : (prev[commentId] || 0) + 1,
    }));
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleLikeReply = (replyId: number) => {
    setReplyLikes((prev) => ({
      ...prev,
      [replyId]: likedReplies[replyId]
        ? (prev[replyId] || 0) - 1
        : (prev[replyId] || 0) + 1,
    }));
    setLikedReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const handleReplyClick = (commentId: number) => {
    setActiveReplyCommentId(
      activeReplyCommentId === commentId ? null : commentId
    );
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
  };

  const handleSaveEditComment = (commentId: number) => {
    if (editCommentContent.trim()) {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: editCommentContent,
                date: new Date().toISOString().split('T')[0],
              }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditCommentContent('');
      console.log('Edited comment:', commentId, editCommentContent);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
    setCommentLikes((prev) => {
      const updated = { ...prev };
      delete updated[commentId];
      return updated;
    });
    console.log('Deleted comment:', commentId);
  };

  const toggleShowReplies = (commentId: number) => {
    setShowAllReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setPdfError(
      `Failed to load PDF: ${error.message}. Please try downloading the file.`
    );
  };

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Back Button */}
          <div className="flex items-center mt-10 gap-2 text-sm text-muted-foreground">
            <Link href="/papers" className="hover:text-foreground flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Papers
            </Link>
            <span>/</span>
            <span>{paper.categoryNames?.[0] || 'Research'}</span>
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
                  variant={paper.isApproved ? 'default' : 'secondary'}
                  className="flex-shrink-0"
                >
                  {paper.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Link href={paper?.authorUuid ? `/users/${paper.authorUuid}` : '#'} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={authorName || 'Author'}
                      />
                      <AvatarFallback className="text-xs">
                        {(authorName || 'A')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hover:text-foreground">
                      {authorLoading ? 'Loading...' : authorName || 'Unknown Author'}
                    </span>
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Published: {formatDate(paper?.publishedAt || paper?.createdAt || new Date().toISOString())}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {formatDate(paper?.submittedAt || new Date().toISOString())}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(paper.categoryNames || []).map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
                <Badge variant={paper.isApproved ? 'default' : 'outline'}>
                  {paper.isApproved ? 'Approved' : 'Pending'}
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
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${
                    isBookmarked ? 'fill-accent text-accent' : ''
                  }`}
                />
                {isBookmarked ? 'Saved' : 'Save'}
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
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter/X
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.85-3.037-1.85 0-2.132 1.447-2.132 2.941v5.665H9.352V9h3.414v1.561h.048c.476-.9 1.636-1.85 3.365-1.85 3.602 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('email')}>
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.287L12 15l10-7.713V19H2z" />
                    </svg>
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('copy')}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="abstract" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="abstract">Abstract</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="citations">Citations</TabsTrigger>
                </TabsList>

                <TabsContent value="abstract" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Abstract</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {paper?.abstractText || 'No abstract available.'}
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
                    <CardHeader>
                      <CardTitle>Full Content</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        View the PDF content directly in your browser. Use the
                        navigation buttons below to browse pages.
                      </p>
                    </CardHeader>

                    <CardContent>
                      {pdfError ? (
                        <div className="text-center text-muted-foreground py-8">
                          <p className="text-red-500 mb-4">{pdfError}</p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setPdfError(null);
                                setNumPages(null);
                                setPageNumber(1);
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
                          <div className="border border-border rounded-lg p-4">
                            <Document
                              file={paper?.fileUrl}
                              onLoadSuccess={onDocumentLoadSuccess}
                              onLoadError={onDocumentLoadError}
                              className="flex justify-center"
                              loading={
                                <div className="text-center text-muted-foreground py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                  Loading PDF...
                                </div>
                              }
                              options={{
                                cMapUrl:
                                  'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                                cMapPacked: true,
                                standardFontDataUrl:
                                  'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
                              }}
                            >
                              <Page
                                pageNumber={pageNumber}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="shadow-lg border border-border rounded"
                                width={
                                  isClient
                                    ? Math.min(600, window.innerWidth - 80)
                                    : 600
                                }
                                onLoadSuccess={() =>
                                  console.log('Page loaded successfully')
                                }
                                onLoadError={(error) =>
                                  console.error('Page load error:', error)
                                }
                              />
                            </Document>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToPreviousPage}
                              disabled={pageNumber <= 1}
                              className="bg-transparent"
                              aria-label="Go to previous page"
                            >
                              <ChevronLeft className="h-4 w-4 mr-2" />
                              Previous
                            </Button>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                Page {pageNumber} of {numPages || '...'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleViewPDFInNewTab}
                                className="text-xs"
                                aria-label="Open PDF in new tab"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Open in New Tab
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToNextPage}
                              disabled={pageNumber >= (numPages || 1)}
                              className="bg-transparent"
                              aria-label="Go to next page"
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
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
                        Comments & Reviews ({comments.length})
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

                      {/* Comments List */}
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="border-b border-border pb-4 last:border-0"
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {comment.author
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium text-sm">
                                      {comment.author}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {comment.date}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < comment.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                    {comment.author === 'User' && (
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
                                            onClick={() =>
                                              handleEditComment(
                                                comment.id,
                                                comment.content
                                              )
                                            }
                                          >
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleDeleteComment(comment.id)
                                            }
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                </div>
                                {editingCommentId === comment.id ? (
                                  <div className="mt-2">
                                    <textarea
                                      className="w-full p-2 border border-border rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                      rows={3}
                                      value={editCommentContent}
                                      onChange={(e) =>
                                        setEditCommentContent(e.target.value)
                                      }
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setEditingCommentId(null)
                                        }
                                        className="text-muted-foreground"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleSaveEditComment(comment.id)
                                        }
                                        disabled={!editCommentContent.trim()}
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-foreground mt-1">
                                    {comment.content}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleLikeComment(comment.id)
                                    }
                                    className={`text-muted-foreground hover:text-secondary ${
                                      likedComments[comment.id]
                                        ? 'text-accent'
                                        : ''
                                    }`}
                                    aria-label={
                                      likedComments[comment.id]
                                        ? 'Unlike comment'
                                        : 'Like comment'
                                    }
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    <span>
                                      {commentLikes[comment.id] ||
                                        comment.likes}
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReplyClick(comment.id)}
                                    className="text-muted-foreground hover:text-accent"
                                    aria-label="Reply to comment"
                                  >
                                    <Reply className="h-4 w-4 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                                {/* Reply Form */}
                                {activeReplyCommentId === comment.id && (
                                  <div className="ml-6 mt-4 flex items-start gap-3">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        U
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <textarea
                                        className="w-full p-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        rows={1}
                                        placeholder="Write a reply..."
                                        value={newReply[comment.id] || ''}
                                        onChange={(e) =>
                                          setNewReply((prev) => ({
                                            ...prev,
                                            [comment.id]: e.target.value,
                                          }))
                                        }
                                      />
                                      <div className="flex gap-2 mt-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            setActiveReplyCommentId(null)
                                          }
                                          className="text-muted-foreground"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleAddReply(comment.id)
                                          }
                                          disabled={
                                            !newReply[comment.id]?.trim()
                                          }
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
                                    {(showAllReplies[comment.id]
                                      ? comment.replies
                                      : comment.replies.slice(0, 2)
                                    ).map((reply) => (
                                      <div
                                        key={reply.id}
                                        className="flex items-start gap-3"
                                      >
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="text-xs">
                                            {reply.author
                                              .split(' ')
                                              .map((n) => n[0])
                                              .join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span className="font-medium text-sm">
                                                {reply.author}
                                              </span>
                                              <span className="text-xs text-muted-foreground ml-2">
                                                {reply.date}
                                              </span>
                                            </div>
                                          </div>
                                          <p className="text-sm text-foreground mt-1">
                                            {reply.content}
                                          </p>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              handleLikeReply(reply.id)
                                            }
                                            className={`text-muted-foreground hover:text-accent ${
                                              likedReplies[reply.id]
                                                ? 'text-accent'
                                                : ''
                                            } mt-1`}
                                            aria-label={
                                              likedReplies[reply.id]
                                                ? 'Unlike reply'
                                                : 'Like reply'
                                            }
                                          >
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            <span>
                                              {replyLikes[reply.id] ||
                                                reply.likes}
                                            </span>
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                    {comment.replies.length > 2 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          toggleShowReplies(comment.id)
                                        }
                                        className="text-muted-foreground hover:text-accent"
                                      >
                                        {showAllReplies[comment.id]
                                          ? `Show Less (${
                                              comment.replies.length - 2
                                            } more)`
                                          : `Show More (${
                                              comment.replies.length - 2
                                            } more)`}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                          {author?.name || 'Unknown Author'} (
                          {new Date(paper.publishedAt || paper.createdAt).getFullYear()}).{' '}
                          {paper.title}. <em>IPUB Academic Platform</em>.
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">BibTeX</h4>
                        <div className="p-3 bg-muted rounded-lg text-sm font-mono">
                          @article{'{'}paper{paper.uuid?.slice(0, 8)},{'}'},
                          <br />
                          &nbsp;&nbsp;title={'{'} {paper.title} {'}'},<br />
                          &nbsp;&nbsp;author={'{'} {author?.name || 'Unknown Author'} {'}'},
                          <br />
                          &nbsp;&nbsp;year={'{'}{' '}
                          {new Date(paper.publishedAt || paper.createdAt).getFullYear()} {'}'},
                          <br />
                          &nbsp;&nbsp;abstract={'{'} {paper.abstractText} {'}'}
                          <br />
                          {'}'}
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
                    <Badge variant={paper.isApproved ? 'default' : 'secondary'}>
                      {paper.status}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span>Published</span>
                    <span className="font-medium">{formatDate(paper.publishedAt || paper.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Submitted</span>
                    <span className="font-medium">{formatDate(paper.submittedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Categories</span>
                    <span className="font-medium">{paper.categoryNames?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Author ID</span>
                    <span className="font-medium text-xs">{paper.authorUuid?.slice(0, 8) || 'Unknown'}...</span>
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
                        src="/placeholder.svg"
                        alt={author?.name || 'Author'}
                      />
                      <AvatarFallback>
                        {(author?.name || 'A')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {authorLoading ? 'Loading...' : author?.name || 'Unknown Author'}
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
                    <Link href={`/users/${paper?.authorUuid || ''}`}>View Profile</Link>
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
                          onDownloadPDF={() => window.open(relatedPaper.fileUrl, '_blank')}
                          onToggleBookmark={() => console.log(`Toggle bookmark for paper ${relatedPaper.uuid}`)}
                          isBookmarked={false}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground">No related papers found.</p>
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
