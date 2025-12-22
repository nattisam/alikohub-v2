import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoleSelectionModal from './RoleSelectionModal';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user needs to select a role
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      const hasSelectedRole = user.hasSelectedRole || user.academyProfile?.hasSelectedRole;
      const hasRole = !!user.academyRole;
      
      // Show role selection if user hasn't selected a role yet
      if (!hasSelectedRole || !hasRole) {
        // Check if we're already on the role selection page to avoid infinite loop
        if (!location.pathname.includes('/select-role')) {
          setShowRoleModal(true);
        }
      }
    }
  }, [isAuthenticated, isLoading, user, location.pathname]);

  const handleRoleSelected = () => {
    setShowRoleModal(false);
    // Redirect to dashboard based on selected role
    if (user?.academyRole) {
      navigate(`/${user.academyRole.toLowerCase()}/dashboard`);
    } else {
      navigate('/');
    }
  };

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

  // If user needs to select a role, show the role selection modal
  const needsRoleSelection = !user.hasSelectedRole && !user.academyRole;
  if (needsRoleSelection) {
    return (
      <RoleSelectionModal 
        onClose={() => {
          // If user closes modal without selecting a role, redirect to home
          navigate('/');
        }}
        onRoleSelected={handleRoleSelected}
      />
    );
  }

  // If role is required but user doesn't have it, show unauthorized
  if (requiredRole && user.academyRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user has the required role (or no role required), render the children
  return <>{children}</>;
};

export default RoleProtectedRoute;
