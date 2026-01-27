import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again later.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full">
      <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-100 transform hover:scale-105"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
