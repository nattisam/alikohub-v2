import React from "react";
import { LogIn, UserPlus, X, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-32 bg-[#17469E] flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="bg-white p-4 rounded-xl shadow-lg transform translate-y-8">
            <BookOpen size={32} className="text-[#17469E]" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Unlock Full Access
          </h3>

          <p className="text-gray-600 mb-6">
            Sign up or log in to view complete course details, curriculum, and
            start your learning journey.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                navigate("/register");
                onClose();
              }}
              className="w-full py-3 bg-[#F0802D] text-white font-semibold rounded-xl hover:bg-[#d97328] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <UserPlus size={18} />
              Create Free Account
            </button>

            <button
              onClick={() => {
                navigate("/login");
                onClose();
              }}
              className="w-full py-3 bg-white text-[#17469E] font-semibold rounded-xl border-2 border-[#17469E] hover:bg-[#17469E]/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LogIn size={18} />
              Log In to Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
