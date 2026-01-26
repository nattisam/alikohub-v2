import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  error?: any;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while trying to load the content.',
  onRetry,
  error
}) => {
  const errorMessage = error?.response?.data?.message || error?.message || message;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-red-50 p-4 rounded-2xl mb-6 text-red-500">
        <FaExclamationTriangle size={48} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-red-500 mb-8 max-w-sm mx-auto">{errorMessage}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition transform active:scale-95 shadow-lg shadow-blue-100"
        >
          <FaRedo /> Retry Again
        </button>
      )}
    </div>
  );
};
