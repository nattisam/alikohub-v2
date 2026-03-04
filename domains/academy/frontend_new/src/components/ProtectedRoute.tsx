import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute
