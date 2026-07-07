import { useState } from "react";
import { Award, CheckCircle2, MoreHorizontal, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StudentLayout from "@/features/student/components/StudentLayout";
import {
  useEnrollments,
  useStudentDashboard,
  useStudentAnalytics,
  useMyTransactions,
} from "@/hooks/useAcademy";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = ["In Progress", "Completed", "Saved"];

const LmsMyLearning = () => {
  const [activeTab, setActiveTab] = useState("In Progress");
  const { data: enrollments, isLoading: isEnrollmentsLoading } =
    useEnrollments();
  const { data: myTransactions } = useMyTransactions();
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useStudentAnalytics();
  const { data: dashboard, isLoading: isDashboardLoading } =
    useStudentDashboard();

  const isLoading =
    isEnrollmentsLoading || isAnalyticsLoading || isDashboardLoading;

  // Cross-check: courses with COMPLETED transactions count as enrolled even if enrollment is still PENDING
  const completedTxCourseIds = new Set(
    myTransactions
      ?.filter((tx: any) => tx.status === "COMPLETED")
      .map((tx: any) => (tx.metadata as any)?.courseId)
      .filter(Boolean) || [],
  );

  const filteredEnrollments = enrollments?.filter((enrollment) => {
    const hasCompletedTx = completedTxCourseIds.has(
      enrollment.courseId ?? enrollment.course?.id,
    );
    if (activeTab === "In Progress")
      return enrollment.status === "ACTIVE" || hasCompletedTx;
    if (activeTab === "Completed") return enrollment.status === "COMPLETED";
    return false;
  });

  const totalLessonsAll =
    enrollments?.reduce((acc, e) => acc + (e.course?.lessonsCount || 0), 0) ||
    1;
  const calculatedProgress = analytics
    ? Math.min(
        Math.round((analytics.lessonsViewed / totalLessonsAll) * 100),
        100,
      )
    : 0;

  let sumPercentage = 0;
  if (dashboard && Array.isArray(dashboard) && dashboard.length > 0) {
    const validProgresses = dashboard.filter(
      (d: any) => typeof d.percentage === "number",
    );
    if (validProgresses.length > 0) {
      sumPercentage = validProgresses.reduce(
        (sum: number, d: any) => sum + d.percentage,
        0,
      );
      sumPercentage = Math.round(sumPercentage / validProgresses.length);
    }
  }

  const overallProgress =
    dashboard && Array.isArray(dashboard) && dashboard.length > 0
      ? sumPercentage
      : calculatedProgress || 0;

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Header - Overall Progress */}
        <div className="mb-8 border rounded-lg p-6 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Overall Progress
            </h2>
            <p className="text-sm text-muted-foreground">
              Average completion across all courses
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600 font-medium">
                Learning Progress
              </span>
              <span className="font-bold text-slate-900">
                {overallProgress}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2.5 bg-slate-100" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        )}

        {!isLoading && filteredEnrollments?.length === 0 && (
          <div className="text-center py-16 border rounded-xl bg-slate-50">
            <p className="text-muted-foreground mb-4">
              {activeTab === "In Progress" &&
                "You don't have any active courses yet."}
              {activeTab === "Completed" &&
                "You haven't completed any courses yet."}
              {activeTab === "Saved" && "You haven't saved any courses yet."}
            </p>
            <Button asChild variant="outline">
              <Link to="/explore">Browse Courses</Link>
            </Button>
          </div>
        )}

        {!isLoading &&
          filteredEnrollments &&
          filteredEnrollments.length > 0 && (
            <div className="space-y-1 border rounded-lg overflow-hidden">
              {filteredEnrollments.map((enrollment, index) => {
                const pData =
                  dashboard && Array.isArray(dashboard)
                    ? dashboard.find(
                        (d) => d.courseId === Number(enrollment.courseId),
                      )
                    : null;

                const currentProgress = Math.round(
                  pData?.percentage || enrollment.progress || 0,
                );
                const isCompleted = enrollment.status === "COMPLETED";

                return (
                  <div
                    key={enrollment.id}
                    className={`p-4 bg-white flex flex-col gap-3 ${
                      index !== filteredEnrollments.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 mt-1" /> // Spacer for alignment
                        )}

                        <div>
                          <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">
                            {enrollment.course?.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Course {index + 1} of {filteredEnrollments.length} •{" "}
                            {isCompleted ? "Complete" : "In Progress"}
                          </p>

                          <div className="flex items-center gap-4 mt-2">
                            {isCompleted ? (
                              <button className="text-[13px] font-medium text-blue-700 hover:underline">
                                View certificate
                              </button>
                            ) : (
                              <Link
                                to={`/courses/${enrollment.courseId}`}
                                className="text-[13px] font-medium text-blue-700 hover:underline"
                              >
                                View details
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Progress Section - Shows only for active courses */}
                    {!isCompleted && (
                      <div className="pl-8 pr-2 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                              {enrollment.course?.instructor?.profilePicture ? (
                                <img
                                  src={
                                    enrollment.course.instructor.profilePicture
                                  }
                                  alt="Instructor"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-[10px] font-bold">
                                  {enrollment.course?.instructor
                                    ?.firstname?.[0] || "I"}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {enrollment.course?.instructor?.firstname}{" "}
                              {enrollment.course?.instructor?.lastname}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Instructor
                            </span>
                          </div>
                          <Button
                            size="sm"
                            asChild
                            className="bg-blue-600 hover:bg-blue-700 px-6 rounded-md"
                          >
                            <Link to={`/learn/${enrollment.courseId}`}>
                              Resume
                            </Link>
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <Progress
                            value={currentProgress}
                            className="h-1.5 bg-slate-100"
                          />
                          <p className="text-[11px] text-muted-foreground">
                            {currentProgress}% complete • Estimated completion:
                            Apr 8, 2026
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        {/* Footer Credit - Coursera Style */}
        <div className="mt-8 p-4 bg-blue-50/50 rounded-lg flex items-center gap-3 border border-blue-100">
          <Award className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-slate-700">
            Earn a career certificate and{" "}
            <span className="text-blue-700 font-medium underline cursor-pointer">
              build toward a degree
            </span>
          </p>
        </div>
      </div>
    </StudentLayout>
  );
};

export default LmsMyLearning;
