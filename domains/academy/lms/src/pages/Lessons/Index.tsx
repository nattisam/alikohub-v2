import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCourseDetails,
  useMarkLessonComplete,
  useEnrollments,
  useStudentAnalytics,
  useStudentDashboard,
  useSubmitExercise,
  useCourseReport,
} from "@/hooks/useAcademy";
import { useQueries } from "@tanstack/react-query";
import { academyService } from "@/services/academyService";
import LmsNavbar from "@/components/LmsNavbar";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  CheckCircle2,
  Circle,
  PlayCircle,
  Lock,
  Menu,
  X,
  Youtube,
  BookOpen,
  Play,
  ArrowLeft,
  Search,
  MoreVertical,
  Globe,
  Settings,
  Bell,
  Clock,
  Layout,
  PlaySquare,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LmsLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetails(id || "");
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: analytics } = useStudentAnalytics();
  const markCompleteMutation = useMarkLessonComplete();
  const submitExerciseMutation = useSubmitExercise();
  const { data: dashboardData } = useStudentDashboard();
  const { data: reportData, isLoading: isReportLoading } = useCourseReport(
    id || "",
  );

  const enrollment = enrollments?.find(
    (e) =>
      String(e.courseId) === String(id) || String(e.course?.id) === String(id),
  );

  const isEnrolled =
    enrollment &&
    (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED");

  // Find progress from dashboard data
  const courseProgressData = dashboardData?.find(
    (d: any) => d.courseId === Number(id),
  );

  const progress = Math.round(
    courseProgressData?.percentage || enrollment?.progress || 0,
  );

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [activeItemType, setActiveItemType] = useState<
    "video" | "reading" | "quiz" | "pdf"
  >("video");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Handle auto-open sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const flatLessons = course?.modules?.flatMap((m) => m.lessons || []) || [];
  const currentLessonIndex = flatLessons.findIndex(
    (l) => l.id === activeLessonId,
  );
  const activeLesson = flatLessons[currentLessonIndex];

  // All items in the course for easy navigation
  const allItems =
    course?.modules?.flatMap(
      (m) =>
        m.lessons?.flatMap((l) => [
          ...(l.contents?.map((c) => ({
            ...c,
            lessonId: l.id,
            itemType: (c.type === "VIDEO" ? "video" : "reading") as
              | "video"
              | "reading",
          })) || []),
          ...(l.exercises?.map((e) => ({
            ...e,
            lessonId: l.id,
            itemType: "quiz" as "quiz",
          })) || []),
        ]) || [],
    ) || [];

  const currentItemIndex = allItems.findIndex(
    (item) => item.id === activeItemId,
  );
  const activeItem = allItems[currentItemIndex];

  // Fetch individual exercises as source of truth for submissions
  const exercises = activeLesson?.exercises || [];
  const exerciseQueries = useQueries({
    queries: exercises.map((ex: any) => ({
      queryKey: ["exercise", ex.id],
      queryFn: () => academyService.getExerciseDetails(ex.id),
      enabled: !!ex.id && activeItemType === "quiz",
    })),
  });

  // Track the most recent data to avoid re-running the sync effect too often
  const lastSyncKey = JSON.stringify(
    exerciseQueries.map(
      (q) => q.data?.mySubmission?.updatedAt || q.dataUpdatedAt,
    ),
  );

  const detailedExercises = exercises.map((ex: any, idx) => {
    const detailed = exerciseQueries[idx]?.data;
    return detailed || ex;
  });

  // Auto-select first item on load
  useEffect(() => {
    if (course && allItems.length > 0 && !activeItemId) {
      const firstItem = allItems[0];
      setActiveItemId(firstItem.id);
      setActiveLessonId(firstItem.lessonId);
      setActiveItemType(
        firstItem.itemType as "video" | "reading" | "quiz" | "pdf",
      );
    }
  }, [course, activeItemId, allItems]);

  // Sync state when item changes
  useEffect(() => {
    if (activeItem) {
      setActiveLessonId(activeItem.lessonId);
      setActiveItemType(
        activeItem.itemType as "video" | "reading" | "quiz" | "pdf",
      );
    }
  }, [activeItem]);

  // 1. Reset quiz state only when switching to a quiz or a different lesson's quiz
  useEffect(() => {
    if (activeItemType === "quiz") {
      setCurrentExerciseIndex(0);
      setIsAnswered(false);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
    }
  }, [activeItemId, activeItemType]);

  // 2. Sync with backend data (detailed fetch or report) and localStorage
  useEffect(() => {
    if (detailedExercises.length) {
      const answers: Record<string, string> = {};
      let submittedCount = 0;
      let score = 0;

      // Find this lesson in report if available
      const reportLesson = reportData
        ?.flatMap((m: any) => m.lessons || [])
        .find((l: any) => l.lessonId === Number(activeLessonId));

      detailedExercises.forEach((ex: any) => {
        // Try to find exercise in report
        const reportExercise = reportLesson?.exercises?.find(
          (rex: any) => rex.exerciseId === Number(ex.id),
        );

        const localAnswer = localStorage.getItem(`academy_ex_answer_${ex.id}`);

        // Source of truth priorities:
        // 1. Specific detailed fetch (detailedEx.mySubmission)
        // 2. Report data (reportExercise.answer)
        // 3. Original lesson structure (ex.mySubmission)
        // 4. LocalStorage
        const storedAnswer =
          ex.mySubmission?.answer ||
          reportExercise?.answer ||
          ex.userAnswer ||
          ex.submission?.answer ||
          localAnswer;

        // Either there is a stored answer or the report says it's GRADED/COMPLETED
        const isCompletedState =
          !!storedAnswer ||
          reportExercise?.status === "GRADED" ||
          reportExercise?.status === "COMPLETED";

        if (isCompletedState) {
          // Make sure we have a fallback answer so the UI considers it answered
          answers[ex.id] =
            storedAnswer || localAnswer || ex.correctAnswer || "SUBMITTED";
          submittedCount++;

          // Check if correct
          const isCorrect =
            ex.mySubmission?.isCorrect ||
            ex.mySubmission?.status === "GRADED" ||
            reportExercise?.isCorrect ||
            reportExercise?.status === "GRADED" ||
            answers[ex.id] === ex.correctAnswer;

          if (isCorrect) score++;
        }
      });

      if (submittedCount > 0) {
        setSelectedAnswers(answers);
        setQuizSubmitted(true);
        setQuizScore(score);
      } else {
        setQuizSubmitted(false);
        setQuizScore(0);
        setSelectedAnswers({});
      }
    } else {
      setQuizSubmitted(false);
      setQuizScore(0);
      setSelectedAnswers({});
    }
  }, [activeLessonId, lastSyncKey, reportData]);

  if (isLoading || isReportLoading) {
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
          removed.
        </p>
        <Button onClick={() => navigate("/dashboard")} className="rounded-xl">
          Return to My Learning
        </Button>
      </div>
    );
  }

  if (!enrollmentsLoading && !isEnrolled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 border border-amber-100 shadow-sm">
          <Lock className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-3xl font-black font-heading text-slate-900 mb-3 tracking-tight">
          Access Restricted
        </h2>
        <p className="text-slate-500 mb-8 text-center max-w-md font-medium leading-relaxed">
          {enrollment?.status === "PENDING"
            ? "Your enrollment is currently pending. This usually means payment is required or approval is in progress."
            : "You are not enrolled in this course yet. Enroll now to get instant access to all learning materials."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate(`/courses/${id}`)}
            className="rounded-2xl h-12 px-8 bg-slate-900 hover:bg-slate-800 font-bold shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
          >
            {enrollment?.status === "PENDING"
              ? "View Enrollment Status"
              : "Go to Enrollment Page"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl h-12 px-8 border-slate-200 hover:bg-slate-50 font-bold active:scale-95 transition-all"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Handlers
  const checkLessonCompleted = (lessonId: string | number) => {
    if (!reportData) return false;
    const allReportLessons = reportData.flatMap((m: any) => m.lessons || []);
    const lesson = allReportLessons.find(
      (l: any) => l.lessonId === Number(lessonId),
    );
    return lesson?.status === "COMPLETED";
  };

  const isLessonCompleted = activeLessonId
    ? checkLessonCompleted(activeLessonId)
    : false;

  const handleNext = (options?: { bypassCheck?: boolean }) => {
    const bypassCheck = options?.bypassCheck === true;
    if (!bypassCheck && activeLessonId) {
      if (!isLessonCompleted) {
        toast.error(
          "Please complete this lesson before moving to the next one.",
        );
        return;
      }
    }
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
            handleNext({ bypassCheck: true });
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
    submitExerciseMutation.mutate(
      { exerciseId, answer },
      {
        onSuccess: () => {
          setIsAnswered(true);
        },
      },
    );
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
    const origin = window.location.origin;
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&enablejsapi=1&origin=${origin}`;
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
    if (activeItemType === "quiz") {
      const exercisesList = detailedExercises || [];
      return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="space-y-8">
            <div className="rounded-2xl bg-slate-50 p-8 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-sm">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Lesson Assessment
                  </h2>
                  {quizSubmitted ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-emerald-600">
                        Score: {quizScore} / {exercisesList.length}
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">
                        {Math.round((quizScore / exercisesList.length) * 100)}%
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {exercisesList.length} Questions • Answer all to complete.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {exercisesList.map((exercise: any, index: number) => {
              const options = parseOptions(exercise.options);
              return (
                <div
                  key={exercise.id}
                  className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-md">
                      Question {index + 1}
                    </span>
                  </div>

                  <div className="mb-8">
                    <div className="text-lg font-bold text-slate-900 leading-snug">
                      {exercise.question}
                    </div>
                  </div>

                  <RadioGroup
                    value={selectedAnswers[exercise.id]}
                    onValueChange={(v) =>
                      !quizSubmitted && handleOptionSelect(exercise.id, v)
                    }
                    className="flex flex-col gap-3"
                    disabled={quizSubmitted}
                  >
                    {options.map((option, idx) => {
                      const isSelected =
                        selectedAnswers[exercise.id] === option;
                      const isCorrect = exercise.correctAnswer === option;
                      const isWrong = isSelected && !isCorrect;

                      let bgClass =
                        "border-slate-200 bg-white hover:border-primary/50";
                      if (quizSubmitted) {
                        if (isCorrect)
                          bgClass = "border-emerald-500 bg-emerald-50";
                        else if (isWrong) bgClass = "border-red-500 bg-red-50";
                        else bgClass = "border-slate-100 opacity-50";
                      } else if (isSelected) {
                        bgClass = "border-primary bg-blue-50/30";
                      }

                      return (
                        <Label
                          key={idx}
                          htmlFor={`q${exercise.id}-o${idx}`}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                            bgClass,
                          )}
                        >
                          {!quizSubmitted ? (
                            <RadioGroupItem
                              value={option}
                              id={`q${exercise.id}-o${idx}`}
                            />
                          ) : isCorrect ? (
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500 shrink-0"
                            />
                          ) : isWrong ? (
                            <X size={18} className="text-red-500 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                          )}
                          <span className="text-[15px] font-medium">
                            {option}
                          </span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </div>
              );
            })}

            {!quizSubmitted && (
              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => {
                    const allAnswered = exercisesList.every(
                      (ex) => selectedAnswers[ex.id],
                    );
                    if (!allAnswered) {
                      toast.error("Please answer all questions.");
                      return;
                    }
                    let correctCount = 0;
                    exercisesList.forEach((ex) => {
                      if (selectedAnswers[ex.id] === ex.correctAnswer)
                        correctCount++;
                    });
                    setQuizScore(correctCount);
                    Promise.all(
                      exercisesList.map((ex) =>
                        submitExerciseMutation.mutateAsync({
                          exerciseId: ex.id,
                          answer: selectedAnswers[ex.id],
                        }),
                      ),
                    ).then(() => {
                      exercisesList.forEach((ex) => {
                        localStorage.setItem(
                          `academy_ex_answer_${ex.id}`,
                          selectedAnswers[ex.id],
                        );
                      });
                      setQuizSubmitted(true);
                      toast.success("Quiz submitted!");
                      handleMarkComplete();
                    });
                  }}
                  disabled={submitExerciseMutation.isPending}
                  className="rounded-xl px-10 h-14 bg-slate-900 text-white font-bold"
                >
                  Submit Quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeItemType === "video") {
      return (
        <div className="w-full animate-in fade-in duration-500">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg mb-8">
            {isYouTube((activeItem as any)?.url) ? (
              <iframe
                className="w-full h-full border-0"
                src={getYouTubeEmbedUrl((activeItem as any)?.url || "")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={getFullUrl((activeItem as any)?.url)}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="prose prose-slate max-w-none mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              About this lesson
            </h3>
            <p className="text-slate-600 leading-relaxed">
              In this part of the course, we'll explore {activeItem?.title}. Pay
              close attention to the key concepts mentioned in the video.
            </p>
          </div>

          {/* Mark Complete Action */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-8 gap-4">
            <div>
              <h3 className="font-bold text-slate-800">
                Done with this content?
              </h3>
              <p className="text-sm text-slate-500">
                Mark it as complete to track your progress.
              </p>
            </div>
            <Button
              onClick={handleMarkComplete}
              disabled={isLessonCompleted || markCompleteMutation.isPending}
              className={cn(
                "rounded-xl px-8 h-12 font-bold shrink-0",
                isLessonCompleted
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-slate-900 text-white hover:bg-slate-800",
              )}
            >
              {isLessonCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </div>
      );
    }

    if (activeItemType === "reading") {
      const isPdf =
        (activeItem as any)?.type === "PDF" ||
        (activeItem as any)?.url?.toLowerCase().endsWith(".pdf");
      const url = getFullUrl((activeItem as any)?.url);

      return (
        <div className="w-full animate-in fade-in duration-500 flex flex-col flex-1 overflow-hidden">
          <div className="mb-6 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {activeItem?.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Reading Material • Please review the document below
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl border-slate-200 hover:bg-slate-50 font-bold gap-2"
            >
              <a href={url} download target="_blank" rel="noopener noreferrer">
                <Download size={16} />
                Download PDF
              </a>
            </Button>
          </div>

          <div className="flex-1 w-full min-h-[85vh] relative overflow-hidden">
            {isPdf ? (
              <iframe
                src={`${url}#toolbar=0&navpanes=0&view=FitH`}
                className="absolute inset-0 w-full h-full border-0 bg-white"
                title={activeItem?.title}
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[600px] h-full text-center p-12 bg-slate-50 rounded-2xl">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  View Reading Resource
                </h4>
                <p className="text-slate-500 max-w-sm mb-8">
                  This reading is available as an external resource. Click the
                  button below to view it.
                </p>
                <Button
                  onClick={() => window.open(url, "_blank")}
                  className="rounded-xl px-10 h-14 bg-primary text-white font-bold shadow-lg shadow-primary/20"
                >
                  Open Resource in New Tab
                </Button>
              </div>
            )}
          </div>

          {/* Mark Complete Action */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 shrink-0 gap-4 mb-8">
            <div>
              <h3 className="font-bold text-slate-800">Finished reading?</h3>
              <p className="text-sm text-slate-500">
                Mark it as complete to track your progress.
              </p>
            </div>
            <Button
              onClick={handleMarkComplete}
              disabled={isLessonCompleted || markCompleteMutation.isPending}
              className={cn(
                "rounded-xl px-8 h-12 font-bold shrink-0",
                isLessonCompleted
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-slate-900 text-white hover:bg-slate-800",
              )}
            >
              {isLessonCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden text-slate-900">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-slate-200 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-md"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-md lg:max-w-xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              <Layout className="w-3 h-3 text-primary" />
              <span>{progress}% Complete</span>
            </div>
            <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:relative z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden h-[calc(100vh-56px)] shrink-0",
            isSidebarOpen
              ? "w-[340px] translate-x-0"
              : "w-0 -translate-x-full lg:w-0",
          )}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <div>
              <button
                onClick={() => navigate(`/courses/${id}`)}
                className="text-[11px] font-bold text-primary hover:underline uppercase tracking-[0.1em]"
              >
                Assess for Success: {course.title}
              </button>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-slate-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {course.modules?.map((module, mIdx) => (
                <div key={module.id} className="flex flex-col">
                  {/* Module Header */}
                  <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-sm px-4 py-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Module {mIdx + 1}: {module.title}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    {module.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className="flex flex-col">
                        {/* Lesson Header - Sticky beneath module */}
                        <div className="sticky top-[41px] z-10 bg-white/95 backdrop-blur-sm px-4 py-2.5 border-b border-slate-50">
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-500 font-bold shrink-0">
                              {lIdx + 1}
                            </span>
                            {lesson.title}
                          </h4>
                        </div>

                        {/* Items List */}
                        <div className="flex flex-col py-1">
                          {/* Contents */}
                          {lesson.contents?.map((content) => {
                            const isActive = activeItemId === content.id;
                            const isCompleted = checkLessonCompleted(lesson.id);
                            return (
                              <button
                                key={content.id}
                                onClick={() => {
                                  setActiveItemId(content.id);
                                  setActiveItemType(
                                    content.type === "VIDEO"
                                      ? "video"
                                      : "reading",
                                  );
                                  if (window.innerWidth < 1024)
                                    setIsSidebarOpen(false);
                                }}
                                className={cn(
                                  "group flex items-start gap-4 px-6 py-3.5 text-left transition-all relative",
                                  isActive
                                    ? "bg-blue-50/40 border-r-4 border-primary"
                                    : "hover:bg-slate-50 border-r-4 border-transparent",
                                )}
                              >
                                <div className="pt-0.5 shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "text-[13px] leading-snug font-medium line-clamp-2",
                                      isActive
                                        ? "text-primary font-bold"
                                        : "text-slate-600",
                                    )}
                                  >
                                    {content.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                      {content.type === "VIDEO" ? (
                                        <Play size={10} strokeWidth={3} />
                                      ) : (
                                        <FileText size={10} strokeWidth={3} />
                                      )}
                                      {content.type === "VIDEO"
                                        ? "Video"
                                        : "Reading"}
                                    </div>
                                    <span className="text-slate-200 text-xs">
                                      •
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400">
                                      5 min
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}

                          {/* Exercises */}
                          {lesson.exercises?.map((exercise) => {
                            const isActive = activeItemId === exercise.id;
                            const isCompleted = checkLessonCompleted(lesson.id);
                            return (
                              <button
                                key={exercise.id}
                                onClick={() => {
                                  setActiveItemId(exercise.id);
                                  setActiveItemType("quiz");
                                  if (window.innerWidth < 1024)
                                    setIsSidebarOpen(false);
                                }}
                                className={cn(
                                  "group flex items-start gap-4 px-6 py-3.5 text-left transition-all relative",
                                  isActive
                                    ? "bg-blue-50/40 border-r-4 border-primary"
                                    : "hover:bg-slate-50 border-r-4 border-transparent",
                                )}
                              >
                                <div className="pt-0.5 shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <PlaySquare className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "text-[13px] leading-snug font-medium line-clamp-2",
                                      isActive
                                        ? "text-primary font-bold"
                                        : "text-slate-600",
                                    )}
                                  >
                                    Practice: {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                      <HelpCircle size={10} strokeWidth={3} />
                                      Quiz
                                    </div>
                                    <span className="text-slate-200 text-xs">
                                      •
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400">
                                      {exercise.points || 10} points
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white flex flex-col relative custom-scrollbar">
          <div
            className={cn(
              "flex-1 mx-auto w-full flex flex-col transition-all duration-300",
              activeItemType === "reading"
                ? "max-w-7xl p-2 md:p-6"
                : "max-w-[1000px] p-4 md:p-10",
            )}
          >
            {/* Redundant titles removed for focused view */}

            <div className="relative group flex-1 flex flex-col">
              {renderActiveContent()}
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100 pb-20">
              <div className="text-sm font-medium text-slate-500 order-2 sm:order-1">
                Item {currentItemIndex + 1} of {allItems.length}
              </div>
              <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentItemIndex > 0) {
                      const prevItem = allItems[currentItemIndex - 1];
                      setActiveItemId(prevItem.id);
                      setActiveItemType(prevItem.itemType);
                    }
                  }}
                  disabled={currentItemIndex === 0}
                  className="rounded-lg h-12 flex-1 sm:flex-initial px-6 text-sm font-bold border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous item
                </Button>
                <Button
                  onClick={() => {
                    if (currentItemIndex < allItems.length - 1) {
                      const nextItem = allItems[currentItemIndex + 1];
                      setActiveItemId(nextItem.id);
                      setActiveItemType(nextItem.itemType);
                    }
                  }}
                  disabled={currentItemIndex === allItems.length - 1}
                  className="rounded-lg h-12 flex-1 sm:flex-initial px-8 text-sm font-bold bg-primary hover:shadow-lg transition-all active:scale-[0.98] gap-2 shadow-sm"
                >
                  Next item
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default LmsLearn;
