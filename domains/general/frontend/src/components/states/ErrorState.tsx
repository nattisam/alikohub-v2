import React from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  error?: any;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An error occurred while loading the data. Please try again.",
  onRetry,
  showRetry = true,
  error,
}) => {
  const isServerError = error?.response?.status === 500;
  const isNetworkError =
    error?.code === "ERR_NETWORK" || error?.message === "Network Error";
  const isTooManyRequests = error?.response?.status === 429;

  const displayTitle = isServerError
    ? "Server Error"
    : isNetworkError
      ? "Connection Lost"
      : isTooManyRequests
        ? "Too Many Requests"
        : title;

  const displayMessage = isServerError
    ? "We're having trouble processing your request right now. Please try again in a moment."
    : isNetworkError
      ? "Unable to reach the server. Please check your internet connection and try again."
      : isTooManyRequests
        ? "You've made too many requests. Please wait a moment before trying again."
        : error?.response?.data?.message || error?.message || message;

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full animate-pulse">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {displayTitle}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{displayMessage}</p>

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#3E92D1] hover:bg-[#2d7db8] text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <FaRedo className="text-sm" /> Retry
          </button>
        )}

        <p className="mt-4 text-sm text-gray-500">
          If the problem persists,{" "}
          <a
            href="/contact"
            className="text-[#3E92D1] hover:underline font-medium"
          >
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
