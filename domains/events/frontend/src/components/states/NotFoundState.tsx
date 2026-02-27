import React from "react";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NotFoundStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onGoHome?: () => void;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({
  title = "Page Not Found",
  message = "The page you are looking for does not exist or has been moved.",
  buttonText = "Go to Home",
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
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[60vh]">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="bg-red-50 p-4 rounded-full">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors active:scale-95"
        >
          <FaHome /> {buttonText}
        </button>
      </div>
    </div>
  );
};

export default NotFoundState;
