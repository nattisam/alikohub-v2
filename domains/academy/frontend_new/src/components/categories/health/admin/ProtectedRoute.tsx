import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.globalRole !== "ADMIN") {
    return <Navigate to="/health/admin/login" replace />;
  }

  return <>{children}</>;
}
