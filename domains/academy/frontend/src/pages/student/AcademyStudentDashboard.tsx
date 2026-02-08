import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { enrollmentApi } from "../../api/enrollmentApi";
import type { EnrollmentWithCourse } from "../../api/enrollmentApi";
import type { Course } from "../../components/common/types.d.tsx";
import {
  BarChart2,
  CheckCircle,
  Layout,
  X,
  Play,
  Info,
  Clock,
  Trophy,
  ArrowRight,
} from "lucide-react";

import StudentProgressTracker from "../../components/student/StudentProgressTracker";
import RoleSelectionModal from "../../components/auth/RoleSelectionModal";
import TeacherApplicationModal from "../../components/auth/TeacherApplicationModal";
import ErrorState from "../../components/states/ErrorState";

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
      navigate("/auth/login");
      return;
    }

    const activeRole =
      currentUser.academyActiveRole || currentUser.academyUser?.activeRole;
    const pendingRole = currentUser.pendingRole;
    const instructorStatus = currentUser.roleStatus?.instructor;

    if (activeRole === "STUDENT") return;
    if (
      (pendingRole === "INSTRUCTOR" ||
        instructorStatus === "pending" ||
        instructorStatus === "not_applied") &&
      activeRole !== "STUDENT"
    )
      return;

    navigate("/role");
  }, [currentUser, isLoading, navigate]);

  const fetchDashboardData = async () => {
    const fetchWithRetry = async (maxRetries = 3, delay = 1000) => {
      let retries = 0;
      while (retries <= maxRetries) {
        try {
          const coursesResponse = await enrollmentApi.getMyCourses();
          const responseData = coursesResponse?.data;
          const rawItems = Array.isArray(responseData)
            ? responseData
            : (responseData as any)?.items || [];

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
            await new Promise((resolve) =>
              setTimeout(resolve, delay * Math.pow(2, retries)),
            );
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

  const activeRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const hasSelectedRole =
    currentUser?.hasSelectedRole &&
    (activeRole === "STUDENT" || activeRole === "INSTRUCTOR");
  const pendingRole = currentUser?.pendingRole;
  const instructorStatus = currentUser?.roleStatus?.instructor;

  if (
    !hasSelectedRole ||
    (activeRole !== "STUDENT" && activeRole !== "INSTRUCTOR")
  ) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Your Role
            </h2>
            <p className="text-gray-500 mb-8">
              To access the student dashboard, please select the Student role.
            </p>
            <RoleSelectionModal onClose={() => navigate("/role")} />
          </div>
        </div>
      </div>
    );
  }

  if (
    (pendingRole === "INSTRUCTOR" ||
      instructorStatus === "pending" ||
      instructorStatus === "not_applied") &&
    activeRole !== "STUDENT"
  ) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <TeacherApplicationModal standalone={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <ErrorState
          message="Failed to load dashboard"
          onRetry={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-[#3E92D1] rounded-full mb-4" />
        <p className="text-sm text-gray-400 font-medium">
          Synchronizing your dashboard...
        </p>
      </div>
    );
  }

  const mostRecentCourse =
    courses.find((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100) ||
    courses[0];
  const otherCourses = courses.filter((c) => c.id !== mostRecentCourse?.id);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-[#3E92D1]/30">
      {/* Dynamic Hero Section - Netflix Style */}
      {mostRecentCourse && (
        <section className="relative h-[500px] w-full overflow-hidden">
          {/* Background Gradient/Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent z-10" />
          <div className="absolute inset-0 bg-[#1e293b] animate-pulse">
            {/* If we had a course thumbnail, we'd put it here */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#3E92D1_1px,_transparent_1px)] bg-[size:32px_32px]"></div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center pt-16">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-2">
                <span className="bg-[#3E92D1] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Continue Learning
                </span>
                <span className="text-[#3E92D1] text-[10px] font-bold uppercase tracking-widest">
                  {mostRecentCourse.progress || 0}% Complete
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                {mostRecentCourse.title}
              </h1>
              <p className="text-lg text-gray-400 line-clamp-3 leading-relaxed">
                {mostRecentCourse.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() =>
                    navigate(`/student-dashboard/course/${mostRecentCourse.id}`)
                  }
                  className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#3E92D1] hover:text-white transition-all transform active:scale-95 shadow-xl shadow-white/5"
                >
                  <Play size={20} fill="currentColor" />
                  Resume Course
                </button>
                <button
                  onClick={() => setSelectedCourse(mostRecentCourse)}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/20 transition-all"
                >
                  <Info size={20} />
                  Course Details
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Progress Stats Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: "Overall Progress",
                value: `${courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) : 0}%`,
                icon: BarChart2,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                label: "Completed",
                value: courses.filter((c) => (c.progress || 0) >= 100).length,
                icon: CheckCircle,
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                label: "Hours Learned",
                value: "12.5h",
                icon: Clock,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
              {
                label: "Certificates",
                value: "2",
                icon: Trophy,
                color: "text-orange-400",
                bg: "bg-orange-400/10",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#1e293b]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* My Courses Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              My Learning Path
            </h2>
            <Link
              to="/courses"
              className="text-sm font-bold text-[#3E92D1] hover:text-white transition-colors flex items-center gap-2 group"
            >
              Explore More{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-[#1e293b]/30 rounded-3xl p-12 text-center border border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                <Layout size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Your journey hasn't started yet
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8 font-medium">
                Discover our library of courses and choose one that fits your
                interests.
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="bg-[#3E92D1] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2d7bb5] transition-all"
              >
                Browse Our Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-[#1e293b]/50 rounded-2xl border border-white/5 overflow-hidden hover:border-[#3E92D1]/50 hover:shadow-2xl hover:shadow-[#3E92D1]/10 transition-all duration-500 flex flex-col"
                >
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#3E92D1] transition-colors line-clamp-2 leading-tight">
                        {course.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm mb-8 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                      {course.shortDescription}
                    </p>

                    <div className="mt-auto space-y-6">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Course Progress
                          </span>
                          <span className="text-xs font-black text-[#3E92D1]">
                            {course.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#3E92D1] h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="p-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all border border-white/5"
                          title="View Statistics"
                        >
                          <BarChart2 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/student-dashboard/course/${course.id}`)
                          }
                          className="flex-1 px-6 py-3 bg-[#3E92D1] text-white rounded-xl font-bold text-sm hover:bg-[#2d7bb5] transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          Resume
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Progress Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Detailed progress analysis
                </p>
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
