import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { data: user, isLoading, isFetched } = useUser();
  if (isLoading || !isFetched) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
