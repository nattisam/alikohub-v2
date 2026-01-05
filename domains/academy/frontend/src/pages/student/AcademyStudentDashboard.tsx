import ContinueLearning from "../../components/student/ContinueLearning";
import QuickActions from "../../components/instructor/QuickActions";
import SidebarStats from "../../components/instructor/SidebarStats";
import { useAuth } from "../../contexts/AuthContext";
import RoleSelectionModal from "../../components/auth/RoleSelectionModal";
import TeacherApplicationModal from "../../components/auth/TeacherApplicationModal";
import { useState, useEffect } from "react";
import { enrollmentApi } from "../../api/enrollmentApi";
import { courseApi } from "../../api/courseApi";
import type { Course } from "../../components/types.d.tsx";

import StudentProgressTracker from "../../components/student/StudentProgressTracker";
import StudentModuleView from "../../components/student/StudentModuleView";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../components/states/ErrorState";
import EmptyState from "../../components/states/EmptyState";

const AcademyStudentDashboard = () => {
  const { user: currentUser, isLoading, refetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  useEffect(() => {
    if (!currentUser) return;

    // Check if user has selected a role and it's appropriate for student dashboard
    const userRole = currentUser.academyRole || currentUser.currentRole || currentUser.academyUser?.role;
    const hasSelectedRole = currentUser.hasSelectedRole || currentUser.academyUser?.hasSelectedRole;
    const academyUserRole = currentUser.academyUser?.role;
    const activeRole = currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
    
    // Check if user wants to apply as instructor
    const pendingRole = currentUser.pendingRole;
    const instructorStatus = currentUser.roleStatus?.instructor;

    // If user has active STUDENT role, allow access to student dashboard
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
  console.log('AcademyStudentDashboard: Checking navigation - currentUser:', currentUser);
  if (!currentUser) {
    console.log('AcademyStudentDashboard: Redirecting to login');
    window.location.href = '/auth/login';
    return null;
  }

  // Check if user has selected a role and it's appropriate for student dashboard
  const userRole = currentUser?.academyRole || currentUser?.currentRole || currentUser?.academyUser?.role;
  const activeRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole = (currentUser?.hasSelectedRole || currentUser?.academyUser?.hasSelectedRole) && (activeRole === "STUDENT" || activeRole === "INSTRUCTOR" || activeRole === "ADMIN");
  
  // Check if user wants to apply as instructor
  const pendingRole = currentUser?.pendingRole;
  const instructorStatus = currentUser?.roleStatus?.instructor;
  
  // Check if user has selected a role based on academyUser role
  const academyUserRole = currentUser?.academyUser?.role;
  
  // If user hasn't selected a role yet (role is still USER or undefined), show role selection modal
  console.log('AcademyStudentDashboard: Checking role - activeRole:', activeRole, 'hasSelectedRole:', hasSelectedRole);
  if (!hasSelectedRole || (activeRole !== 'STUDENT' && activeRole !== 'INSTRUCTOR' && activeRole !== 'ADMIN')) {
    // Show role selection modal
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Role</h2>
            <p className="text-gray-600 mb-6">
              To access the student dashboard, please select the Student role.
            </p>
            <RoleSelectionModal onClose={() => navigate('/role')} />
          </div>
        </div>
      </div>
    );
  }

  // Only show the instructor application modal if the user is not already a student
  // If user is a student, show the student dashboard even if there was a previous instructor intent
  if ((pendingRole === 'INSTRUCTOR' || instructorStatus === 'pending' || instructorStatus === 'not_applied') && activeRole !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <TeacherApplicationModal standalone={true} />
      </div>
    );
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseForModuleView, setCourseForModuleView] = useState<Course | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for re-rendering
  
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
  });

  // Update stats when courses change
  useEffect(() => {
    const completedCourses = courses.filter(course => course.progress && course.progress >= 100).length;
    setStats({
      enrolledCourses: courses.length,
      completedCourses,
      certificates: completedCourses,
    });
  }, [courses]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      
      // Fetch enrolled courses
      const coursesResponse = await enrollmentApi.getMyCourses();
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]); // Add refreshKey to dependencies

  const handleViewProgress = async (courseId: number) => {
    // Find the course in the courses array
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleViewCourseContent = async (courseId: number) => {
    console.log("handleViewCourseContent called with courseId:", courseId);
    console.log("Available courses:", courses);
    
    // Find the course in the courses array
    const course = courses.find(c => c.id === courseId);
    console.log("Found course:", course);
    
    if (course) {
      setCourseForModuleView(course);
    } else {
      console.error("Course not found in courses array");
      // Try to fetch the course directly
      try {
        const response = await courseApi.getCourse(courseId);
        console.log("Fetched course directly:", response.data);
        setCourseForModuleView(response.data);
      } catch (error) {
        console.error("Error fetching course directly:", error);
      }
    }
  };

  // Function to trigger dashboard refresh
  const handleEnrollmentComplete = () => {
    // Increment the refresh key to trigger re-render
    setRefreshKey(prev => prev + 1);
  };

  // Check for error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="px-4 md:px-8 py-6">
          <ErrorState 
            title="Failed to Load Dashboard" 
            message="There was an error loading your dashboard data. Please try again later." 
            error={error}
            onRetry={fetchDashboardData}
          />
        </div>
      </div>
    );
  }
  
  // Check for empty state
  if (!loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="px-4 md:px-8 py-6">
          <EmptyState 
            title="No Courses Yet" 
            message="You haven't enrolled in any courses yet. Start learning by exploring our course catalog." 
            showAction={true}
            actionText="Browse Courses"
            onAction={() => navigate('/courses')}
          />
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="px-4 md:px-8 py-6">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="px-4 md:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main Content */}
          <div className="flex-1">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {currentUser?.firstname}!
              </h1>
              <p className="text-gray-600 mt-2">
                Continue your learning journey and track your progress
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
                <div className="text-gray-600 mt-1">Enrolled Courses</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-green-600">{
                  courses.filter(course => course.progress && course.progress >= 100).length
                }</div>
                <div className="text-gray-600 mt-1">Completed Courses</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-yellow-600">{
                  courses.filter(course => course.progress && course.progress >= 100).length
                }</div>
                <div className="text-gray-600 mt-1">Certificates Earned</div>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 flex flex-col">
                <QuickActions />
                <ContinueLearning 
                  key={refreshKey}
                  onviewProgress={handleViewProgress} 
                  onViewCourseContent={handleViewCourseContent} 
                />

              </div>

              <div className="w-full xl:w-80">
                <SidebarStats className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker Modal */}
      {selectedCourse && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Progress for "{selectedCourse.title}"
                </h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <StudentProgressTracker 
                course={selectedCourse} 
                userId={currentUser.firebaseId} 
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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

export default AcademyStudentDashboard;