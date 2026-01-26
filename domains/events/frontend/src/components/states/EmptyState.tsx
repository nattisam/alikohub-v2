import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No content found',
  message = 'There is no published content to display at the moment.',
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 text-gray-400">
        {icon || <FaFolderOpen size={48} />}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto">{message}</p>
    </div>
  );
};
