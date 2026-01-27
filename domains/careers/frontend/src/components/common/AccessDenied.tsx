import React from 'react';
import { Lock, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = 'Restricted Access',
  message = 'Your account does not have permission to access this area.'
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 w-full animate-in fade-in duration-700 font-sans">
      <div className="bg-white border border-stone-200 rounded-2xl p-10 max-w-sm w-full text-center shadow-xl shadow-stone-200/40 relative">
        <div className="flex justify-center mb-8">
          <div className="bg-stone-50 p-6 rounded-full border border-stone-100">
            <Lock className="text-stone-900 w-10 h-10" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-stone-900 mb-3 tracking-tight font-serif">{title}</h3>
        <p className="text-stone-500 mb-10 leading-relaxed text-sm">{message}</p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft size={16} /> Previous Page
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold py-4 px-6 rounded-xl transition-all active:scale-95"
          >
            <Home size={16} /> Career Portal Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
