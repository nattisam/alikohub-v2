import React from "react";
import InstructorNavbar from "@/components/InstructorNavbar";
import {
  Users,
  BookOpen,
  PlusCircle,
  FileText,
  PlayCircle,
  BellRing,
  Star,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstructorStats, useInstructorCourses } from "@/hooks/useAcademy";
import { Link } from "react-router-dom";

const InstructorDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useInstructorStats();
  const { data: coursesData, isLoading: coursesLoading } = useInstructorCourses(
    { pageSize: 3 },
  );

  const instructorStats =
    (stats as any)?.stats || (stats as any)?.data || stats;

  const statCards = [
    {
      label: "Total Students",
      value: instructorStats?.totalStudents || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "All Courses",
      value: instructorStats?.totalCourses || 0,
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg Rating",
      value: instructorStats?.averageRating?.toFixed(1) || "0.0",
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Experience",
      value: `${instructorStats?.yearsOfExperience || 0} Years`,
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <InstructorNavbar />

      {/* Header Section */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="section-container py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-white">
                Instructor Console
              </h1>
              <p className="mt-2 text-slate-400 max-w-2xl">
                Manage your curriculum, track student progress, and analyze your
                performance all in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
              >
                <Link to="/instructor/lms/analytics">View Analytics</Link>
              </Button>
              <Button
                asChild
                className="gap-2 bg-accent hover:bg-amber-light text-slate-900"
              >
                <Link to="/instructor/lms/courses/new">
                  <PlusCircle className="w-4 h-4" /> Create New Course
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="section-container py-8 md:py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl border border-border shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-slate-900">
                Your Recent Courses
              </h2>
              <Link
                to="/instructor/lms/courses"
                className="text-sm font-medium text-accent hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {coursesLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 rounded-lg" />
                  ))}
                </div>
              ) : !coursesData?.courses || coursesData.courses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">
                    No courses yet
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Start your journey as an instructor by creating your first
                    course.
                  </p>
                  <Button asChild>
                    <Link to="/instructor/lms/courses/new">Create Course</Link>
                  </Button>
                </div>
              ) : (
                coursesData?.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex gap-4">
                      <div className="w-32 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayCircle className="w-8 h-8 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              course.status === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-600"
                                : course.status === "PENDING"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {course.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            • {course.enrolledCount || 0} students
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-accent transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <BookOpen className="w-3.5 h-3.5" />{" "}
                            {course.modulesCount || 0} Modules
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Users className="w-3.5 h-3.5" />{" "}
                            {course.enrolledCount || 0} Enrolled
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/instructor/lms/courses/${course.id}`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Tasks / Notifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Quick Actions
            </h2>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Create Cohort
                    </p>
                    <p className="text-xs text-slate-500">
                      Schedule a new student group
                    </p>
                  </div>
                </button>
                <Link
                  to="/instructor/lms/submissions"
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="p-2 rounded-lg bg-pink-50 text-pink-600 transition-colors group-hover:bg-pink-600 group-hover:text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Grade Submissions
                    </p>
                    <p className="text-xs text-slate-500">
                      View all student work
                    </p>
                  </div>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Send Announcement
                    </p>
                    <p className="text-xs text-slate-500">
                      Notify all your students
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="font-heading font-bold mb-2">Need help?</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Check our instructor guide to learn how to create engaging
                  courses.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-slate-700 bg-transparent hover:bg-slate-800 text-white"
                >
                  View Documentation
                </Button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
