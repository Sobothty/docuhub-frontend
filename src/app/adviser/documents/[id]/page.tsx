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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  MessageSquare,
  Pen,
  Type,
  Highlighter,
  Eraser,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Annotation types
type DrawAnnotation = {
  id: number;
  type: 'draw';
  page: number;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
};

type HighlightAnnotation = {
  id: number;
  type: 'highlight';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type TextAnnotation = {
  id: number;
  type: 'text';
  page: number;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
};

type Annotation = DrawAnnotation | HighlightAnnotation | TextAnnotation;

// Mock document data
const mockDocuments = [
  {
    id: 1,
    title: 'Machine Learning Applications in Healthcare',
    student: 'John Smith',
    studentEmail: 'john.smith@university.edu',
    subject: 'Computer Science',
    description:
      'Exploring the use of ML algorithms for medical diagnosis and treatment optimization...',
    objectives:
      '1. Analyze current ML applications in healthcare 2. Develop new diagnostic algorithms 3. Evaluate effectiveness',
    methodology:
      'Literature review, algorithm development, clinical data analysis',
    submittedDate: '2024-01-15',
    status: 'pending_mentor',
    pdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
  },
  {
    id: 2,
    title: 'Advanced Neural Network Architectures',
    student: 'Emily Davis',
    studentEmail: 'emily.davis@university.edu',
    subject: 'Computer Science',
    description:
      'Research on transformer architectures and their applications in natural language processing...',
    objectives:
      'Study transformer models, implement custom architectures, evaluate performance',
    methodology: 'Literature review, model implementation, benchmark testing',
    submittedDate: '2024-01-18',
    status: 'approved',
    pdfUrl:
      'http://localhost:9000/docuhub/06a558b2-eb2b-4f4f-8ffd-2ccc4a8ca9e5_html_tutorial.pdf',
  },
];

export default function MentorDocumentReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  // --- Move all hooks to top level ---
  const [document, setDocument] = useState(
    mockDocuments.find((d) => d.id === id) || null
  );
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PDF annotation states
  const [pdfjsLib, setPdfjsLib] = useState<typeof import('pdfjs-dist') | null>(
    null
  );
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tool, setTool] = useState<'none' | 'draw' | 'text' | 'highlight'>(
    'none'
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });
  const [textInputScreenPos, setTextInputScreenPos] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState('');
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Hooks must be before any return ---
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

  const forceRedrawCurrentPageOnly = useCallback(
    (pageNumber: number) => {
      if (!overlayCanvasRef.current) return;
      const ctx = overlayCanvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(
        0,
        0,
        overlayCanvasRef.current.width,
        overlayCanvasRef.current.height
      );
      const pageAnnotations = annotations.filter(
        (ann) => ann.page === pageNumber
      );

      pageAnnotations.forEach((annotation) => {
        ctx.save();
        try {
          if (annotation.type === 'draw') {
            ctx.strokeStyle = annotation.color || 'red';
            ctx.lineWidth = annotation.strokeWidth || 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if ('points' in annotation && annotation.points.length > 0) {
              ctx.beginPath();
              annotation.points.forEach((point, pointIndex) => {
                if (pointIndex === 0) {
                  ctx.moveTo(point.x, point.y);
                } else {
                  ctx.lineTo(point.x, point.y);
                }
              });
              ctx.stroke();
            }
          } else if (annotation.type === 'highlight') {
            ctx.fillStyle = (annotation.color || 'yellow') + '50';
            ctx.fillRect(
              annotation.x || 0,
              annotation.y || 0,
              annotation.width || 100,
              annotation.height || 20
            );
          } else if (annotation.type === 'text') {
            ctx.fillStyle = annotation.color || 'black';
            ctx.font = `${annotation.fontSize || 16}px Arial`;
            ctx.textBaseline = 'top';
            ctx.fillText(
              annotation.text || '',
              annotation.x || 0,
              annotation.y || 0
            );
          }
        } catch (error) {
          console.error('Error drawing annotation:', error);
        }
        ctx.restore();
      });
    },
    [annotations]
  );

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
        const overlayCanvas = overlayCanvasRef.current;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (overlayCanvas) {
          overlayCanvas.height = viewport.height;
          overlayCanvas.width = viewport.width;
          const overlayCtx = overlayCanvas.getContext('2d');
          if (overlayCtx) {
            overlayCtx.clearRect(
              0,
              0,
              overlayCanvas.width,
              overlayCanvas.height
            );
          }
        }

        await page.render({
          canvasContext: context!,
          canvas: canvas,
          viewport: viewport,
        }).promise;
        setTimeout(() => {
          forceRedrawCurrentPageOnly(pageNumber);
        }, 150);
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
        setError(`Failed to render page ${pageNumber}`);
      }
    },
    [forceRedrawCurrentPageOnly, setError]
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

  useEffect(() => {
    if (document?.pdfUrl && pdfjsLib) {
      loadPdf(document.pdfUrl);
    }
  }, [document?.pdfUrl, pdfjsLib, loadPdf]);

  useEffect(() => {
    if (showTextInput && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [showTextInput]);

  // --- Early return after hooks ---
  if (!document) {
    return (
      <DashboardLayout userRole="mentor">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/mentor/proposals')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Documents
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Document not found</CardTitle>
              <CardDescription>
                We couldn&apos;t find that document.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_mentor':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
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

  const handleSubmitReview = async () => {
    if (!decision || !feedback.trim()) return;

    setIsSubmitting(true);
    try {
      // Here you would send the review to your API
      console.log(
        `${decision} document ${document.id} with feedback: ${feedback}`
      );
      console.log('Annotations:', annotations);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update document status
      setDocument((prev) =>
        prev
          ? {
              ...prev,
              status: decision === 'approve' ? 'approved' : 'rejected',
            }
          : null
      );

      alert(`Document ${decision}d successfully!`);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPage = async (pageNumber: number) => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;
    setIsDrawing(false);
    setIsHighlighting(false);
    setShowTextInput(false);
    if (overlayCanvasRef.current) {
      const overlayCtx = overlayCanvasRef.current.getContext('2d');
      if (overlayCtx) {
        overlayCtx.clearRect(
          0,
          0,
          overlayCanvasRef.current.width,
          overlayCanvasRef.current.height
        );
      }
    }
    setCurrentPage(pageNumber);
    await renderPage({ pdf: pdfDoc, pageNumber });
  };

  const nextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    if (!overlayCanvasRef.current) return { x: 0, y: 0 };
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const canvasWidth = overlayCanvasRef.current.width;
    const canvasHeight = overlayCanvasRef.current.height;
    const scaleX = canvasWidth / displayWidth;
    const scaleY = canvasHeight / displayHeight;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e);
    if (tool === 'draw') {
      setIsDrawing(true);
      const newAnnotation: DrawAnnotation = {
        id: Date.now(),
        type: 'draw',
        page: currentPage,
        points: [coords],
        color: drawColor,
        strokeWidth: strokeWidth,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
    } else if (tool === 'highlight') {
      setIsHighlighting(true);
      const newAnnotation: HighlightAnnotation = {
        id: Date.now(),
        type: 'highlight',
        page: currentPage,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        color: highlightColor,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
    } else if (tool === 'text') {
      setTextInputPos(coords);
      if (overlayCanvasRef.current) {
        const rect = overlayCanvasRef.current.getBoundingClientRect();
        setTextInputScreenPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      setShowTextInput(true);
      setTextValue('');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e);
    if (isDrawing && tool === 'draw') {
      setAnnotations((prev) => {
        const newAnnotations = [...prev];
        const lastAnnotation = newAnnotations[newAnnotations.length - 1];
        if (lastAnnotation && lastAnnotation.type === 'draw') {
          (lastAnnotation as DrawAnnotation).points.push(coords);
        }
        return newAnnotations;
      });
      forceRedrawCurrentPageOnly(currentPage);
    } else if (isHighlighting && tool === 'highlight') {
      setAnnotations((prev) => {
        const newAnnotations = [...prev];
        const lastAnnotation = newAnnotations[newAnnotations.length - 1];
        if (lastAnnotation && lastAnnotation.type === 'highlight') {
          (lastAnnotation as HighlightAnnotation).width =
            coords.x - (lastAnnotation as HighlightAnnotation).x;
          (lastAnnotation as HighlightAnnotation).height =
            coords.y - (lastAnnotation as HighlightAnnotation).y;
        }
        return newAnnotations;
      });
      forceRedrawCurrentPageOnly(currentPage);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsHighlighting(false);
    forceRedrawCurrentPageOnly(currentPage);
  };

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      const newAnnotation: TextAnnotation = {
        id: Date.now(),
        type: 'text',
        page: currentPage,
        x: textInputPos.x,
        y: textInputPos.y + 16,
        text: textValue,
        color: drawColor,
        fontSize: 16,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      forceRedrawCurrentPageOnly(currentPage);
    }
    setShowTextInput(false);
    setTextValue('');
  };

  const clearAnnotations = () => {
    setAnnotations((prev) => prev.filter((ann) => ann.page !== currentPage));
    forceRedrawCurrentPageOnly(currentPage);
  };

  const clearAllAnnotations = () => {
    setAnnotations([]);
    forceRedrawCurrentPageOnly(currentPage);
  };

  return (
    <DashboardLayout userRole="mentor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/mentor/proposals')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Documents
            </Button>
            <h1 className="text-2xl font-bold mt-2">{document.title}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {document.student}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {document.subject}
              </span>
              <span>Submitted: {document.submittedDate}</span>
              {getStatusBadge(document.status)}
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
                  Review and annotate the student document
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
                    {/* Toolbar */}
                    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tools:</span>
                          <button
                            onClick={() => setTool('none')}
                            className={`px-3 py-2 rounded ${
                              tool === 'none'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border'
                            }`}
                          >
                            Select
                          </button>
                          <button
                            onClick={() => setTool('draw')}
                            className={`px-3 py-2 rounded flex items-center gap-1 ${
                              tool === 'draw'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border'
                            }`}
                          >
                            <Pen size={16} />
                            Draw
                          </button>
                          <button
                            onClick={() => setTool('highlight')}
                            className={`px-3 py-2 rounded flex items-center gap-1 ${
                              tool === 'highlight'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border'
                            }`}
                          >
                            <Highlighter size={16} />
                            Highlight
                          </button>
                          <button
                            onClick={() => setTool('text')}
                            className={`px-3 py-2 rounded flex items-center gap-1 ${
                              tool === 'text'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border'
                            }`}
                          >
                            <Type size={16} />
                            Text
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={clearAnnotations}
                            className="px-3 py-2 bg-orange-500 text-white rounded flex items-center gap-1"
                          >
                            <Eraser size={16} />
                            Clear Page
                          </button>
                          <button
                            onClick={clearAllAnnotations}
                            className="px-3 py-2 bg-red-500 text-white rounded flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Clear All
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">
                            Draw Color:
                          </label>
                          <input
                            type="color"
                            value={drawColor}
                            onChange={(e) => setDrawColor(e.target.value)}
                            className="w-8 h-8 rounded border cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">
                            Highlight Color:
                          </label>
                          <input
                            type="color"
                            value={highlightColor}
                            onChange={(e) => setHighlightColor(e.target.value)}
                            className="w-8 h-8 rounded border cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">
                            Stroke Width:
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={strokeWidth}
                            onChange={(e) =>
                              setStrokeWidth(Number(e.target.value))
                            }
                            className="w-20"
                          />
                          <span className="text-sm">{strokeWidth}px</span>
                        </div>
                      </div>
                    </div>

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
                      <div className="flex justify-center p-4 relative">
                        <div className="relative inline-block">
                          <canvas
                            ref={canvasRef}
                            className="block max-w-full h-auto shadow-lg"
                            style={{ display: pdfDoc ? 'block' : 'none' }}
                          />
                          <canvas
                            ref={overlayCanvasRef}
                            className="absolute top-0 left-0 pointer-events-auto"
                            style={{
                              display: pdfDoc ? 'block' : 'none',
                              cursor: tool !== 'none' ? 'crosshair' : 'default',
                              width: canvasRef.current?.offsetWidth + 'px',
                              height: canvasRef.current?.offsetHeight + 'px',
                              zIndex: 10,
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleMouseDown(e);
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                          />

                          {/* Text Input */}
                          {showTextInput && (
                            <div
                              className="absolute z-20 bg-white border border-red-700 text-black rounded shadow-lg p-2"
                              style={{
                                left: `${textInputScreenPos.x}px`,
                                top: `${textInputScreenPos.y - 45}px`,
                                transform: 'translate(-50%, 0)',
                                minWidth: '150px',
                              }}
                            >
                              <input
                                ref={textInputRef}
                                type="text"
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleTextSubmit();
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    setShowTextInput(false);
                                    setTextValue('');
                                  }
                                }}
                                onBlur={() => {
                                  if (textValue.trim()) {
                                    handleTextSubmit();
                                  } else {
                                    setShowTextInput(false);
                                    setTextValue('');
                                  }
                                }}
                                className="px-2 py-1 text-sm border-0 outline-none w-full"
                                placeholder="Type text here..."
                                autoFocus
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Press Enter to confirm, Escape to cancel
                              </div>
                            </div>
                          )}
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
                    onClick={() => setDecision('approve')}
                    className={`flex-1 ${
                      decision === 'approve'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => setDecision('reject')}
                    className={`flex-1 ${
                      decision === 'reject'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={!decision || !feedback.trim() || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
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
                  <div className="font-medium">{document.student}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Subject</div>
                  <div className="font-medium">{document.subject}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Submitted</div>
                  <div className="font-medium">{document.submittedDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Description
                  </div>
                  <div className="text-sm">{document.description}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
