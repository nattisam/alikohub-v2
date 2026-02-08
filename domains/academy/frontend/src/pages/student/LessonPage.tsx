import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  Video,
  BookOpen,
  Layout,
  Download,
  Trophy,
  Loader2,
  Target,
  Clock,
  HelpCircle,
} from "lucide-react";
import type { Lesson, Exercise } from "../../components/common/types";
import ErrorState from "../../components/states/ErrorState";
import { useRef } from "react";

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
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [viewResults, setViewResults] = useState(false);
  const lastFetchedId = useRef<number | null>(null);

  useEffect(() => {
    if (lessonIdNum && lessonIdNum !== lastFetchedId.current) {
      lastFetchedId.current = lessonIdNum;
      fetchLessonAndData(lessonIdNum);
      setCurrentBlockIndex(0);
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
      <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
          Initializing Study Studio...
        </p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-6">
        <ErrorState
          title="System Offline"
          message={error}
          onRetry={() => navigate(-1)}
        />
      </div>
    );
  }

  const currentBlock = lesson.contents?.[currentBlockIndex];

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-200 flex flex-col overflow-hidden font-sans">
      {/* PREMIUM STUDIO HEADER */}
      <header className="h-[72px] bg-[#0a0f18]/80 backdrop-blur-3xl border-b border-white/[0.03] flex items-center justify-between px-10 z-[60] shrink-0">
        <div className="flex items-center gap-8">
          <Link
            to={`/student-dashboard/course/${courseId}`}
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Return to Syllabus
            </span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 block mb-0.5">
              Current Segment
            </span>
            <h1 className="text-white font-black text-sm tracking-tight truncate max-w-[300px]">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/[0.03] border border-white/5 rounded-2xl p-1 shrink-0">
            <button
              onClick={() => setActiveTab("CONTENT")}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "CONTENT" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-white"}`}
            >
              Theory
            </button>
            <button
              onClick={() => setActiveTab("ASSESSMENT")}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "ASSESSMENT" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-500 hover:text-white"}`}
            >
              Assessment
            </button>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <button
            onClick={() => {
              const idx = moduleLessons.findIndex((l) => l.id === lesson.id);
              if (idx < moduleLessons.length - 1)
                navigate(
                  `/student-dashboard/course/${courseId}/lesson/${moduleLessons[idx + 1].id}`,
                );
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
          >
            Progress <ChevronRight size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT NAV RAIL: Course Progress */}
        <aside className="w-[300px] border-r border-white/[0.03] bg-[#0a0f18] flex flex-col shrink-0">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">
              Course Journey
            </h3>
            <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto thin-scrollbar pr-2">
              {moduleLessons.map((l, idx) => (
                <button
                  key={l.id}
                  onClick={() =>
                    navigate(
                      `/student-dashboard/course/${courseId}/lesson/${l.id}`,
                    )
                  }
                  className={`w-full group p-4 rounded-2xl flex items-center gap-4 transition-all ${l.id === lesson.id ? "bg-indigo-600/10 border border-indigo-500/20" : "hover:bg-white/[0.02]"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${l.id === lesson.id ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-600 group-hover:text-slate-300"}`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-xs font-bold text-left flex-1 truncate ${l.id === lesson.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}
                  >
                    {l.title}
                  </span>
                  {l.id === lesson.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 mt-auto italic">
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <Trophy size={20} />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">
                  Studio Milestone
                </span>
                <span className="text-white font-bold text-xs">
                  Unlock Certification
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN STUDIO VIEWPORT */}
        <main className="flex-1 overflow-y-auto bg-[#070b13] relative flex flex-col">
          {activeTab === "CONTENT" ? (
            <div className="flex-1 flex flex-col">
              {/* Theater Mode Display */}
              <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                {currentBlock ? (
                  <div className="w-full h-full flex flex-col">
                    {currentBlock.type === "VIDEO" &&
                      (isYouTubeUrl(currentBlock.url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(currentBlock.url)}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={currentBlock.url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ))}

                    {currentBlock.type === "PDF" && (
                      <iframe
                        src={currentBlock.url}
                        className="w-full h-full border-none"
                        title="Resource Viewer"
                      />
                    )}

                    {currentBlock.type === "TEXT" && (
                      <div className="flex-1 bg-[#0a0f18] overflow-y-auto pt-20 pb-40 px-10 thin-scrollbar">
                        <div className="max-w-[720px] mx-auto">
                          <div className="flex items-center gap-3 mb-8">
                            <BookOpen size={16} className="text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
                              Theoretical Material
                            </span>
                          </div>
                          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-10 leading-snug">
                            {currentBlock.title || "Lesson Overview"}
                          </h2>
                          <div className="text-slate-400 text-lg leading-relaxed font-medium whitespace-pre-wrap selection:bg-indigo-500/30">
                            {currentBlock.body || currentBlock.content}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-20">
                    <Layout size={64} className="mb-6" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">
                      Segment Unavailable
                    </h3>
                  </div>
                )}
              </div>

              {/* Block Navigator Overlay */}
              {lesson.contents && lesson.contents.length > 1 && (
                <div className="h-20 border-t border-white/[0.03] bg-[#0a0f18]/80 backdrop-blur-3xl flex items-center justify-center px-10 z-50">
                  <div className="flex justify-between w-full max-w-[800px] items-center">
                    <button
                      disabled={currentBlockIndex === 0}
                      onClick={() => setCurrentBlockIndex((prev) => prev - 1)}
                      className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-slate-400 hover:text-white disabled:opacity-20 transition-all active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                      {lesson.contents.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-500 ${i === currentBlockIndex ? "w-12 bg-indigo-600" : "w-4 bg-white/10"}`}
                        />
                      ))}
                    </div>

                    <button
                      disabled={
                        currentBlockIndex === (lesson.contents?.length || 0) - 1
                      }
                      onClick={() => setCurrentBlockIndex((prev) => prev + 1)}
                      className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-slate-400 hover:text-white disabled:opacity-20 transition-all active:scale-95"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ASSESSMENT CHALLENGE */
            <div className="flex-1 overflow-y-auto py-20 px-10 thin-scrollbar">
              <div className="max-w-[700px] mx-auto space-y-16">
                <header>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                      <HelpCircle size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                      Active Validation
                    </span>
                  </div>
                  <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">
                    Mastery Challenge
                  </h2>
                  <p className="text-slate-500 text-lg mt-4 font-medium leading-relaxed max-w-lg">
                    Prove your expertise by resolving the technical inquiries
                    below. Success unlocks the next segment.
                  </p>
                </header>

                <div className="space-y-12">
                  {exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="bg-[#0a0f18] border border-white/5 rounded-[40px] p-10 relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full" />

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                          <span className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-sm font-black text-slate-500">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-emerald-500 transition-all">
                            {ex.type.replace("_", " ")} VALIDATION
                          </span>
                        </div>

                        <h4 className="text-2xl font-black text-white leading-snug mb-10">
                          {ex.question}
                        </h4>

                        <div className="space-y-3">
                          {(ex.type === "MULTIPLE_CHOICE"
                            ? (ex.options as string[])
                            : ["true", "false"]
                          ).map((opt) => {
                            const isSelected = selectedAnswers[ex.id] === opt;
                            const isCorrect = opt === ex.correctAnswer;
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
                                className={`w-full p-6 p-6 rounded-3xl border text-left font-bold text-sm transition-all flex items-center justify-between group/opt ${
                                  viewResults
                                    ? isCorrect
                                      ? "border-emerald-500 bg-emerald-500/5 text-emerald-400"
                                      : isSelected
                                        ? "border-red-500 bg-red-500/5 text-red-500"
                                        : "border-white/5 text-slate-700"
                                    : isSelected
                                      ? "border-indigo-600 bg-indigo-600/5 text-indigo-400"
                                      : "border-white/5 bg-white/[0.02] text-slate-600 hover:border-white/20"
                                }`}
                              >
                                <span className="capitalize">{opt}</span>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                                    isSelected
                                      ? "bg-indigo-600 border-indigo-600"
                                      : "border-white/10"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {exercises.length > 0 && !viewResults && (
                    <button
                      onClick={() => setViewResults(true)}
                      className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      Submit Certification
                    </button>
                  )}

                  {exercises.length === 0 && (
                    <div className="py-20 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center opacity-30 text-center">
                      <Layout size={48} className="mb-4" />
                      <p className="font-bold text-sm uppercase tracking-widest">
                        No Assessments Assigned
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT INFO SIDEBAR */}
        <aside className="w-[400px] border-l border-white/[0.03] bg-[#0a0f18] flex flex-col shrink-0">
          <div className="p-10 border-b border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-8">
              Studio Analytics
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-700" />
                  <span className="text-xs font-bold text-slate-500">
                    Duration
                  </span>
                </div>
                <span className="text-xs font-black text-white">
                  45 Minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target size={16} className="text-slate-700" />
                  <span className="text-xs font-bold text-slate-500">
                    Proficiency
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-500">
                  Expert Level
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 thin-scrollbar">
            <section className="mb-12">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6">
                Subject Narrative
              </h4>
              <div className="text-sm font-medium text-slate-500 leading-relaxed">
                {lesson.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.description }}
                  />
                ) : (
                  "Technical documentation for this segment is currently being synthesized by the lead instructor."
                )}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6">
                Linked Assets
              </h4>
              <div className="space-y-3">
                {lesson.contents?.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-600/30 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                        {c.type === "PDF" ? (
                          <FileText size={16} />
                        ) : (
                          <Video size={16} />
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-all max-w-[150px] truncate">
                        {c.title || c.type}
                      </span>
                    </div>
                    <button className="p-2 text-slate-700 hover:text-indigo-400">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="p-10 pt-0 shrink-0">
            <button
              onClick={() => navigate(`/student-dashboard/course/${courseId}`)}
              className="w-full py-5 bg-white/[0.03] border border-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Exit Study Hub
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LessonPage;
