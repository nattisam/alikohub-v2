import React from "react";

/**
 * A standard, high-quality loading fallback for lazy-loaded pages.
 */
const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-[#3E92D1] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#3E92D1] rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">
        Loading...
      </p>
    </div>
  );
};

export default PageLoader;
