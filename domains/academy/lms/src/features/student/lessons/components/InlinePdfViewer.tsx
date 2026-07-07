import React, { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface InlinePdfViewerProps {
  fileUrl: string;
  onPageChange?: (current: number, total: number) => void;
  onDocumentLoad?: (total: number) => void;
}

const InlinePdfViewer: React.FC<InlinePdfViewerProps> = ({
  fileUrl,
  onPageChange,
  onDocumentLoad,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isDocLoading, setIsDocLoading] = useState(true);
  const [isPageRendering, setIsPageRendering] = useState(true);
  const [error, setError] = useState(false);

  // Measure container once, and on resize — pass a fixed width into <Page>
  // so react-pdf never has to render at native size first, then rescale.
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
      onDocumentLoad?.(total);
      onPageChange?.(1, total);
    },
    [onDocumentLoad, onPageChange],
  );

  const handleDocumentLoadError = useCallback(() => {
    setIsDocLoading(false);
    setError(true);
  }, []);

  const handlePageRenderSuccess = useCallback(() => {
    setIsPageRendering(false);
  }, []);

  const changePage = useCallback(
    (offset: number) => {
      setPageNumber((prev) => {
        const next = Math.min(Math.max(1, prev + offset), numPages || 1);
        if (next !== prev) {
          setIsPageRendering(true);
          onPageChange?.(next, numPages || 1);
        }
        return next;
      });
    },
    [numPages, onPageChange],
  );

  // Reset to page 1 whenever the file itself changes
  useEffect(() => {
    setPageNumber(1);
    setNumPages(null);
    setIsDocLoading(true);
    setIsPageRendering(true);
    setError(false);
  }, [fileUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-12 text-center bg-surface-container-lowest">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
        <p className="text-sm font-bold text-slate-700 mb-1">
          Couldn't load this document
        </p>
        <p className="text-xs text-slate-400">
          Try refreshing the page, or contact support if the issue continues.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Page surface — fixed-height container reserved up front so nothing
          reflows while the document or page is loading. */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[60vh] overflow-auto bg-slate-100 flex items-start justify-center"
      >
        {/* Reserve layout space and show a single centered spinner instead of
            react-pdf's default per-page loading children, which is what
            causes the thumbnail-stack flicker when multiple pages mount
            before being sized. */}
        {(isDocLoading || (isPageRendering && containerWidth > 0)) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-100 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-medium text-slate-400">
              Loading document…
            </p>
          </div>
        )}

        {containerWidth > 0 && (
          <Document
            file={fileUrl}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={null}
            error={null}
            className="py-6"
          >
            {/* Render only the current page — never the whole document at
                once — and pass an explicit width so it's sized correctly
                on the very first paint instead of popping in small then
                rescaling. */}
            <Page
              key={pageNumber}
              pageNumber={pageNumber}
              width={containerWidth - 32}
              onRenderSuccess={handlePageRenderSuccess}
              loading={null}
              renderAnnotationLayer={true}
              renderTextLayer={true}
              className="shadow-md rounded-md overflow-hidden bg-white"
            />
          </Document>
        )}
      </div>

      {/* Pagination footer */}
      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-3 border-t border-slate-200 bg-white shrink-0">
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
            className="h-9 w-9 rounded-lg disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber >= numPages}
            onClick={() => changePage(1)}
            className="h-9 w-9 rounded-lg disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default InlinePdfViewer;
