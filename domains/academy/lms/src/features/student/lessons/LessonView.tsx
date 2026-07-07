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
import { useMyTransactions } from "@/features/student/hooks/usePayment";

import { academyService } from "@/services/academyService";
import { useUser, useLogout } from "@/features/auth/hooks/useAuth";
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
  Clock,
  Link2,
  Unlock,
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

const sentenceCase = (str?: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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
  const markedLessonsRef = useRef<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  );
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

  // Cleanup: Clear legacy assessment localStorage keys on mount to ensure fresh state
  useEffect(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("academy_ex_")) {
        localStorage.removeItem(key);
      }
    });
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

  // Prioritize exact item.id match; only fall back to exercise-id lookup
  let currentItemIndex = allItems.findIndex(
    (item: CourseItem) => item.id === activeItemId,
  );
  if (currentItemIndex === -1) {
    // Fallback: check inside quiz exercises (for legacy quiz navigation)
    currentItemIndex = allItems.findIndex(
      (item: CourseItem) =>
        item.itemType === "quiz" &&
        item.exercises?.some((ex: any) => ex.id === activeItemId),
    );
  }
  const activeItem = allItems[currentItemIndex];
  const isPdf =
    (activeItem as any)?.type === "PDF" ||
    (activeItem as any)?.url?.toLowerCase().endsWith(".pdf");

  const exercises =
    (activeItem as any)?.exercises || activeLesson?.exercises || [];

  const [detailedExercisesMap, setDetailedExercisesMap] = useState<
    Record<string, any>
  >({});
  const [exerciseFetchKey, setExerciseFetchKey] = useState("");

  // Fetch exercise details sequentially to avoid 429 rate limiting
  useEffect(() => {
    if (activeItemType !== "quiz" || exercises.length === 0) return;

    const key = exercises.map((ex: any) => ex.id).join(",");
    if (key === exerciseFetchKey) return; // Already fetched this set
    setExerciseFetchKey(key);

    let cancelled = false;
    (async () => {
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      for (const ex of exercises) {
        if (cancelled) return;
        // Skip if already cached
        if (detailedExercisesMap[ex.id]) continue;
        try {
          const data = await academyService.getExerciseDetails(ex.id);
          if (!cancelled) {
            setDetailedExercisesMap((prev) => ({ ...prev, [ex.id]: data }));
          }
        } catch (e) {
          console.warn(`Failed to fetch exercise ${ex.id}`, e);
        }
        await delay(300);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeItemType, exercises.map((e: any) => e.id).join(",")]);

  const detailedExercises = exercises.map((ex: any) => {
    return detailedExercisesMap[ex.id] || ex;
  });
  const lastSyncKey = JSON.stringify(
    detailedExercises.map((ex: any) => ex?.mySubmission?.updatedAt || ex?.id),
  );

  // Hydrate completed lessons from backend on mount
  useEffect(() => {
    if (!course?.modules) return;
    let cancelled = false;
    (async () => {
      const completed = new Set<string>();
      const lessons =
        course.modules?.flatMap((m: any) => m.lessons || []) || [];
      await Promise.all(
        lessons.map(async (lesson: any) => {
          try {
            const data = await academyService.checkLessonComplete(
              course.id,
              lesson.id,
            );
            if (data?.completed || data?.isCompleted || data === true) {
              completed.add(String(lesson.id));
            }
          } catch (_) {
            // silently skip failed checks
          }
        }),
      );
      if (!cancelled) setCompletedLessons(completed);
    })();
    return () => {
      cancelled = true;
    };
  }, [course?.id]);

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

  const prevQuizLessonRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeItem) {
      setActiveLessonId(activeItem.lessonId);
      setActiveItemType(
        activeItem.itemType as "video" | "reading" | "quiz" | "pdf",
      );
      setIsAnswered(false);
      // Only reset quiz state when switching to a DIFFERENT quiz lesson
      if (
        activeItem.itemType === "quiz" &&
        activeItem.lessonId !== prevQuizLessonRef.current
      ) {
        prevQuizLessonRef.current = activeItem.lessonId;
        setQuizSubmitted(false);
        setQuizScore(0);
        setSelectedAnswers({});
      }
    }
  }, [activeItem]);

  const detailedExercisesLoaded = Object.keys(detailedExercisesMap).length;

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
        const storedAnswer =
          ex.mySubmission?.answer ||
          reportExercise?.answer ||
          ex.userAnswer ||
          ex.submission?.answer;
        const isCompletedState =
          !!storedAnswer ||
          reportExercise?.status === "GRADED" ||
          reportExercise?.status === "COMPLETED";

        if (isCompletedState) {
          answers[ex.id] = storedAnswer || ex.correctAnswer || "SUBMITTED";
          submittedCount++;
          // Use server/report data for scoring
          const isCorrect =
            reportExercise?.status === "GRADED" &&
            (reportExercise?.isCorrect || reportExercise?.score > 0);
          if (isCorrect) score++;
        }
      });

      const isLoadingSubmissions = exercises.some(
        (ex: any) => !detailedExercisesMap[ex.id],
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
    }
    // Don't reset quiz state when exercises are still loading — wait for them to arrive
  }, [
    activeLessonId,
    lastSyncKey,
    reportData,
    activeItemType,
    detailedExercisesLoaded,
  ]);

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
    const key = String(lessonId);
    if (completedLessons.has(key)) return true;
    if (!reportData) return false;
    // Flatten report to find the lesson
    for (const moduleObj of reportData) {
      if (moduleObj.lessons) {
        const found = moduleObj.lessons.find(
          (l: any) => Number(l.lessonId) === Number(lessonId),
        );
        if (found && found.status === "COMPLETED") return true;
      }
    }
    return false;
  };

  const isLessonCompleted = activeLessonId
    ? checkLessonCompleted(activeLessonId)
    : false;

  const isLessonLocked = (lessonId: string | number) => {
    return false; // Unlock all lessons as per user request
  };

  const handleMarkComplete = () => {
    if (activeLessonId) {
      const lessonKey = String(activeLessonId);
      if (
        markedLessonsRef.current.has(lessonKey) ||
        markCompleteMutation.isPending
      )
        return;

      markedLessonsRef.current.add(lessonKey);
      markCompleteMutation.mutate(
        { courseId: course.id, lessonId: activeLessonId },
        {
          onSuccess: () => {
            setCompletedLessons((prev) =>
              new Set(prev).add(String(activeLessonId)),
            );
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
        <div className="bg-background text-on-surface w-full flex flex-col flex-1 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
          <main className="flex-1 max-w-[1280px] w-full mx-auto px-1 sm:px-4 md:px-8 py-4 sm:py-8 flex flex-col">
            <div className="space-y-4 md:space-y-5 px-3 sm:px-6 md:px-10 pt-4 md:pt-8 pb-32">
              {/* Quiz header */}
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <HelpCircle size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Lesson Assesment
                    </h2>
                    {quizSubmitted ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base font-bold text-emerald-600">
                          Score: {quizScore} / {exercisesList.length}
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-xs">
                          {Math.round((quizScore / exercisesList.length) * 100)}
                          %
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
                    className="rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-400"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="mb-4 md:mb-5">
                      <span className="text-[10px] md:text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-100 px-2.5 md:px-3 py-1 rounded-full">
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
                        const knownCorrectAnswer = exercise.correctAnswer;
                        const isCorrect = knownCorrectAnswer
                          ? knownCorrectAnswer === option
                          : false;
                        const isWrong =
                          isSelected && knownCorrectAnswer && !isCorrect;

                        let cls = "border-slate-200 bg-white";
                        if (quizSubmitted) {
                          if (isCorrect)
                            cls = "border-emerald-400 bg-emerald-50";
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

                    {quizSubmitted &&
                      (exercise.mySubmission?.feedback ||
                        exercise.mySubmission?.score !== undefined) && (
                        <div className="mt-6 p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 animate-in fade-in slide-in-from-top-2 duration-500">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                              Instructor Review
                            </p>
                            {exercise.mySubmission?.status === "GRADED" && (
                              <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-sm">
                                {exercise.mySubmission.score} /{" "}
                                {exercise.points || 1} pts
                              </span>
                            )}
                          </div>
                          {exercise.mySubmission?.feedback ? (
                            <p className="text-[14px] text-slate-700 font-medium leading-relaxed italic">
                              "{exercise.mySubmission.feedback}"
                            </p>
                          ) : (
                            <p className="text-[13px] text-slate-400 font-medium italic">
                              No written feedback provided.
                            </p>
                          )}
                        </div>
                      )}
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
                      (async () => {
                        try {
                          const delay = (ms: number) =>
                            new Promise((res) => setTimeout(res, ms));
                          const submitResults: Record<
                            string,
                            { isCorrect: boolean; correctAnswer?: string }
                          > = {};
                          for (const idx in exercisesList) {
                            const ex = exercisesList[idx];
                            const result =
                              await submitExerciseMutation.mutateAsync({
                                exerciseId: ex.id,
                                answer: selectedAnswers[ex.id],
                              });
                            submitResults[ex.id] = {
                              isCorrect:
                                result?.isCorrect ??
                                selectedAnswers[ex.id] === ex.correctAnswer,
                              correctAnswer:
                                result?.correctAnswer || ex.correctAnswer,
                            };
                            if (Number(idx) < exercisesList.length - 1) {
                              await delay(500);
                            }
                          }
                          // Use server-graded score instead of unreliable client-side check
                          const serverScore = Object.values(
                            submitResults,
                          ).filter((r) => r.isCorrect).length;
                          setQuizScore(serverScore);

                          // Quiz state is now managed in component state
                          setQuizSubmitted(true);

                          // Always mark lesson complete after quiz submission
                          const showCelebration = () => {
                            const isModuleEnd = isLastItemInModule();
                            setCelebration({
                              isOpen: true,
                              title: isModuleEnd
                                ? "Module Mastered!"
                                : "Quiz submitted",
                              message: isModuleEnd
                                ? "Excellent progress, keep up the momentum!"
                                : "Your answers have been recorded.",
                              isLastItem:
                                currentItemIndex === allItems.length - 1,
                            });
                          };

                          if (!isLessonCompleted && activeLessonId) {
                            const lessonKey = String(activeLessonId);
                            if (!markedLessonsRef.current.has(lessonKey)) {
                              markedLessonsRef.current.add(lessonKey);
                              markCompleteMutation.mutate(
                                {
                                  courseId: course.id,
                                  lessonId: activeLessonId,
                                },
                                {
                                  onSuccess: () => {
                                    setCompletedLessons((prev) =>
                                      new Set(prev).add(String(activeLessonId)),
                                    );
                                    showCelebration();
                                  },
                                },
                              );
                            } else {
                              showCelebration();
                            }
                          } else {
                            showCelebration();
                          }
                        } catch (e) {
                          toast.error(
                            "Failed to submit some answers properly.",
                          );
                        }
                      })();
                    }}
                    disabled={submitExerciseMutation.isPending}
                    className="rounded-xl px-10 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md"
                  >
                    Submit Quiz
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      );
    }

    // ── Video ─────────────────────────────────────────────────────────────
    if (activeItemType === "video") {
      const isFinished = isLessonCompleted;

      return (
        <div className="bg-background text-on-surface w-full overflow-y-auto custom-scrollbar overflow-x-hidden animate-in fade-in duration-500">
          <main className="flex-1 max-w-[1280px] w-full mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-8">
            {/* Lesson Header & Metadata */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[13px] font-semibold">
                  VIDEO LESSON
                </span>
                <span className="text-on-surface-variant text-[13px]">
                  {course?.title || "Module"}
                </span>
                <span className="text-on-surface-variant text-[13px] ml-auto flex items-center gap-1">
                  <Clock className="w-[18px] h-[18px]" />
                  15 mins
                </span>
              </div>
              <h1 className="text-[1.75rem] md:text-[2.25rem] font-bold leading-tight text-primary mb-6">
                {activeItem?.title || activeLesson?.title}
              </h1>
              {(course as any)?.teacher && (
                <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                  <img
                    className="w-14 h-14 rounded-full border-2 border-on-primary shadow-sm object-cover"
                    alt="Instructor"
                    src={
                      (course as any).teacher.profilePicture ||
                      "https://ui-avatars.com/api/?name=U&background=random"
                    }
                  />
                  <div>
                    <h4 className="font-bold text-primary">
                      {(course as any).teacher.firstname}{" "}
                      {(course as any).teacher.lastname}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Course Instructor
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-8 group">
              {isYouTube((activeItem as any)?.url) ? (
                <iframe
                  className="absolute inset-0 w-full h-full border-0 z-10"
                  src={getYouTubeEmbedUrl((activeItem as any)?.url || "")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={getFullUrl((activeItem as any)?.url) || undefined}
                  controls
                  controlsList="nodownload"
                  className="absolute inset-0 w-full h-full object-contain z-10 bg-black"
                />
              )}
            </div>

            {/* Overview Section */}
            <div className="flex flex-col gap-8 pb-20">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  About this lesson
                </h3>
                <div className="text-[15px] text-on-surface-variant leading-relaxed">
                  {activeItem?.content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: activeItem.content }}
                    />
                  ) : (
                    <p>
                      In this part of the course, we'll explore{" "}
                      <strong>{activeItem?.title}</strong>. Pay close attention
                      to the key concepts mentioned in the video.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    }

    // ── Reading ───────────────────────────────────────────────────────────
    if (activeItemType === "reading") {
      const url = getFullUrl((activeItem as any)?.url);
      const isFinished = isLessonCompleted;

      return (
        <div className="bg-background text-on-surface w-full overflow-y-auto custom-scrollbar overflow-x-hidden animate-in fade-in duration-500 flex flex-col flex-1">
          <main className="flex-1 max-w-[1280px] w-full mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-8 flex flex-col">
            {/* Lesson Header & Metadata */}
            <section className="mb-8 shrink-0">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                  {isPdf ? "READING MATERIAL" : "EXTERNAL RESOURCE"}
                </span>

                <div className="flex items-center gap-2 ml-auto">
                  {/* Expand PDF Button */}
                  {isPdf && (
                    <button
                      onClick={() => setIsPdfViewerOpen(true)}
                      className="text-primary font-bold text-sm px-3 py-1.5 rounded-md hover:bg-surface-container flex items-center gap-1.5 transition-colors"
                    >
                      <Maximize2 className="w-[18px] h-[18px] font-bold" />
                      <span>Expand</span>
                    </button>
                  )}
                </div>
              </div>

              <h1 className="text-[1.75rem] md:text-[2.25rem] font-bold leading-tight text-primary">
                {activeItem?.title || activeLesson?.title}
              </h1>
            </section>

            {/* Read Content Window - Similar to Video Player Wrapper but allowing full height expansion */}
            <div className="relative w-full flex-1 min-h-[60vh] bg-surface-container-low rounded-2xl overflow-hidden shadow-lg border border-outline-variant flex flex-col">
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
                <div className="flex flex-col items-center justify-center flex-1 text-center p-12 bg-surface-container-lowest">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Link2 className="w-9 h-9 text-primary" />
                  </div>
                  <h4 className="text-2xl font-bold text-primary mb-2">
                    External Resource
                  </h4>
                  <p className="text-[15px] text-on-surface-variant max-w-sm mb-8">
                    This reading is available off-platform as an external
                    resource link.
                  </p>
                  <button
                    onClick={() => window.open(url, "_blank")}
                    className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                  >
                    Open Resource in New Tab
                  </button>
                </div>
              )}
            </div>
          </main>
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
      <header className="h-12 md:h-14 shrink-0 flex items-center justify-between px-3 md:px-4 bg-white border-b border-slate-200 z-50 shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-1 md:gap-2 overflow-hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 md:p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-500" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 md:p-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h1 className="text-xs md:text-sm font-bold text-slate-800 truncate max-w-[150px] md:max-w-md lg:max-w-xl">
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
            "bg-surface-container-low shadow-sm flex flex-col gap-4 overflow-y-auto z-40 transition-all duration-300 shrink-0",
            "fixed lg:relative top-[48px] md:top-[56px] lg:top-0 left-0 h-[calc(100vh-48px)] md:h-[calc(100vh-56px)] lg:h-full",
            isSidebarOpen
              ? "w-[320px] lg:w-80 translate-x-0 p-6"
              : "w-0 -translate-x-full lg:w-0 p-0 border-none",
          )}
        >
          {isSidebarOpen && (
            <>
              {/* Progress Section */}
              <div className="flex flex-col gap-2 mb-4 shrink-0 transition-opacity">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-primary">
                    {progress}% Complete
                  </span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-1.5 hover:bg-surface-variant rounded-md transition-colors"
                  >
                    <X className="w-[18px] h-[18px] text-on-surface-variant" />
                  </button>
                </div>
                <div className="w-full h-2.5 bg-slate-300 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 flex-1 pb-4">
                {course.modules?.map((module, mIdx) => (
                  <div key={module.id} className="flex flex-col gap-2 mb-4">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                      {sentenceCase(module.title)}
                    </p>

                    {module.lessons?.map((lesson, lIdx) => {
                      const isActiveLesson = activeLessonId === lesson.id;
                      const isFinishedLesson = checkLessonCompleted(lesson.id);
                      const isLocked = isLessonLocked(lesson.id);

                      return (
                        <div key={lesson.id} className="flex flex-col">
                          <button
                            onClick={() => {
                              // Always navigate to the first item in this lesson
                              setExpandedModules((prev) => ({
                                ...prev,
                                [module.id]: true,
                              }));
                              setActiveLessonId(lesson.id);

                              // Find ALL items belonging to this lesson (contents + quizzes) in order
                              const lessonItems = allItems.filter(
                                (i) => i.lessonId === lesson.id,
                              );
                              if (lessonItems.length > 0) {
                                const firstItem = lessonItems[0];
                                setActiveItemId(firstItem.id);
                                setActiveItemType(firstItem.itemType);
                              }
                            }}
                            className={cn(
                              "transition-all flex items-center gap-3 p-3 rounded-lg text-left",
                              isActiveLesson
                                ? "bg-secondary-container text-on-secondary-container font-bold translate-x-1"
                                : "text-on-surface-variant hover:bg-surface-variant",
                            )}
                          >
                            {isLocked ? (
                              <Lock className="w-5 h-5 shrink-0" />
                            ) : isFinishedLesson ? (
                              <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-500 fill-blue-100" />
                            ) : (
                              <Unlock className="w-5 h-5 shrink-0" />
                            )}
                            <span className="text-sm font-semibold truncate">
                              {sentenceCase(lesson.title)}
                            </span>
                          </button>

                          {/* Nested Lesson Links */}
                          {isActiveLesson && (
                            <div className="pl-10 flex flex-col gap-1 mt-1 mb-2 border-l-2 border-secondary-container ml-5">
                              {lesson.contents?.map((content, cIdx) => {
                                const isActiveItem =
                                  activeItemId === content.id;
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
                                      "text-sm p-2 rounded-md text-left transition-colors flex items-center gap-2",
                                      isActiveItem
                                        ? "bg-primary text-on-primary font-bold"
                                        : "text-on-surface hover:bg-surface-container",
                                    )}
                                  >
                                    {content.type === "VIDEO" ? (
                                      <Play className="w-3.5 h-3.5 shrink-0" />
                                    ) : content.type === "PDF" ||
                                      content.url
                                        ?.toLowerCase()
                                        .endsWith(".pdf") ? (
                                      <FileText className="w-3.5 h-3.5 shrink-0" />
                                    ) : (
                                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                    )}
                                    <span className="truncate">
                                      {sentenceCase(content.title)}
                                    </span>
                                  </button>
                                );
                              })}

                              {allItems
                                .filter(
                                  (item: any) =>
                                    item.lessonId === lesson.id &&
                                    item.itemType === "quiz",
                                )
                                .map((quizItem, qIdx) => {
                                  const isActiveQuiz =
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
                                        "text-sm p-2 rounded-md text-left transition-colors flex items-center gap-2",
                                        isActiveQuiz
                                          ? "bg-primary text-on-primary font-bold"
                                          : "text-on-surface hover:bg-surface-container",
                                      )}
                                    >
                                      {(() => {
                                        const isReportSubmitted =
                                          quizItem.exercises?.some((ex: any) =>
                                            reportData?.some((m: any) =>
                                              m.lessons?.some((l: any) =>
                                                l.exercises?.some(
                                                  (rex: any) =>
                                                    Number(rex.exerciseId) ===
                                                      Number(ex.id) &&
                                                    (rex.status === "GRADED" ||
                                                      rex.status ===
                                                        "COMPLETED"),
                                                ),
                                              ),
                                            ),
                                          );
                                        const isCurrentSubmitted =
                                          quizSubmitted && isActiveQuiz;

                                        return isReportSubmitted ||
                                          isCurrentSubmitted ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-500 shadow-sm" />
                                        ) : (
                                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                                        );
                                      })()}
                                      <span className="truncate">
                                        {sentenceCase(quizItem.title)}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </>
          )}
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
          {/* Static Header for Lesson Contents */}
          <div className="w-full bg-white border-b border-slate-100 px-4 md:px-6 py-3 flex items-center justify-between gap-3 shrink-0 z-10 relative h-14 md:h-16">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-sm md:text-xl font-black text-slate-900 tracking-tight truncate">
                {sentenceCase(activeLesson?.title) || "Lesson details"}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
              <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={handlePrevItem}
                  disabled={currentItemIndex === 0}
                  className="p-1.5 md:px-3 md:py-1.5 rounded-md hover:bg-white transition-all disabled:opacity-30 flex items-center gap-1 text-xs font-bold text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden md:inline">Prev</span>
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1 hidden md:block" />
                <button
                  onClick={handleNextItem}
                  disabled={currentItemIndex === allItems.length - 1}
                  className="p-1.5 md:px-3 md:py-1.5 rounded-md hover:bg-white transition-all disabled:opacity-30 flex items-center gap-1 text-xs font-bold text-slate-600"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {activeItemType !== "quiz" && (
                <button
                  onClick={handleMarkComplete}
                  disabled={isLessonCompleted || markCompleteMutation.isPending}
                  className={cn(
                    "font-bold text-[10px] md:text-xs px-3 md:px-5 py-2 md:py-2.5 rounded-xl transition-all active:scale-[0.98] border shadow-sm",
                    isLessonCompleted
                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
                      : "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700",
                  )}
                >
                  {isLessonCompleted
                    ? "✓ Done"
                    : markCompleteMutation.isPending
                      ? "..."
                      : "Complete"}
                </button>
              )}
            </div>
          </div>

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
