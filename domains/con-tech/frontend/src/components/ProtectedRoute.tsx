import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "CLIENT" | "CONTRACTOR" | "PROJECT_MANAGER" | "ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser, isLoading, isAuthenticated } = useUser();
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
  const userRole = currentUser?.role;
  const hasSelectedRole = currentUser?.hasSelectedRole;

  // Admin access via globalRole or normalized role
  const isAdmin = isGlobalAdmin || userRole === 'ADMIN' || userRole === 'PROJECT_MANAGER';

  // If user hasn't selected a role yet and no specific role is required, redirect to role selection
  // EXCEPT for global admins who should probably have a role or we handle them specially
  if (currentUser && !hasSelectedRole && requiredRole && !isGlobalAdmin) {
    return <Navigate to="/role-selection" state={{ from: location }} replace />;
  }
  
  // If a required role is specified, check if user has it
  if (requiredRole && currentUser) {
    let hasRequiredRole = false;

    // Admins have access to everything
    if (isAdmin) {
      hasRequiredRole = true;
    } else {
      hasRequiredRole = userRole === requiredRole;
    }
    
    if (!hasRequiredRole) {
      // Show access denied state if user doesn't have required role
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">You do not have permission to access this page.</p>
            <p className="text-gray-500 mt-2">Required role: {requiredRole}</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;