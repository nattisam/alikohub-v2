import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Video, Link as LinkIcon, HelpCircle } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: {
    title: string;
    type: string;
    url?: string;
    content?: string; // For text content or exercise description
  };
}

export const PreviewModal = ({
  isOpen,
  onClose,
  content,
}: PreviewModalProps) => {
  if (!content) return null;

  const renderPreview = () => {
    switch (content.type) {
      case "VIDEO":
        return (
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {content.url ? (
              <video
                src={content.url}
                controls
                className="w-full h-full"
                poster="/placeholder.svg"
              />
            ) : (
              <div className="text-white flex flex-col items-center gap-2">
                <Video className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium opacity-50">
                  No video URL provided
                </p>
              </div>
            )}
          </div>
        );
      case "PDF":
        return (
          <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
            {content.url ? (
              <iframe
                src={`${content.url}#toolbar=0`}
                className="w-full h-full"
                title={content.title}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <FileText className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium opacity-50">
                  No PDF URL provided
                </p>
              </div>
            )}
          </div>
        );
      case "TEXT":
      case "LINK":
        return (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 min-h-[200px]">
            <div className="flex items-center gap-3 mb-4 text-slate-900 font-bold">
              <LinkIcon className="w-5 h-5 text-accent" />
              <span>External Resource</span>
            </div>
            <p className="text-slate-600 mb-6">
              This content is hosted externally. You can view the full resource
              by clicking the link below.
            </p>
            {content.url ? (
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Access Resource <LinkIcon className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                No URL provided for this link
              </p>
            )}
          </div>
        );
      case "QUIZ":
      case "MULTIPLE_CHOICE":
      case "TRUE_FALSE":
        return (
          <div className="p-6 rounded-xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center gap-3 mb-4 text-amber-700 font-bold uppercase tracking-wider text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Quiz Preview</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {content.title}
            </h3>
            <p className="text-slate-600 font-medium bg-white p-4 rounded-lg border border-slate-100">
              {content.content || "No question text available for preview."}
            </p>
            <div className="mt-8 flex justify-end">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-100 px-3 py-1.5 rounded-full">
                Interactive Quiz
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-12 text-center text-slate-400 font-medium">
            Preview not available for this type.
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              {content.type === "VIDEO" && <Video className="w-5 h-5" />}
              {content.type === "PDF" && <FileText className="w-5 h-5" />}
              {(content.type === "TEXT" || content.type === "LINK") && (
                <LinkIcon className="w-5 h-5" />
              )}
              {(content.type === "QUIZ" ||
                content.type === "MULTIPLE_CHOICE" ||
                content.type === "TRUE_FALSE") && (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>
            {content.title}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">{renderPreview()}</div>
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-8">
          <span>{content.type} PREVIEW</span>
          <span>STREAMS ACADEMY V2</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
