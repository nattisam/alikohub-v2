import React from "react";
import { SearchX, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotFoundStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onGoHome?: () => void;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({
  title = "Page Not Found",
  message = "The job listing or page you're looking for doesn't exist or has expired.",
  buttonText = "Go to Careers Home",
  onGoHome,
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[60vh]">
      <div className="bg-white border border-stone-100 rounded-3xl p-12 max-w-lg w-full text-center shadow-xl shadow-stone-200/40">
        <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
          <SearchX className="text-stone-300 w-10 h-10" />
        </div>

        <h3 className="text-2xl font-bold text-stone-900 mb-2 font-serif">
          {title}
        </h3>
        <p className="text-stone-500 mb-10 max-w-sm mx-auto leading-relaxed text-sm">
          {message}
        </p>

        <button
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-stone-200 active:scale-95"
        >
          <Home size={18} /> {buttonText}
        </button>
      </div>
    </div>
  );
};

export default NotFoundState;
