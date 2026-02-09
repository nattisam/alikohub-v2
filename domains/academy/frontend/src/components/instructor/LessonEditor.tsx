import React, { useState, useEffect } from "react";
import {
  Trash2,
  AlignLeft,
  Video,
  FileText,
  ChevronLeft,
  Loader2,
  ChevronRight,
  CheckSquare,
  Play,
  Settings,
  ArrowLeft,
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

  // Find the first video block to display in the "Player" area
  const mainVideoBlock = blocks.find((b) => b.type === "VIDEO");

  return (
    <div className="fixed inset-0 bg-[#09090b] z-[100] flex flex-col font-sans text-slate-200">
      {/* HEADER - Matches screenshot: Dark, minimal, breadcrumb-like */}
      <header className="h-16 border-b border-white/[0.08] bg-[#09090b] flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Course</span>
          </button>

          <div className="h-6 w-px bg-white/10" />

          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">
              Currently Editing
            </div>
            <h1 className="text-sm font-bold text-white tracking-wide">
              {lesson?.title || "Untitled Lesson"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Draft Status
            </span>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[35%] bg-blue-600 rounded-full" />
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT - PLAYER STYLE */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#09090b] relative scroll-smooth no-scrollbar">
          {/* VIDEO PLAYER AREA */}
          <div className="w-full bg-black aspect-video relative group shrink-0 border-b border-white/5">
            {mainVideoBlock ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform cursor-pointer">
                    <Play size={32} className="text-white fill-current ml-1" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    Video Preview: {mainVideoBlock.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 font-mono">
                    {mainVideoBlock.url}
                  </p>
                </div>
                {/* Simulated Controls */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent px-6 flex items-end pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full space-y-2">
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                      <div className="w-1/3 h-full bg-blue-600" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-white">
                      <div className="flex gap-4">
                        <span>12:45 / 24:00</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="bg-white/10 px-2 py-0.5 rounded">
                          1.5x
                        </span>
                        <Settings size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-[#050505]">
                <Video size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium uppercase tracking-widest opacity-40">
                  No Video Content
                </p>
                <button
                  onClick={() => {
                    setActiveTab("CONTENT");
                    setActiveBuilder("VIDEO");
                  }}
                  className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold text-slate-400 border border-white/5 transition-all"
                >
                  Add Video Block
                </button>
              </div>
            )}
          </div>

          {/* BELOW PLAYER - TABS & CONTENT */}
          <div className="flex-1 max-w-5xl mx-auto w-full px-8 pb-32">
            {/* TABS NAVIGATION */}
            <div className="flex items-center gap-8 py-6 border-b border-white/[0.06] mb-8 sticky top-0 bg-[#09090b] z-10 transition-all">
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
                <CheckSquare size={14} />
                Exercises
              </button>
            </div>

            {/* CONTENT AREA */}
            <div>
              {loading ? (
                <div className="py-20 flex flex-col items-center">
                  <Loader2 className="animate-spin text-blue-600 mb-4" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                    Loading Content...
                  </span>
                </div>
              ) : activeTab === "CONTENT" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <input
                      type="text"
                      value={lesson?.title || ""}
                      onChange={(e) =>
                        setLesson({ ...lesson, title: e.target.value })
                      }
                      className="w-full bg-transparent border-none focus:ring-0 text-3xl font-bold text-white p-0 tracking-tight placeholder-slate-700 block mb-4"
                      placeholder="Add Lesson Title..."
                    />
                    <div className="text-slate-500 text-lg leading-relaxed border-l-2 border-white/5 pl-4 ml-1">
                      In this module, we dive deep into the fundamental building
                      blocks...
                    </div>
                  </div>

                  {blocks.filter((b) => b.type !== "VIDEO").length > 0 ? (
                    blocks
                      .filter((b) => b.type !== "VIDEO")
                      .map((block) => (
                        <div
                          key={block.id}
                          className="group relative pl-4 border-l-2 border-white/5 hover:border-blue-500/50 transition-colors"
                        >
                          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDeleteContent(block.id)}
                              className="p-2 text-slate-600 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="mb-2">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">
                              {block.type}
                            </span>
                          </div>

                          {block.type === "TEXT" && (
                            <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                              {block.body}
                            </div>
                          )}

                          {block.type === "PDF" && (
                            <div className="bg-white/[0.03] rounded-xl p-4 flex items-center gap-4 border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer">
                              <div className="w-12 h-12 bg-[#2d3748] rounded-lg flex items-center justify-center text-red-400">
                                <FileText size={24} />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium">
                                  {block.title || "PDF Resource"}
                                </h4>
                                <p className="text-sm text-slate-500">
                                  {block.url}
                                </p>
                              </div>
                              <div className="px-3 py-1 bg-white/10 rounded text-xs font-bold text-white">
                                Download
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="py-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center">
                      <p className="text-slate-500 text-sm font-medium">
                        No additional content blocks.
                      </p>
                      <p className="text-slate-600 text-xs mt-1">
                        Use the sidebar to add text or resources.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* ASSESSMENT TAB */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                      Lesson Quiz
                    </h2>
                    <span className="text-sm text-slate-500">
                      {exercises.length} Questions
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {exercises.map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 group hover:border-blue-500/30 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center text-sm font-bold border border-blue-500/20">
                              {idx + 1}
                            </div>
                            <h3 className="text-white font-bold">{ex.title}</h3>
                          </div>
                          <button
                            onClick={() => handleDeleteExercise(ex.id)}
                            className="text-slate-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-slate-300 mb-4 pl-11">
                          {ex.question}
                        </p>
                        <div className="pl-11 grid grid-cols-2 gap-2">
                          {ex.type === "MULTIPLE_CHOICE" &&
                            (ex.options as string[]).map((opt) => (
                              <div
                                key={opt}
                                className={`px-4 py-3 rounded-lg text-sm border ${opt === ex.correctAnswer ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-black/20 border-white/5 text-slate-500"}`}
                              >
                                {opt}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {exercises.length === 0 && (
                    <div className="py-16 text-center">
                      <CheckSquare
                        size={48}
                        className="mx-auto text-slate-700 mb-4"
                      />
                      <h3 className="text-slate-400 font-bold">
                        No Exercises Yet
                      </h3>
                      <button
                        onClick={() => setActiveBuilder("TEXT")}
                        className="text-blue-500 text-sm mt-2 hover:underline"
                      >
                        Create your first question
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - "Playlist" Style Tools */}
        <aside className="w-[400px] bg-[#0c0c0e] border-l border-white/[0.08] flex flex-col shrink-0">
          <div className="p-6 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">
              {activeBuilder ? "Builder Active" : "Course Tools"}
            </h3>
            <p className="text-xs text-slate-500">
              {activeBuilder
                ? "Configure your new block"
                : "Drag elements to the canvas"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 thin-scrollbar">
            {activeBuilder ? (
              <div className="animate-in slide-in-from-right-10 duration-300">
                <button
                  onClick={() => setActiveBuilder(null)}
                  className="mb-6 flex items-center gap-2 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  <ChevronLeft size={16} /> Cancel
                </button>
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
            ) : (
              /* TOOL LIST (Styled like Playlist Items) */
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-2 mb-3">
                    Content Blocks
                  </h4>

                  <button
                    onClick={() => setActiveBuilder("VIDEO")}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl p-4 flex items-center gap-4 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Video size={18} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        Video Player
                      </h5>
                      <p className="text-xs text-slate-500">
                        Embed MP4 or Stream
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-slate-700 group-hover:text-slate-400"
                    />
                  </button>

                  <button
                    onClick={() => setActiveBuilder("TEXT")}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl p-4 flex items-center gap-4 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-600/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <AlignLeft size={18} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                        Rich Text
                      </h5>
                      <p className="text-xs text-slate-500">
                        Narrative & Images
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-slate-700 group-hover:text-slate-400"
                    />
                  </button>

                  <button
                    onClick={() => setActiveBuilder("PDF")}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl p-4 flex items-center gap-4 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-600/10 text-orange-500 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        Resource PDF
                      </h5>
                      <p className="text-xs text-slate-500">
                        Downloadable Assets
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-slate-700 group-hover:text-slate-400"
                    />
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-2 mb-3">
                    Interactivity
                  </h4>
                  <button
                    onClick={() => {
                      setActiveTab("ASSESSMENT");
                      setActiveBuilder("TEXT");
                    }}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl p-4 flex items-center gap-4 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <CheckSquare size={18} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Quiz Question
                      </h5>
                      <p className="text-xs text-slate-500">
                        Multiple Choice / T&F
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-slate-700 group-hover:text-slate-400"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/[0.08] bg-[#0c0c0e]">
            <button
              onClick={onClose}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Save & Finish Editing</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Styles Updated) ---

const ContentBuilderForm: React.FC<{
  type: BlockType;
  lessonId: number;
  onCancel: () => void;
  onSuccess: (block: LessonBlock) => void;
}> = ({ type, lessonId, onSuccess }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Block Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-sm font-medium text-white focus:border-blue-600 focus:ring-0 placeholder-slate-600 transition-colors"
          placeholder="e.g. Introduction"
        />
      </div>

      {type === "TEXT" ? (
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-sm font-medium text-slate-300 focus:border-blue-600 focus:ring-0 placeholder-slate-600 min-h-[200px] thin-scrollbar transition-colors"
            placeholder="Write content..."
            required
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {type === "VIDEO" ? "Video URL" : "File URL"}
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-sm font-mono text-blue-400 focus:border-blue-600 focus:ring-0 placeholder-slate-700 transition-colors"
            placeholder="https://..."
            required
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
      >
        {loading ? "Saving..." : "Add to Lesson"}
      </button>
    </form>
  );
};

const QuizBuilderForm: React.FC<{
  moduleId: number;
  lessonId: number;
  onCancel: () => void;
  onSuccess: () => void;
}> = ({ moduleId, lessonId, onSuccess }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Question Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-sm font-medium text-white focus:border-blue-600 focus:ring-0 placeholder-slate-600 transition-colors"
          placeholder="e.g. Concept Check"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="bg-white/[0.05] border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-blue-600 focus:ring-0"
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True / False</option>
        </select>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="bg-white/[0.05] border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-blue-600 focus:ring-0"
          placeholder="Points"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Question Text
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-sm font-medium text-slate-300 focus:border-blue-600 focus:ring-0 placeholder-slate-600 min-h-[100px]"
          placeholder="Ask something..."
          required
        />
      </div>

      {type === "MULTIPLE_CHOICE" ? (
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Options (Click circle to select correct)
          </label>
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="relative">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const n = [...options];
                    n[idx] = e.target.value;
                    setOptions(n);
                  }}
                  className={`w-full bg-white/[0.03] border rounded-xl p-4 text-xs font-medium pr-12 transition-all ${correctAnswer === opt && opt !== "" ? "border-green-500 text-green-400 bg-green-500/5" : "border-white/10 text-slate-400 focus:border-blue-600"}`}
                  placeholder={`Option ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(opt)}
                  disabled={!opt}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border transition-all ${correctAnswer === opt && opt !== "" ? "bg-green-500 border-green-500" : "border-slate-600 hover:border-slate-400"}`}
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
              className={`flex-1 py-4 rounded-xl border font-bold uppercase tracking-widest text-[10px] transition-all ${correctAnswer === val.toLowerCase() ? "bg-green-600 border-green-500 text-white" : "bg-white/[0.02] border-white/5 text-slate-600 hover:bg-white/[0.05]"}`}
            >
              {val}
            </button>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20"
      >
        {loading ? "Saving..." : "Add Question"}
      </button>
    </form>
  );
};

export default LessonEditor;
