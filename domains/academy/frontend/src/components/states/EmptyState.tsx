import React from 'react';
import { FaFolderOpen, FaPlus } from 'react-icons/fa';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  message = 'There is no data to display at the moment.',
  icon,
  actionText,
  onAction,
  showAction = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            {icon || <FaFolderOpen className="text-gray-600 text-3xl" />}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {showAction && onAction && actionText && (
          <button
            onClick={onAction}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FaPlus /> {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;