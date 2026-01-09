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

  // If user hasn't selected a role yet but no specific role is required, allow access
  // The header and navbar will show the 'Choose Role' button
  if (currentUser && !currentUser.hasSelectedRole && requiredRole) {
    // If a specific role is required but user hasn't selected a role, deny access
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Role Required</h2>
          <p className="text-gray-600">Please select a role to access this page.</p>
          <button 
            onClick={() => window.location.href = "/role-selection"}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Choose Role
          </button>
        </div>
      </div>
    );
  }
  
  // If user hasn't selected a role yet and no specific role required, allow access
  if (currentUser && !currentUser.hasSelectedRole && !requiredRole) {
    return <>{children}</>;
  }

  // If a required role is specified, check if user has it
  if (requiredRole && currentUser) {
    // Check if user has the required role
    const hasRequiredRole = currentUser.contechRole === requiredRole;
    
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

  // If no required role is specified, allow access to authenticated users who have selected a role
  if (!requiredRole && currentUser?.hasSelectedRole) {
    return <>{children}</>;
  }

  // Allow access if no required role is specified and user is authenticated with selected role
  if (requiredRole === undefined && currentUser?.hasSelectedRole) {
    return <>{children}</>;
  }

  // If user has the required role, render the children
  if (requiredRole && currentUser && currentUser.contechRole === requiredRole) {
    return <>{children}</>;
  }

  // Default fallback - should not reach here
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;