import React from 'react';
import { FaInbox } from 'react-icons/fa';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  message = 'There are no items to display at the moment.',
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 w-full">
      <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-12 max-w-lg w-full text-center shadow-sm">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform transform hover:scale-110">
          {icon || <FaInbox className="text-gray-300 text-4xl" />}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">{message}</p>
        
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-blue-100 transform hover:scale-105 active:scale-95"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
