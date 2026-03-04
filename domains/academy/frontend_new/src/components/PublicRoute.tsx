import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const PublicRoute = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (user) {
    // Redirect authenticated users.
    // If they are Admin, maybe redirect to /admin, else to /
    if (user.globalRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
