import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaRedo, FaWifi } from 'react-icons/fa';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  error?: any;
  autoRetrySeconds?: number; // Auto-retry countdown
  compact?: boolean; // Smaller variant for inline use
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  showRetry = true,
  error,
  autoRetrySeconds,
  compact = false,
}) => {
  const [countdown, setCountdown] = useState(autoRetrySeconds || 0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry countdown
  useEffect(() => {
    if (!autoRetrySeconds || !onRetry) return;
    setCountdown(autoRetrySeconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRetrySeconds, onRetry]);

  // Determine error type
  const statusCode = error?.response?.status;
  const isServerError = statusCode === 500;
  const isNetworkError = !statusCode && (error?.code === 'ERR_NETWORK' || isOffline);
  const isForbidden = statusCode === 403;
  const isNotFound = statusCode === 404;
  const isRateLimit = statusCode === 429;

  // Smart messaging based on error type
  const getDisplayTitle = () => {
    if (title) return title;
    if (isOffline || isNetworkError) return 'No Internet Connection';
    if (isServerError) return 'Something went wrong';
    if (isForbidden) return 'Access Denied';
    if (isNotFound) return 'Not Found';
    if (isRateLimit) return 'Too Many Requests';
    return 'Something went wrong';
  };

  const getDisplayMessage = () => {
    if (isOffline || isNetworkError)
      return 'Please check your internet connection and try again.';
    if (isServerError)
      return "We're having trouble processing your request right now. Please try again in a moment.";
    if (isForbidden) return 'You do not have permission to access this resource.';
    if (isNotFound) return 'The resource you are looking for could not be found.';
    if (isRateLimit) return 'Please slow down and try again in a moment.';
    return error?.response?.data?.message || error?.message || message || 'An error occurred while loading the data. Please try again.';
  };

  const getIconColor = () => {
    if (isOffline || isNetworkError) return 'text-amber-500';
    if (isForbidden) return 'text-yellow-500';
    if (isRateLimit) return 'text-orange-500';
    return 'text-red-500';
  };

  const getIconBg = () => {
    if (isOffline || isNetworkError) return 'bg-amber-50';
    if (isForbidden) return 'bg-yellow-50';
    if (isRateLimit) return 'bg-orange-50';
    return 'bg-red-50';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
        <FaExclamationTriangle className="text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{getDisplayTitle()}</p>
          <p className="text-xs text-gray-600 truncate">{getDisplayMessage()}</p>
        </div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[400px]">
      <div className={`${getIconBg()} p-5 rounded-2xl mb-6 ${getIconColor()} animate-[bounce_2s_ease-in-out_infinite]`}>
        {isOffline || isNetworkError ? (
          <FaWifi size={40} />
        ) : (
          <FaExclamationTriangle size={40} />
        )}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{getDisplayTitle()}</h3>
      <p className="text-gray-500 mb-2 max-w-sm mx-auto leading-relaxed">{getDisplayMessage()}</p>

      {statusCode && (
        <p className="text-xs text-gray-400 mb-6 font-mono">Error code: {statusCode}</p>
      )}

      {!statusCode && <div className="mb-6" />}

      {showRetry && onRetry && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
          >
            <FaRedo className="text-sm" /> Try Again
          </button>

          {countdown > 0 && (
            <p className="text-sm text-gray-400">
              Auto-retrying in <span className="font-semibold text-blue-600">{countdown}s</span>
            </p>
          )}
        </div>
      )}

      <p className="mt-6 text-sm text-gray-400">
        If the problem persists,{' '}
        <a href="/contact" className="text-blue-600 hover:underline">
          contact support
        </a>
        .
      </p>
    </div>
  );
};

export default ErrorState;
