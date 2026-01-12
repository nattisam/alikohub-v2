import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RoleSelectionModal from "../auth/RoleSelectionModal";
import AcademyStudentDashboard from "../../Pages/student/AcademyStudentDashboard";
import StudentCourseOverview from "../../Pages/student/StudentCourseOverview";
import StudentProfile from "../../Pages/student/StudentProfile";
import StudentDashboardLayout from "./StudentDashboardLayout";
import StudentCertificatesPage from "../../Pages/student/StudentCertificatesPage";
import ModulePage from "../../Pages/student/ModulePage";
import LessonPage from "../../Pages/student/LessonPage";

import NotFoundState from "../states/NotFoundState";

const StudentDashboardRouter: React.FC = () => {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check the active role from the user's academyUser
  const activeRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole = currentUser?.hasSelectedRole || currentUser?.academyUser?.hasSelectedRole;

  // If user hasn't selected a role yet, show role selection modal
  if (currentUser && !hasSelectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Role</h2>
            <p className="text-gray-600 mb-6">
              To access the student dashboard, please select the Student role.
            </p>
            <RoleSelectionModal onClose={() => window.location.href = '/'} />
          </div>
        </div>
      </div>
    );
  }

  // Check if user is trying to access student dashboard but has a different active role
  if (currentUser && activeRole && activeRole !== 'STUDENT' && activeRole !== 'ADMIN') {
    // Redirect to the appropriate dashboard based on their role
    if (activeRole === 'INSTRUCTOR') {
      window.location.href = '/instructor';
      return null;
    } else {
      // Redirect to role selection if they don't have the right role
      window.location.href = '/role';
      return null;
    }
  }

  return (
    <StudentDashboardLayout>
      <Routes>
        <Route path="" element={<AcademyStudentDashboard />} />
        <Route path="mycourses" element={<StudentCourseOverview />} />
<Route path="mycourses/:courseId/module/lesson/:lessonTitle/:lessonId" element={<LessonPage />} />
        <Route path="certificates" element={<StudentCertificatesPage />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentProfile />} />
        <Route 
          path="*" 
          element={
            <NotFoundState 
              title="Page Not Found" 
              message="The page you are looking for does not exist in the student dashboard."
              onGoHome={() => navigate('/student-dashboard')} 
            /> 
          } 
        />
      </Routes>
    </StudentDashboardLayout>
  );
};

export default StudentDashboardRouter;