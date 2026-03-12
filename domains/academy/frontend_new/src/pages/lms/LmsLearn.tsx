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
// import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1].split("?")[0];
      }
    } catch (e) {
      console.error(e);
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  };

  const getFullUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = "https://api.consultancy.alikohub.com";
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanUrl}`;
  };

  const parseOptions = (options: any): string[] => {
    if (Array.isArray(options)) return options;
    if (typeof options === "string") {
      try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return options
          .split(",")
          .map((o: string) => o.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  const renderActiveContent = () => {
    if (viewMode === "quizzes") {
      return (
        <div className="mx-auto w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setViewMode("overview")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 transition-all hover:text-primary group"
          >
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Overview
          </button>

          <div className="rounded-[32px] bg-white p-8 sm:p-12 shadow-card border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />

            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-sm border border-amber-100">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">
                    Knowledge Check
                  </h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Complete all assessments to validate your learning.
                  </p>
                </div>
              </div>

              <div className="space-y-12">
                {activeLesson?.exercises?.map((exercise, eIdx) => {
                  const options = parseOptions(exercise.options);
                  return (
                    <div
                      key={exercise.id}
                      className="relative pt-10 border-t border-slate-100 first:border-0 first:pt-0"
                    >
                      <div className="mb-6">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                          Question {eIdx + 1}
                        </span>
                        <h2 className="mt-4 text-xl font-bold text-slate-900 leading-snug">
                          {exercise.question}
                        </h2>
                      </div>

                      <RadioGroup
                        value={selectedAnswers[exercise.id]}
                        onValueChange={(v) =>
                          handleOptionSelect(exercise.id, v)
                        }
                        className="flex flex-col gap-3"
                      >
                        {options.map((option, idx) => {
                          const isSelected =
                            selectedAnswers[exercise.id] === option;
                          return (
                            <Label
                              key={idx}
                              htmlFor={`q${exercise.id}-o${idx}`}
                              className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition-all duration-300 ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                  : "border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200"
                              }`}
                            >
                              <RadioGroupItem
                                value={option}
                                id={`q${exercise.id}-o${idx}`}
                                className="border-slate-300 data-[state=checked]:border-primary"
                              />
                              <span
                                className={`flex-1 text-base font-semibold ${isSelected ? "text-slate-900" : "text-slate-600"}`}
                              >
                                {option}
                              </span>
                            </Label>
                          );
                        })}
                      </RadioGroup>

                      <div className="mt-8 flex justify-end">
                        <Button
                          onClick={() => handleExerciseSubmit(exercise.id)}
                          disabled={
                            submitExerciseMutation.isPending ||
                            !selectedAnswers[exercise.id]
                          }
                          className="rounded-xl px-8 h-11 bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-200"
                        >
                          {submitExerciseMutation.isPending
                            ? "Submitting..."
                            : "Submit Answer"}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {!activeLesson?.exercises?.length && (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200">
                    <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      No assessments for this lesson
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (viewMode === "materials") {
      return (
        <div className="mx-auto w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setViewMode("overview")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 transition-all hover:text-primary group"
          >
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Overview
          </button>

          <div className="rounded-[32px] bg-white p-8 sm:p-12 shadow-card border border-slate-100">
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                <PlayCircle size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">
                  Learning Materials
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Access all lesson videos and downloadable resources.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {activeLesson?.contents?.map((content, cIdx) => (
                <div
                  key={content.id}
                  className="pt-10 border-t border-slate-100 first:border-0 first:pt-0"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                      Material {cIdx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                      {content.title}
                    </h3>
                  </div>

                  {content.type === "VIDEO" ? (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-slate-200/50">
                      {isYouTube(content.url) ? (
                        <iframe
                          className="w-full h-full border-0"
                          src={getYouTubeEmbedUrl(content.url || "")}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          src={getFullUrl(content.url)}
                          controls
                          controlsList="nodownload"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:border-primary/20 group-hover:text-primary transition-all">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {content.title}
                          </p>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                            {content.type || "Document"} Resource
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="bg-white rounded-xl px-5 h-10 font-bold border-slate-200 hover:border-primary hover:text-primary shadow-sm"
                      >
                        <a
                          href={getFullUrl(content.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resource
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!activeLesson?.contents?.length && (
              <div className="text-center py-20 bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200">
                <Video className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No materials for this lesson
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default: Lesson Overview
    return (
      <div className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="mx-auto w-full max-w-4xl rounded-[40px] bg-white p-10 sm:p-16 shadow-card border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-50 border border-slate-100 shadow-sm rotate-3 group-hover:rotate-0 transition-all">
              <PlayCircle className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
              {activeLesson?.title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
                Lesson {currentLessonIndex + 1}
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                {activeLesson?.type} Content
              </span>
            </div>

            <p className="mt-8 max-w-2xl text-lg text-slate-500 font-medium leading-relaxed">
              Ready to dive in? Explore the rich learning materials and test
              your mastery with interactive assessments designed for this
              lesson.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                Learning Materials
              </h2>

              <div className="flex flex-col gap-4">
                {activeLesson?.contents?.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => setViewMode("materials")}
                    className="flex items-center gap-4 rounded-3xl border border-slate-100 p-5 text-left bg-white shadow-inset hover:bg-slate-50 transition-all hover:shadow-card-hover group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                      <PlayCircle className="w-6 h-6 text-slate-500 group-hover:text-primary transition-colors" />
                    </div>

                    <div>
                      <span className="block text-base font-bold text-slate-800 group-hover:text-primary transition-colors truncate max-w-[180px]">
                        {content.title}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Click to View
                      </span>
                    </div>
                  </button>
                ))}

                {!activeLesson?.contents?.length && (
                  <div className="p-6 rounded-3xl border border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                    <Video className="w-8 h-8 text-slate-200 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                      No materials yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                Assessments
              </h2>

              <div className="flex flex-col gap-4">
                {activeLesson?.exercises?.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => setViewMode("quizzes")}
                    className="flex items-center gap-4 rounded-3xl border border-slate-100 p-5 text-left bg-white shadow-inset hover:bg-slate-50 transition-all hover:shadow-card-hover relative overflow-hidden group"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-amber-400 opacity-50 transition-opacity group-hover:opacity-100" />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 group-hover:bg-white transition-colors border border-transparent group-hover:border-amber-100">
                      <HelpCircle className="w-6 h-6 text-amber-600" />
                    </div>

                    <div>
                      <span className="block text-base font-bold text-slate-800 transition-colors truncate max-w-[180px]">
                        {exercise.title || "Lesson Quiz"}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        Start Assessment
                      </span>
                    </div>
                  </button>
                ))}

                {!activeLesson?.exercises?.length && (
                  <div className="p-6 rounded-3xl border border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                    <HelpCircle className="w-8 h-8 text-slate-200 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                      No quizzes yet
                    </p>
                  </div>
                )}
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-3 items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/lms/my-learning")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>

          {/* Center Title */}
          <div className="text-center text-sm sm:text-base font-semibold text-foreground truncate">
            {course.title}
          </div>

          {/* Right Controls */}
          <div className="flex items-center justify-end gap-4">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-2 w-28 overflow-hidden rounded-full bg-muted lg:w-40">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="text-sm font-medium tabular-nums text-muted-foreground">
                {progress}%
              </span>
            </div>

            {/* Complete Button */}
            <Button
              onClick={handleMarkComplete}
              disabled={markCompleteMutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Mark as Complete</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`
          fixed md:relative z-30 w-80 bg-white border-r border-slate-100 flex flex-col transition-all duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:w-0 md:opacity-0 md:invisible"}
        `}
        >
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Course Curriculum
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-400"
            >
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
            {course.modules?.map((module, mIdx) => (
              <div key={module.id} className="space-y-4">
                <h3 className="flex items-center gap-3 text-sm font-semibold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                    {mIdx + 1}
                  </span>
                  {module.title}
                </h3>

                <ul className="ml-3 flex flex-col gap-1 border-l border-slate-100 pl-5">
                  {module.lessons?.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    return (
                      <li key={lesson.id} className="relative">
                        <button
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            if (window.innerWidth < 768)
                              setIsSidebarOpen(false);
                          }}
                          className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? "text-primary"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span
                            className={`${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}
                          >
                            {lesson.type === "VIDEO" ? (
                              <PlayCircle size={16} />
                            ) : (
                              <FileText size={16} />
                            )}
                          </span>
                          <span className="flex-1 truncate">
                            {lesson.title}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">
                            {lesson.type}
                          </span>
                        </button>
                        {isActive && (
                          <div className="absolute inset-0 -z-10 rounded-md bg-primary/5" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 relative flex flex-col items-center">
          <div className="max-w-6xl w-full flex-1">{renderActiveContent()}</div>

          <div className="mt-8 flex items-center justify-between w-full max-w-4xl border-t border-slate-100 pt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentLessonIndex === 0}
              className="rounded-lg h-10 px-4 text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentLessonIndex === flatLessons.length - 1}
              className="rounded-lg h-10 px-4 text-sm font-medium"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
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
