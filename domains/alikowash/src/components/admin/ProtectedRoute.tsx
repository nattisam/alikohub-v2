import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * ProtectedRoute ensures that only authenticated administrators can access
 * administrative sections of the application.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">
            Checking credentials...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in at all, redirect to the admin login page
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If logged in but NOT an admin, we log them out and send them to the login page
  // with a clear message, as the system is strictly for administration.
  if (!isAdmin) {
    // If we're here, the user is authenticated but doesn't have the required role.
    // We sign them out to clear the stale session.
    signOut();
    return <Navigate to="/admin/login?error=not_admin" replace />;
  }

  return <>{children}</>;
}
