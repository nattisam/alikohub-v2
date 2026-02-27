import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "info";
  actionLabel?: string;
  onAction?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  actionLabel,
  onAction,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: <CheckCircle className="text-green-500 w-12 h-12" />,
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: <XCircle className="text-red-500 w-12 h-12" />,
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    info: {
      icon: <CheckCircle className="text-blue-500 w-12 h-12" />, // Use a different icon for info if needed
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const { icon, buttonColor } = typeConfig[type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="px-8 pb-8 flex flex-col items-center text-center">
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="w-full flex gap-3">
            <button
              onClick={onAction || onClose}
              className={`flex-1 py-3 px-6 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-black/5 ${buttonColor}`}
            >
              {actionLabel || (type === "error" ? "Close" : "Continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
