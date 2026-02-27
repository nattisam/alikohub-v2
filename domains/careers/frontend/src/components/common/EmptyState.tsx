import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Results Found',
  message = 'We could not find any items matching your criteria. Try adjusting your search.',
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 w-full">
      <div className="bg-white border border-stone-100 rounded-3xl p-12 max-w-lg w-full text-center shadow-sm">
        <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform duration-500 hover:scale-110">
          {icon || <SearchX className="text-stone-300 w-10 h-10" />}
        </div>
        
        <h3 className="text-2xl font-bold text-stone-900 mb-2 font-serif">{title}</h3>
        <p className="text-stone-500 mb-10 max-w-sm mx-auto leading-relaxed text-sm">{message}</p>
        
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-3.5 px-8 rounded-2xl transition-all active:scale-95"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
