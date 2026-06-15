import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const AdminRoute = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
