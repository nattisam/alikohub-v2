import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = "/" 
}) => {
  const { user: currentUser, isLoading, isAuthenticated } = useAuth();
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

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have a role selected, redirect to role selection
  if (isAuthenticated && (!currentUser || !currentUser.hasSelectedRole)) {
    return <Navigate to="/auth/role-selection" state={{ from: location }} replace />;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.some(role => 
    currentUser?.academyRole === role || 
    currentUser?.academyActiveRole === role ||
    currentUser?.availableRoles?.includes(role)
  );

  // If user doesn't have any of the allowed roles, redirect to fallback path
  if (!hasAllowedRole) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If user has an allowed role, render the children
  return <>{children};
};

export default RoleProtectedRoute;