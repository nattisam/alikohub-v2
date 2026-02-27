import React from "react";
import { Loader2 } from "lucide-react";

/**
 * A standard loading fallback for lazy-loaded pages and Suspense boundaries.
 */
const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-stone-900 animate-spin" />
        <div className="absolute inset-0 h-12 w-12 text-stone-900/20 animate-ping rounded-full" />
      </div>
      <p className="mt-4 text-xs font-bold text-stone-400 uppercase tracking-[0.3em]">
        Loading Portal...
      </p>
    </div>
  );
};

export default PageLoader;
