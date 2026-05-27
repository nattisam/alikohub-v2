import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const InstructorRoute = () => {
  const { data: user, isLoading, isFetched } = useUser();
  if (isLoading || !isFetched) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const instructorStatus = user?.instructorStatus?.toUpperCase();
  const isInstructor =
    user?.globalRole === "ADMIN" ||
    user?.academyUser?.role === "INSTRUCTOR" ||
    instructorStatus === "ACCEPTED" ||
    instructorStatus === "APPROVED" ||
    instructorStatus === "ACTIVE" ||
    user?.roleStatus?.instructor === "ACTIVE" ||
    user?.roleStatus?.instructor?.toUpperCase() === "ACTIVE";

  if (!isInstructor) {
    return <Navigate to="/apply-instructor" replace />;
  }

  return <Outlet />;
};

export default InstructorRoute;
