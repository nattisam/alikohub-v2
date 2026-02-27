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
  Loader2,
} from "lucide-react";

import StudentProgressTracker from "../../components/student/StudentProgressTracker";
import TeacherApplicationModal from "../../components/auth/TeacherApplicationModal";
import ErrorState from "../../components/states/ErrorState";

const AcademyStudentDashboard = () => {
  const { user: currentUser, isLoading, setRoleModalOpen } = useAuth();
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

    // Trigger global role selection modal and redirect to home if no role
    setRoleModalOpen(true);
    navigate("/");
  }, [currentUser, isLoading, navigate, setRoleModalOpen]);

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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
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

  // Role selection handled by useEffect and global modal
  if (
    !hasSelectedRole ||
    (activeRole !== "STUDENT" && activeRole !== "INSTRUCTOR")
  ) {
    return null;
  }

  if (
    (pendingRole === "INSTRUCTOR" ||
      instructorStatus === "pending" ||
      instructorStatus === "not_applied") &&
    activeRole !== "STUDENT"
  ) {
    return (
      <div className="min-h-screen bg-[#09090b] pt-24">
        <TeacherApplicationModal standalone={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] pt-24">
        <ErrorState
          message="Failed to load dashboard"
          onRetry={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const mostRecentCourse =
    courses.find((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100) ||
    courses[0];
  const otherCourses = courses.filter((c) => c.id !== mostRecentCourse?.id);

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Dynamic Hero Section - Cinematic Featured Style */}
      {mostRecentCourse && (
        <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden border-b border-white/[0.05]">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10" />

          {/* Abstract Pulse Background (Simulating Video Preview) */}
          <div className="absolute inset-0 bg-blue-900/10 animate-pulse">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#09090b] to-[#09090b]"></div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-8 h-full flex flex-col justify-center">
            <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Play size={14} className="text-white fill-current ml-0.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  Resume Learning
                </span>
              </div>

              <div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-4">
                  {mostRecentCourse.title}
                </h1>
                <p className="text-lg text-slate-400 line-clamp-2 max-w-xl font-medium leading-relaxed">
                  {mostRecentCourse.shortDescription}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Progress</span>
                  <div className="flex-1 max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${mostRecentCourse.progress || 0}%` }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                  <span className="text-white">
                    {mostRecentCourse.progress || 0}%
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/student-dashboard/course/${mostRecentCourse.id}`,
                      )
                    }
                    className="bg-white text-black px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-3 hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                  >
                    <Play size={16} fill="currentColor" />
                    Continue Watching
                  </button>
                  <button
                    onClick={() => setSelectedCourse(mostRecentCourse)}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3"
                  >
                    <Info size={16} />
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-8 py-16 space-y-20">
        {/* Stats Section with 'Glass' Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Overall Progress",
              value: `${courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) : 0}%`,
              icon: BarChart2,
              color: "text-blue-500",
            },
            {
              label: "Completed",
              value: courses.filter((c) => (c.progress || 0) >= 100).length,
              icon: CheckCircle,
              color: "text-emerald-500",
            },
            {
              label: "Hours Learned",
              value: "12.5h",
              icon: Clock,
              color: "text-purple-500",
            },
            {
              label: "Certificates",
              value: "2",
              icon: Trophy,
              color: "text-orange-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.04] transition-colors"
            >
              <div className={`mb-4 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* My Courses Section - 'Playlist' Grid */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-white/[0.05] pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <Layout size={20} className="text-blue-500" />
              My Library
            </h2>
            <Link
              to="/"
              className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group"
            >
              Browse Catalog{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white/[0.02] rounded-3xl p-16 text-center border border-dashed border-white/5 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-600">
                <Layout size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Library Empty
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm">
                Enroll in a course to start building your personal curriculum.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col"
                >
                  <div className="p-8 flex-1 flex flex-col relative">
                    {/* Hover Glow Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-blue-500/10 transition-colors" />

                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-3">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
                        {course.shortDescription}
                      </p>
                    </div>

                    <div className="mt-auto relative z-10">
                      <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            Completed
                          </span>
                          <span className="text-[10px] font-black text-blue-500">
                            {course.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${course.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="p-3 bg-white/[0.03] text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-all border border-white/5"
                        >
                          <BarChart2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/student-dashboard/course/${course.id}`)
                          }
                          className="flex-1 px-4 py-3 bg-white/[0.03] hover:bg-blue-600 hover:text-white text-slate-300 border border-white/5 hover:border-blue-500/30 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          Resume
                          <Play size={10} fill="currentColor" />
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-[#0c0c0e] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#09090b]">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                  Performance Analytics
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <StudentProgressTracker
                course={selectedCourse}
                userId={currentUser.firebaseId}
              />
            </div>

            <div className="p-6 border-t border-white/10 bg-[#09090b] flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-6 py-3 bg-white/5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 font-bold text-xs uppercase tracking-widest transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyStudentDashboard;
