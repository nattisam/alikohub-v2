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
  requiredRole 
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
  if (currentUser && !currentUser.hasSelectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <RoleSelectionModal
          onClose={() => {}}
        />
      </div>
    );
  }
  
  // Check if user has pending or rejected instructor application but is trying to access instructor-only resources
  if (requiredRole === "INSTRUCTOR" && 
      (currentUser.roleStatus?.instructor === "pending" || currentUser.roleStatus?.instructor === "rejected")) {
    // Don't allow access to instructor dashboard if application is pending or rejected
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If a required role is specified, check if user has it
  if (requiredRole && currentUser) {
    const hasRequiredRole = currentUser.currentRole === requiredRole || 
                           currentUser.academyRole === requiredRole ||
                           currentUser.availableRoles?.includes(requiredRole);
    
    if (!hasRequiredRole) {
      // Redirect to home if user doesn't have required role
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }

  // If user is an admin, allow access to all routes
  if (currentUser.academyRole === "ADMIN") {
    return <>{children}</>;
  }

  // If no required role is specified, allow access to authenticated users who have selected a role
  if (!requiredRole && currentUser.hasSelectedRole) {
    return <>{children}</>;
  }

  // If user has the required role, render the children
  if (requiredRole && (currentUser.currentRole === requiredRole || 
      currentUser.academyRole === requiredRole ||
      currentUser.availableRoles?.includes(requiredRole))) {
    return <>{children}</>;
  }

  // Default fallback - should not reach here
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;