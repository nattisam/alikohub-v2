import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const AdminRoute = () => {
  const { data: user, isLoading, isFetched } = useUser();
  if (isLoading || !isFetched) {
    return null; // Initial loading state
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.globalRole !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
