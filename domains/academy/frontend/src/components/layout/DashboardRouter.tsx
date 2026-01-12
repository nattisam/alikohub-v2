import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Smart dashboard router that redirects users to the appropriate dashboard
 * based on their role (STUDENT, INSTRUCTOR, or ADMIN)
 */
const DashboardRouter: React.FC = () => {
  const { user: currentUser, isLoading } = useAuth();

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
    return <Navigate to="/auth/login" replace />;
  }

  // If user hasn't selected a role yet (using hasSelectedRole as the primary indicator), redirect to role selection page
  // According to the experience lesson, always check hasSelectedRole instead of academyRole
  const hasSelectedRole = currentUser.hasSelectedRole || currentUser.academyUser?.hasSelectedRole;
  
  if (!hasSelectedRole) {
    return <Navigate to="/role" replace />;
  }

  // Get the user's active role (the role they're currently using)
  const activeRole = currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
  
  // Check if user wants to apply as instructor
  const pendingRole = currentUser.pendingRole;
  
  // Check instructor status
  const instructorStatus = currentUser.roleStatus?.instructor;

  // Redirect based on active role
  switch (activeRole) {
    case "INSTRUCTOR":
      // If user has active instructor role, send to instructor dashboard
      return <Navigate to="/instructor" replace />;
    case "ADMIN":
      // Even if ADMIN is the active role, redirect to admin section
      return <Navigate to="/admin" replace />;
    case "STUDENT":
    default:
      // Check if user wants to apply as instructor
      if (pendingRole === 'INSTRUCTOR' || instructorStatus === 'pending' || instructorStatus === 'not_applied') {
        // If user has pending instructor application, redirect to the student dashboard
        // The student dashboard will show the instructor application modal
        return <Navigate to="/student-dashboard" replace />;
      }
      return <Navigate to="/student-dashboard" replace />;
  }
};

export default DashboardRouter;
