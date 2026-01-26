import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 w-full">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-500 font-medium animate-pulse">{message}</p>
    </div>
  );
};
