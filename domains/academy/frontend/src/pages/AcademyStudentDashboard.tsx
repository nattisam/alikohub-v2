import ContinueLearning from "../components/ContinueLearning";
import QuickActions from "../components/QuickActions";
import SidebarStats from "../components/SidebarStats";
import { useAuth } from "../contexts/AuthContext";
import RoleSelectionModal from "../components/RoleSelectionModal";
import { useState, useEffect } from "react";
import { progressApi } from "../api/progressApi";
import { enrollmentApi } from "../api/enrollmentApi";
import { courseApi } from "../api/courseApi";
import type { CourseProgress } from "../api/progressApi";
import type { Course } from "../components/types.d.tsx";
import AllCourses from "../components/AllCourses";
import StudentProgressTracker from "../components/StudentProgressTracker";
import StudentModuleView from "../components/StudentModuleView";

const AcademyStudentDashboard = () => {
  const { user: currentUser, isLoading } = useAuth();
  console.log('AcademyStudentDashboard: Rendering with currentUser:', currentUser, 'isLoading:', isLoading);
  const [showRoleModal, setShowRoleModal] = useState(false);

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

  // If user hasn't selected a role yet, show role selection modal
  console.log('AcademyStudentDashboard: Checking role - academyRole:', currentUser.academyRole);
  if (!currentUser.academyRole) {
    // Show role selection modal
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

  // If user is not a student, redirect to appropriate dashboard
  console.log('AcademyStudentDashboard: Checking role permissions - role:', currentUser.academyRole);
  if (currentUser.academyRole !== 'STUDENT') {
    console.log('AcademyStudentDashboard: Redirecting to instructor dashboard');
    window.location.href = '/instructor';
    return null;
  }
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseForModuleView, setCourseForModuleView] = useState<Course | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for re-rendering

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const progressResponse = await progressApi.getStudentDashboard();
      const progressCourses: CourseProgress[] = progressResponse.data;
      
      // Calculate stats
      const enrolledCourses = progressCourses.length;
      const completedCourses = progressCourses.filter(course => course.percentage === 100).length;
      
      setStats({
        enrolledCourses,
        completedCourses,
        certificates: completedCourses, // For now, assume certificates = completed courses
      });
      
      // Fetch enrolled courses
      const coursesResponse = await enrollmentApi.getMyCourses();
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
            <div className="text-3xl font-bold text-blue-600">{stats.enrolledCourses}</div>
            <div className="text-gray-600 mt-1">Enrolled Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.completedCourses}</div>
            <div className="text-gray-600 mt-1">Completed Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.certificates}</div>
            <div className="text-gray-600 mt-1">Certificates</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            <QuickActions />
            <ContinueLearning 
              key={refreshKey} // Add key to force re-render when enrollment changes
              onviewProgress={handleViewProgress} 
              onViewCourseContent={handleViewCourseContent} 
            />
            <AllCourses 
              className="mt-6" 
              onViewCourseContent={handleViewCourseContent} 
              onEnrollmentComplete={handleEnrollmentComplete}
            />
          </div>

          <div className="w-full lg:w-80">
            <SidebarStats className="w-full" />
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