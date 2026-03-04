import { ArrowRight, BookOpen, Clock, Award, TrendingUp, Calendar, Video, Radio, PlayCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LmsNavbar from "@/components/LmsNavbar";

const activeCourses = [
  {
    title: "Introduction to Cloud Computing",
    stream: "Tech",
    streamClass: "stream-tech",
    progress: 68,
    nextLesson: "Module 5: Cloud Deployment",
  },
  {
    title: "Health Data Analytics Foundations",
    stream: "Health",
    streamClass: "stream-health",
    progress: 34,
    nextLesson: "Module 3: Data Visualization",
  },
  {
    title: "AutoCAD for Civil Engineering",
    stream: "STEM",
    streamClass: "stream-stem",
    progress: 85,
    nextLesson: "Module 8: Final Project",
  },
];

const upcomingWebinars = [
  { title: "AI in Healthcare: Trends & Opportunities", date: "Mar 5, 2026", time: "2:00 PM", speaker: "Dr. Amina Yusuf", status: "upcoming" as const },
  { title: "Cloud Career Pathways for Beginners", date: "Mar 8, 2026", time: "10:00 AM", speaker: "Eng. Farouk Ali", status: "live" as const },
  { title: "STEM Innovation & Entrepreneurship", date: "Mar 10, 2026", time: "3:00 PM", speaker: "Prof. Halima Bello", status: "upcoming" as const },
];

const recordedWebinars = [
  { title: "Getting Started with Data Science", duration: "1h 20m", views: 342 },
  { title: "Resume Building for Tech Careers", duration: "45m", views: 518 },
  { title: "Introduction to Biomedical Engineering", duration: "1h 05m", views: 276 },
];

const LmsDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />

      {/* Dashboard Header */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 border-b">
        <div className="section-container py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
                Welcome back, Learner
              </h1>
              <p className="mt-1 text-white/70">
                You are enrolled in: <span className="font-medium text-white">Aliko Academy Tech</span>
              </p>
              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/60">Overall Progress</span>
                  <span className="font-semibold text-white">68%</span>
                </div>
                <Progress value={68} className="h-2.5" />
              </div>
              <p className="mt-3 text-sm text-white/60">
                Next Milestone: <span className="font-medium text-white">Complete Module 5, Cloud Deployment</span>
              </p>
            </div>
            <Button size="lg" className="gap-2 self-start bg-white text-slate-900 hover:bg-white/90">
              Continue Learning <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <div className="section-container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">My Active Courses</h2>
            <div className="space-y-4">
              {activeCourses.map((course) => (
                <div key={course.title} className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${course.streamClass}`}>
                          {course.stream}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Next: {course.nextLesson}</p>
                      <div className="mt-3 max-w-xs">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                    <Button size="sm" className="gap-1 self-start">
                      Continue <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4">Learning Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: "Courses Active", value: "3", bg: "bg-blue-50", iconColor: "text-blue-600" },
                  { icon: Award, label: "Completed", value: "2", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
                  { icon: Clock, label: "Hours Learned", value: "47", bg: "bg-amber-50", iconColor: "text-amber-600" },
                  { icon: TrendingUp, label: "Avg Score", value: "82%", bg: "bg-purple-50", iconColor: "text-purple-600" },
                ].map((stat) => (
                  <div key={stat.label} className={`text-center p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor} mx-auto mb-1`} />
                    <p className="text-lg font-heading font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Video className="w-4 h-4 text-accent" /> Webinars
                </h3>
              </div>
              <div className="space-y-3">
                {upcomingWebinars.map((webinar) => (
                  <div key={webinar.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="mt-0.5">
                      {webinar.status === "live" ? (
                        <Radio className="w-4 h-4 text-health" />
                      ) : (
                        <Calendar className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{webinar.title}</p>
                        {webinar.status === "live" && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded stream-health">Live</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{webinar.speaker} · {webinar.date} at {webinar.time}</p>
                    </div>
                    <Button variant={webinar.status === "live" ? "default" : "outline"} size="sm" className="text-xs shrink-0">
                      {webinar.status === "live" ? "Join" : "RSVP"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-accent" /> Recorded Sessions
              </h3>
              <div className="space-y-3">
                {recordedWebinars.map((rec) => (
                  <div key={rec.title} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <PlayCircle className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{rec.title}</p>
                      <p className="text-xs text-muted-foreground">{rec.duration} · {rec.views} views</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LmsDashboard;
