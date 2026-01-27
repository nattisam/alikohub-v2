import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Application Error',
  message = 'We encountered an error while loading the information. Please try again.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 w-full">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xl shadow-stone-200/50">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full border border-red-100">
            <AlertCircle className="text-red-500 w-8 h-8" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
        <p className="text-stone-500 mb-8 leading-relaxed text-sm">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-stone-200 active:scale-95"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
