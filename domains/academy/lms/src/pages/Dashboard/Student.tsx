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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LmsNavbar from "@/components/LmsNavbar";
import { useUser } from "@/hooks/useAuth";
import {
  useEnrollments,
  useStudentAnalytics,
  useStudentDashboard,
} from "@/hooks/useAcademy";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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

const StudentDashboard = () => {
  const { data: user } = useUser();
  const { data: enrollments, isLoading: isEnrollmentsLoading } =
    useEnrollments();
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useStudentAnalytics();
  const { data: dashboard, isLoading: isDashboardLoading } =
    useStudentDashboard();

  const isLoading =
    isEnrollmentsLoading || isAnalyticsLoading || isDashboardLoading;

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
    <div className="min-h-screen bg-background">
      <LmsNavbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 border-b">
        <div className="section-container py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
                Welcome back, {user?.firstname || "Learner"}
              </h1>

              <p className="mt-1 text-white/70">
                Continue learning with{" "}
                <span className="font-medium text-white">Aliko Academy</span>
              </p>

              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/60">Overall Progress</span>
                  <span className="font-semibold text-white">
                    {overallProgress}%
                  </span>
                </div>
                <Progress value={overallProgress} className="h-2.5" />
              </div>

              <p className="mt-3 text-sm text-white/60">
                {enrollments?.length || 0} Active Enrollments
              </p>
            </div>

            <Button
              size="lg"
              asChild
              className="gap-2 self-start bg-white text-slate-900 hover:bg-white/90"
            >
              <Link to="/courses">
                Continue Learning <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="section-container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              My Active Courses
            </h2>

            <div className="space-y-4">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-lg" />
                  ))
              ) : enrollments?.length === 0 ? (
                <div className="bg-card rounded-lg border p-5 text-center">
                  <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">
                    You are not enrolled in any courses yet.
                  </p>
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              ) : (
                enrollments?.map((enrollment) => {
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
                      className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted">
                              {enrollment.course?.category || "Course"}
                            </span>
                          </div>

                          <h3 className="font-heading font-semibold text-foreground">
                            {enrollment.course?.title}
                          </h3>

                          <div className="mt-3 max-w-xs">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {currentProgress}%
                              </span>
                            </div>

                            <Progress value={currentProgress} className="h-2" />
                          </div>
                        </div>

                        <Button size="sm" asChild className="gap-1 self-start">
                          <Link to={`/learn/${enrollment.courseId}`}>
                            Continue <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* SUMMARY */}
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Learning Summary
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: BookOpen,
                    label: "Courses Active",
                    value: enrollments?.length || 0,
                    bg: "bg-blue-50",
                    iconColor: "text-blue-600",
                  },
                  {
                    icon: Award,
                    label: "Courses Done",
                    value: analytics?.programsCompleted || 0,
                    bg: "bg-emerald-50",
                    iconColor: "text-emerald-600",
                  },
                  {
                    icon: Clock,
                    label: "Lessons Viewed",
                    value: analytics?.lessonsViewed || 0,
                    bg: "bg-amber-50",
                    iconColor: "text-amber-600",
                  },
                  {
                    icon: TrendingUp,
                    label: "Quizzes Done",
                    value: analytics?.quizzesCompleted || 0,
                    bg: "bg-purple-50",
                    iconColor: "text-purple-600",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`text-center p-3 rounded-lg ${stat.bg}`}
                  >
                    <stat.icon
                      className={`w-5 h-5 ${stat.iconColor} mx-auto mb-1`}
                    />
                    <p className="text-lg font-heading font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WEBINARS */}
            <div className="bg-card rounded-lg border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Video className="w-4 h-4 text-accent" /> Webinars
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
                        <Radio className="w-4 h-4 text-health" />
                      ) : (
                        <Calendar className="w-4 h-4 text-accent" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {webinar.title}
                        </p>

                        {webinar.status === "live" && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded stream-health">
                            Live
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
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

            {/* RECORDED */}
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-accent" /> Recorded Sessions
              </h3>

              <div className="space-y-3">
                {recordedWebinars.map((rec) => (
                  <div
                    key={rec.title}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <PlayCircle className="w-4 h-4 text-accent" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        {rec.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {rec.duration} · {rec.views} views
                      </p>
                    </div>

                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            {/* INSTRUCTOR CTA */}
            {!isInstructor && (
              <div className="bg-slate-900 rounded-lg p-6 text-white text-center shadow-lg shadow-slate-200/20">
                <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="text-lg font-heading font-bold mb-2">
                  {isPending ? "Application Pending" : "Share your Knowledge"}
                </h3>
                <p className="text-white/60 text-xs mb-4 leading-relaxed">
                  {isPending
                    ? "Our team is currently reviewing your instructor profile. We'll be in touch soon!"
                    : "Become an instructor and share your expertise with thousands of students globally."}
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold"
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
    </div>
  );
};

export default StudentDashboard;
