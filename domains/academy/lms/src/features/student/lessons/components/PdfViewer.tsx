import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoomBoost, setZoomBoost] = useState(0); // extra px added on top of fit-width
  const [isDocLoading, setIsDocLoading] = useState(true);
  const [isPageRendering, setIsPageRendering] = useState(true);
  const [error, setError] = useState(false);

  // Lock page scroll behind the modal while it's open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") changePage(-1);
      if (e.key === "ArrowRight") changePage(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPages]);

  // Measure the full-width container so the page always renders sized
  // correctly on first paint instead of popping in small then rescaling.
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const measure = () => {
      const width = el.clientWidth;
      if (width > 0) setContainerWidth(Math.floor(width));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleDocumentLoadSuccess = useCallback(
    ({ numPages: total }: { numPages: number }) => {
      setNumPages(total);
      setIsDocLoading(false);
    },
    [],
  );

  const handleDocumentLoadError = useCallback(() => {
    setIsDocLoading(false);
    setError(true);
  }, []);

  const handlePageRenderSuccess = useCallback(() => {
    setIsPageRendering(false);
  }, []);

  function changePage(offset: number) {
    setPageNumber((prev) => {
      const next = Math.min(Math.max(1, prev + offset), numPages || 1);
      if (next !== prev) setIsPageRendering(true);
      return next;
    });
  }

  const zoomIn = () => setZoomBoost((p) => Math.min(p + 120, 480));
  const zoomOut = () => setZoomBoost((p) => Math.max(p - 120, 0));

  // Target render width: fills the available column, capped to a readable
  // max, plus whatever zoom boost the user has dialed in.
  const pageWidth = containerWidth
    ? Math.min(containerWidth - 48, 900) + zoomBoost
    : undefined;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <header className="h-14 shrink-0 flex items-center justify-between px-3 md:px-4 bg-white border-b border-slate-200 shadow-sm z-50">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-sm md:text-base font-bold text-slate-900 truncate max-w-[160px] sm:max-w-md">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Page nav */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
              className="h-8 w-8 rounded-md disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-bold text-slate-600 px-2 tabular-nums min-w-[64px] text-center">
              {pageNumber} / {numPages || "--"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={pageNumber >= (numPages || 1)}
              onClick={() => changePage(1)}
              className="h-8 w-8 rounded-md disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={zoomBoost <= 0}
              className="h-8 w-8 rounded-md disabled:opacity-30"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={zoomBoost >= 480}
              className="h-8 w-8 rounded-md disabled:opacity-30"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <a href={url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-[18px] h-[18px]" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Mobile page nav */}
      <div className="sm:hidden flex items-center justify-center gap-4 py-2 border-b border-slate-100 bg-white shrink-0">
        <Button
          variant="ghost"
          size="icon"
          disabled={pageNumber <= 1}
          onClick={() => changePage(-1)}
          className="h-8 w-8 rounded-md disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-xs font-bold text-slate-600 tabular-nums">
          Page {pageNumber} of {numPages || "--"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => changePage(1)}
          className="h-8 w-8 rounded-md disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Full-page document surface */}
      <main
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-slate-50"
      >
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
            <p className="text-sm font-bold text-slate-700 mb-1">
              Couldn't load this document
            </p>
            <p className="text-xs text-slate-400">
              Try refreshing, or contact support if this keeps happening.
            </p>
          </div>
        ) : (
          <>
            {(isDocLoading || (isPageRendering && containerWidth > 0)) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-xs font-medium text-slate-400">
                  Loading document…
                </p>
              </div>
            )}

            {containerWidth > 0 && (
              <div className="flex justify-center py-8 px-4">
                <Document
                  file={url}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  onLoadError={handleDocumentLoadError}
                  loading={null}
                  error={null}
                >
                  <Page
                    key={pageNumber}
                    pageNumber={pageNumber}
                    width={pageWidth}
                    onRenderSuccess={handlePageRenderSuccess}
                    loading={null}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    className="shadow-md rounded-md overflow-hidden bg-white"
                  />
                </Document>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PdfViewer;
