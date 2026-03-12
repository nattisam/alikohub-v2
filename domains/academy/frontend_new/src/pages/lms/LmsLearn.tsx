import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCourseDetails,
  useMarkLessonComplete,
  useEnrollments,
  useStudentAnalytics,
  useStudentDashboard,
  useSubmitExercise,
} from "@/hooks/useAcademy";
import LmsNavbar from "@/components/LmsNavbar";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  PlayCircle,
  Lock,
  Menu,
  X,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const LmsLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetails(id || "");
  const { data: enrollments } = useEnrollments();
  const { data: analytics } = useStudentAnalytics();
  const markCompleteMutation = useMarkLessonComplete();
  const submitExerciseMutation = useSubmitExercise();

  const { data: dashboardData } = useStudentDashboard();

  const enrollment = enrollments?.find((e) => e.courseId === id);

  // Find progress from dashboard data
  const courseProgressData = dashboardData?.find(
    (d: any) => d.courseId === Number(id),
  );

  const progress = courseProgressData?.percentage || enrollment?.progress || 0;

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<
    "overview" | "materials" | "quizzes"
  >("overview");
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  // Auto-select first lesson on load
  useEffect(() => {
    if (course && course.modules?.[0]?.lessons?.[0] && !activeLessonId) {
      setActiveLessonId(course.modules[0].lessons[0].id);
    }
  }, [course, activeLessonId]);

  // Reset view mode when lesson changes
  useEffect(() => {
    setViewMode("overview");
  }, [activeLessonId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LmsNavbar />
        <div className="flex h-[calc(100vh-64px)]">
          <div className="w-80 bg-white border-r hidden md:block p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2">
          Course not found
        </h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          We couldn't find the course you're looking for. It might have been
          removed or you don't have access.
        </p>
        <Button
          onClick={() => navigate("/lms/my-learning")}
          className="rounded-xl"
        >
          Return to My Learning
        </Button>
      </div>
    );
  }

  // Find active data
  const flatLessons = course.modules?.flatMap((m) => m.lessons || []) || [];
  const currentLessonIndex = flatLessons.findIndex(
    (l) => l.id === activeLessonId,
  );
  const activeLesson = flatLessons[currentLessonIndex];

  // Handlers
  const handleNext = () => {
    if (currentLessonIndex < flatLessons.length - 1) {
      setActiveLessonId(flatLessons[currentLessonIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(flatLessons[currentLessonIndex - 1].id);
    }
  };

  const handleMarkComplete = () => {
    if (activeLessonId) {
      markCompleteMutation.mutate(
        {
          courseId: course.id,
          lessonId: activeLessonId,
        },
        {
          onSuccess: () => {
            toast.success("Lesson marked as complete!");
            handleNext();
          },
        },
      );
    }
  };

  const handleOptionSelect = (exerciseId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: option }));
  };

  const handleExerciseSubmit = (exerciseId: string) => {
    const answer = selectedAnswers[exerciseId];
    if (!answer) {
      toast.error("Please select an answer first.");
      return;
    }
    submitExerciseMutation.mutate({ exerciseId, answer });
  };

  const isYouTube = (url?: string) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    try {
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v") || "";
      }
    } catch (e) {
      console.error(e);
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const renderActiveContent = () => {
    if (viewMode === "quizzes") {
      return (
        <div className="mt-8 max-w-4xl mx-auto space-y-12 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Lesson Assessments
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={() => setViewMode("overview")}
              className="rounded-xl border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Back to Overview
            </Button>
          </div>

          {activeLesson?.exercises?.map((exercise, eIdx) => (
            <div
              key={exercise.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 leading-tight">
                    {eIdx + 1}. {exercise.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                      {exercise.points} Points
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      • {exercise.type?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-100/50 mb-8 shadow-inner">
                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                  {exercise.question}
                </p>
              </div>

              <div className="space-y-4">
                {exercise.options?.map((option, idx) => {
                  const isSelected = selectedAnswers[exercise.id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(exercise.id, option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/50 shadow-sm"
                          : "border-slate-100 hover:border-amber-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors ${
                          isSelected
                            ? "bg-amber-500 text-white"
                            : "bg-white border border-slate-200 text-slate-400 group-hover:border-amber-300 group-hover:text-amber-500"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected
                            ? "text-amber-900"
                            : "text-slate-600 group-hover:text-slate-900"
                        }`}
                      >
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={() => handleExerciseSubmit(exercise.id)}
                  disabled={submitExerciseMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                >
                  {submitExerciseMutation.isPending
                    ? "Submitting..."
                    : `Submit Question ${eIdx + 1}`}
                </Button>
              </div>
            </div>
          ))}

          {!activeLesson?.exercises?.length && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium pb-2 text-lg">
                No assessments found for this lesson.
              </p>
              <p className="text-slate-400 text-sm">
                Once exercises are added, they will appear here.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (viewMode === "materials") {
      return (
        <div className="mt-8 max-w-4xl mx-auto space-y-12 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Learning Materials
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={() => setViewMode("overview")}
              className="rounded-xl border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Back to Overview
            </Button>
          </div>

          {activeLesson?.contents?.map((content, cIdx) => (
            <div
              key={content.id}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-inner">
                    {cIdx + 1}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900">
                    {content.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-slate-50/50">
                {content.type === "VIDEO" ? (
                  <div className="w-full rounded-2xl overflow-hidden bg-black shadow-2xl relative border border-slate-200/50">
                    {isYouTube(content.url) ? (
                      <div className="aspect-video w-full">
                        <iframe
                          className="w-full h-full border-0"
                          src={getYouTubeEmbedUrl(content.url || "")}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="aspect-video w-full">
                        <video
                          src={content.url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="p-5 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-full w-fit mx-auto mb-6 shadow-inner">
                      <FileText className="w-10 h-10" />
                    </div>
                    <h4 className="text-slate-800 font-bold text-xl mb-2">
                      Resource Document
                    </h4>
                    <p className="text-slate-500 mb-8 font-medium max-w-md">
                      This material is ready for download or direct viewing.
                      Click below to access.
                    </p>
                    <Button
                      asChild
                      className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-10 h-12 rounded-xl shadow-lg shadow-slate-900/10 transition-transform active:scale-95"
                    >
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open {content.type} Resource
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {!activeLesson?.contents?.length && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium pb-2 text-lg">
                No materials found for this lesson.
              </p>
              <p className="text-slate-400 text-sm">
                Materials will appear here once the instructor uploads them.
              </p>
            </div>
          )}
        </div>
      );
    }

    // Default: Lesson Overview
    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-10 md:p-14 border border-slate-100 shadow-sm text-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />

          <div className="relative z-10">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg ${
                activeLesson?.type === "VIDEO"
                  ? "bg-blue-500 text-white shadow-blue-100"
                  : "bg-emerald-500 text-white shadow-emerald-100"
              }`}
            >
              {activeLesson?.type === "VIDEO" ? (
                <Video className="w-8 h-8" />
              ) : (
                <FileText className="w-8 h-8" />
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 tracking-tight">
              {activeLesson?.title}
            </h1>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10">
              Welcome to this lesson! Explore the materials and complete the
              assessments to master this topic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
              <div
                onClick={() => setViewMode("materials")}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Learning Materials
                  </p>
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
                <div className="space-y-3">
                  {activeLesson?.contents?.slice(0, 3).map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-white flex items-center justify-center border border-slate-100">
                        <PlayCircle className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 truncate">
                        {c.title}
                      </span>
                    </div>
                  ))}
                  {(activeLesson?.contents?.length || 0) > 3 && (
                    <p className="text-[10px] font-bold text-accent">
                      + {activeLesson!.contents!.length - 3} more items
                    </p>
                  )}
                  {!activeLesson?.contents?.length && (
                    <p className="text-xs text-slate-400 font-medium italic">
                      No materials yet
                    </p>
                  )}
                </div>
              </div>

              <div
                onClick={() => setViewMode("quizzes")}
                className="p-6 rounded-2xl bg-amber-50/30 border border-amber-100/50 hover:border-amber-300 hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">
                    Assessments
                  </p>
                  <ChevronRight className="w-3 h-3 text-amber-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="space-y-3">
                  {activeLesson?.exercises?.slice(0, 3).map((e) => (
                    <div key={e.id} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-white flex items-center justify-center border border-amber-100">
                        <HelpCircle className="w-3 h-3 text-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 truncate">
                        {e.title}
                      </span>
                    </div>
                  ))}
                  {(activeLesson?.exercises?.length || 0) > 3 && (
                    <p className="text-[10px] font-bold text-amber-600">
                      + {activeLesson!.exercises!.length - 3} more quizzes
                    </p>
                  )}
                  {!activeLesson?.exercises?.length && (
                    <p className="text-xs text-slate-400 font-medium italic">
                      No quizzes yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-900 flex items-center justify-between px-4 md:px-8 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/lms/my-learning")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-bold hidden sm:inline">
              Back to Dashboard
            </span>
          </button>
          <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />
          <h1 className="text-white font-bold text-sm md:text-base truncate max-w-[200px] md:max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8 flex-1 justify-center px-20">
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
              <span>Course Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-1 bg-white/10"
              indicatorClassName="bg-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="bg-accent hover:bg-amber-light text-slate-900 font-bold rounded-xl h-10 px-6 sm:px-8 shadow-lg shadow-accent/20"
            onClick={handleMarkComplete}
            disabled={markCompleteMutation.isPending}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Mark as Complete</span>
            <span className="sm:hidden text-xs">Complete</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`
          fixed md:relative z-30 w-80 bg-white border-r border-slate-100 flex flex-col h-[calc(100vh-64px)] transition-all duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:w-0 md:opacity-0 md:invisible"}
        `}
        >
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-heading font-bold text-slate-900 uppercase tracking-widest">
              Course Curriculum
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-400"
            >
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
            {course.modules?.map((module, mIdx) => (
              <div key={module.id} className="space-y-2">
                <div className="px-3 flex items-center justify-between group">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {mIdx + 1}
                    </span>
                    {module.title}
                  </h3>
                </div>

                <div className="space-y-1">
                  {module.lessons?.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    const isCompleted = false; // We use total progress tracking now

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-xl transition-all text-left
                          ${
                            isActive
                              ? "bg-slate-800 text-white shadow-md translate-x-1"
                              : "text-slate-600 hover:bg-slate-50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl border ${
                              isActive
                                ? "bg-white/10 border-white/10"
                                : isCompleted
                                  ? "bg-emerald-50 border-emerald-100"
                                  : "bg-white border-slate-100 shadow-xs"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            ) : lesson.type === "VIDEO" ? (
                              <Video className="w-3.5 h-3.5" />
                            ) : (
                              <FileText className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold leading-tight mb-0.5">
                              {lesson.title}
                            </p>
                            <p
                              className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? "text-white/40" : "text-slate-400"}`}
                            >
                              {lesson.type || "LESSON"}
                            </p>
                          </div>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-12 relative flex flex-col items-center">
          {/* Navigation Overlays */}
          <div className="max-w-[1200px] w-full flex-1">
            {renderActiveContent()}
          </div>

          <div className="mt-auto pt-8 flex items-center gap-4 w-full max-w-4xl justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentLessonIndex === 0}
              className="rounded-xl h-11 px-6 font-bold border border-transparent hover:border-slate-200"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </Button>
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={currentLessonIndex === flatLessons.length - 1}
              className="rounded-xl h-11 px-6 font-bold border border-transparent hover:border-slate-200"
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LmsLearn;
