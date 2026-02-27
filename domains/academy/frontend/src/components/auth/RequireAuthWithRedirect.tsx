import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface RequireAuthWithRedirectProps {
  children: React.ReactNode;
  message?: string;
}

const RequireAuthWithRedirect: React.FC<RequireAuthWithRedirectProps> = ({
  children,
  message = "Please log in to continue.",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    const encodedMessage = encodeURIComponent(message);

    return (
      <Navigate
        to={`/auth/login?redirect=${redirectUrl}&message=${encodedMessage}`}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuthWithRedirect;
