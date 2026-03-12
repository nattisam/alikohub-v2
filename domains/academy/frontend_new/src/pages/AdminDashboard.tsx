import React, { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import {
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
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
  Legend,
} from "recharts";
import ReviewApplicationModal from "@/components/ReviewApplicationModal";
import ReviewCourseModal from "@/components/ReviewCourseModal";
import { TeacherApplication, Course } from "@/types/academy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/admin/courses") return "courses";
    if (path === "/admin/analytics") return "analytics";
    return "applications"; // Default
  };

  const activeTab = getActiveTab();

  const handleTabChange = (value: string) => {
    if (value === "applications") navigate("/admin");
    else if (value === "courses") navigate("/admin/courses");
    else if (value === "analytics") navigate("/admin/analytics");
  };

  const { data: applications, isLoading: appsLoading } =
    useTeacherApplications();
  const approveMutation = useApproveTeacher();
  const rejectMutation = useRejectTeacher();

  const { data: coursesData, isLoading: coursesLoading } = useAdminCourses();
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
    // Note: the backend API for approve currently might not take notes depending on the implementation, but we pass it anyway.
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

  const stats = [
    {
      label: "Total Students",
      value: allCourses.reduce(
        (acc: number, course: any) => acc + (course.enrolledNum || 0),
        0,
      ),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Courses",
      value: allCourses.filter((c: any) => c.status === "PUBLISHED").length,
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Apps",
      value: Array.isArray(applications)
        ? applications.filter((a) => a.status === "PENDING").length
        : (applications as any)?.applications?.filter(
            (a: any) => a.status === "PENDING",
          ).length || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Draft Courses",
      value: allCourses.filter((c: any) => c.status === "DRAFT").length,
      icon: CheckCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />

      <main className="section-container py-8 md:py-12">
        <h1 className="text-xl md:text-2xl font-heading font-bold text-slate-900 mb-8">
          Admin Overview
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="bg-white border p-1 h-auto">
            <TabsTrigger value="applications" className="px-6 py-2">
              Teacher Applications
            </TabsTrigger>
            <TabsTrigger value="courses" className="px-6 py-2">
              Course Reviews
            </TabsTrigger>
            <TabsTrigger value="analytics" className="px-6 py-2">
              Platform Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Applications</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Applicant</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Applied For</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Resume</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {appsLoading ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            Loading applications...
                          </td>
                        </tr>
                      ) : !applications ||
                        (Array.isArray(applications)
                          ? applications.length === 0
                          : (applications as any).applications?.length ===
                            0) ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            No applications found.
                          </td>
                        </tr>
                      ) : (
                        (Array.isArray(applications)
                          ? applications
                          : (applications as any).applications || []
                        ).map((app: any) => (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                                  {app.user?.firstname?.[0] ?? ""}
                                  {app.user?.lastname?.[0] ?? ""}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900 text-sm">
                                    {app.user?.firstname ?? ""}{" "}
                                    {app.user?.lastname ?? ""}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    ID: {String(app.id).substring(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                              {app.user?.email ?? ""}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                                Instructor
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {app.formData?.resumeUrl ? (
                                <a
                                  href={app.formData.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium text-xs flex items-center gap-1"
                                >
                                  View <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 text-xs">
                                  None
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  app.status === "PENDING"
                                    ? "bg-amber-50 text-amber-600"
                                    : app.status === "ACCEPTED"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              {app.status === "PENDING" ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs bg-slate-900 hover:bg-slate-800"
                                  onClick={() => handleReview(app)}
                                >
                                  Review
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs text-slate-600"
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Instructor</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Students</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {coursesLoading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            Loading courses...
                          </td>
                        </tr>
                      ) : !allCourses || allCourses.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-slate-500"
                          >
                            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p>No courses found in the system.</p>
                          </td>
                        </tr>
                      ) : (
                        allCourses.map((course: any) => (
                          <tr
                            key={course.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                                  {course.thumbnail ? (
                                    <img
                                      src={course.thumbnail}
                                      alt={course.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <BookOpen className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className="font-semibold text-slate-900 text-sm max-w-[200px] truncate"
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
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                              {course.instructor
                                ? `${course.instructor.firstname} ${course.instructor.lastname}`
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                              {course.category}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                              {course.enrolledNum || 0}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  course.status === "PENDING"
                                    ? "bg-amber-50 text-amber-600"
                                    : course.status === "PUBLISHED"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : course.status === "REJECTED"
                                        ? "bg-red-50 text-red-600"
                                        : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                {course.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              {course.status === "PENDING" ||
                              course.status === "PENDING_APPROVAL" ||
                              course.status === "DRAFT" ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs bg-slate-900 hover:bg-slate-800"
                                  onClick={() => handleReviewCourse(course)}
                                >
                                  Review
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5 h-8 text-xs text-slate-600"
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                {analyticsLoading ? (
                  <div className="py-12 text-center text-slate-500">
                    Loading analytics...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[300px]">
                      <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">
                        Overview (Bar Chart)
                      </h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis axisLine={false} tickLine={false} />
                          <RechartsTooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="h-[300px]">
                      <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">
                        Trends (Line Graph)
                      </h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis axisLine={false} tickLine={false} />
                          <RechartsTooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{
                              r: 6,
                              fill: "#10b981",
                              strokeWidth: 2,
                              stroke: "#fff",
                            }}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
      </main>
    </div>
  );
};

export default AdminDashboard;
