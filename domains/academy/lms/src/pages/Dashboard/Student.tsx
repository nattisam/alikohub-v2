import {
  ArrowRight,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Video,
  Radio,
  PlayCircle,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/hooks/useAuth";
import {
  useEnrollments,
  useStudentAnalytics,
  useStudentDashboard,
  useMyTransactions,
} from "@/hooks/useAcademy";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import StudentLayout from "@/components/StudentLayout";

const upcomingWebinars = [
  {
    title: "AI in Healthcare: Trends & Opportunities",
    date: "Mar 5, 2026",
    time: "2:00 PM",
    speaker: "Dr. Amina Yusuf",
    status: "upcoming" as const,
  },
  {
    title: "Cloud Career Pathways for Beginners",
    date: "Mar 8, 2026",
    time: "10:00 AM",
    speaker: "Eng. Farouk Ali",
    status: "live" as const,
  },
  {
    title: "STEM Innovation & Entrepreneurship",
    date: "Mar 10, 2026",
    time: "3:00 PM",
    speaker: "Prof. Halima Bello",
    status: "upcoming" as const,
  },
];

const recordedWebinars = [
  {
    title: "Getting Started with Data Science",
    duration: "1h 20m",
    views: 342,
  },
  { title: "Resume Building for Tech Careers", duration: "45m", views: 518 },
  {
    title: "Introduction to Biomedical Engineering",
    duration: "1h 05m",
    views: 276,
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const StudentDashboard = () => {
  const { data: user } = useUser();
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

  // Only show enrollments that are ACTIVE, COMPLETED, or have a completed transaction
  const activeEnrollments = enrollments?.filter(
    (e: any) =>
      e.status === "ACTIVE" ||
      e.status === "COMPLETED" ||
      completedTxCourseIds.has(e.courseId ?? e.course?.id),
  );

  const totalLessonsAll =
    activeEnrollments?.reduce((acc, e) => acc + (e.course?.lessonsCount || 0), 0) ||
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

  const completedCount =
    activeEnrollments?.filter((e) => e.status === "COMPLETED").length || 0;

  const instructorStatus = user?.instructorStatus?.toUpperCase();
  const isInstructor =
    user?.globalRole === "ADMIN" ||
    user?.academyUser?.role === "INSTRUCTOR" ||
    instructorStatus === "ACCEPTED" ||
    instructorStatus === "APPROVED" ||
    instructorStatus === "ACTIVE" ||
    user?.roleStatus?.instructor === "ACTIVE" ||
    user?.roleStatus?.instructor?.toUpperCase() === "ACTIVE";

  const isPending =
    user?.hasTeacherApplication ||
    instructorStatus === "PENDING" ||
    user?.roleStatus?.instructor === "pending" ||
    user?.roleStatus?.instructor?.toUpperCase() === "PENDING";

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">
        {/* ── Hero / Welcome Banner ── */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: "#081830",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #7c6ef0 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #4f8ef0 0%, transparent 70%)",
              transform: "translateY(40%)",
            }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="space-y-3">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Welcome back
              </p>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
                {getGreeting()}, {user?.firstname || "Learner"} 👋
              </h1>
              <p className="text-white/80 text-sm">
                Continue learning with{" "}
                <span className="font-semibold text-white">Aliko Academy</span>
              </p>

              {/* Progress bar */}
              <div className="max-w-xs mt-1">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-white/60 font-medium">
                    Overall progress
                  </span>
                  <span className="font-bold text-white">
                    {overallProgress}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${overallProgress}%`,
                      background: "linear-gradient(90deg, #7c6ef0, #a78bfa)",
                    }}
                  />
                </div>
              </div>

              <p className="text-white/60 text-xs">
                {activeEnrollments?.length || 0} active enrollments · {completedCount}{" "}
                completed
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 md:items-end shrink-0">
              <Button
                asChild
                size="sm"
                className="gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm text-sm font-semibold"
              >
                <Link to="/learning">
                  <PlayCircle className="w-4 h-4" />
                  Continue learning
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2 bg-white text-slate-900 hover:bg-white/90 border-0 text-sm font-semibold"
              >
                <Link to="/courses">Browse new courses</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT: Active Courses ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-heading font-bold text-foreground">
                My active courses
              </h2>
              <Link
                to="/learning"
                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                  ))
              ) : activeEnrollments?.length === 0 ? (
                <div className="bg-card rounded-xl border p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    You're not enrolled in any courses yet.
                  </p>
                  <Button asChild size="sm">
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              ) : (
                activeEnrollments?.map((enrollment) => {
                  const pData =
                    dashboard && Array.isArray(dashboard)
                      ? dashboard.find(
                          (d: any) =>
                            d.courseId === Number(enrollment.courseId),
                        )
                      : null;
                  const currentProgress = Math.round(
                    pData?.percentage || enrollment.progress || 0,
                  );

                  return (
                    <div
                      key={enrollment.id}
                      className="bg-card rounded-xl border hover:shadow-md transition-shadow duration-200 p-4 flex gap-4"
                    >
                      {/* Course thumbnail placeholder */}
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0 border border-border overflow-hidden">
                        {enrollment.course?.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-indigo-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Category badge */}
                        {enrollment.course?.category && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                              {enrollment.course.category}
                            </span>
                          </div>
                        )}

                        <h3 className="text-sm font-heading font-semibold text-foreground leading-snug truncate">
                          {enrollment.course?.title}
                        </h3>

                        {/* Progress */}
                        <div className="mt-2 max-w-xs">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-semibold text-foreground">
                              {currentProgress}%
                            </span>
                          </div>
                          <Progress value={currentProgress} className="h-1.5" />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        asChild
                        className="gap-1 self-center shrink-0 text-xs"
                      >
                        <Link to={`/learn/${enrollment.courseId}`}>
                          Continue <ArrowRight className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  );
                })
              )}
            </div>

            {/* ── Webinars ── */}
            <div className="bg-card rounded-xl border p-5 mt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4 text-primary" /> Upcoming Webinars
                </h3>
              </div>
              <div className="space-y-3">
                {upcomingWebinars.map((webinar) => (
                  <div
                    key={webinar.title}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="mt-0.5">
                      {webinar.status === "live" ? (
                        <Radio className="w-4 h-4 text-rose-500" />
                      ) : (
                        <Calendar className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {webinar.title}
                        </p>
                        {webinar.status === "live" && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white shrink-0">
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {webinar.speaker} · {webinar.date} at {webinar.time}
                      </p>
                    </div>
                    <Button
                      variant={
                        webinar.status === "live" ? "default" : "outline"
                      }
                      size="sm"
                      className="text-xs shrink-0"
                    >
                      {webinar.status === "live" ? "Join" : "RSVP"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recorded Sessions ── */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2 text-sm">
                <PlayCircle className="w-4 h-4 text-primary" /> Recorded
                Sessions
              </h3>
              <div className="space-y-3">
                {recordedWebinars.map((rec) => (
                  <div
                    key={rec.title}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                      <PlayCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {rec.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rec.duration} · {rec.views} views
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Summary & CTA ── */}
          <div className="space-y-4">
            {/* Learning Summary */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Learning summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: BookOpen,
                    label: "Courses active",
                    value: activeEnrollments?.length || 0,
                    color: "text-indigo-600",
                    bg: "bg-indigo-50",
                  },
                  {
                    icon: Award,
                    label: "Courses done",
                    value: analytics?.programsCompleted || 0,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: Clock,
                    label: "Lessons viewed",
                    value: analytics?.lessonsViewed || 0,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                  {
                    icon: TrendingUp,
                    label: "Quizzes done",
                    value: analytics?.quizzesCompleted || 0,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col items-center text-center p-3 rounded-xl ${stat.bg}`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-1.5`} />
                    <p className="text-xl font-heading font-bold text-foreground leading-none">
                      {isLoading ? "—" : stat.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Progress card */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-3 text-sm">
                Overall Progress
              </h3>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Completion rate</span>
                <span className="font-bold text-foreground">
                  {overallProgress}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {activeEnrollments?.length || 0} enrollments · {completedCount}{" "}
                completed
              </p>
            </div>

            {/* Instructor CTA */}
            {!isInstructor && (
              <div
                className="rounded-xl p-5 text-white text-center"
                style={{
                  backgroundColor: "#081830",
                }}
              >
                <Sparkles className="w-7 h-7 text-white/80 mx-auto mb-3" />
                <h3 className="text-sm font-heading font-bold mb-1.5">
                  {isPending ? "Application Pending" : "Share your Knowledge"}
                </h3>
                <p className="text-white/60 text-xs mb-4 leading-relaxed">
                  {isPending
                    ? "Our team is reviewing your instructor profile. We'll be in touch soon!"
                    : "Become an instructor and share your expertise with thousands of students globally."}
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold text-xs"
                  size="sm"
                >
                  <Link to="/instructor/apply">
                    {isPending ? "View Application" : "Apply as Instructor"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
