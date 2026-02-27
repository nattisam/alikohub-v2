import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks";

import AccessDenied from "./common/AccessDenied";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "CLIENT" | "CONTRACTOR" | "ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser, isLoading, isAuthenticated } = useUser();

  // If we're still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-4 w-full">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-bold animate-pulse tracking-widest uppercase text-[10px]">Authing...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
  const userRole = currentUser?.role;

  // Admin access via globalRole or normalized role
  const isAdmin = isGlobalAdmin || userRole === 'ADMIN';

  
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
      return <AccessDenied requiredRole={requiredRole} />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;