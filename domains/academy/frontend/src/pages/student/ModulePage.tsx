import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Video as VideoIcon,
  Search,
  BookOpen,
  Download,
  CheckCircle2,
  Loader2,
  Menu,
  X,
  Lock,
  Trophy,
  Award,
} from "lucide-react";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import { courseApi } from "../../api/courseApi";
import { progressApi } from "../../api/progressApi";
import ErrorState from "../../components/states/ErrorState";
import type { Lesson, Exercise } from "../../components/common/types";
import FeedbackModal from "../../components/common/FeedbackModal";

const ModulePage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(
    lessonId ? Number(lessonId) : null,
  );
  const [lessonLoading, setLessonLoading] = useState(false);
  const [, setLessonError] = useState("");
  const [activeTab, setActiveTab] = useState<"CONTENT" | "ASSESSMENT">(
    "CONTENT",
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [, setSelectedAnswers] = useState<Record<number, string>>({});
  const [, setViewResults] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>(
    {},
  );

  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const lastFetchedLessonId = useRef<number | null>(null);

  const parsedCourseId = isNaN(Number(courseId))
    ? parseInt(courseId?.split("-").pop() || "0")
    : Number(courseId);

  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useCourse(parsedCourseId);

  const { data: modules = [], isLoading: areModulesLoading } =
    useCourseModules(parsedCourseId);

  useEffect(() => {
    if (modules.length > 0) {
      const initial = { ...expandedModules };

      if (Object.keys(expandedModules).length === 0) {
        modules.forEach((m, idx) => {
          const hasActiveLesson =
            activeLessonId && m.lessons?.some((l) => l.id === activeLessonId);
          initial[m.id] = !!hasActiveLesson || idx === 0;
        });
        setExpandedModules(initial);
      }

      if (!activeLessonId && modules[0]?.lessons?.[0]) {
        setActiveLessonId(modules[0].lessons[0].id);
      }
    }
  }, [modules, activeLessonId]);

  useEffect(() => {
    if (lessonId) {
      setActiveLessonId(Number(lessonId));
    }
  }, [lessonId]);

  useEffect(() => {
    if (activeLessonId && activeLessonId !== lastFetchedLessonId.current) {
      lastFetchedLessonId.current = activeLessonId;
      fetchLessonData(activeLessonId);
      setViewResults(false);
      setSelectedAnswers({});
      setActiveTab("CONTENT");
    }
  }, [activeLessonId]);

  useEffect(() => {
    fetchDetailedProgress();
  }, [courseId, activeLessonId]);

  const fetchDetailedProgress = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const currentUser = JSON.parse(storedUser);
      // Try multiple ID fields just in case
      const studentId = currentUser.firebaseId || currentUser.id?.toString();
      if (!studentId) return;

      const progressRes = await progressApi.getDetailedStudentProgress(
        parsedCourseId,
        studentId,
      );
      setCourseProgress(progressRes.data);

      // Check if course is completed
      const allLessons = progressRes.data.flatMap((m: any) => m.lessons || []);
      const completedLessons = allLessons.filter(
        (l: any) => l.status === "COMPLETED",
      );
      const progressPercentage =
        allLessons.length > 0
          ? (completedLessons.length / allLessons.length) * 100
          : 0;

      if (progressPercentage === 100) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // Refresh data when module changes
  useEffect(() => {
    if (activeLessonId) {
      fetchLessonData(activeLessonId);
    }
  }, [modules]);

  const fetchLessonData = async (id: number) => {
    try {
      setLessonLoading(true);
      setLessonError("");

      const lessonRes = await courseApi.getLesson(id);

      const currentLesson = lessonRes.data?.data || lessonRes.data;

      // progressApi
      //   .updateProgress({
      //     courseId: parsedCourseId,
      //     moduleId: currentLesson.moduleId,
      //     lessonId: currentLesson.id,
      //     progress: 100,
      //   })
      //   .catch(() => {});

      // Fetch content
      const contentsRes = await courseApi.getContent(id);

      const contentList = Array.isArray(contentsRes.data)
        ? contentsRes.data
        : contentsRes.data?.items || contentsRes.data?.data?.items || [];

      setActiveLesson({ ...currentLesson, contents: contentList });

      // Fetch exercises
      const exercisesRes = await courseApi.getExercisesByModule(
        currentLesson.moduleId,
      );

      const exList = Array.isArray(exercisesRes.data)
        ? exercisesRes.data
        : exercisesRes.data?.items || [];

      // Filter exercises to only show those for the current lesson
      const lessonExercises = exList.filter((ex: any) => ex.lessonId === id);

      setExercises(lessonExercises);
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      setLessonError("Failed to load lesson content.");
    } finally {
      setLessonLoading(false);
    }
  };

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markLessonAsComplete = async () => {
    if (!activeLesson || !courseId) return;

    try {
      await progressApi.completeLesson(parseInt(courseId), activeLesson.id);

      // Refresh progress data
      await fetchDetailedProgress();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const navigateToLesson = (lesson: any) => {
    if (isLessonLocked(lesson.id)) return;
    navigate(`/student-dashboard/course/${courseId}/lesson/${lesson.id}`);
    setMobileOpen(false);
  };

  const isLessonLocked = (id: number) => {
    if (!courseProgress) return false;

    const allLessons = modules.flatMap((m: any) => m.lessons || []);
    const lessonIndex = allLessons.findIndex((l: any) => l.id === id);

    if (lessonIndex <= 0) return false;

    // Check if the previous lesson is completed
    const prevLessonId = allLessons[lessonIndex - 1].id;
    const prevLessonProgress = courseProgress
      .flatMap((m: any) => m.lessons || [])
      .find((l: any) => l.lessonId === prevLessonId);

    return prevLessonProgress?.status !== "COMPLETED";
  };

  const isLessonCompleted = (id: number) => {
    if (!courseProgress) return false;
    const lessonProgress = courseProgress
      .flatMap((m: any) => m.lessons || [])
      .find((l: any) => l.lessonId === id);
    return lessonProgress?.status === "COMPLETED";
  };

  const getOverallProgress = () => {
    if (!courseProgress) return 0;
    const allLessons = courseProgress.flatMap((m: any) => m.lessons || []);
    const completedLessons = allLessons.filter(
      (l: any) => l.status === "COMPLETED",
    );
    return allLessons.length > 0
      ? Math.round((completedLessons.length / allLessons.length) * 100)
      : 0;
  };

  const isYouTubeUrl = (url: string) =>
    url?.includes("youtube") || url?.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = "";
      if (urlObj.hostname.includes("youtu.be"))
        videoId = urlObj.pathname.substring(1);
      else videoId = urlObj.searchParams.get("v") || "";
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return url;
    }
  };

  // Quiz functions
  const handleAnswerSelect = (exerciseId: number, answer: any) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [exerciseId]: answer,
    }));
  };

  const submitExercise = async (exerciseId: number, _exercise: any) => {
    try {
      const answer = quizAnswers[exerciseId];
      const result = await courseApi.submitExercise(exerciseId, answer);

      // Mark as submitted
      setQuizSubmitted((prev) => ({
        ...prev,
        [exerciseId]: true,
      }));

      return result;
    } catch (error: any) {
      console.error("Error submitting exercise:", error);
      setFeedback({
        isOpen: true,
        title: "Submission Failed",
        message:
          error?.response?.data?.message ||
          "There was an issue submitting your answer. Please try again.",
        type: "error",
      });
    }
  };

  if (isCourseLoading || areModulesLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isCourseError) {
    return <ErrorState title="Error" message="Failed" />;
  }

  const mainVideoBlock = activeLesson?.contents?.find(
    (c) => c.type === "VIDEO",
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Modern Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/student-dashboard/mycourses")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold text-gray-900 truncate">
              {activeLesson?.title || "Course Content"}
            </h1>
            <p className="text-xs text-gray-500">
              {courseData?.title || "Loading course..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
          >
            <Menu size={20} />
          </button>

          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Your Progress
              </span>
              <span className="text-xs font-black text-blue-600">
                {getOverallProgress()}%
              </span>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                style={{ width: `${getOverallProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Video Player Section */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video flex items-center justify-center">
            {lessonLoading ? (
              <div className="flex flex-col items-center text-white">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="text-sm opacity-75">Loading content...</p>
              </div>
            ) : mainVideoBlock ? (
              isYouTubeUrl(mainVideoBlock.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(mainVideoBlock.url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  src={mainVideoBlock.url}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="flex flex-col items-center text-white text-center p-6">
                <VideoIcon size={48} className="opacity-50 mb-3" />
                <h3 className="text-lg font-medium mb-1">No Video Content</h3>
                <p className="text-sm opacity-75 max-w-md">
                  This lesson doesn't contain video content. Check the study
                  materials below.
                </p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {activeLesson?.title}
              </h1>

              {activeLesson?.description && (
                <p className="text-gray-600 text-base leading-relaxed">
                  {activeLesson.description}
                </p>
              )}
            </div>

            {/* Course Completion Celebration */}
            {isCompleted && (
              <div className="mb-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Trophy size={160} />
                </div>
                <div className="relative z-10 text-center max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={40} className="text-yellow-300" />
                  </div>
                  <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">
                    Course Completed!
                  </h2>
                  <p className="text-blue-100 text-lg mb-8 font-medium">
                    Congratulations! You've mastered all the lessons in this
                    course.
                  </p>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
                  >
                    View My Certificate
                  </button>
                </div>
              </div>
            )}

            {/* Study Notes Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Study Notes
                </h2>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all hover:border-gray-300">
                <textarea
                  className="w-full p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
                  placeholder="Take notes while watching the lesson..."
                />
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab("CONTENT")}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === "CONTENT"
                      ? "bg-white text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <BookOpen size={16} />
                    Content
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("ASSESSMENT")}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === "ASSESSMENT"
                      ? "bg-white text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    Assessment
                  </div>
                </button>
              </div>

              <div className="p-6">
                {activeTab === "CONTENT" ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="text-blue-600" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Learning Materials
                      </h3>
                    </div>

                    {lessonLoading ? (
                      <div className="flex flex-col items-center py-8">
                        <Loader2
                          className="animate-spin text-blue-500 mb-3"
                          size={24}
                        />
                        <p className="text-gray-500">Loading content...</p>
                      </div>
                    ) : activeLesson?.contents &&
                      activeLesson.contents.length > 0 ? (
                      <div className="space-y-4">
                        {activeLesson.contents.map((content) => (
                          <div
                            key={content.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {content.type === "VIDEO" && (
                                  <VideoIcon
                                    className="text-red-500"
                                    size={18}
                                  />
                                )}
                                {content.type === "TEXT" && (
                                  <FileText
                                    className="text-blue-500"
                                    size={18}
                                  />
                                )}
                                {content.type === "PDF" && (
                                  <FileText
                                    className="text-orange-500"
                                    size={18}
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {content.title}
                                </h4>
                                {content.body && (
                                  <p className="text-gray-600 text-sm mt-1">
                                    {content.body}
                                  </p>
                                )}
                                {content.url && (
                                  <div className="mt-2">
                                    <a
                                      href={content.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                      <span>View Content</span>
                                      <Download size={14} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen
                          className="mx-auto text-gray-300 mb-3"
                          size={48}
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Content Available
                        </h3>
                        <p className="text-gray-500">
                          Your instructor hasn't added any learning materials to
                          this lesson yet.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Assessments
                      </h3>
                    </div>

                    {/* Complete Lesson Action / Next Lesson Button */}
                    <div className="mb-8 p-8 bg-gray-50 rounded-[24px] border border-gray-100 flex flex-col items-center text-center">
                      {isLessonCompleted(activeLesson?.id || 0) ? (
                        <>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <CheckCircle2 size={24} />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            Lesson Completed!
                          </h4>
                          <p className="text-gray-500 mb-6 font-medium">
                            You've finished all the materials for this lesson.
                          </p>

                          {(() => {
                            const allLessons = modules.flatMap(
                              (m: any) => m.lessons || [],
                            );
                            const currentIndex = allLessons.findIndex(
                              (l: any) => l.id === activeLessonId,
                            );
                            const nextLesson = allLessons[currentIndex + 1];

                            if (nextLesson) {
                              return (
                                <button
                                  onClick={() => navigateToLesson(nextLesson)}
                                  className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20 group"
                                >
                                  Next Lesson
                                  <ChevronRight
                                    size={16}
                                    className="group-hover:translate-x-1 transition-transform"
                                  />
                                </button>
                              );
                            }
                            return (
                              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                                <Trophy size={20} />
                                <span>Module Completed</span>
                              </div>
                            );
                          })()}
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                            <BookOpen size={24} />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            Ready to move on?
                          </h4>
                          <p className="text-gray-500 mb-6 font-medium">
                            Mark this lesson as complete to track your progress.
                          </p>
                          <button
                            onClick={markLessonAsComplete}
                            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20"
                          >
                            <CheckCircle2 size={16} />
                            Complete Lesson
                          </button>
                        </>
                      )}
                    </div>

                    {lessonLoading ? (
                      <div className="flex flex-col items-center py-8">
                        <Loader2
                          className="animate-spin text-blue-500 mb-3"
                          size={24}
                        />
                        <p className="text-gray-500">Loading assessments...</p>
                      </div>
                    ) : exercises && exercises.length > 0 ? (
                      <div className="space-y-6">
                        {exercises.map((exercise, index) => (
                          <div
                            key={exercise.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                          >
                            {/* Exercise Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                  <span className="text-green-700 font-medium text-sm">
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {exercise.title}
                                  </h4>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {exercise.question}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {exercise.type
                                        .replace("_", " ")
                                        .toLowerCase()}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      {exercise.points} points
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Exercise Options */}
                            <div className="mt-4">
                              {exercise.type === "TRUE_FALSE" ? (
                                <div className="grid grid-cols-2 gap-4">
                                  {["True", "False"].map((option) => (
                                    <button
                                      key={option}
                                      onClick={() =>
                                        handleAnswerSelect(
                                          exercise.id,
                                          option.toLowerCase(),
                                        )
                                      }
                                      disabled={quizSubmitted[exercise.id]}
                                      className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${
                                        quizAnswers[exercise.id] ===
                                        option.toLowerCase()
                                          ? "border-green-500 bg-green-50 text-green-700"
                                          : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                                      } ${quizSubmitted[exercise.id] ? "opacity-75 cursor-not-allowed" : ""}`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {(exercise.options || []).map(
                                    (option: string, idx: number) => (
                                      <button
                                        key={idx}
                                        onClick={() =>
                                          handleAnswerSelect(
                                            exercise.id,
                                            option,
                                          )
                                        }
                                        disabled={quizSubmitted[exercise.id]}
                                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                          quizAnswers[exercise.id] === option
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                                        } ${quizSubmitted[exercise.id] ? "opacity-75 cursor-not-allowed" : ""}`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                              quizAnswers[exercise.id] ===
                                              option
                                                ? "border-blue-500 bg-blue-500"
                                                : "border-gray-300"
                                            }`}
                                          >
                                            {quizAnswers[exercise.id] ===
                                              option && (
                                              <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                          </div>
                                          <span>{option}</span>
                                        </div>
                                      </button>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 flex justify-end">
                              <button
                                onClick={() =>
                                  submitExercise(exercise.id, exercise)
                                }
                                disabled={
                                  !quizAnswers[exercise.id] ||
                                  quizSubmitted[exercise.id]
                                }
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                  quizAnswers[exercise.id] &&
                                  !quizSubmitted[exercise.id]
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                {quizSubmitted[exercise.id]
                                  ? "Submitted"
                                  : "Submit"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle2
                          className="mx-auto text-gray-300 mb-3"
                          size={48}
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Assessments
                        </h3>
                        <p className="text-gray-500">
                          There are no quizzes or exercises for this lesson.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Course Outline
              </h2>
            </div>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-3">
              {modules.map((module) => (
                <div key={module.id} className="mb-2">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-3 flex justify-between items-center text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <span className="truncate">{module.title}</span>
                    {expandedModules[module.id] ? (
                      <ChevronDown
                        className="text-gray-500 flex-shrink-0"
                        size={16}
                      />
                    ) : (
                      <ChevronRight
                        className="text-gray-500 flex-shrink-0"
                        size={16}
                      />
                    )}
                  </button>

                  {expandedModules[module.id] && module.lessons && (
                    <div className="mt-1 space-y-1">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(lesson)}
                          disabled={isLessonLocked(lesson.id)}
                          className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all flex items-center justify-between group ${
                            lesson.id === activeLessonId
                              ? "bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                              : isLessonLocked(lesson.id)
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isLessonLocked(lesson.id) ? (
                              <Lock
                                size={12}
                                className="text-gray-300 flex-shrink-0"
                              />
                            ) : lesson.id === activeLessonId ? (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            ) : (
                              <div className="w-2 h-2 rounded-full flex-shrink-0"></div>
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {isLessonCompleted(lesson.id) &&
                            !isLessonLocked(lesson.id) && (
                              <CheckCircle2
                                size={14}
                                className="text-green-500 flex-shrink-0"
                              />
                            )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar Panel */}
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Course Outline
                  </h2>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search lessons..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Modules List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                {modules.map((module) => (
                  <div key={module.id} className="mb-2">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-3 flex justify-between items-center text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <span className="truncate">{module.title}</span>
                      {expandedModules[module.id] ? (
                        <ChevronDown
                          className="text-gray-500 flex-shrink-0"
                          size={16}
                        />
                      ) : (
                        <ChevronRight
                          className="text-gray-500 flex-shrink-0"
                          size={16}
                        />
                      )}
                    </button>

                    {expandedModules[module.id] && module.lessons && (
                      <div className="mt-1 space-y-1">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(lesson)}
                            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all flex items-center gap-2 ${
                              lesson.id === activeLessonId
                                ? "bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {lesson.id === activeLessonId ? (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            ) : (
                              <div className="w-2 h-2 rounded-full flex-shrink-0"></div>
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal Placeholder */}
      {showCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-8 right-8 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="p-16 flex flex-col items-center text-center">
              <div className="w-full aspect-[1.414/1] bg-white border-[20px] border-double border-indigo-900 rounded-lg p-12 flex flex-col items-center justify-center relative mb-8 shadow-inner overflow-hidden">
                {/* Premium Decorative Corners */}
                <div className="absolute top-0 left-0 w-40 h-40 border-l-[12px] border-t-[12px] border-amber-500/30 m-6 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-40 h-40 border-r-[12px] border-t-[12px] border-amber-500/30 m-6 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 border-l-[12px] border-b-[12px] border-amber-500/30 m-6 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 border-r-[12px] border-b-[12px] border-amber-500/30 m-6 rounded-br-lg"></div>

                <div className="mb-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl mb-4 p-1">
                    <div className="w-full h-full bg-indigo-950 rounded-full flex items-center justify-center">
                      <Trophy size={48} className="text-amber-500" />
                    </div>
                  </div>
                  <h3 className="text-5xl font-serif text-indigo-950 mb-4 uppercase tracking-[0.3em] font-light">
                    Certificate
                  </h3>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-[0.5em] mb-8">
                    OF COMPLETION
                  </div>
                </div>

                <div className="w-full max-w-lg space-y-6">
                  <div>
                    <p className="text-slate-500 italic text-lg font-serif mb-2">
                      This is to officially recognize
                    </p>
                    <h4 className="text-6xl font-black text-indigo-950 mb-2 font-serif bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-blue-800">
                      {JSON.parse(localStorage.getItem("user") || "{}")
                        .firstname ||
                        JSON.parse(localStorage.getItem("user") || "{}").user
                          ?.firstname ||
                        "Student Name"}
                    </h4>
                  </div>

                  <div>
                    <p className="text-slate-500 italic text-lg font-serif mb-2">
                      for successfully mastering the curriculum of
                    </p>
                    <h5 className="text-3xl font-bold text-indigo-700 mb-8 max-w-md mx-auto">
                      {courseData?.title}
                    </h5>
                  </div>
                </div>

                <div className="flex justify-between w-full max-w-2xl mt-12 px-12">
                  <div className="text-center">
                    <div className="w-48 border-b border-indigo-200 mb-2 py-2 text-xl font-serif text-indigo-900">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Graduation Date
                    </p>
                  </div>

                  <div className="text-center relative">
                    <div className="w-48 border-b border-indigo-200 mb-2 py-2 text-xl font-serif text-indigo-900 italic">
                      {courseData?.instructor?.firstname}{" "}
                      {courseData?.instructor?.lastname}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Lead Instructor
                    </p>
                  </div>
                </div>

                {/* Premium Gold Seal */}
                <div className="absolute -bottom-8 -right-8 w-40 h-40 rotate-12 flex items-center justify-center">
                  <div className="w-full h-full bg-amber-500 rounded-full shadow-2xl flex items-center justify-center p-1 border-[6px] border-amber-600">
                    <div className="w-full h-full border-4 border-dashed border-amber-400 rounded-full flex items-center justify-center flex-col text-indigo-950 font-black p-2 leading-none">
                      <span className="text-[10px]">ALIKOHUB</span>
                      <Award size={24} className="my-1" />
                      <span className="text-[8px]">CERTIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Download size={18} /> Download PDF
                </button>
                <button className="bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">
                  <X size={18} /> Share LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type}
      />
    </div>
  );
};

export default ModulePage;
