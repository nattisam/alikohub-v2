import React from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  error?: any; // The error object if available
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An error occurred while loading the data. Please try again.",
  onRetry,
  showRetry = true,
  error,
}) => {
  // Check if it's a 500 error
  const isServerError = error?.response?.status === 500;

  // Use requested messaging for server errors
  const displayTitle = isServerError ? "Something went wrong" : title;
  const displayMessage = isServerError
    ? "We’re having trouble processing your request right now. Please try again in a moment."
    : error?.response?.data?.message || error?.message || message;

  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gray-50 px-4 rounded-xl">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {displayTitle}
        </h1>

        <p className="text-gray-600 mb-6">{displayMessage}</p>

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition shadow-md hover:shadow-lg active:scale-95"
          >
            Retry
          </button>
        )}

        <p className="mt-4 text-sm text-gray-500">
          If the problem persists,{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
