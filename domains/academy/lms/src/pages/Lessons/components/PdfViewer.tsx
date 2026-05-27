import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Share2,
  FileText,
  Info,
  ChevronRight,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";

// Import styles for react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(
          `Error attempting to enable full-screen mode: ${e.message}`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(url);
    toast.success("PDF link copied to clipboard!");
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages || 1);
    });
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a] select-none touch-none">
      {/* Animated Entrance Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950 pointer-events-none"
      />

      {/* Premium Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="h-20 flex items-center justify-between px-8 bg-slate-900/60 backdrop-blur-3xl border-b border-white/5 relative z-50"
      >
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </Button>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <FileText size={14} className="text-primary" />
              </div>
              <h2 className="text-slate-100 font-bold tracking-tight truncate max-w-[180px] sm:max-w-md text-lg">
                {title}
              </h2>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mt-1 ml-8">
              Premium Document Viewer
            </p>
          </div>
        </div>

        {/* Center Navigation Controls */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-800/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
              className="text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 h-10 w-10 transition-all rounded-xl"
            >
              <ChevronLeft size={22} />
            </Button>
            <div className="flex items-center gap-2 px-4 border-l border-r border-white/5 mx-2 min-w-[100px] justify-center">
              <span className="text-white font-bold tabular-nums">
                {pageNumber}
              </span>
              <span className="text-slate-500 text-xs font-medium">/</span>
              <span className="text-slate-400 font-medium tabular-nums">
                {numPages || "--"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={pageNumber >= (numPages || 1)}
              onClick={() => changePage(1)}
              className="text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 h-10 w-10 transition-all rounded-xl"
            >
              <ChevronRight size={22} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 mr-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9"
            >
              <ZoomOut size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9"
            >
              <ZoomIn size={18} />
            </Button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={rotate}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9"
            >
              <RotateCw size={18} />
            </Button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl gap-2 font-bold px-4 h-9"
              onClick={handleShare}
            >
              <Share2 size={16} />
              Share
            </Button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl gap-2 font-bold px-4 h-9"
              asChild
            >
              <a href={url} download target="_blank" rel="noopener noreferrer">
                <Download size={16} />
                Save
              </a>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfo(!showInfo)}
            className={`text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 transition-all ${showInfo ? "bg-white/10 text-white" : ""}`}
          >
            <Info size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl h-12 w-12 transition-all active:scale-90"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-100 hover:bg-red-500/20 hover:text-red-400 rounded-2xl h-12 w-12 ml-2 transition-all active:scale-95"
          >
            <X size={24} />
          </Button>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-auto bg-[#1a202c] scrollbar-hide py-10">
        {/* Glow Effects */}
        <div className="fixed top-0 left-1/4 w-1/2 h-64 bg-primary/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="fixed bottom-0 right-1/4 w-1/2 h-64 bg-slate-800/30 blur-[120px] pointer-events-none rounded-full" />

        {/* Mobile Page Indicator */}
        <div className="lg:hidden sticky top-4 left-0 right-0 z-40 px-4 mb-4">
          <div className="max-w-fit mx-auto bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-4 text-white">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="h-8 w-8 text-white"
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="text-xs font-bold">
              {pageNumber} / {numPages || "--"}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => changePage(1)}
              disabled={pageNumber >= (numPages || 1)}
              className="h-8 w-8 text-white"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center justify-start min-h-full px-4"
        >
          <div className="relative shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center justify-center p-20 text-white min-h-[600px] min-w-[400px]">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p className="text-sm font-medium text-slate-400">
                    Decrypting Document...
                  </p>
                </div>
              }
              error={
                <div className="p-20 text-center text-white">
                  <p className="text-red-400 font-bold mb-2">Error</p>
                  <p className="text-slate-400 text-sm">Failed to load PDF</p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                className="pdf-page transition-all duration-500"
                renderAnnotationLayer={true}
                renderTextLayer={true}
              />
            </Document>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Overlay */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed right-6 top-24 bottom-6 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 z-[60] shadow-2xl"
            >
              <h3 className="text-white font-bold text-xl mb-4">
                Material Details
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">
                    Title
                  </p>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {title}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">
                    Type
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md text-[10px] font-bold border border-emerald-500/20">
                      PDF DOCUMENT
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">
                    Dimensions
                  </p>
                  <p className="text-slate-400 text-xs">
                    Current Scale: {Math.round(scale * 100)}%
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                    Use the toolbar for navigation, zoom and rotation controls.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowInfo(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <div className="h-10 bg-slate-950 flex items-center justify-between px-8 border-t border-white/5 relative z-50">
        <p className="text-[10px] text-slate-600 font-medium tracking-[0.2em] uppercase">
          Academy Secure Document Viewer &bull; Protected Access
        </p>

        <div className="flex items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          <span>Page {pageNumber}</span>
          <span className="w-1 h-1 bg-slate-800 rounded-full" />
          <span>Total {numPages || 0} Pages</span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
