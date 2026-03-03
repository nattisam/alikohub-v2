import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import AcademyStudentDashboard from "../../pages/student/AcademyStudentDashboard";
import StudentCourseOverview from "../../pages/student/StudentCourseOverview";
import StudentProfile from "../../pages/student/StudentProfile";
import StudentDashboardLayout from "./StudentDashboardLayout";
import ModulePage from "../../pages/student/ModulePage";

import NotFoundState from "../states/NotFoundState";

const CheckoutSuccessPage = React.lazy(
  () => import("../../pages/student/CheckoutSuccessPage"),
);
const CheckoutCancelPage = React.lazy(
  () => import("../../pages/student/CheckoutCancelPage"),
);

const StudentDashboardRouter: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { setRoleModalOpen } = useUI();
  const navigate = useNavigate();

  // Check the active role from the user's academyUser
  const activeRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole = currentUser?.hasSelectedRole;

  // If user is an admin, they can bypass these checks
  if (currentUser?.globalRole === "ADMIN") {
    // Though they should ideally use /admin, if they are here, don't redirect to /
  }
  // Move redirection to useEffect
  React.useEffect(() => {
    // Check if user is trying to access student dashboard but has a different active role
    if (
      currentUser &&
      currentUser.globalRole !== "ADMIN" &&
      activeRole &&
      activeRole !== "STUDENT" &&
      activeRole !== "ADMIN"
    ) {
      // Redirect to the appropriate dashboard based on their role
      if (activeRole === "INSTRUCTOR") {
        navigate("/instructor");
      } else {
        // Trigger global role selection modal and redirect to home
        setRoleModalOpen(true);
        navigate("/");
      }
    }
  }, [currentUser, activeRole, setRoleModalOpen, navigate]);

  // If user hasn't selected a role yet, redirections handled by useEffect
  if (currentUser && !hasSelectedRole && currentUser.globalRole !== "ADMIN") {
    return null;
  }

  // Return null if redirecting
  if (
    currentUser &&
    currentUser.globalRole !== "ADMIN" &&
    activeRole &&
    activeRole !== "STUDENT" &&
    activeRole !== "ADMIN"
  ) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="course/:courseId/lesson/:lessonId"
        element={<ModulePage />}
      />
      <Route path="checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
      <Route
        path="*"
        element={
          <StudentDashboardLayout>
            <Routes>
              <Route path="" element={<AcademyStudentDashboard />} />
              <Route path="mycourses" element={<StudentCourseOverview />} />
              <Route path="course/:courseId" element={<ModulePage />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="settings" element={<StudentProfile />} />
              <Route
                path="*"
                element={
                  <NotFoundState
                    title="Page Not Found"
                    message="The page you are looking for does not exist in the student dashboard."
                  />
                }
              />
            </Routes>
          </StudentDashboardLayout>
        }
      />
    </Routes>
  );
};

export default StudentDashboardRouter;
