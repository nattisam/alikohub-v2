import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import AccessDenied from "../states/AccessDenied";

interface AppRouteProps {
  children: React.ReactNode;
  requiredRole?: "STUDENT" | "INSTRUCTOR"; // Exclude ADMIN as admin users should not access app routes
  allowNoRole?: boolean;
  message?: string;
}

const AppRoute: React.FC<AppRouteProps> = ({
  children,
  requiredRole,
  allowNoRole = false,
  message,
}) => {
  const {
    user: currentUser,
    isLoading,
    isAuthenticated,
    isLoggingOut,
  } = useAuth();
  const { setRoleModalOpen } = useUI();
  const location = useLocation();

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

  // Get the normalized active role
  const activeRole = (
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole
  )?.toUpperCase();

  // 1. Loading State
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

  // 2. Authentication Check
  if (!isAuthenticated) {
    if (isLoggingOut) {
      return <Navigate to="/auth/login" replace />;
    }

    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    const messagePart = message
      ? `&message=${encodeURIComponent(message)}`
      : "";
    return (
      <Navigate
        to={`/auth/login?redirect=${redirectUrl}${messagePart}`}
        replace
      />
    );
  }

  // 3. Admin Bypass
  // Admins should be sent to the admin section, not allowed to stay in student/instructor routes
  if (currentUser?.globalRole?.toUpperCase() === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // 4. Role Selection Check
  // If user hasn't selected a role, send back to home (where the modal will trigger)
  // allowNoRole is used for pages like Profile where a role isn't strictly required
  if (!allowNoRole && !hasSelectedRole) {
    return <Navigate to="/" replace />;
  }

  // 5. Role-Specific Access Control
  if (requiredRole) {
    // Check for Instructor Application specifically
    if (requiredRole === "INSTRUCTOR") {
      const status = currentUser?.roleStatus?.instructor;
      if (
        status === "pending" ||
        status === "rejected" ||
        status === "not_applied"
      ) {
        return (
          <AccessDenied
            title="Access Denied"
            message="You do not have access to the instructor dashboard."
          />
        );
      }
    }

    // Role mismatch check
    if (activeRole !== requiredRole) {
      return (
        <AccessDenied
          title="Access Denied"
          message={`You do not have permission to access this ${requiredRole.toLowerCase()} page.`}
        />
      );
    }
  }

  // 6. Final Grant
  return <>{children}</>;
};

export default AppRoute;
