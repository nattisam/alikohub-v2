import React from "react";
import { FaServer } from "react-icons/fa";

interface ServerErrorProps {
  onRetry?: () => void;
  statusCode?: number;
}

const ServerError: React.FC<ServerErrorProps> = ({
  onRetry,
  statusCode = 500,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
            <FaServer className="text-red-500 text-4xl animate-pulse" />
          </div>
        </div>

        <p className="text-6xl font-black text-gray-200 mb-2">{statusCode}</p>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          We're having trouble processing your request right now.
          <br />
          Please try again in a moment.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95"
          >
            Retry
          </button>
        )}

        <p className="mt-6 text-sm text-gray-400">
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
