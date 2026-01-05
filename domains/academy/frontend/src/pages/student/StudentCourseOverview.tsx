import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Course } from "../../components/types.d.tsx";
import AllCourses from "../../components/course/AllCourses";
import StudentModuleView from "../../components/student/StudentModuleView";

import RoleSelectionModal from "../../components/auth/RoleSelectionModal";
import TeacherApplicationModal from "../../components/auth/TeacherApplicationModal";

const StudentCourseOverview = () => {
  const { user: currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [courseForModuleView, setCourseForModuleView] = useState<Course | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for re-rendering

  // Check role access similar to dashboard
  useEffect(() => {
    if (!currentUser) return;

    const userRole = currentUser.academyRole || currentUser.currentRole || currentUser.academyUser?.role;
    const activeRole = currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
    const pendingRole = currentUser.pendingRole;
    const instructorStatus = currentUser.roleStatus?.instructor;

    // If user has active STUDENT role, allow access
    if (activeRole === "STUDENT") {
      return; // allowed
    }
    
    // If user wants to apply as instructor, allow access to see the application modal, but only if not already a student
    if ((pendingRole === 'INSTRUCTOR' || instructorStatus === 'pending' || instructorStatus === 'not_applied') && activeRole !== 'STUDENT') {
      return; // allowed to see application modal
    }

    // If user is ADMIN, also allow access
    if (userRole === "ADMIN" || activeRole === "ADMIN") {
      return; // allowed
    }

    // Redirect to role selection if user hasn't selected a role yet
    navigate("/role"); // Redirect to role selection page
  }, [currentUser, navigate]);

  // If user is loading, show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    window.location.href = '/auth/login';
    return null;
  }

  // Check if user has selected a role and it's appropriate
  const userRole = currentUser?.academyRole || currentUser?.currentRole || currentUser?.academyUser?.role;
  const activeRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole = (currentUser?.hasSelectedRole || currentUser?.academyUser?.hasSelectedRole) && (activeRole === "STUDENT" || activeRole === "INSTRUCTOR" || activeRole === "ADMIN");
  
  // Check if user wants to apply as instructor
  const pendingRole = currentUser?.pendingRole;
  const instructorStatus = currentUser?.roleStatus?.instructor;
  
  // Check if user has selected a role based on academyUser role
  const academyUserRole = currentUser?.academyUser?.role;
  
  // If user hasn't selected a role yet (role is still USER or undefined), show role selection modal
  if (!hasSelectedRole || (activeRole !== 'STUDENT' && activeRole !== 'INSTRUCTOR' && activeRole !== 'ADMIN')) {
    // Show role selection modal
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Role</h2>
            <p className="text-gray-600 mb-6">
              To access the course overview, please select the Student role.
            </p>
            <RoleSelectionModal onClose={() => navigate('/role')} />
          </div>
        </div>
      </div>
    );
  }

  // Only show the instructor application modal if the user is not already a student
  if ((pendingRole === 'INSTRUCTOR' || instructorStatus === 'pending' || instructorStatus === 'not_applied') && activeRole !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <TeacherApplicationModal standalone={true} />
      </div>
    );
  }

  // Function to trigger refresh
  const handleEnrollmentComplete = () => {
    // Increment the refresh key to trigger re-render
    setRefreshKey(prev => prev + 1);
  };

  // Function to handle viewing course content
  const handleViewCourseContent = async (courseId: number) => {
    setCourseForModuleView({ id: courseId } as Course); // We'll fetch the actual course data in the modal
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="px-4 md:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Course Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Browse all available courses and manage your enrollments
          </p>
        </div>

        <AllCourses 
          onViewCourseContent={handleViewCourseContent} 
          onEnrollmentComplete={handleEnrollmentComplete}
        />
      </div>

      {/* Course Content Modal */}
      {courseForModuleView && (
        <StudentModuleView
          courseId={courseForModuleView.id}
          onClose={() => setCourseForModuleView(null)}
        />
      )}
    </div>
  );
};

export default StudentCourseOverview;