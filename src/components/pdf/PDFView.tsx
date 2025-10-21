import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface RenderPageParams {
  pdf: PDFDocumentProxy;
  pageNumber: number;
}

const PDFViewer = ({ pdfUri }: { pdfUri: string }) => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfjsLib, setPdfjsLib] = useState<typeof import("pdfjs-dist") | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const renderPage = async ({ pdf, pageNumber }: RenderPageParams) => {
    if (!pdf || !canvasRef.current) return;
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (!context) {
        throw new Error("Failed to get 2D context from canvas");
      }
      
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the PDF page
      await page.render({ canvasContext: context, viewport: viewport }).promise;

      console.log(`Page ${pageNumber} rendered successfully`);
    } catch (error) {
      console.log(`Error rendering page ${pageNumber}:`, error);
      setError(`Failed to render page ${pageNumber}`);
    }
  };

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
    [pdfjsLib]
  );

  const goToPage = async (pageNumber: number) => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;

    console.log(`Navigating from page ${currentPage} to page ${pageNumber}`);

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

  useEffect(() => {
    if (pdfUri && pdfjsLib) {
      loadPdf(pdfUri);
    }
  }, [pdfUri, pdfjsLib, loadPdf]);

  if (!pdfjsLib) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="mr-2 animate-spin text-accent" size={24} />
          <span>Loading PDF library...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl">
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
        className="border border-gray-300 rounded-lg bg-white overflow-hidden mb-4"
        ref={containerRef}
      >
        <div className="flex justify-center">
          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              className="block max-w-full h-auto shadow-lg"
              style={{ display: pdfDoc ? "block" : "none" }}
            />
          </div>

          {!pdfDoc && !loading && (
            <div className="text-gray-500 text-center py-12">
              No PDF loaded. Please provide a PDF URI.
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {totalPages > 0 && (
        <div className="flex items-center justify-center gap-4 mb-4 p-3 rounded-lg">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1 || loading}
            className="flex items-center px-3 py-1 border bg-accent hover:bg-accent-hover text-white rounded-lg disabled:bg-transparent text-md"
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
            className="flex items-center px-3 py-1 border bg-accent hover:bg-accent-hover text-white rounded-lg disabled:bg-transparent text-md"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
