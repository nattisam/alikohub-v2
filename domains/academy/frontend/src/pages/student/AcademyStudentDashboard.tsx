import RoleSelectionModal from "../../components/auth/RoleSelectionModal";
import TeacherApplicationModal from "../../components/auth/TeacherApplicationModal";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Restore useAuth
import { enrollmentApi } from "../../api/enrollmentApi";
import type { EnrollmentWithCourse } from "../../api/enrollmentApi";
import type { Course } from "../../components/common/types.d.tsx"; // Ensure this matches usage or update usage

import StudentProgressTracker from "../../components/student/StudentProgressTracker";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../components/states/ErrorState";
import EmptyState from "../../components/states/EmptyState";

const AcademyStudentDashboard = () => {
  const { user: currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // State definitions (Moved to top to avoid conditional hook errors)
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auth and Role check effect
  useEffect(() => {
    if (isLoading) return;
    
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }

    // Check if user has selected a role and it's appropriate for student dashboard
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

    // Redirect to role selection if user hasn't selected a role yet
    navigate("/role"); // Redirect to role selection page
  }, [currentUser, isLoading, navigate]);

  const fetchDashboardData = async () => {
    const fetchWithRetry = async (maxRetries = 3, delay = 1000) => {
      let retries = 0;

      while (retries <= maxRetries) {
        try {
          // Fetch enrolled courses
          const coursesResponse = await enrollmentApi.getMyCourses();
          const rawItems = Array.isArray(coursesResponse.data)
            ? coursesResponse.data
            : Array.isArray((coursesResponse.data as any)?.items)
              ? (coursesResponse.data as any).items
              : [];

          const detectedEnrollments: EnrollmentWithCourse[] = [];
          const detectedCourses: Course[] = [];

          rawItems.forEach((item: any) => {
            if (item && typeof item === "object" && "courseId" in item) {
              const enrollmentItem = item as EnrollmentWithCourse;
              detectedEnrollments.push(enrollmentItem);
              if (enrollmentItem.course) {
                detectedCourses.push({
                  ...enrollmentItem.course,
                  progress:
                    enrollmentItem.progress ??
                    enrollmentItem.course.progress ??
                    0,
                } as unknown as Course);
              }
            } else if (item && typeof item === "object") {
              detectedCourses.push(item as Course);
            }
          });

          setEnrollments(detectedEnrollments);
          setCourses(detectedCourses);
          setError(null); // Clear any previous error
          return; // Success, exit the retry loop
        } catch (error: any) {

          // Check if it's a 429 error (Too Many Requests)
          if (error.response?.status === 429 && retries < maxRetries) {
            // Exponential backoff: wait longer after each retry
            await new Promise((resolve) =>
              setTimeout(resolve, delay * Math.pow(2, retries))
            );
            retries++;
          } else {
            setError(error as Error);
            break; // Stop retrying on other errors or max retries reached
          }
        }
      }
    };

    setLoading(true);
    try {
      await fetchWithRetry();
    } catch (err: any) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [refreshKey, currentUser]);

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

  // If user is not logged in, return null (redirection handled in effect)
  if (!currentUser) {
    return null;
  }

  // Logic to determine what to show
  const activeRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole = (currentUser?.hasSelectedRole) && (activeRole === "STUDENT" || activeRole === "INSTRUCTOR");
  
  const pendingRole = currentUser?.pendingRole;
  const instructorStatus = currentUser?.roleStatus?.instructor;
  
  // If user hasn't selected a role yet (role is still USER or undefined), show role selection modal
  if (!hasSelectedRole || (activeRole !== 'STUDENT' && activeRole !== 'INSTRUCTOR')) {
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
  if ((pendingRole === 'INSTRUCTOR' || instructorStatus === 'pending' || instructorStatus === 'not_applied') && activeRole !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <TeacherApplicationModal standalone={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <ErrorState 
          message="Failed to load dashboard data"
          onRetry={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {currentUser?.firstName || currentUser?.email}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {enrollments.length === 0 ? (
          <EmptyState 
            title="No Enrollments Found"
            message="You haven't enrolled in any courses yet."
            actionText="Browse Courses"
            onAction={() => navigate('/courses')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                  <p className="text-gray-500 mt-1">{course.shortDescription}</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{course.progress || 0}% complete</p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Progress
                    </button>
                    <button 
                      onClick={() => navigate(`/student-dashboard/mycourses/${course.id}/modules`)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Progress Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{selectedCourse.title} Progress</h2>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
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
    </div>
  );
};

export default AcademyStudentDashboard;