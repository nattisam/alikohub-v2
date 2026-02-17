import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AccessDenied from "../states/AccessDenied";

interface AppRouteProps {
  children: React.ReactNode;
  requiredRole?: "STUDENT" | "INSTRUCTOR"; // Exclude ADMIN as admin users should not access app routes
  allowNoRole?: boolean;
}

const AppRoute: React.FC<AppRouteProps> = ({
  children,
  requiredRole,
  allowNoRole = false,
}) => {
  const {
    user: currentUser,
    isLoading,
    isAuthenticated,
    setRoleModalOpen,
  } = useAuth();

  const hasSelectedRole =
    currentUser?.hasSelectedRole || currentUser?.academyUser?.hasSelectedRole;

  React.useEffect(() => {
    if (!allowNoRole && isAuthenticated && !hasSelectedRole && !isLoading) {
      setRoleModalOpen(true);
    }
  }, [
    allowNoRole,
    isAuthenticated,
    hasSelectedRole,
    isLoading,
    setRoleModalOpen,
  ]);

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
    return <Navigate to="/auth/login" replace />;
  }

  // If user is an admin, redirect them to admin dashboard - they should not access app routes
  if (currentUser?.globalRole === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // If user hasn't selected a role yet, redirect to home page (modal will be triggered by useEffect)
  if (!allowNoRole && currentUser && !hasSelectedRole) {
    return <Navigate to="/" replace />;
  }

  // Check if user has pending or rejected instructor application but is trying to access instructor-only resources
  if (
    requiredRole === "INSTRUCTOR" &&
    currentUser &&
    (currentUser.roleStatus?.instructor === "pending" ||
      currentUser.roleStatus?.instructor === "rejected" ||
      currentUser.roleStatus?.instructor === "not_applied")
  ) {
    // Don't allow access to instructor dashboard if application is pending, not applied, or rejected
    return (
      <AccessDenied
        title="Access Denied"
        message="You do not have access to the instructor dashboard."
      />
    );
  }

  // If a required role is specified, check if user has it
  if (requiredRole && currentUser) {
    // Active role should be the primary check
    const activeRole =
      currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;

    const hasRequiredRole =
      activeRole === requiredRole ||
      (requiredRole === "INSTRUCTOR" &&
        (currentUser.roleStatus?.instructor === "not_applied" ||
          currentUser.roleStatus?.instructor === "pending")); // User can access instructor application

    if (!hasRequiredRole) {
      // Show access denied state if user doesn't have required role
      return (
        <AccessDenied
          title="Access Denied"
          message="You do not have permission to access this page."
        />
      );
    }
  }

  // If no required role is specified, allow access to authenticated users who have selected a role
  // OR if allowNoRole is true
  if (
    !requiredRole &&
    currentUser &&
    (allowNoRole ||
      currentUser.hasSelectedRole ||
      currentUser.academyUser?.hasSelectedRole)
  ) {
    return <>{children}</>;
  }

  // If user has the required role, render the children
  if (requiredRole && currentUser) {
    const activeRole =
      currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;

    const hasRequiredRole =
      activeRole === requiredRole ||
      (requiredRole === "INSTRUCTOR" &&
        (currentUser.roleStatus?.instructor === "not_applied" ||
          currentUser.roleStatus?.instructor === "pending")); // User can access instructor application

    if (hasRequiredRole) {
      return <>{children}</>;
    }
  }

  // Default fallback - should not reach here
  return (
    <AccessDenied
      title="Access Denied"
      message="You do not have permission to access this page."
    />
  );
};

export default AppRoute;
