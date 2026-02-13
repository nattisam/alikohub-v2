import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RoleSelectionModal from "../auth/RoleSelectionModal";
import AcademyStudentDashboard from "../../pages/student/AcademyStudentDashboard";
import StudentCourseOverview from "../../pages/student/StudentCourseOverview";
import StudentProfile from "../../pages/student/StudentProfile";
import StudentDashboardLayout from "./StudentDashboardLayout";
import ModulePage from "../../pages/student/ModulePage";

import NotFoundState from "../states/NotFoundState";

const StudentDashboardRouter: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Check the active role from the user's academyUser
  const activeRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole = currentUser?.hasSelectedRole;
  // Move redirection to useEffect
  React.useEffect(() => {
    // Check if user is trying to access student dashboard but has a different active role
    if (
      currentUser &&
      activeRole &&
      activeRole !== "STUDENT" &&
      activeRole !== "ADMIN"
    ) {
      // Redirect to the appropriate dashboard based on their role
      if (activeRole === "INSTRUCTOR") {
        navigate("/instructor");
      } else {
        // Redirect to role selection if they don't have the right role
        navigate("/role");
      }
    }
  }, [currentUser, activeRole]);

  // If user hasn't selected a role yet, show role selection modal
  if (currentUser && !hasSelectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Select Your Role
            </h2>
            <p className="text-gray-600 mb-6">
              To access the student dashboard, please select the Student role.
            </p>
            <RoleSelectionModal onClose={() => navigate("/")} />
          </div>
        </div>
      </div>
    );
  }

  // Return null if redirecting
  if (
    currentUser &&
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
