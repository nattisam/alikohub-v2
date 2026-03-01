import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AccessDenied from "../states/AccessDenied";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const {
    user: currentUser,
    isLoading,
    isAuthenticated,
    isLoggingOut,
  } = useAuth();
  const location = useLocation();

  // 1. Loading State
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

  // 2. Authentication Check
  if (!isAuthenticated) {
    // If we're intentionally logging out, do a clean redirect
    if (isLoggingOut) {
      return <Navigate to="/auth/login" replace />;
    }

    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?redirect=${redirectUrl}`} replace />;
  }

  // 3. Admin Authorization Check
  if (currentUser?.globalRole?.toUpperCase() !== "ADMIN") {
    return (
      <AccessDenied
        title="Access Denied"
        message="You do not have permission to access the admin section."
      />
    );
  }

  // 4. Final Grant
  return <>{children}</>;
};

export default AdminRoute;
