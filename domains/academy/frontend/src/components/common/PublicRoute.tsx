import React from "react";
import { useAuth } from "../../contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isLoading } = useAuth();

  // If we're still loading, show a loading indicator
  if (isLoading) {
    return <>{children}</>;
  }

  // Otherwise, render the children (public route)
  return <>{children}</>;
};

export default PublicRoute;
