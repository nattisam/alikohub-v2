import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Users, BookOpen, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTeacherApplications,
  useApproveTeacher,
  useRejectTeacher,
  useAdminCourses,
  useApproveCourse,
  useRejectCourse,
  useAdminAnalytics,
} from "@/hooks/useAcademy";
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
import { TeacherApplication, Course } from "@/types/academy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/admin/applications") return "applications";
    if (path === "/admin/analytics") return "analytics";
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

  const { data: analyticsData, isLoading: analyticsLoading } =
    useAdminAnalytics();

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={
            activeTab === "courses"
              ? "Course Reviews"
              : activeTab === "applications"
                ? "Teacher Applications"
                : "Platform Analytics"
          }
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === "applications" && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Applied For</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appsLoading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Clock className="w-8 h-8 text-slate-300 animate-pulse" />
                              Loading applications...
                            </div>
                          </td>
                        </tr>
                      ) : !allApplications || allApplications.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            No applications found.
                          </td>
                        </tr>
                      ) : (
                        allApplications.map((app: any) => (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shadow-sm border border-white">
                                  {app.user?.firstname?.[0] ?? ""}
                                  {app.user?.lastname?.[0] ?? ""}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900 text-sm">
                                    {app.user?.firstname ?? ""}{" "}
                                    {app.user?.lastname ?? ""}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    ID: {String(app.id).substring(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                              {app.user?.email ?? ""}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                Instructor
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={cn(
                                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                                  (app.status === "PENDING" ||
                                    app.status === "SUBMITTED") &&
                                    "bg-amber-50 text-amber-600 border-amber-100",
                                  (app.status === "ACCEPTED" ||
                                    app.status === "APPROVED") &&
                                    "bg-emerald-50 text-emerald-600 border-emerald-100",
                                  app.status === "REJECTED" &&
                                    "bg-red-50 text-red-600 border-red-100",
                                )}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {app.status === "PENDING" ||
                              app.status === "SUBMITTED" ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs bg-[#005461] hover:bg-[#00434d] shadow-sm font-bold"
                                  onClick={() => handleReview(app)}
                                >
                                  Review
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs text-slate-600 hover:bg-slate-50 font-medium"
                                  onClick={() => handleReview(app)}
                                >
                                  View Details
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">
                    Page {appsPage}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold"
                      onClick={() => setAppsPage((p) => Math.max(1, p - 1))}
                      disabled={appsPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold"
                      onClick={() => setAppsPage((p) => p + 1)}
                      disabled={
                        !allApplications || allApplications.length < pageSize
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "courses" && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Instructor</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Students</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coursesLoading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <BookOpen className="w-8 h-8 text-slate-300 animate-pulse" />
                              Loading courses...
                            </div>
                          </td>
                        </tr>
                      ) : !allCourses || allCourses.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="font-medium">
                              No courses found in the system.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        allCourses.map((course: any) => (
                          <tr
                            key={course.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm border border-slate-200 group-hover:border-[#3BC1A8] transition-colors">
                                  {course.thumbnail ? (
                                    <img
                                      src={course.thumbnail}
                                      alt={course.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <BookOpen className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className="font-bold text-slate-900 text-sm max-w-[200px] truncate"
                                    title={course.title}
                                  >
                                    {course.title}
                                  </span>
                                  <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                    {course.shortDescription ||
                                      "No description"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-semibold">
                              {course.instructor
                                ? `${course.instructor.firstname} ${course.instructor.lastname}`
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase">
                                {course.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-bold">
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
                                    "bg-amber-50 text-amber-600 border-amber-100",
                                  (course.status === "PUBLISHED" ||
                                    course.status === "APPROVED") &&
                                    "bg-emerald-50 text-emerald-600 border-emerald-100",
                                  course.status === "REJECTED" &&
                                    "bg-red-50 text-red-600 border-red-100",
                                  course.status === "DRAFT" &&
                                    "bg-blue-50 text-blue-600 border-blue-100",
                                )}
                              >
                                {course.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {course.status === "PENDING" ||
                              course.status === "PENDING_APPROVAL" ||
                              course.status === "DRAFT" ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs bg-[#005461] hover:bg-[#00434d] shadow-sm font-bold"
                                  onClick={() => handleReviewCourse(course)}
                                >
                                  Review
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs text-slate-600 hover:bg-slate-50 font-medium"
                                  onClick={() => handleReviewCourse(course)}
                                >
                                  View Details
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">
                    Page {coursesPage}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold"
                      onClick={() => setCoursesPage((p) => Math.max(1, p - 1))}
                      disabled={coursesPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold"
                      onClick={() => setCoursesPage((p) => p + 1)}
                      disabled={!allCourses || allCourses.length < pageSize}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                {analyticsLoading ? (
                  <div className="py-12 text-center text-slate-500">
                    <Clock className="w-8 h-8 text-slate-300 animate-spin mx-auto mb-4" />
                    Loading analytics...
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Summary Cards - Specific to Analytics Tab */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Total Courses
                        </span>
                        <span className="text-2xl font-black text-slate-900">
                          {analyticsData?.totalCourses || 0}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Total Progress
                        </span>
                        <span className="text-2xl font-black text-slate-900">
                          {analyticsData?.totalProgress || 0}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Total Enrollments
                        </span>
                        <span className="text-2xl font-black text-slate-900">
                          {analyticsData?.totalEnrollments || 0}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="h-[400px]">
                        <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                          <span className="w-2 h-4 bg-[#3BC1A8] rounded-full"></span>
                          Overview Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#64748b",
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#64748b", fontSize: 12 }}
                            />
                            <RechartsTooltip
                              cursor={{ fill: "rgba(0,0,0,0.02)" }}
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
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

                      <div className="h-[400px]">
                        <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                          <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
                          Platform Trends
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#64748b",
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#64748b", fontSize: 12 }}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
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
                                stroke: "#fff",
                              }}
                              activeDot={{ r: 8, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
