import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AccessDenied from '../states/AccessDenied';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user: currentUser, isLoading, isAuthenticated } = useAuth();

  // If we're still loading, show a loading indicator
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

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has admin role (global role)
  if (currentUser?.globalRole !== "ADMIN") {
    return <AccessDenied 
      title="Access Denied"
      message="You do not have permission to access this page."
    />;
  }

  // If user is an admin, allow access
  return <>{children}</>;
};

export default AdminRoute;