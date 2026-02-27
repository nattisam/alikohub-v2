import React from "react";

interface ServerErrorProps {
  onRetry?: () => void;
}

const ServerError: React.FC<ServerErrorProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          We’re having trouble processing your request right now.
          <br />
          Please try again in a moment.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
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

export default ServerError;
