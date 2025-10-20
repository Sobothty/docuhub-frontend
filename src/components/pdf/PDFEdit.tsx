"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pen,
  Type,
  Highlighter,
  Eraser,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCw,
  Minimize,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useCreateMediaMutation } from "@/feature/media/mediaSlice";
import { PDFDocumentProxy } from "pdfjs-dist";
import { toast } from "sonner";
import DocuhubLoader from "../loader/docuhub-loading";

interface PDFEditProps {
  pdfUri: string;
  onUploadSuccess?: (fileUri: string) => void;
}

interface UploadMediaResponse {
  data: {
    uri: string;
  };
}

interface PdfjsLib {
  getDocument: (url: string) => {
    promise: Promise<PDFDocumentProxy>;
  };
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  version: string;
}

type DrawAnnotation = {
  id: number;
  type: "draw";
  page: number;
  points: Array<{ x: number; y: number }>;
  color: string;
  strokeWidth: number;
};

type HighlightAnnotation = {
  id: number;
  type: "highlight";
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type TextAnnotation = {
  id: number;
  type: "text";
  page: number;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
};

type Annotation = DrawAnnotation | HighlightAnnotation | TextAnnotation;

interface RenderPageParams {
  pdf: PDFDocumentProxy;
  pageNumber: number;
}

const PDFEdit = ({ pdfUri, onUploadSuccess }: PDFEditProps) => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfjsLib, setPdfjsLib] = useState<PdfjsLib | null>(null);

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState("");

  const [tool, setTool] = useState<"none" | "draw" | "text" | "highlight">(
    "none"
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentDrawingAnnotation, setCurrentDrawingAnnotation] =
    useState<DrawAnnotation | null>(null);
  const [currentHighlightAnnotation, setCurrentHighlightAnnotation] =
    useState<HighlightAnnotation | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });
  const [textInputScreenPos, setTextInputScreenPos] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");
  const [drawColor, setDrawColor] = useState("#ff0000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInputValue, setPageInputValue] = useState("1");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);

  const [createMedia, { isLoading: isUploading }] = useCreateMediaMutation();

  const [renderingCache, setRenderingCache] = useState<
    Map<number, HTMLCanvasElement>
  >(new Map());

  // Draw a single annotation on the canvas
  const drawAnnotation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      annotation: DrawAnnotation | HighlightAnnotation
    ) => {
      ctx.save();
      try {
        if (annotation.type === "draw") {
          ctx.strokeStyle = annotation.color;
          ctx.lineWidth = annotation.strokeWidth;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();

          if (annotation.points && annotation.points.length > 0) {
            ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
            for (let i = 1; i < annotation.points.length; i++) {
              ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
            }
          }
          ctx.stroke();
        } else if (annotation.type === "highlight") {
          ctx.fillStyle = annotation.color + "80";
          ctx.fillRect(
            annotation.x,
            annotation.y,
            annotation.width,
            annotation.height
          );
        }
      } catch (error) {
        console.log(`Error drawing annotation:`, error);
      }
      ctx.restore();
    },
    []
  );

  // Redraw only saved annotations (not temporary ones)
  const redrawSavedAnnotations = useCallback(
    (pageNumber: number) => {
      if (!overlayCanvasRef.current) {
        return;
      }

      const ctx = overlayCanvasRef.current.getContext("2d");
      if (!ctx) {
        return;
      }

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
          if (annotation.type === "draw") {
            ctx.strokeStyle = annotation.color;
            ctx.lineWidth = annotation.strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();

            if (annotation.points && annotation.points.length > 0) {
              ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
              for (let i = 1; i < annotation.points.length; i++) {
                ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
              }
            }
            ctx.stroke();
          } else if (annotation.type === "highlight") {
            ctx.fillStyle = annotation.color + "80";
            ctx.fillRect(
              annotation.x,
              annotation.y,
              annotation.width,
              annotation.height
            );
          } else if (annotation.type === "text") {
            ctx.fillStyle = annotation.color || "#000000";
            ctx.font = `${annotation.fontSize || 16}px Arial`;
            ctx.fillText(annotation.text, annotation.x, annotation.y);
          }
        } catch (error) {
          console.log(`Error drawing annotation:`, error);
        }
        ctx.restore();
      });
    },
    [annotations]
  );

  const renderPageSilent = useCallback(
    async (pageNumber: number): Promise<HTMLCanvasElement> => {
      if (!pdfDoc) throw new Error("No PDF document loaded");

      if (renderingCache.has(pageNumber)) {
        const cachedCanvas = renderingCache.get(pageNumber);
        if (cachedCanvas) return cachedCanvas;
      }

      try {
        const page = await pdfDoc.getPage(pageNumber);

        const tempPdfCanvas = document.createElement("canvas");
        const tempOverlayCanvas = document.createElement("canvas");

        const viewport = page.getViewport({ scale, rotation });

        tempPdfCanvas.width = viewport.width;
        tempPdfCanvas.height = viewport.height;
        tempOverlayCanvas.width = viewport.width;
        tempOverlayCanvas.height = viewport.height;

        const pdfCtx = tempPdfCanvas.getContext("2d");
        const overlayCtx = tempOverlayCanvas.getContext("2d");

        if (!pdfCtx || !overlayCtx) {
          throw new Error("Failed to get canvas contexts");
        }

        await page.render({
          canvasContext: pdfCtx,
          viewport: viewport,
        }).promise;

        overlayCtx.clearRect(
          0,
          0,
          tempOverlayCanvas.width,
          tempOverlayCanvas.height
        );

        const pageAnnotations = annotations.filter(
          (ann) => ann.page === pageNumber
        );

        pageAnnotations.forEach((annotation) => {
          overlayCtx.save();
          try {
            if (annotation.type === "draw") {
              overlayCtx.strokeStyle = annotation.color;
              overlayCtx.lineWidth = annotation.strokeWidth;
              overlayCtx.lineCap = "round";
              overlayCtx.lineJoin = "round";
              overlayCtx.beginPath();

              if (annotation.points && annotation.points.length > 0) {
                overlayCtx.moveTo(
                  annotation.points[0].x,
                  annotation.points[0].y
                );
                for (let i = 1; i < annotation.points.length; i++) {
                  overlayCtx.lineTo(
                    annotation.points[i].x,
                    annotation.points[i].y
                  );
                }
              }
              overlayCtx.stroke();
            } else if (annotation.type === "highlight") {
              overlayCtx.fillStyle = annotation.color + "80";
              overlayCtx.fillRect(
                annotation.x,
                annotation.y,
                annotation.width,
                annotation.height
              );
            } else if (annotation.type === "text") {
              overlayCtx.fillStyle = annotation.color || "#000000";
              overlayCtx.font = `${annotation.fontSize || 16}px Arial`;
              overlayCtx.fillText(annotation.text, annotation.x, annotation.y);
            }
          } catch (error) {
            console.warn(`Error drawing annotation:`, error);
          }
          overlayCtx.restore();
        });

        const combinedCanvas = document.createElement("canvas");
        combinedCanvas.width = viewport.width;
        combinedCanvas.height = viewport.height;

        const combinedCtx = combinedCanvas.getContext("2d");
        if (combinedCtx) {
          combinedCtx.drawImage(tempPdfCanvas, 0, 0);
          combinedCtx.drawImage(tempOverlayCanvas, 0, 0);
        }

        setRenderingCache((prev) => {
          const newCache = new Map(prev);
          if (newCache.size >= 10) {
            const firstKey = newCache.keys().next().value;
            if (firstKey !== undefined) {
              newCache.delete(firstKey);
            }
          }
          newCache.set(pageNumber, combinedCanvas);
          return newCache;
        });

        return combinedCanvas;
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
        throw error;
      }
    },
    [pdfDoc, scale, rotation, annotations, renderingCache]
  );

  const renderPage = useCallback(
    async ({ pdf, pageNumber }: RenderPageParams) => {
      if (!pdf || !canvasRef.current) return;
      try {
        const page = await pdf.getPage(pageNumber);
        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Failed to get canvas context");
        }

        const viewport = page.getViewport({ scale, rotation });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (overlayCanvas) {
          overlayCanvas.height = viewport.height;
          overlayCanvas.width = viewport.width;

          const overlayCtx = overlayCanvas.getContext("2d");
          if (overlayCtx) {
            overlayCtx.clearRect(
              0,
              0,
              overlayCanvas.width,
              overlayCanvas.height
            );
          }
        }

        await page.render({ canvasContext: context, viewport: viewport })
          .promise;

        setTimeout(() => {
          redrawSavedAnnotations(pageNumber);
        }, 100);
      } catch (error) {
        console.log(`Error rendering page ${pageNumber}:`, error);
        setError(`Failed to render page ${pageNumber}`);
      }
    },
    [scale, rotation, redrawSavedAnnotations]
  );

  const goToPage = useCallback(
    async (pageNumber: number) => {
      if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;

      setIsDrawing(false);
      setIsHighlighting(false);
      setShowTextInput(false);
      setCurrentDrawingAnnotation(null);
      setCurrentHighlightAnnotation(null);

      if (overlayCanvasRef.current) {
        const overlayCtx = overlayCanvasRef.current.getContext("2d");
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
    },
    [pdfDoc, totalPages, renderPage]
  );

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1.5);
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const handlePageJump = useCallback(() => {
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      goToPage(pageNum);
    } else {
      setPageInputValue(currentPage.toString());
    }
  }, [pageInputValue, totalPages, currentPage, goToPage]);

  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const loadPdfjs = async () => {
      try {
        if (typeof window !== "undefined") {
          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
          setPdfjsLib(pdfjs);
        }
      } catch (error) {
        console.log("Failed to load PDF.js:", error);
        setError("Failed to load PDF library");
      }
    };
    loadPdfjs();
  }, []);

  const loadPdf = useCallback(
    async (pdfUrl: string) => {
      if (!pdfjsLib) return;
      setLoading(true);
      setError("");
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        await renderPage({ pdf, pageNumber: 1 });
      } catch (error) {
        console.log("Error loading PDF:", error);
        setError("Failed to load PDF.");
      } finally {
        setLoading(false);
      }
    },
    [pdfjsLib, renderPage]
  );

  const createAndUploadPDF = useCallback(async (): Promise<string | null> => {
    const originalPage = currentPage;

    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setDownloadType("Initializing PDF Creation");
      setError("");

      setRenderingCache(new Map());

      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;

      if (!pdfDoc) {
        throw new Error("No PDF document loaded");
      }

      const pdf = new jsPDF({
        compress: true,
        format: "a4",
        unit: "mm",
      });

      setDownloadProgress(5);
      setDownloadType("Processing PDF Pages");

      const BATCH_SIZE = 5;
      const totalBatches = Math.ceil(totalPages / BATCH_SIZE);
      let isFirstPage = true;

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startPage = batchIndex * BATCH_SIZE + 1;
        const endPage = Math.min((batchIndex + 1) * BATCH_SIZE, totalPages);

        const batchPromises: Promise<{
          pageNum: number;
          canvas: HTMLCanvasElement;
        }>[] = [];

        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
          batchPromises.push(
            renderPageSilent(pageNum).then((canvas) => ({ pageNum, canvas }))
          );
        }

        try {
          const batchResults = await Promise.race([
            Promise.all(batchPromises),
            new Promise<never>((_, reject) =>
              setTimeout(
                () => reject(new Error("Batch processing timeout")),
                30000
              )
            ),
          ]);

          batchResults.sort((a, b) => a.pageNum - b.pageNum);

          for (const { pageNum, canvas } of batchResults) {
            try {
              const quality = totalPages > 20 ? 0.8 : 0.95;
              const imgData = canvas.toDataURL("image/jpeg", quality);

              const imgWidth = canvas.width;
              const imgHeight = canvas.height;

              const pdfWidth = 210;
              const pdfHeight = 297;

              const scaleX = pdfWidth / imgWidth;
              const scaleY = pdfHeight / imgHeight;
              const scale = Math.min(scaleX, scaleY);

              const scaledWidth = imgWidth * scale;
              const scaledHeight = imgHeight * scale;

              const x = (pdfWidth - scaledWidth) / 2;
              const y = (pdfHeight - scaledHeight) / 2;

              if (!isFirstPage) {
                pdf.addPage();
              }

              pdf.addImage(imgData, "JPEG", x, y, scaledWidth, scaledHeight);
              isFirstPage = false;

              const progress = 10 + (pageNum / totalPages) * 70;
              setDownloadProgress(progress);
            } catch (pageError) {
              console.warn(`Failed to add page ${pageNum} to PDF:`, pageError);
            }
          }

          if (batchIndex < totalBatches - 1) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } catch (batchError) {
          console.error(
            `Error processing batch ${batchIndex + 1}:`,
            batchError
          );
        }
      }

      setDownloadProgress(85);
      setDownloadType("Compressing PDF");

      const pdfBlob = pdf.output("blob");

      const maxSize = 50 * 1024 * 1024;
      if (pdfBlob.size > maxSize) {
        throw new Error(
          `PDF too large (${Math.round(
            pdfBlob.size / 1024 / 1024
          )}MB). Maximum: 50MB`
        );
      }

      setDownloadProgress(90);
      setDownloadType("Uploading to Server");

      const formData = new FormData();
      formData.append("file", pdfBlob, `annotated-pdf-${Date.now()}.pdf`);

      const uploadResult = await Promise.race([
        createMedia(formData).unwrap(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Upload timeout")), 120000)
        ),
      ]);

      setDownloadProgress(100);

      const uploadedUri = (uploadResult as UploadMediaResponse)?.data?.uri;

      if (onUploadSuccess) {
        onUploadSuccess(uploadedUri);
      }

      setRenderingCache(new Map());

      setTimeout(() => {
        if (originalPage !== currentPage) {
          goToPage(originalPage);
        }
      }, 100);

      toast.success("PDF uploaded successfully!");
      return uploadedUri;
    } catch (error) {
      console.error("Error creating/uploading PDF:", error);

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setError(`Failed to create/upload PDF: ${errorMessage}`);

      setRenderingCache(new Map());

      setTimeout(() => {
        if (originalPage !== currentPage) {
          goToPage(originalPage);
        }
      }, 100);

      return null;
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadType("");
    }
  }, [
    currentPage,
    pdfDoc,
    totalPages,
    renderPageSilent,
    createMedia,
    onUploadSuccess,
    goToPage,
  ]);

  const DownloadProgressModal = () => {
    if (!isDownloading) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-4">
              <DocuhubLoader />
            </div>
            <h3 className="text-lg font-semibold mb-2">{downloadType}</h3>
            <p className="text-gray-600 mb-4">
              Processing page {Math.ceil((downloadProgress / 100) * totalPages)}{" "}
              of {totalPages}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>

            <div className="text-2xl font-bold text-blue-500">
              {Math.round(downloadProgress)}%
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {downloadProgress < 50
                ? "This may take a moment for large documents..."
                : downloadProgress < 90
                ? "Almost ready..."
                : "Finalizing upload..."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleUploadAndProcess = useCallback(async () => {
    const uploadedUri = await createAndUploadPDF();

    if (uploadedUri) {
      console.log("Uploaded PDF URI:", uploadedUri);
    } else {
      console.log("Upload failed, no URI returned");
    }
  }, [createAndUploadPDF]);

  const createPDFAndDownload = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;

      if (!pdfDoc) {
        throw new Error("No PDF document loaded");
      }

      const pdf = new jsPDF();
      let isFirstPage = true;

      const originalPage = currentPage;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const renderedCanvas = await renderPageSilent(pageNum);
        const imgData = renderedCanvas.toDataURL("image/jpeg", 0.95);

        const imgWidth = renderedCanvas.width;
        const imgHeight = renderedCanvas.height;

        const pdfWidth = 210;
        const pdfHeight = 297;

        const scaleX = pdfWidth / imgWidth;
        const scaleY = pdfHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;

        if (!isFirstPage) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "JPEG", x, y, scaledWidth, scaledHeight);
        isFirstPage = false;
      }

      await goToPage(originalPage);

      pdf.save(`annotated-pdf-${Date.now()}.pdf`);
    } catch (error) {
      console.log("Error creating PDF:", error);
      setError(`Failed to create PDF: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [pdfDoc, currentPage, totalPages, goToPage, renderPageSilent]);

  useEffect(() => {
    if (pdfUri && pdfjsLib) {
      loadPdf(pdfUri);
    }
  }, [pdfUri, pdfjsLib, loadPdf]);

  useEffect(() => {
    if (showTextInput && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [showTextInput]);

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

    if (tool === "draw") {
      setIsDrawing(true);
      const newAnnotation: DrawAnnotation = {
        id: Date.now(),
        type: "draw",
        page: currentPage,
        points: [coords],
        color: drawColor,
        strokeWidth: strokeWidth,
      };
      setCurrentDrawingAnnotation(newAnnotation);
    } else if (tool === "highlight") {
      setIsHighlighting(true);
      const newAnnotation: HighlightAnnotation = {
        id: Date.now(),
        type: "highlight",
        page: currentPage,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        color: highlightColor,
      };
      setCurrentHighlightAnnotation(newAnnotation);
    } else if (tool === "text") {
      setTextInputPos(coords);
      if (overlayCanvasRef.current) {
        const rect = overlayCanvasRef.current.getBoundingClientRect();
        setTextInputScreenPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      setShowTextInput(true);
      setTextValue("");
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!overlayCanvasRef.current) return;
    const coords = getCanvasCoordinates(e);
    const ctx = overlayCanvasRef.current.getContext("2d");
    if (!ctx) return;

    if (isDrawing && tool === "draw" && currentDrawingAnnotation) {
      // Add point to current drawing
      currentDrawingAnnotation.points.push(coords);

      // Redraw everything: saved annotations + current drawing
      ctx.clearRect(
        0,
        0,
        overlayCanvasRef.current.width,
        overlayCanvasRef.current.height
      );

      // Draw saved annotations
      const pageAnnotations = annotations.filter(
        (ann) => ann.page === currentPage
      );
      pageAnnotations.forEach((annotation) => {
        ctx.save();
        try {
          if (annotation.type === "draw") {
            ctx.strokeStyle = annotation.color;
            ctx.lineWidth = annotation.strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();

            if (annotation.points && annotation.points.length > 0) {
              ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
              for (let i = 1; i < annotation.points.length; i++) {
                ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
              }
            }
            ctx.stroke();
          } else if (annotation.type === "highlight") {
            ctx.fillStyle = annotation.color + "80";
            ctx.fillRect(
              annotation.x,
              annotation.y,
              annotation.width,
              annotation.height
            );
          } else if (annotation.type === "text") {
            ctx.fillStyle = annotation.color || "#000000";
            ctx.font = `${annotation.fontSize || 16}px Arial`;
            ctx.fillText(annotation.text, annotation.x, annotation.y);
          }
        } catch (error) {
          console.log(`Error drawing annotation:`, error);
        }
        ctx.restore();
      });

      // Draw current drawing annotation
      drawAnnotation(ctx, currentDrawingAnnotation);
    } else if (
      isHighlighting &&
      tool === "highlight" &&
      currentHighlightAnnotation
    ) {
      // Update current highlight dimensions
      currentHighlightAnnotation.width =
        coords.x - currentHighlightAnnotation.x;
      currentHighlightAnnotation.height =
        coords.y - currentHighlightAnnotation.y;

      // Redraw everything: saved annotations + current highlight
      ctx.clearRect(
        0,
        0,
        overlayCanvasRef.current.width,
        overlayCanvasRef.current.height
      );

      // Draw saved annotations
      const pageAnnotations = annotations.filter(
        (ann) => ann.page === currentPage
      );
      pageAnnotations.forEach((annotation) => {
        ctx.save();
        try {
          if (annotation.type === "draw") {
            ctx.strokeStyle = annotation.color;
            ctx.lineWidth = annotation.strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();

            if (annotation.points && annotation.points.length > 0) {
              ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
              for (let i = 1; i < annotation.points.length; i++) {
                ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
              }
            }
            ctx.stroke();
          } else if (annotation.type === "highlight") {
            ctx.fillStyle = annotation.color + "80";
            ctx.fillRect(
              annotation.x,
              annotation.y,
              annotation.width,
              annotation.height
            );
          } else if (annotation.type === "text") {
            ctx.fillStyle = annotation.color || "#000000";
            ctx.font = `${annotation.fontSize || 16}px Arial`;
            ctx.fillText(annotation.text, annotation.x, annotation.y);
          }
        } catch (error) {
          console.log(`Error drawing annotation:`, error);
        }
        ctx.restore();
      });

      // Draw current highlight annotation
      drawAnnotation(ctx, currentHighlightAnnotation);
    }
  };

  const handleMouseUp = () => {
    // Save the current annotation to the main annotations array
    if (isDrawing && currentDrawingAnnotation) {
      setAnnotations((prev) => [...prev, currentDrawingAnnotation]);
      setCurrentDrawingAnnotation(null);
      // Don't redraw - the annotation is already visible on canvas
    } else if (isHighlighting && currentHighlightAnnotation) {
      setAnnotations((prev) => [...prev, currentHighlightAnnotation]);
      setCurrentHighlightAnnotation(null);
      // Don't redraw - the annotation is already visible on canvas
    }

    setIsDrawing(false);
    setIsHighlighting(false);
  };

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      const newAnnotation: TextAnnotation = {
        id: Date.now(),
        type: "text",
        page: currentPage,
        x: textInputPos.x,
        y: textInputPos.y + 16,
        text: textValue,
        color: drawColor,
        fontSize: 16,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);

      // Manually draw the text annotation immediately
      if (overlayCanvasRef.current) {
        const ctx = overlayCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.save();
          ctx.fillStyle = drawColor;
          ctx.font = "16px Arial";
          ctx.fillText(textValue, textInputPos.x, textInputPos.y + 16);
          ctx.restore();
        }
      }
    }
    setShowTextInput(false);
    setTextValue("");
  };

  const clearAnnotations = useCallback(() => {
    setAnnotations((prev) => prev.filter((ann) => ann.page !== currentPage));
  }, [currentPage]);

  const clearAllAnnotations = useCallback(() => {
    setAnnotations([]);
  }, []);

  if (!pdfjsLib) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="mr-2 animate-spin" size={24} />
          <span>Loading PDF library...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Modern Toolbar */}
      <div className="mb-4 sm:mb-6">
        {/* Main Tools Section */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            {/* Tool Selection */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-md sm:text-sm font-semibold mr-1 sm:mr-2">
                Tools :
              </span>
              <div className="flex items-center gap-1 bg-background rounded-lg p-1 flex-1 sm:flex-initial">
                <button
                  onClick={() => setTool("none")}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    tool === "none"
                      ? "bg-accent text-sm shadow-sm"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  Select
                </button>
                <button
                  onClick={() => setTool("draw")}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                    tool === "draw"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <Pen size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Draw</span>
                </button>
                <button
                  onClick={() => setTool("highlight")}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                    tool === "highlight"
                      ? "bg-white text-yellow-600 shadow-sm"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <Highlighter size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Highlight</span>
                </button>
                <button
                  onClick={() => setTool("text")}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                    tool === "text"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <Type size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Text</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={clearAnnotations}
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 border border-orange-200"
              >
                <Eraser size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Clear Page</span>
              </button>
              <button
                onClick={clearAllAnnotations}
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 border border-red-200"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Controls Section */}
        <div className="py-2">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold mr-1 sm:mr-2">
                View
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 sm:p-2 text-sm bg-background rounded-lg transition-colors"
                >
                  <ZoomOut
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-body-text"
                  />
                </button>
                <span className="px-2 sm:px-3 py-1 bg-background rounded-lg text-xs sm:text-sm min-w-[3rem] sm:min-w-[4rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors"
                >
                  <ZoomIn
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-body-text"
                  />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-2 sm:px-3 py-1 sm:py-2 bg-background rounded-lg text-xs sm:text-sm transition-colors"
                >
                  Fit
                </button>
                <button
                  onClick={handleRotate}
                  className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors"
                >
                  <RotateCw
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-sm"
                  />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors text-sm"
                >
                  {isFullscreen ? (
                    <Minimize size={16} className="sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <Maximize size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage <= 1 || loading}
                className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-md"
                />
              </button>

              <div className="flex items-center gap-1 sm:gap-2 bg-background rounded-lg px-2 sm:px-3 py-1">
                <input
                  ref={pageInputRef}
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInputValue}
                  onChange={(e) => setPageInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePageJump();
                      pageInputRef.current?.blur();
                    }
                  }}
                  onBlur={handlePageJump}
                  className="w-8 sm:w-12 text-center text-sm sm:text-navigation-links"
                />
                <span className="text-gray-500 text-xs sm:text-sm">/</span>
                <span className="w-8 text-center text-sm sm:text-navigation-links">
                  {totalPages}
                </span>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages || loading}
                className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-md"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Style Controls Section */}
        <div className="py-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Draw Color */}
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-xs sm:text-sm">Draw</label>
              <div className="relative">
                <input
                  type="color"
                  value={drawColor}
                  onChange={(e) => setDrawColor(e.target.value)}
                  className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer transition-colors"
                />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: drawColor }}
                />
              </div>
            </div>

            {/* Highlight Color */}
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-xs sm:text-sm">Highlight</label>
              <div className="relative">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg cursor-pointer transition-colors"
                />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: highlightColor }}
                />
              </div>
            </div>

            {/* Stroke Width */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[150px] sm:min-w-[200px]">
              <label className="text-xs sm:text-sm whitespace-nowrap">
                Stroke
              </label>
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-xs sm:text-body-text font-semibold bg-background px-2 sm:px-3 py-1 rounded-lg min-w-[2.5rem] sm:min-w-[3rem] text-center">
                  {strokeWidth}px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Actions Section */}
        <div className="py-2 border-t">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold mr-1 sm:mr-2 w-full sm:w-auto">
              Export Options
            </span>
            <button
              onClick={createPDFAndDownload}
              className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || isDownloading}
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
              {loading ? "Creating..." : "Download PDF"}
            </button>
            <button
              onClick={handleUploadAndProcess}
              className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || isDownloading || isUploading}
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
              {isDownloading || isUploading
                ? "Uploading..."
                : "Upload to Student"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-start">
            <AlertCircle
              className="mr-3 mt-0.5 text-red-500 flex-shrink-0"
              size={20}
            />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Display */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <div className="flex items-center text-blue-800">
            <Loader2 className="mr-3 animate-spin text-blue-500" size={20} />
            <span className="font-medium">Loading PDF...</span>
          </div>
        </div>
      )}

      {/* PDF Display Container */}
      <div className="p-1 bg-background rounded-xl" ref={containerRef}>
        <div className="flex justify-center relative">
          <div className="relative inline-block rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="block max-w-full h-auto"
              style={{ display: pdfDoc ? "block" : "none" }}
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 pointer-events-auto"
              style={{
                display: pdfDoc ? "block" : "none",
                cursor: tool !== "none" ? "crosshair" : "default",
                width: canvasRef.current?.offsetWidth + "px",
                height: canvasRef.current?.offsetHeight + "px",
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />

            {/* Text Input */}
            {showTextInput && (
              <div
                className="absolute z-20 bg-white border-2 border-blue-500 rounded-lg shadow-xl p-3"
                style={{
                  left: `${textInputScreenPos.x}px`,
                  top: `${textInputScreenPos.y - 60}px`,
                  transform: "translate(-50%, 0)",
                  minWidth: "200px",
                }}
              >
                <input
                  ref={textInputRef}
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleTextSubmit();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setShowTextInput(false);
                      setTextValue("");
                    }
                  }}
                  onBlur={() => {
                    if (textValue.trim()) {
                      handleTextSubmit();
                    } else {
                      setShowTextInput(false);
                      setTextValue("");
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border-0 outline-none rounded-md bg-gray-50 focus:bg-white"
                  placeholder="Type text here..."
                  autoFocus
                />
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                  <span>↵ Enter to add</span>
                  <span>Esc to cancel</span>
                </div>
              </div>
            )}
          </div>

          {!pdfDoc && !loading && (
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300">
                <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600 font-medium">No PDF loaded</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please provide a PDF URI
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Download Progress Modal */}
      <DownloadProgressModal />

      {/* Quick Navigation Footer */}
      {totalPages > 0 && (
        <div className="mt-4 sm:mt-6 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-md">Quick Jump:</span>
              <button
                onClick={() => goToPage(1)}
                className="px-2 sm:px-3 py-1 rounded-lg text-sm bg-background font-medium transition-colors"
              >
                First
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                className="px-2 sm:px-3 py-1 bg-background rounded-lg text-sm font-medium transition-colors"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFEdit;
