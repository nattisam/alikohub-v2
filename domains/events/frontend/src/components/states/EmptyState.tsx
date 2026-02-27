import React from "react";
import { FaFolderOpen, FaPlus } from "react-icons/fa";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No content found",
  message = "There is no published content to display at the moment.",
  icon,
  actionText,
  onAction,
  showAction = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm text-gray-400">
            {icon || <FaFolderOpen size={40} />}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 leading-relaxed">{message}</p>

        {showAction && onAction && actionText && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-md shadow-blue-600/20"
          >
            <FaPlus /> {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
