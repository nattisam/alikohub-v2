import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ServerErrorProps {
  onRetry?: () => void;
}

const ServerError: React.FC<ServerErrorProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="bg-red-50 p-6 rounded-[2rem] mb-8 text-red-500 shadow-xl shadow-red-50">
        <FaExclamationTriangle size={64} />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
        Something went wrong
      </h1>

      <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg font-medium leading-relaxed">
        We’re having trouble processing your request right now. Please try again
        in a moment.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-[#3E92D1] hover:bg-[#2E82C1] text-white font-black px-10 py-4 rounded-2xl transition shadow-2xl shadow-blue-100 transform active:scale-95"
        >
          Retry Connection
        </button>
      )}

      <p className="mt-8 text-sm text-gray-400 font-bold uppercase tracking-widest">
        If the problem persists,{" "}
        <a
          href="mailto:support@alikohub.com"
          className="text-[#3E92D1] hover:underline"
        >
          contact support
        </a>
      </p>
    </div>
  );
};

export default ServerError;
