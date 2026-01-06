import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
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

  // If a required role is specified, check if user has it
  if (requiredRole && currentUser) {
    // Check user's global role
    const userRole = currentUser.globalRole;
    
    const hasRequiredRole = userRole === requiredRole || (requiredRole === 'USER' && userRole !== 'ADMIN');
    
    if (!hasRequiredRole) {
      // Show access denied state if user doesn't have required role
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">You do not have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  // If user is an admin, allow access to all routes
  if (currentUser?.globalRole === "ADMIN") {
    return <>{children}</>;
  }

  // If no required role is specified, allow access to authenticated users
  if (!requiredRole) {
    return <>{children}</>;
  }

  // If user has the required role, render the children
  if (requiredRole && currentUser) {
    const userRole = currentUser.globalRole;
    
    const hasRequiredRole = userRole === requiredRole || (requiredRole === 'USER' && userRole !== 'ADMIN');
    
    if (hasRequiredRole) {
      return <>{children}</>;
    }
  }

  // Default fallback - should not reach here
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;