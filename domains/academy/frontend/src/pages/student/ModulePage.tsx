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
  Trophy,
  Settings,
} from "lucide-react";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import { courseApi } from "../../api/courseApi";
import { progressApi } from "../../api/progressApi";
import ErrorState from "../../components/states/ErrorState";
import type { Lesson, Exercise } from "../../components/common/types";

const ModulePage: React.FC = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const [] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});

  // Lesson specific state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(
    lessonId ? Number(lessonId) : null,
  );
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState("");
  const [activeTab, setActiveTab] = useState<"CONTENT" | "ASSESSMENT">(
    "CONTENT",
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [viewResults, setViewResults] = useState(false);
  const lastFetchedLessonId = useRef<number | null>(null);

  // Parse courseId
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

  // Initialize expanded modules and default lesson
  useEffect(() => {
    if (modules.length > 0) {
      // Expand modules that contain the active lesson or just the first module
      const initial: Record<number, boolean> = { ...expandedModules };

      if (Object.keys(expandedModules).length === 0) {
        modules.forEach((m, idx) => {
          const hasActiveLesson =
            activeLessonId && m.lessons?.some((l) => l.id === activeLessonId);
          initial[m.id] = !!hasActiveLesson || idx === 0;
        });
        setExpandedModules(initial);
      }

      // If no lessonId in URL, default to first lesson of first module
      if (!activeLessonId && modules[0]?.lessons?.[0]) {
        const firstLessonId = modules[0].lessons[0].id;
        setActiveLessonId(firstLessonId);
      }
    }
  }, [modules, activeLessonId]);

  // Update activeLessonId when URL changes
  useEffect(() => {
    if (lessonId) {
      setActiveLessonId(Number(lessonId));
    }
  }, [lessonId]);

  // Fetch lesson details when activeLessonId changes
  useEffect(() => {
    if (activeLessonId && activeLessonId !== lastFetchedLessonId.current) {
      lastFetchedLessonId.current = activeLessonId;
      fetchLessonData(activeLessonId);

      // Reset lesson-specific UI state
      setViewResults(false);
      setSelectedAnswers({});
      setActiveTab("CONTENT");
    }
  }, [activeLessonId]);

  const fetchLessonData = async (id: number) => {
    try {
      setLessonLoading(true);
      setLessonError("");

      const lessonRes = await courseApi.getLesson(id);
      const currentLesson = lessonRes.data?.data || lessonRes.data;

      if (!currentLesson?.id) throw new Error("Lesson synchronization failed");

      // Update progress automatically when lesson is opened
      progressApi
        .updateProgress({
          courseId: parsedCourseId,
          moduleId: currentLesson.moduleId,
          lessonId: currentLesson.id,
          progress: 100, // Marking as viewed/completed on access
        })
        .catch((err) => console.error("Progress Sync Failure:", err));

      // Fetch lesson content
      const contentsRes = await courseApi.getContent(id);
      const contentList = Array.isArray(contentsRes.data)
        ? contentsRes.data
        : contentsRes.data?.items || contentsRes.data?.data?.items || [];

      setActiveLesson({ ...currentLesson, contents: contentList });

      // Fetch exercises for this module
      if (currentLesson.moduleId) {
        const exercisesRes = await courseApi.getExercisesByModule(
          currentLesson.moduleId,
        );
        const exList = Array.isArray(exercisesRes.data)
          ? exercisesRes.data
          : exercisesRes.data?.items || exercisesRes.data?.data?.items || [];

        setExercises(exList.filter((ex: any) => ex.lessonId === id));
      }
    } catch (err: any) {
      console.error("Lesson Fetch Error:", err);
      setLessonError(
        err?.response?.status === 429
          ? "Too many requests. Please wait."
          : "Failed to load lesson content.",
      );
    } finally {
      setLessonLoading(false);
    }
  };

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navigateToLesson = (lesson: any) => {
    navigate(`/student-dashboard/course/${courseId}/lesson/${lesson.id}`);
  };

  const isYouTubeUrl = (url: string) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = "";
      if (urlObj.hostname.includes("youtu.be"))
        videoId = urlObj.pathname.substring(1);
      else if (urlObj.hostname.includes("youtube.com"))
        videoId = urlObj.searchParams.get("v") || "";
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
        : url;
    } catch {
      return url;
    }
  };

  if (isCourseLoading || areModulesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-[#3E92D1]" />
          <p className="text-gray-500 font-medium text-sm animate-pulse">
            Syncing Academy Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (isCourseError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <ErrorState
          title="Curriculum Unavailable"
          message="We couldn't retrieve the curriculum. Please try again later."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const totalLessons = modules.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0,
  );
  const progressPercent = 35; // Mock until integration

  const mainVideoBlock = activeLesson?.contents?.find(
    (c) => c.type === "VIDEO",
  );
  const otherContents =
    activeLesson?.contents?.filter((c) => c.type !== "VIDEO") || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col">
      {/* Dynamic Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/student-dashboard/mycourses")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-slate-900 truncate">
                {courseData?.title}
              </h1>
              {activeLesson && (
                <p className="text-[10px] text-[#3E92D1] font-bold uppercase tracking-wider">
                  {activeLesson.title}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Progress
                </span>
                <span className="text-[10px] font-black text-slate-900">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* MAIN VIEWPORT: Content & Lesson Player */}
        <main className="flex-1 overflow-y-auto bg-white border-r border-slate-200 no-scrollbar">
          {lessonLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-[#3E92D1] animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Initialising Content...
              </p>
            </div>
          ) : lessonError ? (
            <div className="h-full flex items-center justify-center p-12">
              <ErrorState
                title="Load Failed"
                message={lessonError}
                onRetry={() =>
                  activeLessonId && fetchLessonData(activeLessonId)
                }
              />
            </div>
          ) : activeLesson ? (
            <div className="pb-24">
              {/* Media Section */}
              <div className="bg-black aspect-video relative group border-b border-slate-200">
                {mainVideoBlock ? (
                  <div className="w-full h-full">
                    {isYouTubeUrl(mainVideoBlock.url) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(mainVideoBlock.url)}
                        className="w-full h-full"
                        allowFullScreen
                        title={mainVideoBlock.title}
                      />
                    ) : (
                      <video
                        src={mainVideoBlock.url}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-slate-900">
                    <VideoIcon
                      size={48}
                      className="mb-4 opacity-20 text-white"
                    />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      Knowledge Module Active
                    </p>
                  </div>
                )}
              </div>

              {/* Tabs Section */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-slate-100 mb-8 px-8">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => setActiveTab("CONTENT")}
                    className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                      activeTab === "CONTENT"
                        ? "text-[#3E92D1] border-[#3E92D1]"
                        : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}
                  >
                    Module Details
                  </button>
                  <button
                    onClick={() => setActiveTab("ASSESSMENT")}
                    className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                      activeTab === "ASSESSMENT"
                        ? "text-[#3E92D1] border-[#3E92D1]"
                        : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}
                  >
                    Exercises ({exercises.length})
                  </button>
                </div>
              </div>

              <div className="px-8 max-w-4xl">
                {activeTab === "CONTENT" ? (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 mb-4">
                        {activeLesson.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                        {activeLesson.description ||
                          "No description provided for this module."}
                      </p>
                    </div>

                    {otherContents.length > 0 && (
                      <div className="space-y-4 pt-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Resources & Attachments
                        </h3>
                        <div className="grid gap-3">
                          {otherContents.map((block) => (
                            <div
                              key={block.id}
                              className="group p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#3E92D1]/30 transition-all flex items-start gap-4"
                            >
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#3E92D1] shadow-sm border border-slate-100">
                                <FileText size={18} />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-bold text-slate-900 mb-1">
                                  {block.title || "Study Material"}
                                </h4>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                                  {block.body || block.content}
                                </p>
                                {block.url && (
                                  <a
                                    href={block.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-[10px] font-black text-[#3E92D1] uppercase tracking-tighter"
                                  >
                                    <Download size={12} /> Access Resource
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">
                        Knowledge Check
                      </h3>
                      <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {exercises.length} Tasks
                      </div>
                    </div>

                    {exercises.length > 0 ? (
                      <div className="space-y-6 pb-12">
                        {exercises.map((ex, idx) => (
                          <div
                            key={ex.id}
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8"
                          >
                            <div className="flex gap-4 mb-6">
                              <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-[#3E92D1] shrink-0">
                                {idx + 1}
                              </span>
                              <h4 className="text-sm lg:text-base font-bold text-slate-900 pt-1 leading-snug">
                                {ex.question}
                              </h4>
                            </div>

                            <div className="grid gap-2 pl-12">
                              {(ex.type === "MULTIPLE_CHOICE"
                                ? (ex.options as string[])
                                : ["true", "false"]
                              ).map((opt) => {
                                const isSelected =
                                  selectedAnswers[ex.id] === opt;
                                const isCorrect = opt === ex.correctAnswer;
                                const showResult = viewResults;

                                let themeClass =
                                  "bg-white border-slate-200 text-slate-600 hover:border-slate-300";
                                if (showResult) {
                                  if (isCorrect)
                                    themeClass =
                                      "bg-green-50 border-green-500 text-green-700";
                                  else if (isSelected)
                                    themeClass =
                                      "bg-red-50 border-red-500 text-red-700";
                                } else if (isSelected) {
                                  themeClass =
                                    "bg-[#3E92D1]/5 border-[#3E92D1] text-[#3E92D1]";
                                }

                                return (
                                  <button
                                    key={opt}
                                    disabled={viewResults}
                                    onClick={() =>
                                      setSelectedAnswers({
                                        ...selectedAnswers,
                                        [ex.id]: opt,
                                      })
                                    }
                                    className={`p-4 rounded-xl border text-sm font-bold text-left capitalize transition-all flex items-center justify-between ${themeClass}`}
                                  >
                                    {opt}
                                    {showResult && isCorrect && (
                                      <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {!viewResults && (
                          <button
                            onClick={() => setViewResults(true)}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                          >
                            Submit Assessment
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center text-center opacity-30">
                        <Trophy size={48} className="mb-4 text-slate-300" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                          No Assessment Required
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <BookOpen size={48} className="text-slate-200 mb-6" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Select a lesson to begin
              </h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Pick any topic from the curriculum sidebar to start your
                learning journey.
              </p>
            </div>
          )}
        </main>

        {/* SIDEBAR: Full Curriculum Playlist */}
        <aside className="w-80 lg:w-[400px] flex flex-col bg-slate-50 h-full overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Course Curriculum
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {totalLessons} Modules
              </span>
            </div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#3E92D1] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar p-3 space-y-2">
            {modules.map((module, mIdx) => {
              const lessons = module.lessons || [];
              const filteredLessons = lessons.filter(
                (l) =>
                  !searchTerm ||
                  l.title.toLowerCase().includes(searchTerm.toLowerCase()),
              );
              const isExpanded = expandedModules[module.id] || searchTerm;

              if (searchTerm && filteredLessons.length === 0) return null;

              return (
                <div key={module.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      isExpanded
                        ? "bg-white shadow-sm ring-1 ring-slate-200"
                        : "hover:bg-slate-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                        {mIdx + 1}
                      </div>
                      <div className="text-left">
                        <p
                          className={`text-xs font-bold leading-none mb-1 ${isExpanded ? "text-slate-900" : "text-slate-600"}`}
                        >
                          {module.title}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                          {lessons.length} Modules active
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-300" />
                    )}
                  </button>

                  <div
                    className={`mt-1 space-y-1 overflow-hidden transition-all ${isExpanded ? "max-h-[1000px] py-1" : "max-h-0"}`}
                  >
                    {filteredLessons.map((lesson) => {
                      const isActive = activeLessonId === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigateToLesson(lesson)}
                          className={`w-full p-3 pl-12 rounded-lg flex items-center justify-between text-left group transition-all ${
                            isActive
                              ? "bg-[#3E92D1]/5 text-[#3E92D1]"
                              : "text-slate-500 hover:bg-white hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {lesson.type === "VIDEO" ? (
                              <VideoIcon size={12} />
                            ) : (
                              <FileText size={12} />
                            )}
                            <span
                              className={`text-[11px] font-medium transition-colors ${isActive ? "font-bold" : ""}`}
                            >
                              {lesson.title}
                            </span>
                          </div>
                          {isActive && (
                            <div className="w-1 h-1 rounded-full bg-[#3E92D1] shadow-[0_0_8px_rgba(62,146,209,0.8)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ModulePage;
