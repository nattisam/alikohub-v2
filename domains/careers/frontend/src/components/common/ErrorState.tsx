import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

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
      <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md w-full text-center shadow-xl shadow-stone-200/50">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full border border-red-100 animate-pulse">
            <AlertCircle className="text-red-500 w-10 h-10" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-stone-900 mb-2 font-serif">
          {displayTitle}
        </h3>
        <p className="text-stone-500 mb-8 leading-relaxed text-sm">
          {displayMessage}
        </p>

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-stone-200 active:scale-95"
          >
            <RotateCcw size={18} /> Retry
          </button>
        )}

        <p className="mt-4 text-xs text-stone-400">
          If the problem persists,{" "}
          <a
            href="/contact"
            className="text-stone-900 font-medium hover:underline"
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
