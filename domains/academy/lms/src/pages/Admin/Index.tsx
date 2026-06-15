import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Users,
  BookOpen,
  Clock,
  ExternalLink,
  Trash2,
  Filter,
  Download,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTeacherApplications,
  useApproveTeacher,
  useRejectTeacher,
  useAdminCourses,
  useApproveCourse,
  useRejectCourse,
  useAdminAnalytics,
  useDeleteCourse,
} from "@/hooks/useAcademy";
import {
  useAllTransactions,
  useUpdateTransactionStatus,
} from "@/hooks/usePayment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import ReviewApplicationModal from "@/components/ReviewApplicationModal";
import ReviewCourseModal from "@/components/ReviewCourseModal";
import type { TeacherApplication, Course } from "@/types/academy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/admin/applications") return "applications";
    if (path === "/admin/analytics") return "analytics";
    if (path === "/admin/transactions") return "transactions";
    return "courses";
  };

  const activeTab = getActiveTab();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [appsPage, setAppsPage] = useState(1);
  const [coursesPage, setCoursesPage] = useState(1);
  const pageSize = 5;

  const { data: applications, isLoading: appsLoading } = useTeacherApplications(
    appsPage,
    pageSize,
  );
  const approveMutation = useApproveTeacher();
  const rejectMutation = useRejectTeacher();

  const { data: coursesData, isLoading: coursesLoading } = useAdminCourses(
    coursesPage,
    pageSize,
  );
  const approveCourseMutation = useApproveCourse();
  const rejectCourseMutation = useRejectCourse();
  const deleteCourseMutation = useDeleteCourse();

  const { data: analyticsData, isLoading: analyticsLoading } =
    useAdminAnalytics();
  const { data: allTransactions, isLoading: allTransactionsLoading } =
    useAllTransactions();
  const updateTransactionMutation = useUpdateTransactionStatus();

  // Filter out free course enrollments (amount === 0)
  const paidTransactions = allTransactions?.filter(
    (tx: any) => Number(tx.amount) > 0,
  );

  const [selectedApp, setSelectedApp] = useState<TeacherApplication | null>(
    null,
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const chartData = [
    { name: "Courses", value: analyticsData?.totalCourses || 0 },
    { name: "Progress", value: analyticsData?.totalProgress || 0 },
    { name: "Enrollments", value: analyticsData?.totalEnrollments || 0 },
  ];

  const handleReview = (application: TeacherApplication) => {
    setSelectedApp(application);
  };

  const onApprove = (id: string, notes: string) => {
    approveMutation.mutate(
      { appId: id, reviewNotes: notes },
      { onSuccess: () => setSelectedApp(null) },
    );
  };

  const onReject = (id: string, notes: string) => {
    rejectMutation.mutate(
      { appId: id, reviewNotes: notes },
      { onSuccess: () => setSelectedApp(null) },
    );
  };

  const handleReviewCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const onApproveCourse = (id: string, notes: string) => {
    approveCourseMutation.mutate(id, {
      onSuccess: () => setSelectedCourse(null),
    });
  };

  const onRejectCourse = (id: string, notes: string) => {
    rejectCourseMutation.mutate(
      { courseId: id, reason: notes },
      { onSuccess: () => setSelectedCourse(null) },
    );
  };

  const handleDeleteCourse = (courseId: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the course "${title}"? This action cannot be undone.`,
      )
    ) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  const allCourses = Array.isArray(coursesData)
    ? coursesData
    : (coursesData as any)?.courses ||
      (coursesData as any)?.items ||
      (coursesData as any)?.data ||
      [];

  const allApplications = Array.isArray(applications)
    ? applications
    : (applications as any)?.applications ||
      (applications as any)?.items ||
      (applications as any)?.data ||
      [];

  const totalRevenue =
    paidTransactions
      ?.filter((tx: any) => tx.status === "COMPLETED")
      .reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0) || 0;
  const completedTx =
    paidTransactions?.filter((tx: any) => tx.status === "COMPLETED").length || 0;
  const pendingTx =
    paidTransactions?.filter((tx: any) => tx.status === "PENDING").length || 0;
  const uniqueUsers =
    new Set(paidTransactions?.map((tx: any) => tx.userId)).size || 0;

  return (
    <div className="flex min-h-screen bg-[#18181b] transition-colors duration-300">
      <AdminSidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={
            activeTab === "courses"
              ? "Course Reviews"
              : activeTab === "applications"
                ? "Teacher Applications"
                : activeTab === "transactions"
                  ? "Platform payments"
                  : "Platform Analytics"
          }
          darkTheme={true}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* ── Teacher Applications ── */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#3f3f46] flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    Teacher applications
                  </h2>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white text-sm font-semibold rounded-lg transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white text-sm font-semibold rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-zinc-400 uppercase text-xs font-bold border-b border-[#3f3f46]">
                      <tr>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Applied for</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3f3f46]">
                      {appsLoading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-zinc-500"
                          >
                            <Clock className="w-8 h-8 text-zinc-600 animate-spin mx-auto mb-4" />
                            Loading applications...
                          </td>
                        </tr>
                      ) : !allApplications || allApplications.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-zinc-500"
                          >
                            No applications found.
                          </td>
                        </tr>
                      ) : (
                        allApplications.map((app: any) => (
                          <tr
                            key={app.id}
                            className="hover:bg-[#3f3f46]/50 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#3f3f46] flex items-center justify-center font-bold text-zinc-300 text-xs border border-[#52525b]">
                                  {app.user?.firstname?.[0] ?? ""}
                                  {app.user?.lastname?.[0] ?? ""}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-white text-sm">
                                    {app.user?.firstname ?? ""}{" "}
                                    {app.user?.lastname ?? ""}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    ID: {String(app.id).substring(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                              {app.user?.email ?? ""}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Instructor
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={cn(
                                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                                  (app.status === "PENDING" ||
                                    app.status === "SUBMITTED") &&
                                    "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                  (app.status === "ACCEPTED" ||
                                    app.status === "APPROVED") &&
                                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                  app.status === "REJECTED" &&
                                    "bg-red-500/10 text-red-400 border-red-500/20",
                                )}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {app.status === "PENDING" ||
                              app.status === "SUBMITTED" ? (
                                <button
                                  className="px-3 py-1.5 bg-[#005461] hover:bg-[#00434d] text-white text-xs font-bold rounded-lg transition-colors"
                                  onClick={() => handleReview(app)}
                                >
                                  Review
                                </button>
                              ) : (
                                <button
                                  className="px-3 py-1.5 bg-[#3f3f46] hover:bg-[#52525b] border border-[#52525b] text-zinc-300 text-xs font-medium rounded-lg transition-colors"
                                  onClick={() => handleReview(app)}
                                >
                                  View details
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-[#3f3f46]">
                  <span className="text-xs text-zinc-500 font-medium">
                    Page {appsPage}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-[#3f3f46] hover:bg-[#52525b] border border-[#52525b] text-zinc-300 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => setAppsPage((p) => Math.max(1, p - 1))}
                      disabled={appsPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-1.5 bg-[#3f3f46] hover:bg-[#52525b] border border-[#52525b] text-zinc-300 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => setAppsPage((p) => p + 1)}
                      disabled={
                        !allApplications || allApplications.length < pageSize
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Course Reviews ── */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#3f3f46] flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    Course reviews
                  </h2>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white text-sm font-semibold rounded-lg transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white text-sm font-semibold rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-zinc-400 uppercase text-xs font-bold border-b border-[#3f3f46]">
                      <tr>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Instructor</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Students</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3f3f46]">
                      {coursesLoading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-zinc-500"
                          >
                            <BookOpen className="w-8 h-8 text-zinc-600 animate-pulse mx-auto mb-4" />
                            Loading courses...
                          </td>
                        </tr>
                      ) : !allCourses || allCourses.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-zinc-500"
                          >
                            <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="font-medium">
                              No courses found in the system.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        allCourses.map((course: any) => (
                          <tr
                            key={course.id}
                            className="hover:bg-[#3f3f46]/50 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#3f3f46] flex-shrink-0 border border-[#52525b] group-hover:border-[#3BC1A8] transition-colors">
                                  {course.thumbnail ? (
                                    <img
                                      src={course.thumbnail}
                                      alt={course.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                      <BookOpen className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className="font-bold text-white text-sm max-w-[200px] truncate"
                                    title={course.title}
                                  >
                                    {course.title}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">
                                    {course.shortDescription ||
                                      "No description"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-zinc-300 font-semibold">
                              {course.instructor
                                ? `${course.instructor.firstname} ${course.instructor.lastname}`
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-[#3f3f46] border border-[#52525b] rounded-lg text-[10px] font-bold text-zinc-400 uppercase">
                                {course.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-white font-bold">
                              {course.enrolledNum ||
                                course.enrolledCount ||
                                course.enrollmentCount ||
                                0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={cn(
                                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                                  (course.status === "PENDING" ||
                                    course.status === "PENDING_APPROVAL") &&
                                    "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                  (course.status === "PUBLISHED" ||
                                    course.status === "APPROVED") &&
                                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                  course.status === "REJECTED" &&
                                    "bg-red-500/10 text-red-400 border-red-500/20",
                                  course.status === "DRAFT" &&
                                    "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                )}
                              >
                                {course.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                {course.status === "PENDING" ||
                                course.status === "PENDING_APPROVAL" ||
                                course.status === "DRAFT" ? (
                                  <button
                                    className="px-3 py-1.5 bg-[#005461] hover:bg-[#00434d] text-white text-xs font-bold rounded-lg transition-colors"
                                    onClick={() => handleReviewCourse(course)}
                                  >
                                    Review
                                  </button>
                                ) : (
                                  <button
                                    className="px-3 py-1.5 bg-[#3f3f46] hover:bg-[#52525b] border border-[#52525b] text-zinc-300 text-xs font-medium rounded-lg transition-colors"
                                    onClick={() => handleReviewCourse(course)}
                                  >
                                    View details
                                  </button>
                                )}

                                <button
                                  className="h-8 w-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors disabled:opacity-40"
                                  onClick={() =>
                                    handleDeleteCourse(course.id, course.title)
                                  }
                                  disabled={deleteCourseMutation.isPending}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-[#3f3f46]">
                  <span className="text-xs text-zinc-500 font-medium">
                    Page {coursesPage}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-[#3f3f46] hover:bg-[#52525b] border border-[#52525b] text-zinc-300 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => setCoursesPage((p) => Math.max(1, p - 1))}
                      disabled={coursesPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-1.5 bg-[#3f3f46] hover:bg-[#52525b] border border-[#52525b] text-zinc-300 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => setCoursesPage((p) => p + 1)}
                      disabled={!allCourses || allCourses.length < pageSize}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Analytics ── */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {analyticsLoading ? (
                <div className="py-12 text-center text-zinc-500">
                  <Clock className="w-8 h-8 text-zinc-600 animate-spin mx-auto mb-4" />
                  Loading analytics...
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-semibold">Total courses</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {analyticsData?.totalCourses || 0}
                      </div>
                      <div className="text-zinc-500 text-xs font-medium">
                        on the platform
                      </div>
                    </div>

                    <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm font-semibold">Total progress</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {analyticsData?.totalProgress || 0}
                      </div>
                      <div className="text-zinc-500 text-xs font-medium">
                        completions logged
                      </div>
                    </div>

                    <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-semibold">Total enrollments</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {analyticsData?.totalEnrollments || 0}
                      </div>
                      <div className="text-zinc-500 text-xs font-medium">
                        across all courses
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6">
                      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-4 bg-[#3BC1A8] rounded-full"></span>
                        Overview distribution
                      </h3>
                      <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#3f3f46"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#71717a",
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#71717a", fontSize: 12 }}
                            />
                            <RechartsTooltip
                              cursor={{ fill: "rgba(255,255,255,0.03)" }}
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #3f3f46",
                                backgroundColor: "#27272a",
                                color: "#fff",
                                padding: "12px",
                              }}
                            />
                            <Bar
                              dataKey="value"
                              fill="#3BC1A8"
                              radius={[6, 6, 0, 0]}
                              barSize={50}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6">
                      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
                        Platform trends
                      </h3>
                      <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#3f3f46"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#71717a",
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#71717a", fontSize: 12 }}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #3f3f46",
                                backgroundColor: "#27272a",
                                color: "#fff",
                                padding: "12px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#10b981"
                              strokeWidth={4}
                              dot={{
                                r: 6,
                                fill: "#10b981",
                                strokeWidth: 3,
                                stroke: "#27272a",
                              }}
                              activeDot={{ r: 8, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Transactions ── (unchanged) */}
          {activeTab === "transactions" && (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-semibold">Total revenue</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    All time
                  </div>
                </div>

                <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Completed</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {completedTx}
                  </div>
                  <div className="text-zinc-500 text-xs font-medium">
                    transactions
                  </div>
                </div>

                <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">Pending</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {pendingTx}
                  </div>
                  <div className="text-zinc-500 text-xs font-medium">
                    awaiting confirmation
                  </div>
                </div>

                <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">Unique users</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {uniqueUsers}
                  </div>
                  <div className="text-zinc-500 text-xs font-medium">
                    this period
                  </div>
                </div>
              </div>

              {/* Transactions Table Card */}
              <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#3f3f46] flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    Transaction history
                  </h2>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white text-sm font-semibold rounded-lg transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white text-sm font-semibold rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-zinc-400 uppercase text-xs font-bold border-b border-[#3f3f46]">
                      <tr>
                        <th className="px-6 py-4">ID / REF</th>
                        <th className="px-6 py-4">USER ID</th>
                        <th className="px-6 py-4">AMOUNT</th>
                        <th className="px-6 py-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3f3f46]">
                      {allTransactionsLoading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-zinc-500"
                          >
                            <Clock className="w-8 h-8 text-zinc-600 animate-spin mx-auto mb-4" />
                            Loading transactions...
                          </td>
                        </tr>
                      ) : !paidTransactions || paidTransactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-zinc-500"
                          >
                            No transactions found.
                          </td>
                        </tr>
                      ) : (
                        paidTransactions.map((tx: any) => (
                          <tr
                            key={tx.id}
                            className="hover:bg-[#3f3f46]/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">
                                  #{tx.id}
                                </span>
                                <span className="text-xs text-zinc-400 font-mono mt-1">
                                  {tx.reference || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className="text-zinc-300 font-mono text-sm"
                                title={tx.userId}
                              >
                                {tx.userId?.substring(0, 16)}...
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-bold text-white text-sm">
                                ${tx.amount}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="relative inline-block text-left">
                                <select
                                  value={tx.status}
                                  onChange={(e) => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to change transaction #${tx.id} status to ${e.target.value}?`,
                                      )
                                    ) {
                                      updateTransactionMutation.mutate({
                                        id: tx.id,
                                        status: e.target.value as any,
                                      });
                                    }
                                  }}
                                  disabled={updateTransactionMutation.isPending}
                                  className={cn(
                                    "appearance-none bg-transparent text-sm font-bold pl-3 pr-8 py-1.5 rounded-full border transition-colors cursor-pointer outline-none",
                                    tx.status === "PENDING" &&
                                      "text-amber-500 border-amber-500/30 hover:border-amber-500/50",
                                    tx.status === "COMPLETED" &&
                                      "text-emerald-500 border-emerald-500/30 hover:border-emerald-500/50",
                                    tx.status === "FAILED" &&
                                      "text-red-500 border-red-500/30 hover:border-red-500/50",
                                  )}
                                >
                                  <option
                                    className="bg-[#27272a] text-amber-500"
                                    value="PENDING"
                                  >
                                    PENDING
                                  </option>
                                  <option
                                    className="bg-[#27272a] text-emerald-500"
                                    value="COMPLETED"
                                  >
                                    COMPLETED
                                  </option>
                                  <option
                                    className="bg-[#27272a] text-red-500"
                                    value="FAILED"
                                  >
                                    FAILED
                                  </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                  <ArrowDown className="w-3 h-3 text-zinc-400" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {selectedApp && (
          <ReviewApplicationModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onApprove={onApprove}
            onReject={onReject}
            isProcessing={approveMutation.isPending || rejectMutation.isPending}
          />
        )}

        {selectedCourse && (
          <ReviewCourseModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onApprove={onApproveCourse}
            onReject={onRejectCourse}
            isProcessing={
              approveCourseMutation.isPending || rejectCourseMutation.isPending
            }
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
