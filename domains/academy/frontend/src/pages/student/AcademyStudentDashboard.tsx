import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { enrollmentApi } from "../../api/enrollmentApi";
import type { EnrollmentWithCourse } from "../../api/enrollmentApi";
import type { Course } from "../../components/common/types.d.tsx";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  ArrowRight, 
  BarChart2, 
  Plus,
  CheckCircle,
  Layout,
  X
} from "lucide-react";

import StudentProgressTracker from "../../components/student/StudentProgressTracker";
import RoleSelectionModal from "../../components/auth/RoleSelectionModal";
import TeacherApplicationModal from "../../components/auth/TeacherApplicationModal";
import ErrorState from "../../components/states/ErrorState";
import EmptyState from "../../components/states/EmptyState";

const AcademyStudentDashboard = () => {
  const { user: currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }

    const activeRole = currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
    const pendingRole = currentUser.pendingRole;
    const instructorStatus = currentUser.roleStatus?.instructor;

    if (activeRole === "STUDENT") return;
    if ((pendingRole === 'INSTRUCTOR' || instructorStatus === 'pending' || instructorStatus === 'not_applied') && activeRole !== 'STUDENT') return;

    navigate("/role");
  }, [currentUser, isLoading, navigate]);

  const fetchDashboardData = async () => {
    const fetchWithRetry = async (maxRetries = 3, delay = 1000) => {
      let retries = 0;
      while (retries <= maxRetries) {
        try {
          const coursesResponse = await enrollmentApi.getMyCourses();
          const responseData = coursesResponse?.data;
          const rawItems = Array.isArray(responseData) ? responseData : (responseData as any)?.items || [];

          const detectedEnrollments: EnrollmentWithCourse[] = [];
          const detectedCourses: Course[] = [];

          rawItems.forEach((item: any) => {
            if (item && typeof item === "object" && "courseId" in item) {
              const enrollmentItem = item as EnrollmentWithCourse;
              detectedEnrollments.push(enrollmentItem);
              if (enrollmentItem.course) {
                detectedCourses.push({
                  ...enrollmentItem.course,
                  progress: (enrollmentItem as any).progress ?? (enrollmentItem.course as any).progress ?? 0,
                } as unknown as Course);
              }
            } else if (item && typeof item === "object") {
              detectedCourses.push(item as Course);
            }
          });

          setEnrollments(detectedEnrollments);
          setCourses(detectedCourses);
          setError(null);
          return;
        } catch (error: any) {
          const status = error.response?.status;
          if (status === 401 || status === 404) {
            setEnrollments([]);
            setCourses([]);
            setError(null);
            return;
          }
          if (status === 429 && retries < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, retries)));
            retries++;
          } else {
            setError(error as Error);
            break;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-[#3E92D1] rounded-full" />
      </div>
    );
  }

  if (!currentUser) return null;

  const activeRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole = (currentUser?.hasSelectedRole) && (activeRole === "STUDENT" || activeRole === "INSTRUCTOR");
  const pendingRole = currentUser?.pendingRole;
  const instructorStatus = currentUser?.roleStatus?.instructor;

  if (!hasSelectedRole || (activeRole !== 'STUDENT' && activeRole !== 'INSTRUCTOR')) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Role</h2>
            <p className="text-gray-500 mb-8">
              To access the student dashboard, please select the Student role.
            </p>
            <RoleSelectionModal onClose={() => navigate('/role')} />
          </div>
        </div>
      </div>
    );
  }

  if ((pendingRole === 'INSTRUCTOR' || instructorStatus === 'pending' || instructorStatus === 'not_applied') && activeRole !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <TeacherApplicationModal standalone={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <ErrorState message="Failed to load dashboard" onRetry={() => setRefreshKey(prev => prev + 1)} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-[#3E92D1] rounded-full mb-4" />
        <p className="text-sm text-gray-400 font-medium">Synchronizing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {currentUser?.firstName || currentUser?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 bg-[#3E92D1]/5 text-[#3E92D1] px-4 py-2 rounded-lg text-sm font-semibold border border-[#3E92D1]/10">
                 <BookOpen size={16} />
                 {enrollments.length} Active Courses
              </span>
              <button 
                onClick={() => navigate('/courses')}
                className="bg-[#3E92D1] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#327aae] transition-colors flex items-center gap-2 shadow-sm"
              >
                 <Plus size={16} />
                 Explore Courses
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-50 text-[#3E92D1] rounded-md">
                    <BarChart2 size={18} />
                 </div>
                 <span className="text-sm font-medium text-gray-500">Overall Progress</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                 {courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) : 0}%
              </p>
           </div>
           <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-green-50 text-green-600 rounded-md">
                    <CheckCircle size={18} />
                 </div>
                 <span className="text-sm font-medium text-gray-500">Completed Courses</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                 {courses.filter(c => (c.progress || 0) >= 100).length}
              </p>
           </div>
           <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
                    <Clock size={18} />
                 </div>
                 <span className="text-sm font-medium text-gray-500">Hours Learned</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">12.5h</p>
           </div>
           <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-orange-50 text-orange-600 rounded-md">
                    <Trophy size={18} />
                 </div>
                 <span className="text-sm font-medium text-gray-500">Certificates Earned</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
           </div>
        </div>

        <div className="flex items-center justify-between mb-6">
           <h2 className="text-lg font-semibold text-gray-900">My Learning Path</h2>
           <Link to="/courses" className="text-sm font-medium text-[#3E92D1] hover:underline flex items-center gap-1">
              Browse More <ArrowRight size={14} />
           </Link>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState 
            title="Your journey hasn't started yet"
            message="Discover our library of courses and choose one that fits your interests."
            actionText="Browse Courses"
            onAction={() => navigate('/courses')}
            icon={<Layout className="h-10 w-10 text-gray-200" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#3E92D1] transition-colors line-clamp-2">
                       {course.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
                     {course.shortDescription}
                  </p>
                  
                  <div className="mt-auto space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course Progress</span>
                        <span className="text-[10px] font-bold text-[#3E92D1] bg-[#3E92D1]/5 px-2 py-0.5 rounded-full">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#3E92D1] h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="flex-1 px-3 py-2.5 bg-gray-50 text-gray-600 rounded-md font-semibold text-xs hover:bg-gray-100 transition-all border border-gray-100 flex items-center justify-center gap-2"
                      >
                         <BarChart2 size={12} />
                         View Stats
                      </button>
                      <button 
                        onClick={() => navigate(`/student-module/${course.id}/modules`)}
                        className="flex-[1.5] px-3 py-2.5 bg-[#3E92D1] text-white rounded-md font-semibold text-xs hover:bg-[#327aae] transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                         Resume Learning
                         <ArrowRight size={12} />
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
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedCourse.title}</h2>
                  <p className="text-xs text-gray-400 mt-1">Detailed progress analysis</p>
               </div>
               <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-all"
               >
                  <X size={20} />
               </button>
            </div>

            <div className="p-6 overflow-y-auto">
               <StudentProgressTracker
                 course={selectedCourse}
                 userId={currentUser.firebaseId}
               />
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
               <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 font-semibold text-sm transition-all"
               >
                  Dismiss
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyStudentDashboard;