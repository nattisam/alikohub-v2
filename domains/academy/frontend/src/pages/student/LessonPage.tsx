import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import {
  FileText,
  Video,
  Download,
  Trophy,
  Loader2,
  Clock,
  Play,
  CheckCircle2,
  ArrowLeft,
  Settings,
} from "lucide-react";
import type { Lesson, Exercise } from "../../components/common/types";
import ErrorState from "../../components/states/ErrorState";

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const lessonIdNum = Number(lessonId);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [moduleExercises, setModuleExercises] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // View State
  const [activeTab, setActiveTab] = useState<"CONTENT" | "ASSESSMENT">(
    "CONTENT",
  );

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [viewResults, setViewResults] = useState(false);
  const lastFetchedId = useRef<number | null>(null);

  useEffect(() => {
    if (lessonIdNum && lessonIdNum !== lastFetchedId.current) {
      lastFetchedId.current = lessonIdNum;
      fetchLessonAndData(lessonIdNum);

      setViewResults(false);
      setSelectedAnswers({});
    }
  }, [lessonIdNum]);

  const fetchLessonAndData = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const lessonRes = await courseApi.getLesson(id);
      const currentLesson = lessonRes.data?.data || lessonRes.data;

      if (!currentLesson?.id) throw new Error("Lesson synchronization failed");

      if (currentLesson.moduleId) {
        // Optimization: Only fetch module-wide data if we don't have it or it's a different module
        const needsModuleData =
          moduleLessons.length === 0 ||
          moduleLessons[0].moduleId !== currentLesson.moduleId;

        const requests: Promise<any>[] = [courseApi.getContent(id)];

        if (needsModuleData) {
          requests.push(courseApi.getLessons(currentLesson.moduleId));
          requests.push(courseApi.getExercisesByModule(currentLesson.moduleId));
        }

        const responses = await Promise.all(requests);
        const contentsRes = responses[0];

        const contentList = Array.isArray(contentsRes.data)
          ? contentsRes.data
          : contentsRes.data?.items || contentsRes.data?.data?.items || [];

        setLesson({ ...currentLesson, contents: contentList });

        if (needsModuleData) {
          const lessonsRes = responses[1];
          const exercisesRes = responses[2];

          const mLessons = Array.isArray(lessonsRes.data)
            ? lessonsRes.data
            : lessonsRes.data?.items || [];
          setModuleLessons(
            mLessons.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
          );

          const exList = Array.isArray(exercisesRes.data)
            ? exercisesRes.data
            : exercisesRes.data?.items || exercisesRes.data?.data?.items || [];

          setModuleExercises(exList);
          setExercises(exList.filter((ex: any) => ex.lessonId === id));
        } else {
          // Optimization: Filter from cached module exercises
          setExercises(moduleExercises.filter((ex: any) => ex.lessonId === id));
        }
      }
    } catch (err: any) {
      console.error("Transmission Error:", err);
      setError(
        err?.response?.status === 429
          ? "Workspace synchronization throttled. Retrying..."
          : "Workspace unavailable.",
      );
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          Loading Lesson...
        </p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#09090b] flex items-center justify-center p-6">
        <ErrorState
          title="Content Unavailable"
          message={error}
          onRetry={() => navigate(-1)}
        />
      </div>
    );
  }

  // Find the video block (if any) to display in the main player area
  const mainVideoBlock = lesson.contents?.find((c) => c.type === "VIDEO");
  // Filter out the video block from the content list so it's not duplicated below
  const otherContents =
    lesson.contents?.filter((c) => c.type !== "VIDEO") || [];

  return (
    <div className="fixed inset-0 z-[100] bg-[#09090b] text-slate-200 flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-white/[0.08] bg-[#09090b] flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link
            to={`/student-dashboard/course/${courseId}`}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Course</span>
          </Link>

          <div className="h-6 w-px bg-white/10" />

          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">
              Now Playing
            </div>
            <h1 className="text-sm font-bold text-white tracking-wide truncate max-w-md">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Course Progress
            </span>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              {/* Placeholder progress calculation */}
              <div className="h-full w-[35%] bg-blue-600 rounded-full" />
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
            S
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#09090b] relative scroll-smooth no-scrollbar">
          {/* VIDEO PLAYER */}
          <div className="w-full bg-black aspect-video relative group shrink-0 border-b border-white/5">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-[#050505]">
                <Video size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium uppercase tracking-widest opacity-40">
                  No Video Available
                </p>
              </div>
            )}
          </div>

          {/* CONTENT TABS & BODY */}
          <div className="flex-1 max-w-5xl mx-auto w-full px-8 pb-32">
            <div className="flex items-center gap-8 py-6 border-b border-white/[0.06] mb-8 sticky top-0 bg-[#09090b] z-10">
              <button
                onClick={() => setActiveTab("CONTENT")}
                className={`flex items-center gap-2 text-sm font-bold pb-4 border-b-2 transition-all ${
                  activeTab === "CONTENT"
                    ? "text-blue-500 border-blue-500"
                    : "text-slate-500 border-transparent hover:text-white"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px]">
                  i
                </div>
                About this Lesson
              </button>
              <button
                onClick={() => setActiveTab("ASSESSMENT")}
                className={`flex items-center gap-2 text-sm font-bold pb-4 border-b-2 transition-all ${
                  activeTab === "ASSESSMENT"
                    ? "text-blue-500 border-blue-500"
                    : "text-slate-500 border-transparent hover:text-white"
                }`}
              >
                <CheckCircle2 size={14} />
                Exercises
              </button>
            </div>

            {activeTab === "CONTENT" ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {lesson.title}
                  </h2>
                  <div className="text-slate-400 text-base leading-relaxed whitespace-pre-wrap">
                    {lesson.description ||
                      "No description provided for this lesson."}
                  </div>
                </div>

                {otherContents.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                      Lesson Resources
                    </h3>
                    {otherContents.map((block) => (
                      <div
                        key={block.id}
                        className="bg-white/[0.03] border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${block.type === "PDF" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}
                          >
                            {block.type === "PDF" ? (
                              <FileText size={20} />
                            ) : (
                              <FileText size={20} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-sm mb-1">
                              {block.title || "Untitled Resource"}
                            </h4>
                            <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                              {block.body || block.content}
                            </div>
                            {block.url && (
                              <a
                                href={block.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 hover:bg-blue-500/10 transition-colors"
                              >
                                <Download size={14} />
                                Download Resource
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Knowledge Check
                  </h2>
                  <span className="text-sm text-slate-500">
                    {exercises.length} Questions
                  </span>
                </div>

                {exercises.length > 0 ? (
                  <div className="space-y-6">
                    {exercises.map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="bg-white/[0.03] border border-white/5 rounded-2xl p-8"
                      >
                        <div className="flex gap-4 mb-6">
                          <span className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/20 flex items-center justify-center text-sm font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h3 className="text-white font-bold text-lg leading-snug">
                              {ex.question}
                            </h3>
                          </div>
                        </div>

                        <div className="space-y-3 pl-12">
                          {(ex.type === "MULTIPLE_CHOICE"
                            ? (ex.options as string[])
                            : ["true", "false"]
                          ).map((opt) => {
                            const isSelected = selectedAnswers[ex.id] === opt;
                            const isCorrect = opt === ex.correctAnswer;
                            const showResult = viewResults;

                            let btnClass =
                              "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:border-white/10";

                            if (showResult) {
                              if (isCorrect)
                                btnClass =
                                  "border-green-500/50 bg-green-500/10 text-green-400";
                              else if (isSelected)
                                btnClass =
                                  "border-red-500/50 bg-red-500/10 text-red-400";
                            } else if (isSelected) {
                              btnClass =
                                "border-blue-500 bg-blue-500/10 text-blue-400";
                            }

                            return (
                              <button
                                key={opt}
                                onClick={() =>
                                  !viewResults &&
                                  setSelectedAnswers({
                                    ...selectedAnswers,
                                    [ex.id]: opt,
                                  })
                                }
                                disabled={viewResults}
                                className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnClass}`}
                              >
                                <span className="capitalize">{opt}</span>
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
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => setViewResults(true)}
                          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                        >
                          Submit Answers
                        </button>
                      </div>
                    )}

                    {viewResults && (
                      <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="text-blue-400 font-bold mb-1">
                            Lesson Complete
                          </h4>
                          <p className="text-sm text-slate-400">
                            Great job reviewing the material.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const idx = moduleLessons.findIndex(
                              (l) => l.id === lesson.id,
                            );
                            if (idx < moduleLessons.length - 1) {
                              navigate(
                                `/student-dashboard/course/${courseId}/lesson/${moduleLessons[idx + 1].id}`,
                              );
                            }
                          }}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors"
                        >
                          Next Lesson
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                    <Trophy size={48} className="mb-4 text-slate-600" />
                    <p className="font-bold text-slate-500">
                      No exercises for this lesson.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR (PLAYLIST) */}
        <aside className="w-[350px] bg-[#0c0c0e] border-l border-white/[0.08] flex flex-col shrink-0">
          <div className="p-6 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1">
              Course Content
            </h3>
            <p className="text-[10px] text-slate-500">
              Module 1: The Foundation
            </p>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar">
            {moduleLessons.map((l, idx) => {
              const isActive = l.id === lesson.id;
              return (
                <button
                  key={l.id}
                  onClick={() =>
                    navigate(
                      `/student-dashboard/course/${courseId}/lesson/${l.id}`,
                    )
                  }
                  className={`w-full p-4 flex items-start gap-4 transition-all border-b border-white/[0.04] text-left group ${isActive ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"}`}
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isActive ? "bg-blue-600 border-blue-500 text-white" : "border-white/10 text-slate-500 group-hover:border-white/30"}`}
                  >
                    {isActive ? (
                      <Play size={10} fill="currentColor" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-bold mb-1 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
                    >
                      {l.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> 12m
                      </span>
                      {l.type === "VIDEO" && (
                        <span className="flex items-center gap-1">
                          <Video size={10} /> Video
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-6 border-t border-white/[0.08] bg-[#0c0c0e]">
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
              <h4 className="text-xs font-bold text-white mb-2">
                Student Resources
              </h4>
              <button className="w-full py-2 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                Download Course Materials
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LessonPage;
