'use client';

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
} from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

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

const PDFEdit = ({ pdfUri }: { pdfUri: string }) => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState<typeof import('pdfjs-dist') | null>(null);

  // Add download progress states
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<string>('');

  // Annotation states
  const [tool, setTool] = useState<'none' | 'draw' | 'text' | 'highlight'>('none');
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

  // --- Add missing createAndUploadPDF and DownloadProgressModal ---
  const createAndUploadPDF = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setDownloadType('Creating and Uploading PDF');
      setError('');

      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;

      if (!pdfDoc) {
        setError('No PDF document loaded');
        setIsDownloading(false);
        return;
      }

      const pdf = new jsPDF();
      let isFirstPage = true;
      const originalPage = currentPage;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        await goToPage(pageNum);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const combinedCanvas = combineCanvases();
        const imgData = combinedCanvas.toDataURL('image/jpeg', 0.95);

        const imgWidth = combinedCanvas.width;
        const imgHeight = combinedCanvas.height;
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
        pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
        isFirstPage = false;

        setDownloadProgress((pageNum / totalPages) * 80);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await goToPage(originalPage);

      setDownloadProgress(85);
      setDownloadType('Uploading PDF to Server');
      const pdfBlob = pdf.output('blob');
      const formData = new FormData();
      formData.append('file', pdfBlob, `annotated-pdf-${Date.now()}.pdf`);
      setDownloadProgress(90);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/media`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        setDownloadProgress(100);
        alert('PDF with annotations uploaded successfully!');
        await new Promise((resolve) => setTimeout(resolve, 500));
        return result;
      } else {
        throw new Error(
          `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
        );
      }
    } catch (error) {
      setError(`Failed to create/upload PDF: ${error}`);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadType('');
    }
  };

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
              Processing page {Math.ceil((downloadProgress / 100) * totalPages)}{' '}
              of {totalPages}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
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
  // --- End missing functions ---

  // Update your renderPage function to properly clear and redraw
  const renderPage = async ({
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
      const context: CanvasRenderingContext2D | undefined = canvas.getContext('2d') ?? undefined;
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (overlayCanvas) {
        overlayCanvas.height = viewport.height;
        overlayCanvas.width = viewport.width;

        const overlayCtx: CanvasRenderingContext2D | undefined = overlayCanvas.getContext('2d') ?? undefined;
        if (overlayCtx) {
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          overlayCtx.fillStyle = 'rgba(255,255,255,0)';
          overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
      }

      // Fix: Add the required 'canvas' property to RenderParameters
      await page.render({
        canvasContext: context!,
        canvas: canvas,
        viewport: viewport,
      }).promise;

      setTimeout(() => {
        forceRedrawCurrentPageOnly(pageNumber);
      }, 150);
    } catch (error) {
      setError(`Failed to render page ${pageNumber}`);
    }
  };

  // Add a new function that forces redraw only for specific page
  const forceRedrawCurrentPageOnly = (pageNumber: number) => {
    if (!overlayCanvasRef.current) {
      console.log('No overlay canvas available');
      return;
    }

    const ctx = overlayCanvasRef.current.getContext('2d');
    if (!ctx) {
      console.log('No canvas context available');
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
    const pageAnnotations = annotations.filter((ann) => ann.page === pageNumber);

    console.log(
      `FORCE Redrawing ${pageAnnotations.length} annotations for page ${pageNumber}`
    );
    console.log(
      'Page annotations:',
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
        if (annotation.type === 'draw') {
          ctx.strokeStyle = annotation.color || 'red';
          ctx.lineWidth = annotation.strokeWidth || 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          if (annotation.points && annotation.points.length > 0) {
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
        console.error('Error drawing annotation:', error, annotation);
      }

      ctx.restore();
    });
  };

  const loadPdf = async (pdfUrl: string) => {
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
      // Set screen position for the text input
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
    } else if (isHighlighting && tool === 'highlight') {
      setAnnotations((prev) => {
        const newAnnotations = [...prev];
        const lastAnnotation = newAnnotations[newAnnotations.length - 1];
        if (lastAnnotation && lastAnnotation.type === 'highlight') {
          (lastAnnotation as HighlightAnnotation).width = coords.x - (lastAnnotation as HighlightAnnotation).x;
          (lastAnnotation as HighlightAnnotation).height = coords.y - (lastAnnotation as HighlightAnnotation).y;
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
    console.log('Text submit:', textValue, 'at position:', textInputPos);
    if (textValue.trim()) {
      const newAnnotation: TextAnnotation = {
        id: Date.now(),
        type: 'text',
        page: currentPage,
        x: textInputPos.x,
        y: textInputPos.y + 16, // Offset for font baseline
        text: textValue,
        color: drawColor,
        fontSize: 16,
      };
      console.log('Adding text annotation:', newAnnotation);
      setAnnotations((prev) => {
        const updated = [...prev, newAnnotation];
        console.log('Updated annotations:', updated);
        return updated;
      });
    }
    setShowTextInput(false);
    setTextValue('');
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
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'pdf-annotations.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Function to combine PDF and annotations into a single canvas
  const combineCanvases = (): HTMLCanvasElement => {
    if (!canvasRef.current || !overlayCanvasRef.current) {
      throw new Error('Canvases not available');
    }

    // Create a new canvas for the combined result
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    if (!combinedCtx) {
      throw new Error('Failed to get canvas context');
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
  const downloadCanvasAsImage = (format: 'png' | 'jpeg' = 'png') => {
    try {
      const combinedCanvas = combineCanvases();
      const dataURL = combinedCanvas.toDataURL(`image/${format}`);

      // Create download link
      const link = document.createElement('a');
      link.download = `pdf-page-${currentPage}-annotated.${format}`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Error downloading canvas:', error);
      setError('Failed to download canvas image');
    }
  };

  // Function to get the combined canvas as a base64 string
  const getCanvasAsBase64 = (format: 'png' | 'jpeg' = 'png'): string => {
    try {
      const combinedCanvas = combineCanvases();
      return combinedCanvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.error('Error getting canvas as base64:', error);
      return '';
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
        const link = document.createElement('a');
        link.download = `pdf-page-${page}-annotated.png`;
        link.href = dataURL;
        link.click();
      });

      // Return to original page
      await goToPage(originalPage);
    } catch (error) {
      console.error('Error downloading all pages:', error);
      setError('Failed to download all pages');
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
      formData.append('file', blob, `pdf-page-${currentPage}-annotated.png`);

      // Upload to your server
      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/media`, // You might need to adjust the endpoint
        {
          method: 'POST',
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log('Canvas saved to server successfully', result);
        // You might want to show a success message to the user
        setError(''); // Clear any previous errors
      } else {
        throw new Error('Failed to save to server');
      }
    } catch (error) {
      console.error('Error saving canvas to server:', error);
      setError('Failed to save canvas to server');
    }
  };

  // Alternative function to create PDF and download locally first
  const createPDFAndDownload = async () => {
    try {
      setLoading(true);
      setError('');

      // Dynamic import of jsPDF
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;

      if (!pdfDoc) {
        throw new Error('No PDF document loaded');
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
        const imgData = combinedCanvas.toDataURL('image/jpeg', 0.95);

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
        pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
        isFirstPage = false;
      }

      // Return to original page
      await goToPage(originalPage);

      // Download the PDF
      pdf.save(`annotated-pdf-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error creating PDF:', error);
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
      console.log('Focusing text input');
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [showTextInput]);

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
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Interactive PDF Viewer</h2>

      {/* Toolbar */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Tools:</span>
            <button
              onClick={() => setTool('none')}
              className={`px-3 py-2 rounded ${
                tool === 'none' ? 'bg-blue-500 text-white' : 'bg-white border'
              }`}
            >
              Select
            </button>
            <button
              onClick={() => setTool('draw')}
              className={`px-3 py-2 rounded flex items-center gap-1 ${
                tool === 'draw' ? 'bg-blue-500 text-white' : 'bg-white border'
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
              onClick={() => {
                console.log('Text tool selected');
                setTool('text');
              }}
              className={`px-3 py-2 rounded flex items-center gap-1 ${
                tool === 'text' ? 'bg-blue-500 text-white' : 'bg-white border'
              }`}
            >
              <Type size={16} />
              Text {tool === 'text' && '(Active)'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAnnotations}
              className="px-3 py-2 bg-orange-500 text-white rounded flex items-center gap-1"
              title="Clear current page annotations"
            >
              <Eraser size={16} />
              Clear Page
            </button>
            <button
              onClick={clearAllAnnotations}
              className="px-3 py-2 bg-red-500 text-white rounded flex items-center gap-1"
              title="Clear all annotations"
            >
              <Trash2 size={16} />
              Clear All
            </button>
            <button
              onClick={downloadAnnotations}
              className="px-3 py-2 bg-green-500 text-white rounded flex items-center gap-1"
              title="Download annotations"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Draw Color:</label>
            <input
              type="color"
              value={drawColor}
              onChange={(e) => setDrawColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Highlight Color:</label>
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Stroke Width:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm">{strokeWidth}px</span>
          </div>
        </div>

        {/* Download buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={createPDFAndDownload}
            className="px-3 py-2 bg-green-500 text-white rounded flex items-center gap-1"
            title="Create PDF with annotations and download"
            disabled={loading || isDownloading}
          >
            <Download size={16} />
            {loading ? 'Creating...' : 'Create PDF'}
          </button>
          <button
            onClick={createAndUploadPDF}
            className="px-3 py-2 bg-blue-500 text-white rounded flex items-center gap-1"
            title="Create PDF with annotations and upload to server"
            disabled={loading || isDownloading}
          >
            <Download size={16} />
            {isDownloading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      {totalPages > 0 && (
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-100 rounded-lg">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1 || loading || isDownloading}
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
            disabled={currentPage >= totalPages || loading || isDownloading}
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
              onClick={(e) => {
                console.log('Canvas clicked! Tool:', tool);
                e.preventDefault();
                e.stopPropagation();
              }}
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
                  onChange={(e) => {
                    console.log('Text input changed:', e.target.value);
                    setTextValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    console.log('Key pressed:', e.key);
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
                    console.log('Text input blur');
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

      {/* Download Progress Modal - Only shows when isDownloading is true */}
      <DownloadProgressModal />

      {/* Status Debug */}
      <div className="mt-4 text-sm text-gray-500 flex justify-between">
        <div>
          {pdfUri && <div>PDF URI: {pdfUri}</div>}
          {pdfDoc && <div>Status: PDF loaded successfully</div>}
          <div>
            Current Tool: <strong>{tool}</strong>
          </div>
          <div>
            Show Text Input: <strong>{showTextInput ? 'Yes' : 'No'}</strong>
          </div>
        </div>
        <div>
          Annotations on current page:{' '}
          {annotations.filter((ann) => ann.page === currentPage).length}
        </div>
      </div>
    </div>
  );
};

export default PDFEdit;
