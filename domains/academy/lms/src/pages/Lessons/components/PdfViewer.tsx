import React from "react";
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Share2,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title, onClose }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(
          `Error attempting to enable full-screen mode: ${e.message}`,
        );
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(url);
    toast.success("PDF link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a] select-none">
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
        className="h-20 flex items-center justify-between px-8 bg-slate-900/40 backdrop-blur-3xl border-b border-white/5 relative z-10"
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
              Document Viewer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 mr-4">
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
      <main className="flex-1 relative overflow-hidden bg-[#1e293b]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-primary/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-64 bg-slate-800/30 blur-[120px] pointer-events-none rounded-full" />

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full flex items-center justify-center p-0 md:p-6 lg:p-10"
        >
          <div className="w-full h-full max-w-7xl mx-auto rounded-none md:rounded-[32px] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/5 relative bg-[#f8fafc]">
            <iframe
              src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0"
              title={title}
            />
          </div>
        </motion.div>

        {/* Info Overlay */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute right-6 top-6 bottom-6 w-80 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 z-20 shadow-2xl"
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
                <div className="pt-6 border-t border-white/5">
                  <p className="text-slate-400 text-sm italic font-medium">
                    Use the toolbar at the top of the PDF for zoom, print and
                    rotation controls.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <div className="h-10 bg-slate-950 flex items-center justify-center px-8 border-t border-white/5">
        <p className="text-[10px] text-slate-600 font-medium tracking-[0.2em] uppercase">
          Academy Secure Document Viewer &bull; Protected Access
        </p>
      </div>
    </div>
  );
};

export default PdfViewer;
