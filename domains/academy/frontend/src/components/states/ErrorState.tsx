import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  error?: any; // The error object if available
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  onRetry,
  showRetry = true,
  error
}) => {
  // Extract error details if available
  const errorMessage = error?.response?.data?.message || error?.message || message;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-red-800 mb-2">{title}</h3>
        <p className="text-red-600 mb-6">{errorMessage}</p>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FaRedo /> Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;