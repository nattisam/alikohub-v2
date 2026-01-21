import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user: currentUser, isLoading, isAuthenticated } = useAuth();

  // If we're still loading, show a loading indicator
  if (isLoading) {
    return <>{children}</>;
  }

  // If user is authenticated and is an admin, redirect to admin panel
  if (isAuthenticated && currentUser?.globalRole === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, render the children (public route)
  return <>{children}</>;
};

export default PublicRoute;