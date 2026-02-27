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
          We're having trouble processing your request right now.
          <br />
          Please try again in a moment.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#3E92D1] hover:bg-[#2d7db8] text-white font-medium px-6 py-2.5 rounded-lg transition shadow-md hover:shadow-lg active:scale-95"
          >
            Retry
          </button>
        )}

        <p className="mt-4 text-sm text-gray-500">
          If the problem persists,{" "}
          <a href="/contact" className="text-[#3E92D1] hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ServerError;
