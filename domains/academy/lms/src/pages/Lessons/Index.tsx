import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useCourseDetails,
  useMarkLessonComplete,
  useEnrollments,
  useStudentAnalytics,
  useStudentDashboard,
  useSubmitExercise,
  useCourseReport,
} from "@/hooks/useAcademy";
import { useMyTransactions } from "@/hooks/usePayment";
import { useQueries } from "@tanstack/react-query";
import { academyService } from "@/services/academyService";
import { useUser, useLogout } from "@/hooks/useAuth";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  CheckCircle2,
  Circle,
  Lock,
  Menu,
  X,
  Play,
  ArrowLeft,
  PlaySquare,
  Maximize2,
  BookOpen,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import PdfViewer from "./components/PdfViewer";
import InlinePdfViewer from "./components/InlinePdfViewer";
import CelebrationModal from "./components/CelebrationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CourseItem {
  id: string;
  title: string;
  lessonId: string;
  itemType: "video" | "reading" | "quiz" | "pdf";
  type?: string;
  url?: string;
  exercises?: any[];
  fullTitle?: string;
  content?: string;
}

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
  const { data: user } = useUser();
  const logout = useLogout();

  const profileRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitials = user
    ? `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()
    : "U";

  const { data: myTransactions } = useMyTransactions();

  const enrollment = enrollments?.find(
    (e) =>
      String(e.courseId) === String(id) || String(e.course?.id) === String(id),
  );

  // Cross-check: a COMPLETED transaction for this course means the admin approved payment
  const hasCompletedTransaction = myTransactions?.some(
    (tx: any) =>
      tx.status === "COMPLETED" &&
      (tx.metadata as any)?.courseId === Number(id),
  );

  const isEnrolled =
    (enrollment &&
      (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED")) ||
    hasCompletedTransaction;

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
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [pdfTotalPages, setPdfTotalPages] = useState(0);
  const [pdfCurrentPage, setPdfCurrentPage] = useState(1);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isLastItem?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    isLastItem: false,
  });

  const isLastItemInModule = () => {
    const currentModule = course?.modules?.find((m: any) =>
      m.lessons?.some((l: any) => l.id === activeLessonId),
    );
    if (
      !currentModule ||
      !currentModule.lessons ||
      currentModule.lessons.length === 0
    )
      return false;
    const lastLessonInModule =
      currentModule.lessons[currentModule.lessons.length - 1];

    const itemsInLastLesson = allItems.filter(
      (i) => i.lessonId === lastLessonInModule.id,
    );
    if (!itemsInLastLesson.length) return false;

    return activeItemId === itemsInLastLesson[itemsInLastLesson.length - 1].id;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const flatLessons = course?.modules?.flatMap((m) => m.lessons || []) || [];
  const currentLessonIndex = flatLessons.findIndex(
    (l) => l.id === activeLessonId,
  );
  const activeLesson = flatLessons[currentLessonIndex];

  const allItems: CourseItem[] =
    course?.modules?.flatMap(
      (m) =>
        m.lessons?.flatMap((l) => {
          const items: CourseItem[] =
            l.contents?.map((c) => ({
              ...c,
              lessonId: l.id,
              itemType: (c.type === "VIDEO" ? "video" : "reading") as
                | "video"
                | "reading"
                | "quiz"
                | "pdf",
            })) || [];

          if (l.exercises && l.exercises.length > 0) {
            const groupedAssessments = l.exercises.reduce(
              (acc: any, ex: any) => {
                const title = ex.title || `Practice: ${l.title}`;
                const groupKey = title.includes(" ||| ")
                  ? title.split(" ||| ")[1]
                  : title;
                if (!acc[groupKey])
                  acc[groupKey] = { fullTitle: title, exercises: [] };
                acc[groupKey].exercises.push(ex);
                return acc;
              },
              {} as Record<string, any>,
            );
            Object.entries(groupedAssessments).forEach(
              ([groupKey, group]: [string, any]) => {
                const { fullTitle, exercises } = group;
                const displayTitle = fullTitle.split(" ||| ")[0];
                items.push({
                  id: `quiz-${l.id}-${groupKey.replace(/\s+/g, "-").toLowerCase()}`,
                  title: displayTitle,
                  fullTitle,
                  lessonId: l.id,
                  itemType: "quiz",
                  exercises,
                });
              },
            );
          }
          return items;
        }) || [],
    ) || [];

  const currentItemIndex = allItems.findIndex(
    (item: CourseItem) =>
      item.id === activeItemId ||
      (item.itemType === ("quiz" as any) &&
        item.exercises?.some((ex: any) => ex.id === activeItemId)),
  );
  const activeItem = allItems[currentItemIndex];
  const isPdf =
    (activeItem as any)?.type === "PDF" ||
    (activeItem as any)?.url?.toLowerCase().endsWith(".pdf");

  const exercises =
    (activeItem as any)?.exercises || activeLesson?.exercises || [];
  const exerciseQueries = useQueries({
    queries: exercises.map((ex: any) => ({
      queryKey: ["exercise", ex.id],
      queryFn: () => academyService.getExerciseDetails(ex.id),
      enabled: !!ex.id && activeItemType === "quiz",
    })),
  });
  const lastSyncKey = JSON.stringify(
    exerciseQueries.map(
      (q: any) => q.data?.mySubmission?.updatedAt || q.dataUpdatedAt,
    ),
  );
  const detailedExercises = exercises.map((ex: any, idx: number) => {
    const detailed = exerciseQueries[idx]?.data;
    return detailed || ex;
  });

  // Auto-select first item
  useEffect(() => {
    if (course && allItems.length > 0 && !activeItemId) {
      const firstItem = allItems[0];
      setActiveItemId(firstItem.id);
      setActiveLessonId(firstItem.lessonId);
      setActiveItemType(
        firstItem.itemType as "video" | "reading" | "quiz" | "pdf",
      );
      if (course.modules?.[0]) {
        setExpandedModules({ [course.modules[0].id]: true });
      }
    }
  }, [course, activeItemId, allItems]);

  useEffect(() => {
    if (activeItem) {
      setActiveLessonId(activeItem.lessonId);
      setActiveItemType(
        activeItem.itemType as "video" | "reading" | "quiz" | "pdf",
      );
      setIsAnswered(false);
    }
  }, [activeItem]);

  useEffect(() => {
    if (activeItemType === "quiz" && detailedExercises.length) {
      const answers: Record<string, string> = {};
      let submittedCount = 0;
      let score = 0;
      const reportLesson = reportData
        ?.flatMap((m: any) => m.lessons || [])
        .find((l: any) => Number(l.lessonId) === Number(activeLessonId));

      detailedExercises.forEach((ex: any) => {
        const reportExercise = reportLesson?.exercises?.find(
          (rex: any) => Number(rex.exerciseId) === Number(ex.id),
        );
        const localAnswer = localStorage.getItem(`academy_ex_answer_${ex.id}`);
        const storedAnswer =
          ex.mySubmission?.answer ||
          reportExercise?.answer ||
          ex.userAnswer ||
          ex.submission?.answer ||
          localAnswer;
        const isCompletedState =
          !!storedAnswer ||
          reportExercise?.status === "GRADED" ||
          reportExercise?.status === "COMPLETED";

        if (isCompletedState) {
          answers[ex.id] =
            storedAnswer || localAnswer || ex.correctAnswer || "SUBMITTED";
          submittedCount++;
          const isCorrect =
            ex.mySubmission?.isCorrect ||
            ex.mySubmission?.status === "GRADED" ||
            reportExercise?.isCorrect ||
            reportExercise?.status === "GRADED" ||
            answers[ex.id] === ex.correctAnswer;
          if (isCorrect) score++;
        }
      });

      const isLoadingSubmissions = exerciseQueries.some(
        (q) => q.isLoading && (q as any).isEnabled,
      );
      if (submittedCount > 0) {
        setSelectedAnswers(answers);
        setQuizSubmitted(true);
        setQuizScore(score);
      } else if (!isLoadingSubmissions) {
        setQuizSubmitted(false);
        setQuizScore(0);
        setSelectedAnswers({});
      }
    } else if (activeItemType === "quiz") {
      setQuizSubmitted(false);
      setQuizScore(0);
      setSelectedAnswers({});
    }
  }, [activeLessonId, lastSyncKey, reportData, activeItemType]);

  const lessonProgressQueries = useQueries({
    queries: flatLessons.map((l: any) => ({
      queryKey: ["lesson-complete", course?.id, l.id],
      queryFn: () =>
        academyService.checkLessonComplete(
          course?.id?.toString() || "",
          l.id.toString(),
        ),
      enabled: !!course?.id && !!l.id,
    })),
  });

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading || isReportLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex h-screen">
        <div className="w-72 h-full bg-white border-r border-slate-200 p-4 flex flex-col gap-3">
          <Skeleton className="h-8 w-36 mb-2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-[360px] w-full rounded-2xl" />
          <Skeleton className="h-8 w-2/3 rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Course not found
        </h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          We couldn't find the course you're looking for.
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
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          Access Restricted
        </h2>
        <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
          {enrollment?.status === "PENDING"
            ? "Your enrollment is pending. Payment or approval may be required."
            : "You are not enrolled in this course. Enroll to get access."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate(`/courses/${id}`)}
            className="rounded-2xl h-12 px-8 bg-slate-900 hover:bg-slate-800 font-bold"
          >
            {enrollment?.status === "PENDING"
              ? "View Enrollment Status"
              : "Go to Enrollment Page"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl h-12 px-8 font-bold"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const checkLessonCompleted = (lessonId: string | number) => {
    if (!reportData) return false;
    // Flatten report to find the lesson
    for (const moduleObj of reportData) {
      if (moduleObj.lessons) {
        const found = moduleObj.lessons.find(
          (l: any) => Number(l.lessonId) === Number(lessonId),
        );
        if (found) return found.status === "COMPLETED";
      }
    }
    return false;
  };

  const isLessonMarkedComplete = (lessonId: string | number) => {
    const query = lessonProgressQueries.find(
      (_, idx) => String(flatLessons[idx].id) === String(lessonId),
    );
    return query?.data?.completed === true;
  };

  const isLessonCompleted = activeLessonId
    ? checkLessonCompleted(activeLessonId)
    : false;

  const isLessonLocked = (lessonId: string | number) => {
    return false; // Unlock all lessons as per user request
  };

  const handleMarkComplete = () => {
    if (activeLessonId) {
      markCompleteMutation.mutate(
        { courseId: course.id, lessonId: activeLessonId },
        {
          onSuccess: () => {
            const isModuleEnd = isLastItemInModule();
            setCelebration({
              isOpen: true,
              title: isModuleEnd
                ? "Module Mastered!"
                : "Skill lesson completed",
              message: isModuleEnd
                ? "Excellent progress, keep up the momentum!"
                : "You're one step closer to your goal.",
              isLastItem: currentItemIndex === allItems.length - 1,
            });
          },
        },
      );
    }
  };

  const handleNextItem = () => {
    if (currentItemIndex < allItems.length - 1) {
      const nextItem = allItems[currentItemIndex + 1];
      setActiveItemId(nextItem.id);
      setActiveItemType(nextItem.itemType);
    }
  };

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      const prevItem = allItems[currentItemIndex - 1];
      setActiveItemId(prevItem.id);
      setActiveItemType(prevItem.itemType);
    }
  };

  const handleOptionSelect = (exerciseId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: option }));
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

  // ── Content renderer ──────────────────────────────────────────────────────
  const renderActiveContent = () => {
    // ── Quiz ─────────────────────────────────────────────────────────────
    if (activeItemType === "quiz") {
      const exercisesList = detailedExercises || [];
      const isFinished = isLessonCompleted;

      return (
        <div className="w-full flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          {/* Sticky Lesson Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                Lesson Assessment
              </span>
              <h1 className="text-lg font-black text-slate-900 truncate">
                {activeLesson?.title || activeItem?.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevItem}
                disabled={currentItemIndex === 0}
                className="h-9 px-3 font-bold text-slate-500 rounded-xl"
              >
                <ChevronLeft size={16} className="mr-1" /> Prev
              </Button>

              {isFinished ? (
                <Button
                  onClick={handleNextItem}
                  disabled={currentItemIndex === allItems.length - 1}
                  className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Next Item <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleMarkComplete}
                  disabled={markCompleteMutation.isPending}
                  className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Complete Lesson
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-5 px-6 md:px-10 pt-8 pb-32">
            {/* Quiz header */}
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {activeItem?.title || "Assessment"}
                  </h2>
                  {quizSubmitted ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base font-bold text-emerald-600">
                        Score: {quizScore} / {exercisesList.length}
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-xs">
                        {Math.round((quizScore / exercisesList.length) * 100)}%
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {exercisesList.length} Questions · Answer all to submit.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Questions */}
            {exercisesList.map((exercise: any, index: number) => {
              const options = parseOptions(exercise.options);
              return (
                <div
                  key={exercise.id}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-400"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="mb-5">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                      Question {index + 1}
                    </span>
                  </div>
                  <div className="mb-6 text-base font-semibold text-slate-900 leading-snug">
                    {exercise.question}
                  </div>
                  <RadioGroup
                    value={selectedAnswers[exercise.id] || ""}
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

                      let cls = "border-slate-200 bg-white";
                      if (quizSubmitted) {
                        if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
                        else if (isWrong) cls = "border-red-400 bg-red-50";
                        else cls = "border-slate-100 opacity-60";
                      } else if (isSelected) {
                        cls = "border-primary bg-primary/5";
                      }

                      return (
                        <Label
                          key={idx}
                          htmlFor={`q${exercise.id}-o${idx}`}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border p-4 transition-all",
                            !quizSubmitted
                              ? "cursor-pointer hover:border-primary/50 hover:bg-primary/5"
                              : "cursor-default",
                            cls,
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
                            <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className="text-[15px] font-medium text-slate-800">
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
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    const allAnswered = exercisesList.every(
                      (ex: any) => selectedAnswers[ex.id],
                    );
                    if (!allAnswered) {
                      toast.error("Please answer all questions.");
                      return;
                    }
                    let correct = 0;
                    exercisesList.forEach((ex: any) => {
                      if (selectedAnswers[ex.id] === ex.correctAnswer)
                        correct++;
                    });
                    const isPassed =
                      correct >= Math.ceil(exercisesList.length * 0.7);
                    setQuizScore(correct);
                    Promise.all(
                      exercisesList.map((ex: any) =>
                        submitExerciseMutation.mutateAsync({
                          exerciseId: ex.id,
                          answer: selectedAnswers[ex.id],
                        }),
                      ),
                    ).then(() => {
                      exercisesList.forEach((ex: any) => {
                        localStorage.setItem(
                          `academy_ex_answer_${ex.id}`,
                          selectedAnswers[ex.id],
                        );
                      });
                      setQuizSubmitted(true);
                      if (isPassed || correct === exercisesList.length) {
                        const isModuleEnd = isLastItemInModule();
                        setCelebration({
                          isOpen: true,
                          title: isModuleEnd
                            ? "Module Mastered!"
                            : "Quiz passed",
                          message: isModuleEnd
                            ? "Excellent progress, keep up the momentum!"
                            : "Great work on demonstrating your knowledge.",
                          isLastItem: currentItemIndex === allItems.length - 1,
                        });
                      } else {
                        toast.success("Quiz submitted!");
                      }
                    });
                  }}
                  disabled={submitExerciseMutation.isPending}
                  className="rounded-xl px-10 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md"
                >
                  Submit Quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── Video ─────────────────────────────────────────────────────────────
    if (activeItemType === "video") {
      const isFinished = isLessonCompleted;

      return (
        <div className="w-full flex-1 flex flex-col overflow-y-auto custom-scrollbar overflow-x-hidden animate-in fade-in duration-400">
          {/* Sticky Lesson Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                Video Lesson
              </span>
              <h1 className="text-lg font-black text-slate-900 truncate">
                {activeLesson?.title || activeItem?.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevItem}
                disabled={currentItemIndex === 0}
                className="h-9 px-3 font-bold text-slate-500 rounded-xl"
              >
                <ChevronLeft size={16} className="mr-1" /> Prev
              </Button>

              {isFinished ? (
                <Button
                  onClick={handleNextItem}
                  disabled={currentItemIndex === allItems.length - 1}
                  className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Next Item <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleMarkComplete}
                  disabled={markCompleteMutation.isPending}
                  className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Complete Lesson
                </Button>
              )}
            </div>
          </div>

          {/* Full-width flush video — no border-radius, edge-to-edge */}
          <div className="aspect-video w-full overflow-hidden bg-slate-900">
            {isYouTube((activeItem as any)?.url) ? (
              <iframe
                className="w-full h-full border-0"
                src={getYouTubeEmbedUrl((activeItem as any)?.url || "")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={getFullUrl((activeItem as any)?.url)}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Meta */}
          <div className="px-6 md:px-10 pt-6 pb-20">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              About this lesson
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              In this part of the course, we'll explore {activeItem?.title}. Pay
              close attention to the key concepts mentioned in the video.
            </p>
          </div>
        </div>
      );
    }

    // ── Reading ───────────────────────────────────────────────────────────
    if (activeItemType === "reading") {
      const url = getFullUrl((activeItem as any)?.url);
      const isFinished = isLessonCompleted;

      return (
        <div className="w-full animate-in fade-in duration-400 flex flex-col flex-1 overflow-hidden">
          {/* Sticky Lesson Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                {isPdf ? "Reading Material" : "External Resource"}
              </span>
              <h1 className="text-lg font-black text-slate-900 truncate">
                {activeLesson?.title || activeItem?.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {isPdf && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsPdfViewerOpen(true)}
                  className="h-9 w-9 text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  <Maximize2 size={16} />
                </Button>
              )}

              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevItem}
                disabled={currentItemIndex === 0}
                className="h-9 px-3 font-bold text-slate-500 rounded-xl"
              >
                <ChevronLeft size={16} className="mr-1" /> Prev
              </Button>

              {isFinished ? (
                <Button
                  onClick={handleNextItem}
                  disabled={currentItemIndex === allItems.length - 1}
                  className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Next Item <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleMarkComplete}
                  disabled={markCompleteMutation.isPending}
                  className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Complete Lesson
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 w-full relative overflow-hidden bg-white">
            {isPdf ? (
              <InlinePdfViewer
                fileUrl={url}
                onPageChange={(current, total) => {
                  setPdfCurrentPage(current);
                  setPdfTotalPages(total);
                  if (current === total && total > 1 && !isLessonCompleted) {
                    handleMarkComplete();
                  }
                }}
                onDocumentLoad={(total) => setPdfTotalPages(total)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-12 bg-slate-50">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  View Reading Resource
                </h4>
                <p className="text-slate-500 max-w-sm mb-8">
                  This reading is available as an external resource.
                </p>
                <Button
                  onClick={() => window.open(url, "_blank")}
                  className="rounded-xl px-10 h-12 bg-primary text-white font-bold shadow-lg shadow-primary/20"
                >
                  Open Resource in New Tab
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden text-slate-900">
      <AnimatePresence>
        {isPdfViewerOpen && isPdf && (
          <PdfViewer
            url={getFullUrl((activeItem as any)?.url || activeItem?.content)}
            title={activeItem?.title || "Document"}
            onClose={() => setIsPdfViewerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-white border-b border-slate-200 z-50 shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-500" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h1 className="text-sm font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-md lg:max-w-xl ml-1">
            {course.title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center">
          {/* Avatar dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Avatar className="h-8 w-8 border border-slate-200">
                <AvatarImage
                  src={user?.profilePicture || undefined}
                  alt={user?.firstname}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-[100]">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user ? `${user.firstname} ${user.lastname}` : "Student"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    My Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Profile
                  </Link>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:relative z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden h-[calc(100vh-56px)] shrink-0",
            isSidebarOpen
              ? "w-[300px] translate-x-0"
              : "w-0 -translate-x-full lg:w-0",
          )}
        >
          {/* Sidebar header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/60 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Course Content
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-slate-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 py-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-[11px] font-bold text-primary">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col py-2">
              {course.modules?.map((module, mIdx) => {
                const isExpanded = expandedModules[module.id] !== false;
                return (
                  <div key={module.id} className="flex flex-col">
                    {/* Module header */}
                    <button
                      onClick={() =>
                        setExpandedModules((prev) => ({
                          ...prev,
                          [module.id]: !isExpanded,
                        }))
                      }
                      className="flex items-center justify-between px-4 py-3 text-left w-full hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                          {mIdx + 1}
                        </span>
                        <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide truncate">
                          {module.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                          isExpanded ? "rotate-180" : "",
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <div className="flex flex-col pb-2">
                        {module.lessons?.map((lesson, lIdx) => {
                          const isFinished = checkLessonCompleted(lesson.id);
                          const isMarkedComplete = isLessonMarkedComplete(
                            lesson.id,
                          );
                          const isLocked = isLessonLocked(lesson.id);
                          const isActiveLesson = activeLessonId === lesson.id;

                          return (
                            <div key={lesson.id} className="flex flex-col">
                              {/* Lesson Header */}
                              <div
                                className={cn(
                                  "px-8 py-3 border-b border-slate-100 flex items-center justify-between transition-colors",
                                  isFinished
                                    ? "bg-emerald-50/40"
                                    : isActiveLesson
                                      ? "bg-primary/5"
                                      : "bg-slate-50/40",
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="shrink-0">
                                    {isMarkedComplete ? (
                                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      </div>
                                    ) : isActiveLesson ? (
                                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
                                        <Play className="w-3 h-3 text-primary fill-primary" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                                    )}
                                  </div>
                                  <h4
                                    className={cn(
                                      "text-[10px] font-black uppercase tracking-widest truncate",
                                      isFinished
                                        ? "text-emerald-700"
                                        : isActiveLesson
                                          ? "text-primary"
                                          : "text-slate-400",
                                    )}
                                  >
                                    {lIdx + 1}. {lesson.title}
                                  </h4>
                                </div>
                              </div>

                              {/* Content items - simplified nested list */}
                              <div className="flex flex-col">
                                {lesson.contents?.map((content) => {
                                  const isActive = activeItemId === content.id;
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
                                        "group flex items-center gap-3 px-10 py-3 text-left transition-all w-full border-l-4",
                                        isActive
                                          ? "border-primary bg-primary/5"
                                          : "border-transparent hover:bg-slate-50",
                                      )}
                                    >
                                      <div className="shrink-0">
                                        {content.type === "VIDEO" ? (
                                          <PlaySquare
                                            className={cn(
                                              "w-4 h-4",
                                              isActive
                                                ? "text-primary"
                                                : "text-slate-400",
                                            )}
                                          />
                                        ) : (
                                          <FileText
                                            className={cn(
                                              "w-4 h-4",
                                              isActive
                                                ? "text-primary"
                                                : "text-slate-400",
                                            )}
                                          />
                                        )}
                                      </div>
                                      <p
                                        className={cn(
                                          "text-[12px] leading-snug line-clamp-1 transition-colors",
                                          isActive
                                            ? "text-primary font-bold"
                                            : isFinished
                                              ? "text-slate-400 italic"
                                              : "text-slate-600 font-medium group-hover:text-slate-900",
                                        )}
                                      >
                                        {content.title}
                                      </p>
                                    </button>
                                  );
                                })}

                                {/* Quiz item inside lesson */}
                                {allItems
                                  .filter(
                                    (item: any) =>
                                      item.lessonId === lesson.id &&
                                      item.itemType === "quiz",
                                  )
                                  .map((quizItem) => {
                                    const isActive =
                                      activeItemId === quizItem.id;
                                    return (
                                      <button
                                        key={quizItem.id}
                                        onClick={() => {
                                          setActiveItemId(quizItem.id);
                                          setActiveItemType("quiz");
                                          if (window.innerWidth < 1024)
                                            setIsSidebarOpen(false);
                                        }}
                                        className={cn(
                                          "group flex items-center gap-3 px-10 py-3 text-left transition-all w-full border-l-4",
                                          isActive
                                            ? "border-amber-500 bg-amber-50/60"
                                            : "border-transparent hover:bg-slate-50",
                                        )}
                                      >
                                        <HelpCircle
                                          className={cn(
                                            "w-4 h-4 shrink-0",
                                            isActive
                                              ? "text-amber-600"
                                              : "text-slate-400",
                                          )}
                                        />
                                        <p
                                          className={cn(
                                            "text-[12px] leading-snug line-clamp-1 transition-colors",
                                            isActive
                                              ? "text-amber-700 font-bold"
                                              : isFinished
                                                ? "text-slate-400 italic"
                                                : "text-slate-600 font-medium group-hover:text-slate-900",
                                          )}
                                        >
                                          {quizItem.title}
                                        </p>
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Content Area ─────────────────────────────────────────────────── */}
        <main className="flex-1 bg-white flex flex-col relative overflow-hidden">
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col transition-all duration-300 custom-scrollbar">
            <div className="relative group flex-1 flex flex-col">
              {renderActiveContent()}
            </div>
          </div>
        </main>
      </div>

      <CelebrationModal
        isOpen={celebration.isOpen}
        title={celebration.title}
        message={celebration.message}
        isLastItem={celebration.isLastItem}
        onClose={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
        onContinue={() => {
          setCelebration((prev) => ({ ...prev, isOpen: false }));
          if (celebration.isLastItem) {
            navigate("/dashboard");
          } else {
            handleNextItem();
          }
        }}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default LmsLearn;
