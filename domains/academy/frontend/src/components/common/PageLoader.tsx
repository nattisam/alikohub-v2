import React from "react";
import { Loader2 } from "lucide-react";

/**
 * A standard, high-quality loading fallback for lazy-loaded pages.
 * Minimal and centered with a cinematic spinning effect.
 */
const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-[#3E92D1] animate-spin" />
        <div className="absolute inset-0 h-12 w-12 text-[#3E92D1]/20 animate-ping rounded-full" />
      </div>
      <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">
        Loading...
      </p>
    </div>
  );
};

export default PageLoader;
