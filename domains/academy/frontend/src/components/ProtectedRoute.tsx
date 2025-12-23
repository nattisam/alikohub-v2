import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RoleSelectionModal from "./RoleSelectionModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = "STUDENT" 
}) => {
  const { user: currentUser, isLoading } = useAuth();
  const location = useLocation();

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

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user hasn't selected a role yet, show role selection modal
  if (currentUser && !currentUser.academyRole) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <RoleSelectionModal
          onClose={() => {}}
        />
      </div>
    );
  }

  // If user doesn't have the required role, redirect to appropriate dashboard
  if (requiredRole === "INSTRUCTOR" && currentUser.academyRole === "STUDENT") {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is an admin, allow access to all routes
  if (currentUser.academyRole === "ADMIN") {
    return <>{children}</>;
  }

  // If user has the required role, render the children
  if (currentUser.academyRole === requiredRole) {
    return <>{children}</>;
  }

  // Default fallback - should not reach here
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
