import React from "react";
import { FaLock, FaHome, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Restricted Access",
  message,
  requiredRole,
}) => {
  const navigate = useNavigate();
  const displayMessage =
    message ||
    (requiredRole
      ? `You do not have the required permissions (${requiredRole}) to view this page.`
      : "You do not have the required permissions to view this page.");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 w-full animate-in fade-in duration-700">
      <div className="bg-white border border-slate-100 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>

        <div className="flex justify-center mb-8">
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
            <FaLock className="text-amber-500 text-4xl" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 mb-10 leading-relaxed text-sm">
          {displayMessage}
        </p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            <FaArrowLeft size={14} /> Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all active:scale-95"
          >
            <FaHome size={14} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
