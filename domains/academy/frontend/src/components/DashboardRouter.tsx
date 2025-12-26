import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RoleSelectionModal from "./RoleSelectionModal";

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

  // If user hasn't selected a role yet (still has USER role), show role selection modal
  if (!currentUser.hasSelectedRole || (currentUser.currentRole === "USER" || currentUser.academyRole === "USER")) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <RoleSelectionModal onClose={() => {}} />
      </div>
    );
  }

  // Get the user's effective role
  const userRole = currentUser.currentRole || currentUser.academyRole;
  
  // Check if user wants to apply as instructor
  const pendingRole = currentUser.pendingRole;
  
  // Check instructor status
  const instructorStatus = currentUser.roleStatus?.instructor;

  // Redirect based on role
  switch (userRole) {
    case "INSTRUCTOR":
      // If user has been approved as instructor, send to instructor dashboard
      if (instructorStatus === 'active' || instructorStatus === 'approved') {
        return <Navigate to="/instructor" replace />;
      }
      // Otherwise, they might have applied and are pending
      return <Navigate to="/instructor/pending" replace />;
    case "ADMIN":
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
