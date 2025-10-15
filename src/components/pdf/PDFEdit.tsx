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
import { useRef, useState, useEffect } from "react";
import { useCreateMediaMutation } from "@/feature/media/mediaSlice";

interface PDFEditProps {
  pdfUri: string;
  onUploadSuccess?: (fileUri: string) => void;
}

const PDFEdit = ({ pdfUri, onUploadSuccess }: PDFEditProps) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  // Add download progress states
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<string>("");

  // Annotation states
  const [tool, setTool] = useState<"none" | "draw" | "text" | "highlight">(
    "none"
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });
  const [textInputScreenPos, setTextInputScreenPos] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");
  const [drawColor, setDrawColor] = useState("#ff0000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [strokeWidth, setStrokeWidth] = useState(2);

  // NEW: Enhanced UX states
  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);

  // Add RTK Query mutation hook
  const [createMedia, { isLoading: isUploading }] = useCreateMediaMutation();

  // Update only the createAndUploadPDF function to include progress
  const createAndUploadPDF = async (): Promise<string | null> => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setDownloadType("Creating and Uploading PDF");
      setError("");

      // Dynamic import of jsPDF
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;

      if (!pdfDoc) {
        setError("No PDF document loaded");
        setIsDownloading(false);
        return null;
      }

      // Create a new PDF
      const pdf = new jsPDF();
      let isFirstPage = true;

      const originalPage = currentPage;

      // Process each page (80% of progress)
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        console.log(`Processing page ${pageNum}...`);

        // Navigate to the page
        await goToPage(pageNum);

        // Wait for the page to render completely
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get the combined canvas (PDF + annotations)
        const combinedCanvas = combineCanvases();
        const imgData = combinedCanvas.toDataURL("image/jpeg", 0.95);

        // Calculate dimensions to fit PDF page
        const imgWidth = combinedCanvas.width;
        const imgHeight = combinedCanvas.height;

        // A4 dimensions in mm
        const pdfWidth = 210;
        const pdfHeight = 297;

        // Calculate scale to fit page while maintaining aspect ratio
        const scaleX = pdfWidth / imgWidth;
        const scaleY = pdfHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        // Center the image on the page
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;

        if (!isFirstPage) {
          pdf.addPage();
        }

        // Add the image to PDF
        pdf.addImage(imgData, "JPEG", x, y, scaledWidth, scaledHeight);
        isFirstPage = false;

        // Update progress (80% for processing pages)
        const progress = (pageNum / totalPages) * 80;
        setDownloadProgress(progress);

        // Small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Return to original page
      await goToPage(originalPage);

      // Upload progress (20% remaining)
      setDownloadProgress(85);
      setDownloadType("Uploading PDF to Server");

      // Convert PDF to blob
      const pdfBlob = pdf.output("blob");

      // Create form data
      const formData = new FormData();
      formData.append("file", pdfBlob, `feedback-pdf-${Date.now()}.pdf`);

      setDownloadProgress(90);

      // Upload using RTK Query mutation
      const result = await createMedia(formData).unwrap();
      
      console.log("PDF uploaded successfully:", result);
      
      setDownloadProgress(100);

      // Get the URI from the uploaded file
      const uploadedUri = result.data.uri;

      // Call the callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(uploadedUri);
      }

      // Show success message
      alert("PDF with annotations uploaded successfully!");

      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Return the URI from the uploaded file
      return uploadedUri;

    } catch (error) {
      console.log("Error creating/uploading PDF:", error);
      setError(`Failed to create/upload PDF: Unknown error occurred`);
      return null;
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadType("");
    }
  };

  // Example function that uses the returned URI
  const handleUploadAndProcess = async () => {
    const uploadedUri = await createAndUploadPDF();

    if (uploadedUri) {
      console.log("Uploaded PDF URI:", uploadedUri);
    } else {
      console.log("Upload failed, no URI returned");
    }
  };

  // Add the Download Progress Modal component
  const DownloadProgressModal = () => {
    if (!isDownloading) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-4">
              <Loader2
                className="mx-auto animate-spin text-blue-500"
                size={48}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{downloadType}</h3>
            <p className="text-gray-600 mb-4">
              Processing page {Math.ceil((downloadProgress / 100) * totalPages)}{" "}
              of {totalPages}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>

            {/* Percentage */}
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(downloadProgress)}%
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Please wait while we process your request...
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Add these new handler functions after the state declarations
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.5);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handlePageJump = () => {
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      goToPage(pageNum);
    } else {
      setPageInputValue(currentPage.toString());
    }
  };

  // Update the scale and rotation effects
  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage({ pdf: pdfDoc, pageNumber: currentPage });
    }
  }, [scale, rotation]);

  // Sync pageInputValue with currentPage
  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextPage();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevPage();
          break;
        case "Home":
          e.preventDefault();
          goToPage(1);
          break;
        case "End":
          e.preventDefault();
          goToPage(totalPages);
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
        case "_":
          e.preventDefault();
          handleZoomOut();
          break;
        case "?":
          e.preventDefault();
          setShowKeyboardShortcuts(true);
          break;
        case "d":
        case "D":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setTool("draw");
          }
          break;
        case "h":
        case "H":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setTool("highlight");
          }
          break;
        case "t":
        case "T":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setTool("text");
          }
          break;
        case "s":
        case "S":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setTool("none");
          }
          break;
        case "Escape":
          e.preventDefault();
          setTool("none");
          setShowTextInput(false);
          break;
        case "0":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleResetZoom();
          }
          break;
        case "f":
        case "F":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ...existing code for all your other functions...

  useEffect(() => {
    const loadPdfjs = async () => {
      try {
        if (typeof window !== "undefined") {
          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc =
            "//unpkg.com/pdfjs-dist@" +
            pdfjs.version +
            "/build/pdf.worker.min.js";
          setPdfjsLib(pdfjs);
        }
      } catch (error) {
        console.log("Failed to load PDF.js:", error);
        setError("Failed to load PDF library");
      }
    };
    loadPdfjs();
  }, []);

  // Add this useEffect to re-render annotations when currentPage changes
  useEffect(() => {
    // Re-render annotations whenever the current page changes
    if (overlayCanvasRef.current) {
      forceRedrawCurrentPageOnly(currentPage);
    }
  }, [currentPage, annotations]); // Depend on both currentPage and annotations

  // Update your renderPage function to properly clear and redraw
  const renderPage = async ({ pdf, pageNumber }: any) => {
    if (!pdf || !canvasRef.current) return;
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale, rotation });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (overlayCanvas) {
        overlayCanvas.height = viewport.height;
        overlayCanvas.width = viewport.width;

        const overlayCtx = overlayCanvas.getContext("2d");
        if (overlayCtx) {
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          overlayCtx.fillStyle = "rgba(255,255,255,0)";
          overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
      }

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      setTimeout(() => {
        forceRedrawCurrentPageOnly(pageNumber);
      }, 150);
    } catch (error) {
      console.log(`Error rendering page ${pageNumber}:`, error);
      setError(`Failed to render page ${pageNumber}`);
    }
  };

  // Add a new function that forces redraw only for specific page
  const forceRedrawCurrentPageOnly = (pageNumber: number) => {
    if (!overlayCanvasRef.current) {
      console.log("No overlay canvas available");
      return;
    }

    const ctx = overlayCanvasRef.current.getContext("2d");
    if (!ctx) {
      console.log("No canvas context available");
      return;
    }

    // FORCE clear again
    ctx.clearRect(
      0,
      0,
      overlayCanvasRef.current.width,
      overlayCanvasRef.current.height
    );

    // Only get annotations for the SPECIFIC page number (not currentPage state)
    const pageAnnotations = annotations.filter(
      (ann) => ann.page === pageNumber
    );

    console.log(
      `FORCE Redrawing ${pageAnnotations.length} annotations for page ${pageNumber}`
    );
    console.log(
      "Page annotations:",
      pageAnnotations.map((a) => ({ page: a.page, type: a.type, id: a.id }))
    );

    if (pageAnnotations.length === 0) {
      console.log(`No annotations found for page ${pageNumber}`);
      return;
    }

    pageAnnotations.forEach((annotation, index) => {
      console.log(`Drawing annotation ${index} on page ${pageNumber}:`, {
        type: annotation.type,
        page: annotation.page,
        id: annotation.id,
      });

      ctx.save();

      try {
        if (annotation.type === "draw") {
          ctx.strokeStyle = annotation.color || "red";
          ctx.lineWidth = annotation.strokeWidth || 2;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          if (annotation.points && annotation.points.length > 0) {
            ctx.beginPath();
            annotation.points.forEach((point: any, pointIndex: number) => {
              if (pointIndex === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
          }
        } else if (annotation.type === "highlight") {
          ctx.fillStyle = (annotation.color || "yellow") + "50";
          ctx.fillRect(
            annotation.x || 0,
            annotation.y || 0,
            annotation.width || 100,
            annotation.height || 20
          );
        } else if (annotation.type === "text") {
          ctx.fillStyle = annotation.color || "black";
          ctx.font = `${annotation.fontSize || 16}px Arial`;
          ctx.textBaseline = "top";
          ctx.fillText(
            annotation.text || "",
            annotation.x || 0,
            annotation.y || 0
          );
        }
      } catch (error) {
        console.log("Error drawing annotation:", error, annotation);
      }

      ctx.restore();
    });
  };

  const loadPdf = async (pdfUrl: string) => {
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
  };

  const goToPage = async (pageNumber: number) => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;

    console.log(`Navigating from page ${currentPage} to page ${pageNumber}`);

    // Clear any ongoing drawing operations
    setIsDrawing(false);
    setIsHighlighting(false);
    setShowTextInput(false);

    // IMMEDIATELY clear the overlay canvas
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

    // Set the current page
    setCurrentPage(pageNumber);

    // Render the new page
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

    // Get the actual displayed size vs canvas internal size
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const canvasWidth = overlayCanvasRef.current.width;
    const canvasHeight = overlayCanvasRef.current.height;

    // Calculate scale factors
    const scaleX = canvasWidth / displayWidth;
    const scaleY = canvasHeight / displayHeight;

    // Get mouse position relative to canvas
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e);

    if (tool === "draw") {
      setIsDrawing(true);
      const newAnnotation = {
        id: Date.now(),
        type: "draw",
        page: currentPage,
        points: [coords],
        color: drawColor,
        strokeWidth: strokeWidth,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
    } else if (tool === "highlight") {
      setIsHighlighting(true);
      const newAnnotation = {
        id: Date.now(),
        type: "highlight",
        page: currentPage,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        color: highlightColor,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
    } else if (tool === "text") {
      setTextInputPos(coords);
      // Set screen position for the text input
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
    const coords = getCanvasCoordinates(e);

    if (isDrawing && tool === "draw") {
      setAnnotations((prev) => {
        const newAnnotations = [...prev];
        const lastAnnotation = newAnnotations[newAnnotations.length - 1];
        if (lastAnnotation && lastAnnotation.type === "draw") {
          lastAnnotation.points.push(coords);
        }
        return newAnnotations;
      });
    } else if (isHighlighting && tool === "highlight") {
      setAnnotations((prev) => {
        const newAnnotations = [...prev];
        const lastAnnotation = newAnnotations[newAnnotations.length - 1];
        if (lastAnnotation && lastAnnotation.type === "highlight") {
          lastAnnotation.width = coords.x - lastAnnotation.x;
          lastAnnotation.height = coords.y - lastAnnotation.y;
        }
        return newAnnotations;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsHighlighting(false);
  };

  const handleTextSubmit = () => {
    console.log("Text submit:", textValue, "at position:", textInputPos);
    if (textValue.trim()) {
      const newAnnotation = {
        id: Date.now(),
        type: "text",
        page: currentPage,
        x: textInputPos.x,
        y: textInputPos.y + 16, // Offset for font baseline
        text: textValue,
        color: drawColor,
        fontSize: 16,
      };
      console.log("Adding text annotation:", newAnnotation);
      setAnnotations((prev) => {
        const updated = [...prev, newAnnotation];
        console.log("Updated annotations:", updated);
        return updated;
      });
    }
    setShowTextInput(false);
    setTextValue("");
  };

  const clearAnnotations = () => {
    setAnnotations((prev) => prev.filter((ann) => ann.page !== currentPage));
  };

  const clearAllAnnotations = () => {
    setAnnotations([]);
  };

  const downloadAnnotations = () => {
    const dataStr = JSON.stringify(annotations, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "pdf-annotations.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Function to combine PDF and annotations into a single canvas
  const combineCanvases = (): HTMLCanvasElement => {
    if (!canvasRef.current || !overlayCanvasRef.current) {
      throw new Error("Canvases not available");
    }

    // Create a new canvas for the combined result
    const combinedCanvas = document.createElement("canvas");
    const combinedCtx = combinedCanvas.getContext("2d");

    if (!combinedCtx) {
      throw new Error("Failed to get canvas context");
    }

    // Set dimensions to match the PDF canvas
    combinedCanvas.width = canvasRef.current.width;
    combinedCanvas.height = canvasRef.current.height;

    // Draw the PDF content first (background)
    combinedCtx.drawImage(canvasRef.current, 0, 0);

    // Draw the annotations on top
    combinedCtx.drawImage(overlayCanvasRef.current, 0, 0);

    return combinedCanvas;
  };

  // Function to download the combined canvas as an image
  const downloadCanvasAsImage = (format: "png" | "jpeg" = "png") => {
    try {
      const combinedCanvas = combineCanvases();
      const dataURL = combinedCanvas.toDataURL(`image/${format}`);

      // Create download link
      const link = document.createElement("a");
      link.download = `pdf-page-${currentPage}-annotated.${format}`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.log("Error downloading canvas:", error);
      setError("Failed to download canvas image");
    }
  };

  // Function to get the combined canvas as a base64 string
  const getCanvasAsBase64 = (format: "png" | "jpeg" = "png"): string => {
    try {
      const combinedCanvas = combineCanvases();
      return combinedCanvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.log("Error getting canvas as base64:", error);
      return "";
    }
  };

  // Function to save all pages with annotations
  const downloadAllPagesAsImages = async () => {
    if (!pdfDoc) return;

    const originalPage = currentPage;
    const images: { page: number; dataURL: string }[] = [];

    try {
      // Go through each page and capture it
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        await goToPage(pageNum);
        // Wait a bit for the page to render
        await new Promise((resolve) => setTimeout(resolve, 500));

        const dataURL = getCanvasAsBase64();
        if (dataURL) {
          images.push({ page: pageNum, dataURL });
        }
      }

      // Download each page
      images.forEach(({ page, dataURL }) => {
        const link = document.createElement("a");
        link.download = `pdf-page-${page}-annotated.png`;
        link.href = dataURL;
        link.click();
      });

      // Return to original page
      await goToPage(originalPage);
    } catch (error) {
      console.log("Error downloading all pages:", error);
      setError("Failed to download all pages");
    }
  };

  // Function to save to server (if you want to upload the image)
  const saveCanvasToServer = async () => {
    try {
      const base64Data = getCanvasAsBase64();
      if (!base64Data) return;

      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("file", blob, `pdf-page-${currentPage}-annotated.png`);

      // Upload to your server
      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/media`, // You might need to adjust the endpoint
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log("Canvas saved to server successfully", result);
        // You might want to show a success message to the user
        setError(""); // Clear any previous errors
      } else {
        throw new Error("Failed to save to server");
      }
    } catch (error) {
      console.log("Error saving canvas to server:", error);
      setError("Failed to save canvas to server");
    }
  };

  // Alternative function to create PDF and download locally first
  const createPDFAndDownload = async () => {
    try {
      setLoading(true);
      setError("");

      // Dynamic import of jsPDF
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;

      if (!pdfDoc) {
        throw new Error("No PDF document loaded");
      }

      // Create a new PDF
      const pdf = new jsPDF();
      let isFirstPage = true;

      const originalPage = currentPage;

      // Process each page
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        console.log(`Processing page ${pageNum}...`);

        // Navigate to the page
        await goToPage(pageNum);

        // Wait for the page to render completely
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get the combined canvas (PDF + annotations)
        const combinedCanvas = combineCanvases();
        const imgData = combinedCanvas.toDataURL("image/jpeg", 0.95);

        // Calculate dimensions to fit PDF page
        const imgWidth = combinedCanvas.width;
        const imgHeight = combinedCanvas.height;

        // A4 dimensions in mm
        const pdfWidth = 210;
        const pdfHeight = 297;

        // Calculate scale to fit page while maintaining aspect ratio
        const scaleX = pdfWidth / imgWidth;
        const scaleY = pdfHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        // Center the image on the page
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;

        if (!isFirstPage) {
          pdf.addPage();
        }

        // Add the image to PDF
        pdf.addImage(imgData, "JPEG", x, y, scaledWidth, scaledHeight);
        isFirstPage = false;
      }

      // Return to original page
      await goToPage(originalPage);

      // Download the PDF
      pdf.save(`annotated-pdf-${Date.now()}.pdf`);
    } catch (error) {
      console.log("Error creating PDF:", error);
      setError(`Failed to create PDF: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pdfUri && pdfjsLib) {
      loadPdf(pdfUri);
    }
  }, [pdfUri, pdfjsLib]);

  useEffect(() => {
    if (showTextInput && textInputRef.current) {
      console.log("Focusing text input");
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [showTextInput]);

  // Keyboard Shortcuts Modal - Enhanced with more shortcuts
  const KeyboardShortcutsModal = () => {
    if (!showKeyboardShortcuts) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowKeyboardShortcuts(false)}
      >
        <div
          className="bg-background rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-sm font-bold mb-6">
            Keyboard Shortcuts
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Navigation Section */}
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                Navigation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Next page</span>
                  <kbd className="px-3 py-1 bg-background rounded text-xs">
                    →
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Previous page</span>
                  <kbd className="px-3 py-1 bg-background rounded text-sm">
                    ←
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">First page</span>
                  <kbd className="px-3 py-1 bg-background rounded text-sm">
                    Home
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Last page</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    End
                  </kbd>
                </div>
              </div>
            </div>

            {/* View Section */}
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                View
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Zoom in</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    +
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Zoom out</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    -
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Reset zoom</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    Ctrl+0
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Fullscreen</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    Ctrl+F
                  </kbd>
                </div>
              </div>
            </div>

            {/* Tools Section */}
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                Tools
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Select tool</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    S
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Draw tool</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    D
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Highlight tool</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    H
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Text tool</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    T
                  </kbd>
                </div>
              </div>
            </div>

            {/* General Section */}
            <div>
              <h4 className="font-semibold text-sm mb-3 uppercase tracking-wide">
                General
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm">Show shortcuts</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    ?
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Cancel/Deselect</span>
                  <kbd className="px-3 py-1 bg-background rounded text-md">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowKeyboardShortcuts(false)}
            className="mt-6 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  };

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
                  title="Select tool (S)"
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
                  title="Draw tool (D)"
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
                  title="Highlight tool (H)"
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
                  title="Text tool (T)"
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
                title="Clear current page annotations"
              >
                <Eraser size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Clear Page</span>
              </button>
              <button
                onClick={clearAllAnnotations}
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 border border-red-200"
                title="Clear all annotations"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-xs sm:text-sm font-medium transition-all border border-purple-200"
                title="Keyboard shortcuts (?)"
              >
                ?
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
                  title="Zoom out (-)"
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
                  title="Zoom in (+)"
                >
                  <ZoomIn
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-body-text"
                  />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-2 sm:px-3 py-1 sm:py-2 bg-background rounded-lg text-xs sm:text-sm transition-colors"
                  title="Reset zoom (Ctrl+0)"
                >
                  Fit
                </button>
                <button
                  onClick={handleRotate}
                  className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors"
                  title="Rotate 90°"
                >
                  <RotateCw
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-sm"
                  />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 sm:p-2 bg-background rounded-lg transition-colors text-sm"
                  title="Fullscreen (Ctrl+F)"
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
                title="Previous page (←)"
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
                title="Next page (→)"
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
                  title="Select draw color"
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
                  title="Select highlight color"
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
                  title="Adjust stroke width"
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
              title="Create PDF with annotations and download"
              disabled={loading || isDownloading}
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
              {loading ? "Creating..." : "Download PDF"}
            </button>
            <button
              onClick={handleUploadAndProcess}
              className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Create PDF with annotations and upload to server"
              disabled={loading || isDownloading || isUploading}
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
              {isDownloading || isUploading ? "Uploading..." : "Upload to Student"}
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
      <div
        className="p-1 bg-background rounded-xl"
        ref={containerRef}
      >
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
                console.log("Canvas clicked! Tool:", tool);
                e.preventDefault();
                e.stopPropagation();
              }}
            />

            {/* Text Input - Improved styling */}
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

      {/* Download Progress Modal - Enhanced styling */}
      <DownloadProgressModal />

      {/* Keyboard Shortcuts Modal - NEW */}
      <KeyboardShortcutsModal />

      {/* Quick Navigation Footer - NEW */}
      {totalPages > 0 && (
        <div className="mt-4 sm:mt-6 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-md">
                Quick Jump:
              </span>
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

            <div className="text-xs sm:text-sm text-gray-600">
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-100 rounded border text-xs">
                ?
              </kbd>{" "}
              for shortcuts
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFEdit;
