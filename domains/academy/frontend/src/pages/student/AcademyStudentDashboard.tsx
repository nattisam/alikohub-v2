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
          
          // Robustly handle different response formats and potential null values
          const responseData = coursesResponse?.data;
          const rawItems = Array.isArray(responseData)
            ? responseData
            : Array.isArray((responseData as any)?.items)
              ? (responseData as any).items
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
                    (enrollmentItem as any).progress ??
                    (enrollmentItem.course as any).progress ??
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
          // Check for status codes that shouldn't be treated as "fatal" dashboard errors
          const status = error.response?.status;
          
          if (status === 401 || status === 404) {
            // These mean either unauthorized (handled elsewhere) or nothing found
            setEnrollments([]);
            setCourses([]);
            setError(null);
            return;
          }

          // Check if it's a 429 error (Too Many Requests)
          if (status === 429 && retries < maxRetries) {
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-4 w-full">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-bold animate-pulse tracking-widest uppercase text-[10px]">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-all duration-500">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 sm:px-8 lg:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Academy Dashboard</h1>
            <p className="text-slate-500 mt-2 font-medium italic">Welcome back, {(currentUser?.firstName as string) || currentUser?.email}</p>
          </div>
          <div className="flex bg-blue-50/50 p-1.5 rounded-2xl border border-blue-100 mb-2">
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-black text-blue-600 uppercase tracking-wider">
              Enrolled: {enrollments.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 sm:px-8 lg:px-10">
        {enrollments.length === 0 ? (
          <EmptyState 
            title="No Enrollments Found"
            message="You haven't enrolled in any courses yet. Start your learning journey today."
            actionText="Find a Course"
            onAction={() => navigate('/courses')}
            icon={
              <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group relative flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-blue-600 line-clamp-1">{course.title}</h3>
                    <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed h-10">{course.shortDescription}</p>
                  </div>
                  
                  <div className="mt-auto space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                        <span className="text-[10px] font-black text-blue-600">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="flex-1 px-4 py-4 bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
                      >
                        Stats
                      </button>
                      <button 
                        onClick={() => navigate(`/student-dashboard/mycourses/${course.id}/modules`)}
                        className="flex-[2] px-4 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                      >
                        Resume 
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7M3 12h18" />
                        </svg>
                      </button>
                    </div>
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