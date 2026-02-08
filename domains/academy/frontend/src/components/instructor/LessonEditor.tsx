import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  GripVertical,
  AlignLeft,
  Video,
  FileText,
  HelpCircle,
  Layout,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  ChevronRight,
  CheckSquare,
  Layers,
} from "lucide-react";
import { courseApi } from "../../api/courseApi";

// Shared Types
import type { BlockType, LessonBlock } from "./types";

interface LessonEditorProps {
  lessonId: number;
  moduleId: number;
  onClose: () => void;
  onUpdate: () => void;
  readOnly?: boolean;
}

interface Exercise {
  id: number;
  moduleId: number;
  lessonId?: number;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "MATCHING" | "SHORT_TEXT";
  title: string;
  question: string;
  options: any;
  correctAnswer: any;
  points: number;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lessonId,
  moduleId,
  onClose,
  onUpdate,
  readOnly = false,
}) => {
  const [lesson, setLesson] = useState<any>(null);
  const [blocks, setBlocks] = useState<LessonBlock[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"CONTENT" | "ASSESSMENT">(
    "CONTENT",
  );
  const [activeBuilder, setActiveBuilder] = useState<BlockType | null>(null);

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const [lessonRes, contentRes, exerciseRes] = await Promise.all([
        courseApi.getLesson(lessonId),
        courseApi.getContent(lessonId),
        courseApi
          .getExercisesByModule(moduleId)
          .catch(() => ({ data: { items: [] } })),
      ]);

      setLesson(lessonRes.data);

      const items =
        contentRes.data?.items ||
        (Array.isArray(contentRes.data) ? contentRes.data : []);
      setBlocks(
        items.map((i: any) => ({
          id: i.id.toString(),
          type: i.type,
          body: i.body || i.content,
          url: i.url,
          title: i.title,
        })),
      );

      const exItems =
        exerciseRes.data?.items ||
        (Array.isArray(exerciseRes.data) ? exerciseRes.data : []);
      // Only show exercises for this lesson if they are linked
      setExercises(exItems.filter((ex: any) => ex.lessonId === lessonId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (readOnly) return;
    try {
      await courseApi.deleteContent(Number(id));
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExercise = async (id: number) => {
    if (readOnly) return;
    try {
      await courseApi.deleteExercise(id);
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#070b13] z-[100] flex flex-col overflow-hidden text-slate-200">
      {/* PREMIUM TOP HEADER */}
      <header className="h-[80px] border-b border-white/[0.03] flex items-center justify-between px-10 bg-[#0a0f18]/80 backdrop-blur-3xl z-50 shrink-0">
        <div className="flex items-center gap-8">
          <button
            onClick={onClose}
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
              <ChevronLeft size={20} />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Studio Home
            </span>
          </button>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                Curriculum Drafting
              </span>
            </div>
            <h2 className="text-white font-extrabold text-lg tracking-tight">
              {lesson?.title || "Drafting..."}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
          >
            Finish Editing
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SLIM LEFT RAIL */}
        <nav className="w-20 border-r border-white/[0.03] flex flex-col items-center py-10 gap-10 bg-[#070b13] shrink-0 z-40">
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={() => setActiveTab("CONTENT")}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${activeTab === "CONTENT" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30" : "bg-white/[0.03] text-slate-500 hover:bg-white/10 hover:text-white border border-white/5"}`}
              title="Content Designer"
            >
              <Layout size={20} />
            </button>
            <div className="h-px w-8 bg-white/5" />
            <button
              onClick={() => setActiveTab("ASSESSMENT")}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${activeTab === "ASSESSMENT" ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 text-emerald-100" : "bg-white/[0.03] text-slate-500 hover:bg-white/10 hover:text-white border border-white/5"}`}
              title="Assessment Builder"
            >
              <CheckSquare size={20} />
            </button>
          </div>
        </nav>

        {/* MAIN STUDIO CANVAS */}
        <main className="flex-1 overflow-y-auto bg-[#070b13] relative pt-16 pb-40 px-16 scroll-smooth thin-scrollbar">
          <div className="max-w-[800px] mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-indigo-500/20 animate-spin mb-4" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  Hydrating Studio Workspace...
                </span>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                {activeTab === "CONTENT" ? (
                  <>
                    <input
                      type="text"
                      value={lesson?.title || ""}
                      onChange={(e) =>
                        setLesson({ ...lesson, title: e.target.value })
                      }
                      className="w-full bg-transparent border-none focus:ring-0 text-7xl font-black text-white p-0 tracking-tighter leading-[0.9] mb-16 placeholder-slate-900 focus:placeholder-slate-800 transition-all"
                      placeholder="Lesson Title"
                    />

                    <div className="space-y-16">
                      {blocks.length > 0 ? (
                        blocks.map((block) => (
                          <div key={block.id} className="group relative">
                            {/* Hover Action Bar */}
                            <div className="absolute -left-16 top-0 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button className="p-2 text-slate-600 hover:text-indigo-400 cursor-grab">
                                <GripVertical size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteContent(block.id)}
                                className="p-2 text-slate-600 hover:text-red-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 group-hover:text-indigo-500 transition-all">
                                  {block.type} BLOCK
                                </span>
                                <div className="h-px flex-1 bg-white/[0.03]" />
                              </div>

                              {block.type === "TEXT" && (
                                <div className="text-slate-400 text-xl font-medium leading-[1.6] whitespace-pre-wrap selection:bg-indigo-500/30 px-2 line-clamp-none">
                                  {block.body}
                                </div>
                              )}

                              {block.type === "VIDEO" && (
                                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black/40 group-hover:border-indigo-500/20 transition-all">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                                      <Video
                                        size={32}
                                        className="text-indigo-500"
                                      />
                                    </div>
                                  </div>
                                  <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-[#0a0f18]/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5">
                                      <span className="text-[10px] font-mono text-slate-500">
                                        {block.url}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {block.type === "PDF" && (
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex items-center gap-6 group-hover:bg-white/[0.04] transition-all">
                                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                                    <FileText size={28} />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-lg font-bold text-white mb-1">
                                      Interactive PDF Resource
                                    </h4>
                                    <p className="text-sm text-slate-500 font-medium truncate max-w-sm">
                                      {block.url}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
                          <AlignLeft size={64} className="mb-6" />
                          <h3 className="text-2xl font-black uppercase tracking-tighter">
                            Canvas Awaiting Content
                          </h3>
                          <p className="text-sm font-bold mt-2">
                            Use the Action Bar to inject curriculum blocks.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* ASSESSMENT VIEW */
                  <div className="space-y-12">
                    <header className="mb-16">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                          <CheckSquare size={16} />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                          Knowledge Validation
                        </span>
                      </div>
                      <h1 className="text-6xl font-black text-white tracking-tighter leading-tight">
                        Mastery Certification
                      </h1>
                      <p className="text-slate-500 text-lg mt-4 font-medium leading-relaxed max-w-xl">
                        Design challenging questions to ensure graduates have
                        truly retained the core concepts of this lesson.
                      </p>
                    </header>

                    <div className="space-y-6">
                      {exercises.map((ex, idx) => (
                        <div
                          key={ex.id}
                          className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 group hover:border-emerald-500/20 transition-all relative overflow-hidden"
                        >
                          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-600/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center gap-4">
                                <span className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-500">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
                                    {ex.type.replace("_", " ")}
                                  </span>
                                  <h4 className="text-xl font-bold text-white">
                                    {ex.title}
                                  </h4>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteExercise(ex.id)}
                                className="text-slate-700 hover:text-red-500 transition-colors p-2"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                              {ex.question}
                            </p>

                            {ex.type === "MULTIPLE_CHOICE" && (
                              <div className="grid grid-cols-2 gap-3">
                                {(ex.options as string[]).map((opt) => (
                                  <div
                                    key={opt}
                                    className={`px-5 py-4 rounded-2xl border text-sm font-bold flex items-center justify-between ${opt === ex.correctAnswer ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/[0.03] border-white/5 text-slate-500"}`}
                                  >
                                    {opt}
                                    {opt === ex.correctAnswer && (
                                      <CheckCircle2 size={16} />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {ex.type === "TRUE_FALSE" && (
                              <div className="flex gap-4">
                                {["true", "false"].map((val) => (
                                  <div
                                    key={val}
                                    className={`flex-1 py-4 rounded-2xl border text-center text-sm font-black uppercase tracking-widest ${val === ex.correctAnswer ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/[0.03] border-white/5 text-slate-700"}`}
                                  >
                                    {val}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {exercises.length === 0 && (
                        <div className="py-32 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center opacity-20">
                          <HelpCircle size={48} className="mb-4" />
                          <h3 className="text-xl font-black uppercase tracking-widest">
                            No Assessment Records
                          </h3>
                          <p className="text-xs font-bold mt-2">
                            Trigger a builder from the right panel to add
                            validation.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* DYNAMIC RIGHT ACTION BAR */}
        <aside className="w-[450px] border-l border-white/[0.03] bg-[#0a0f18] flex flex-col shrink-0">
          {activeBuilder ? (
            <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-500">
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                      Builder Active
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Add {activeBuilder.replace("_", " ")}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveBuilder(null)}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 thin-scrollbar pb-32">
                {activeTab === "CONTENT" ? (
                  <ContentBuilderForm
                    type={activeBuilder}
                    lessonId={lessonId}
                    onCancel={() => setActiveBuilder(null)}
                    onSuccess={(newBlock) => {
                      setBlocks((prev) => [...prev, newBlock]);
                      setActiveBuilder(null);
                      onUpdate();
                    }}
                  />
                ) : (
                  <QuizBuilderForm
                    moduleId={moduleId}
                    lessonId={lessonId}
                    onCancel={() => setActiveBuilder(null)}
                    onSuccess={() => {
                      setActiveBuilder(null);
                      fetchLessonData();
                      onUpdate();
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            /* DEFAULT SIDEBAR: LESSON SETTINGS */
            <div className="flex flex-col h-full animate-in fade-in duration-700">
              <div className="p-10 border-b border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">
                  Action Hub
                </h3>
                <div className="space-y-4">
                  {activeTab === "CONTENT" ? (
                    <>
                      <BuilderTrigger
                        icon={<AlignLeft />}
                        label="Rich Text"
                        desc="Write educational copy"
                        onClick={() => setActiveBuilder("TEXT")}
                        color="indigo"
                      />
                      <BuilderTrigger
                        icon={<Video />}
                        label="Video Motion"
                        desc="Embed YouTube/Vimeo"
                        onClick={() => setActiveBuilder("VIDEO")}
                        color="indigo"
                      />
                      <BuilderTrigger
                        icon={<FileText />}
                        label="Resource PDF"
                        desc="Upload technical docs"
                        onClick={() => setActiveBuilder("PDF")}
                        color="indigo"
                      />
                    </>
                  ) : (
                    <>
                      <BuilderTrigger
                        icon={<Layers />}
                        label="Multiple Choice"
                        desc="Binary or multi-option"
                        onClick={() => setActiveBuilder("TEXT")}
                        color="emerald"
                        forceLabel="QUIZ"
                      />
                      <BuilderTrigger
                        icon={<HelpCircle />}
                        label="True / False"
                        desc="Simple binary validation"
                        onClick={() => setActiveBuilder("TEXT")}
                        color="emerald"
                        forceLabel="QUIZ"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 thin-scrollbar">
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      Contextual Data
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/5 px-2 py-1 rounded">
                      Auto-Saving
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                        Publish Status
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          Live Production
                        </span>
                        <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center justify-end px-1">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                        Completion Mode
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          Sequential Only
                        </span>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-10 pt-0 shrink-0">
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-white/[0.03] border border-white/5 hover:border-red-500/40 hover:bg-red-500/5 text-slate-500 hover:text-red-500 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Discard Draft
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const BuilderTrigger = ({
  icon,
  label,
  desc,
  onClick,
  color,
  forceLabel,
}: any) => (
  <button
    onClick={() => onClick(forceLabel || label.split(" ")[1].toUpperCase())}
    className="w-full p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-4 group hover:border-white/10 hover:bg-white/[0.05] transition-all text-left"
  >
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${color === "indigo" ? "bg-indigo-600/10 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white" : "bg-emerald-600/10 text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white"}`}
    >
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="flex-1">
      <div className="text-sm font-black text-white group-hover:translate-x-1 transition-transform tracking-tight">
        {label}
      </div>
      <div className="text-[10px] font-bold text-slate-600 mt-0.5">{desc}</div>
    </div>
    <ChevronRight
      size={16}
      className="text-slate-800 group-hover:text-slate-400 group-hover:translate-x-1 transition-all"
    />
  </button>
);

const ContentBuilderForm: React.FC<{
  type: BlockType;
  lessonId: number;
  onCancel: () => void;
  onSuccess: (block: LessonBlock) => void;
}> = ({ type, lessonId, onCancel, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await courseApi.createContent({
        lessonId,
        title: title || `${type} Block`,
        type,
        body: content,
        url: url,
        order: 99,
      });
      onSuccess({
        id: res.data.id.toString(),
        type,
        body: content,
        url,
        title: title || `${type} Block`,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save content block");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
          Internal Reference
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm font-bold text-white focus:border-indigo-600 focus:ring-0 placeholder-slate-800"
          placeholder="e.g. Intro Section Part 1"
        />
      </div>

      {type === "TEXT" ? (
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Educational Narrative
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-base font-medium leading-relaxed text-slate-300 focus:border-indigo-600 focus:ring-0 placeholder-slate-800 min-h-[350px] thin-scrollbar"
            placeholder="Write your lesson content here..."
            required
          />
        </div>
      ) : (
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            {type === "VIDEO" ? "Dynamic Stream URL" : "Document Cloud Link"}
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm font-bold text-white focus:border-indigo-600 focus:ring-0 placeholder-slate-800 font-mono"
            placeholder="https://..."
            required
          />
        </div>
      )}

      <div className="flex gap-4 pt-10">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-5 bg-white/[0.03] text-slate-500 rounded-[24px] text-[10px] font-black uppercase tracking-widest"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all"
        >
          {loading ? "Synthesizing..." : "Commit to Canvas"}
        </button>
      </div>
    </form>
  );
};

const QuizBuilderForm: React.FC<{
  moduleId: number;
  lessonId: number;
  onCancel: () => void;
  onSuccess: () => void;
}> = ({ moduleId, lessonId, onCancel, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"MULTIPLE_CHOICE" | "TRUE_FALSE">(
    "MULTIPLE_CHOICE",
  );
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [points, setPoints] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        moduleId,
        lessonId,
        title: title || question.substring(0, 30),
        type,
        question,
        options:
          type === "MULTIPLE_CHOICE"
            ? options.filter((o) => o.trim())
            : ["true", "false"],
        correctAnswer,
        points: Number(points),
      };
      await courseApi.createExercise(payload);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
          Assessment Goal
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm font-bold text-white focus:border-indigo-600 focus:ring-0 placeholder-slate-800"
          placeholder="e.g. Master React Hooks"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Validation Logic
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-xs font-bold text-white focus:border-indigo-600 focus:ring-0"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Reward Points
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm font-bold text-white focus:border-indigo-600 focus:ring-0"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
          Strategic Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-sm font-bold text-white focus:border-indigo-600 focus:ring-0 placeholder-slate-800 min-h-[120px]"
          placeholder="Pose the challenge..."
          required
        />
      </div>

      {type === "MULTIPLE_CHOICE" ? (
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Propositions (Select Verified)
          </label>
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="relative group">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const n = [...options];
                    n[idx] = e.target.value;
                    setOptions(n);
                  }}
                  className={`w-full bg-white/[0.03] border rounded-2xl p-5 text-xs font-bold pr-14 transition-all ${correctAnswer === opt && opt !== "" ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" : "border-white/10 text-slate-400 focus:border-indigo-600"}`}
                  placeholder={`Option ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(opt)}
                  disabled={!opt}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 transition-all ${correctAnswer === opt && opt !== "" ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-110" : "border-slate-800 hover:border-slate-600"}`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          {["True", "False"].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setCorrectAnswer(val.toLowerCase())}
              className={`flex-1 py-8 rounded-[32px] border-2 font-black uppercase tracking-widest text-[10px] transition-all ${correctAnswer === val.toLowerCase() ? "bg-emerald-600 border-emerald-500 text-white shadow-2xl shadow-emerald-600/30" : "bg-white/[0.02] border-white/5 text-slate-600"}`}
            >
              {val}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-4 pt-10">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-5 bg-white/[0.03] text-slate-500 rounded-[24px] text-[10px] font-black uppercase tracking-widest"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-5 bg-emerald-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/20 active:scale-95 transition-all"
        >
          {loading ? "Validating..." : "Commit Assessment"}
        </button>
      </div>
    </form>
  );
};

export default LessonEditor;
