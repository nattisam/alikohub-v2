import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
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

  // If user hasn't selected a role yet, redirect to role selection page
  if (currentUser && !(currentUser.hasSelectedRole || currentUser.academyUser?.hasSelectedRole)) {
    return <Navigate to="/auth/role-selection" state={{ from: location }} replace />;
  }

  // Check if user has pending or rejected instructor application but is trying to access instructor-only resources
  if (requiredRole === "INSTRUCTOR" && 
      (currentUser.roleStatus?.instructor === "pending" || currentUser.roleStatus?.instructor === "rejected" || currentUser.roleStatus?.instructor === "not_applied")) {
    // Don't allow access to instructor dashboard if application is pending, not applied, or rejected
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If a required role is specified, check if user has it
  if (requiredRole && currentUser) {
    // Check various role properties to determine if user has required role
    // Consider main role if activeRole is still USER (default)
    const activeRole = currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
    const mainRole = currentUser.academyRole || currentUser.academyUser?.role;
    
    const hasRequiredRole = (activeRole === requiredRole) || 
                           (mainRole === requiredRole && activeRole === 'USER') || // If main role is correct but activeRole still default
                           (requiredRole === 'INSTRUCTOR' && (currentUser.roleStatus?.instructor === 'not_applied' || currentUser.roleStatus?.instructor === 'pending')) || // User can access instructor application
                           (currentUser.currentRole === requiredRole) ||
                           (currentUser.availableRoles?.includes(requiredRole));
    
    if (!hasRequiredRole) {
      // Redirect to home if user doesn't have required role
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }

  // If user is an admin, allow access to all routes
  const activeRole = currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
  const mainRole = currentUser.academyRole || currentUser.academyUser?.role;
  
  if ((activeRole === "ADMIN") || (mainRole === "ADMIN" && activeRole === 'USER')) {
    return <>{children}</>;

  }

  // If no required role is specified, allow access to authenticated users who have selected a role
  if (!requiredRole && (currentUser.hasSelectedRole || currentUser.academyUser?.hasSelectedRole)) {
    return <>{children}</>;
  }

  // If user has the required role, render the children
  if (requiredRole && currentUser) {
    const activeRole = currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
    const mainRole = currentUser.academyRole || currentUser.academyUser?.role;
    
    const hasRequiredRole = (activeRole === requiredRole) || 
                           (mainRole === requiredRole && activeRole === 'USER') || // If main role is correct but activeRole still default
                           (requiredRole === 'INSTRUCTOR' && (currentUser.roleStatus?.instructor === 'not_applied' || currentUser.roleStatus?.instructor === 'pending')) || // User can access instructor application
                           (currentUser.currentRole === requiredRole) ||
                           (currentUser.availableRoles?.includes(requiredRole));
    
    if (hasRequiredRole) {
      return <>{children}</>;
    }
  }

  // Default fallback - should not reach here
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;