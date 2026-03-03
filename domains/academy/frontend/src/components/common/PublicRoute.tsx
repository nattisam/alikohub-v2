import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getRedirectPath } from "../../utils/user";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // If we're still loading, show a neutral state or nothing to avoid flashes
  if (isLoading) {
    return null;
  }

  // IF the user is authenticated and trying to access a public page
  // Redirect them immediately to either their intended destination or dashboard
  if (isAuthenticated && user) {
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get("redirect");

    if (redirectUrl) {
      return <Navigate to={redirectUrl} replace />;
    }

    const target = getRedirectPath(user);

    // ONLY redirect if the target is different from where we are right now
    // This prevents infinite loops for users with no selected role on the home page
    if (target !== location.pathname) {
      return <Navigate to={target} replace />;
    }
  }

  // Otherwise, render the children (public route)
  return <>{children}</>;
};

export default PublicRoute;
