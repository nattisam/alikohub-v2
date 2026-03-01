import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import { useNavigate } from "react-router-dom";
import AllCourses from "../../components/course/AllCourses";
import TeacherApplicationModal from "../../components/auth/TeacherApplicationModal";

const StudentCourseOverview = () => {
  const { user: currentUser, isLoading } = useAuth();
  const { setRoleModalOpen } = useUI();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for re-rendering

  // Check role access similar to dashboard
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    const activeRole =
      currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
    const pendingRole = currentUser.pendingRole;
    const instructorStatus = currentUser.roleStatus?.instructor;

    // If user has active STUDENT role, allow access
    if (activeRole === "STUDENT") {
      return; // allowed
    }

    // If user wants to apply as instructor, allow access to see the application modal, but only if not already a student
    if (
      (pendingRole === "INSTRUCTOR" ||
        instructorStatus === "pending" ||
        instructorStatus === "not_applied") &&
      activeRole !== "STUDENT"
    ) {
      return; // allowed to see application modal
    }

    // Trigger global role selection modal and redirect to home if no role
    setRoleModalOpen(true);
    navigate("/");
  }, [currentUser, navigate, setRoleModalOpen]);

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

  // If user is not logged in, return null (redirection handled in useEffect)
  if (!currentUser) {
    return null;
  }

  // Check if user has selected a role and it's appropriate
  const activeRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole =
    currentUser?.hasSelectedRole &&
    (activeRole === "STUDENT" || activeRole === "INSTRUCTOR");

  // Check if user wants to apply as instructor
  const pendingRole = currentUser?.pendingRole;
  const instructorStatus = currentUser?.roleStatus?.instructor;

  // Role selection handled by useEffect and global modal
  if (
    !hasSelectedRole ||
    (activeRole !== "STUDENT" && activeRole !== "INSTRUCTOR")
  ) {
    return null;
  }

  // Only show the instructor application modal if the user is not already a student
  if (
    (pendingRole === "INSTRUCTOR" ||
      instructorStatus === "pending" ||
      instructorStatus === "not_applied") &&
    activeRole !== "STUDENT"
  ) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <TeacherApplicationModal standalone={true} />
      </div>
    );
  }

  // Function to trigger refresh
  const handleEnrollmentComplete = () => {
    // Increment the refresh key to trigger re-render
    setRefreshKey((prev) => prev + 1);
  };

  // Function to handle viewing course content
  const handleViewCourseContent = async (courseId: number) => {
    // Redirect to the course home (journey) page
    navigate(`/student-dashboard/course/${courseId}`);
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
          key={refreshKey}
          onViewCourseContent={handleViewCourseContent}
          onEnrollmentComplete={handleEnrollmentComplete}
        />
      </div>

      {/* Course Content Modal - commented out since we're redirecting to module page */}
      {/*
      {courseForModuleView && (
        <StudentModuleView
          courseId={courseForModuleView.id}
          onClose={() => setCourseForModuleView(null)}
        />
      */}
    </div>
  );
};

export default StudentCourseOverview;
