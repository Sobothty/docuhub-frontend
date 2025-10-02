'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Mock feedback data
const mockFeedbackDetails = [
  {
    id: 1,
    type: 'approval',
    paper: 'Machine Learning Applications in Healthcare Diagnostics',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-12',
    time: '2:30 PM',
    message:
      'Excellent work! Your methodology is sound and the results are well-presented. Approved for publication.',
    status: 'approved',
    hasAnnotations: true,
    annotatedPdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
    detailedFeedback:
      'Your research demonstrates a strong understanding of machine learning principles and their application in healthcare. The methodology is well-structured and the results are compelling. I particularly appreciate your attention to ethical considerations in medical AI applications.',
  },
  {
    id: 3,
    type: 'revision',
    paper: 'Economic Recovery Patterns Post-Pandemic',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-14',
    time: '4:45 PM',
    message:
      "The paper shows promise but needs revision. Please address the methodology section and provide more detailed statistical analysis. I've attached specific comments in the document.",
    status: 'revision',
    hasAnnotations: true,
    annotatedPdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
    detailedFeedback:
      "While your topic is relevant and timely, the methodology section needs significant strengthening. Please provide more detailed statistical analysis and consider including additional data sources. I've marked specific areas in the document that need attention.",
  },
  {
    id: 5,
    type: 'rejection',
    paper: 'Social Media Impact on Mental Health',
    mentor: 'Dr. Sarah Johnson',
    mentorAvatar: '/placeholder.svg?height=40&width=40',
    date: '2024-03-05',
    time: '3:15 PM',
    message:
      'Unfortunately, this paper needs significant work before it can be approved. The literature review is incomplete and the methodology has several issues. Please consider reworking the entire approach.',
    status: 'rejected',
    hasAnnotations: true,
    annotatedPdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
    detailedFeedback:
      'The paper requires substantial revision before it can be considered for approval. The literature review is incomplete and lacks critical sources. The methodology has several fundamental issues that need to be addressed. I recommend reworking the entire approach with a more focused research question.',
  },
];

export default function StudentFeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  // State for feedback (no setFeedback since it's read-only)
  const [feedback] = useState(
    mockFeedbackDetails.find((f) => f.id === id) || null
  );

  // PDF viewer states
  const [pdfjsLib, setPdfjsLib] = useState<typeof import('pdfjs-dist') | null>(
    null
  );
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // PDF functions
  const renderPage = useCallback(
    async ({
      pdf,
      pageNumber,
    }: {
      pdf: PDFDocumentProxy;
      pageNumber: number;
    }) => {
      if (!pdf || !canvasRef.current) return;
      try {
        const page = await pdf.getPage(pageNumber);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, canvas, viewport }).promise;
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
        setError(`Failed to render page ${pageNumber}`);
      }
    },
    [setError]
  );

  const loadPdf = useCallback(
    async (pdfUrl: string) => {
      if (!pdfjsLib) return;
      setLoading(true);
      setError('');
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        await renderPage({ pdf, pageNumber: 1 });
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF.');
      } finally {
        setLoading(false);
      }
    },
    [pdfjsLib, renderPage]
  );

  const goToPage = useCallback(
    async (pageNumber: number) => {
      if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
      await renderPage({ pdf: pdfDoc, pageNumber });
    },
    [pdfDoc, totalPages, renderPage]
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  useEffect(() => {
    const loadPdfjs = async () => {
      try {
        if (typeof window !== 'undefined') {
          const pdfjs = await import('pdfjs-dist');
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/${pdfjs.version}/build/pdf.worker.min.js`;
          setPdfjsLib(pdfjs);
        }
      } catch (error) {
        console.error('Failed to load PDF.js:', error);
        setError('Failed to load PDF library');
      }
    };
    loadPdfjs();
  }, []);

  useEffect(() => {
    if (feedback?.annotatedPdfUrl && pdfjsLib) {
      loadPdf(feedback.annotatedPdfUrl);
    }
  }, [feedback?.annotatedPdfUrl, pdfjsLib, loadPdf]);

  const handleDownloadFeedback = () => {
    if (!feedback) return;
    // Create a text file with the feedback
    const feedbackText = `Feedback from ${feedback.mentor}
Date: ${feedback.date} at ${feedback.time}
Status: ${feedback.status.toUpperCase()}

Detailed Feedback:
${feedback.detailedFeedback}

Original Message:
${feedback.message}`;

    const blob = new Blob([feedbackText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback-${feedback.paper
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Early return after hooks
  if (!feedback) {
    return (
      <DashboardLayout userRole="student">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/student/feedback')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Feedback
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Feedback not found</CardTitle>
              <CardDescription>
                We couldn&apos;t find that feedback.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'revision':
        return (
          <Badge variant="outline">
            <Edit className="w-3 h-3 mr-1" />
            Revision Required
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-4 w-4" />;
      case 'revision':
        return <Edit className="h-4 w-4" />;
      case 'rejection':
        return <XCircle className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/student/feedback')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Feedback
            </Button>
            <h1 className="text-2xl font-bold mt-2">Feedback Details</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {getTypeIcon(feedback.type)}
                {feedback.paper}
              </span>
              <span>From: {feedback.mentor}</span>
              <span>
                {feedback.date} at {feedback.time}
              </span>
              {getStatusBadge(feedback.status)}
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
                {!pdfjsLib ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="mr-2 animate-spin" size={24} />
                    <span>Loading PDF library...</span>
                  </div>
                ) : (
                  <div>
                    {/* Navigation */}
                    {totalPages > 0 && (
                      <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-100 rounded-lg">
                        <button
                          onClick={prevPage}
                          disabled={currentPage <= 1 || loading}
                          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </button>
                        <span className="font-medium">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={currentPage >= totalPages || loading}
                          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                        >
                          Next
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center text-red-800">
                          <AlertCircle className="mr-2" size={20} />
                          <span className="font-medium">Error: {error}</span>
                        </div>
                      </div>
                    )}

                    {/* Loading Display */}
                    {loading && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-center text-blue-800">
                          <Loader2 className="mr-2 animate-spin" size={20} />
                          <span>Loading PDF...</span>
                        </div>
                      </div>
                    )}

                    {/* PDF Display */}
                    <div
                      className="border border-gray-300 rounded-lg bg-white overflow-hidden"
                      ref={containerRef}
                    >
                      <div className="flex justify-center p-4">
                        <div className="relative inline-block">
                          <canvas
                            ref={canvasRef}
                            className="block max-w-full h-auto shadow-lg"
                            style={{ display: pdfDoc ? 'block' : 'none' }}
                          />
                        </div>

                        {!pdfDoc && !loading && (
                          <div className="text-gray-500 text-center py-12">
                            No PDF loaded. Please provide a PDF URI.
                          </div>
                        )}
                      </div>
                    </div>
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
                      src={feedback.mentorAvatar}
                      alt={feedback.mentor}
                    />
                    <AvatarFallback>
                      {feedback.mentor
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{feedback.mentor}</div>
                    <div className="text-sm text-muted-foreground">
                      {feedback.date} at {feedback.time}
                    </div>
                  </div>
                  {getStatusBadge(feedback.status)}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {feedback.message}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Detailed Feedback</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback.detailedFeedback}
                  </p>
                </div>

                <Button onClick={handleDownloadFeedback} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Feedback
                </Button>
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
                  <div className="font-medium">{feedback.paper}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mentor</div>
                  <div className="font-medium">{feedback.mentor}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Review Date
                  </div>
                  <div className="font-medium">
                    {feedback.date} at {feedback.time}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div>{getStatusBadge(feedback.status)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
