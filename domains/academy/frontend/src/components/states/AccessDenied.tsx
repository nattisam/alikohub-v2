import React from 'react';
import { FaBan, FaHome, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = 'Access Denied',
  message = 'You do not have permission to access this page.',
  showHomeButton = true,
  showBackButton = true,
  onBack
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <FaBan className="text-yellow-600 text-3xl" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-yellow-800 mb-2">{title}</h3>
        <p className="text-yellow-600 mb-6">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FaArrowLeft /> Go Back
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FaHome /> Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;