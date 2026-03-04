import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
