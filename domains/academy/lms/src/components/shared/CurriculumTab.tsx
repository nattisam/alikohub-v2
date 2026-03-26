import React, { useState } from "react";
import {
  Book,
  PlusCircle,
  Trash2,
  Video,
  Youtube,
  FileText,
  ChevronRight,
  HelpCircle,
  Eye,
  PlayCircle,
  Plus,
  MonitorPlay,
  ClipboardList,
  Layers,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course, Lesson } from "@/types/academy";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CurriculumTabProps {
  course?: Course;
  selectedItem: any;
  onSetSelectedItem: (item: any) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  onUpdateLesson: (lessonId: string, data: any) => void;
  onAddContent: (moduleId: string, lessonId: string) => void;
  onAddExercise: (moduleId: string, lessonId: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onDeleteContent: (contentId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onView: (content: any) => void;
  isRejected: boolean;
}

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

export const CurriculumTab = ({
  course,
  selectedItem,
  onSetSelectedItem,
  onAddModule,
  onAddLesson,
  onUpdateLesson,
  onAddContent,
  onAddExercise,
  onDeleteModule,
  onDeleteLesson,
  onDeleteContent,
  onDeleteExercise,
  onView,
  isRejected,
}: CurriculumTabProps) => {
  const [lessonActiveTab, setLessonActiveTab] = useState<string>("materials");
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(
    null,
  );

  const getEmbedUrl = (url: string) => {
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${origin}`;
      } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${origin}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleLessonSelect = (lesson: Lesson, moduleId: string) => {
    onSetSelectedItem({
      type: "LESSON",
      data: lesson,
      moduleId,
      lessonId: lesson.id,
    });
    setEditingLesson({ ...lesson });
    setLessonActiveTab("materials");
  };

  const handleUpdateLessonSave = () => {
    if (selectedItem?.type === "LESSON" && editingLesson) {
      onUpdateLesson(selectedItem.lessonId!, editingLesson);
    }
  };

  const setSelectItem = (content: any) => {
    onSetSelectedItem({
      type: "CONTENT",
      data: content,
      moduleId: selectedItem?.moduleId,
      lessonId: selectedItem?.lessonId,
    });
  };

  const renderPreview = () => {
    if (!selectedItem) return null;
    const { type, data } = selectedItem;

    if (type === "LESSON") {
      const lesson = data;
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          {/* Lesson Header */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                  {lesson.type === "VIDEO" ? (
                    <Video className="w-8 h-8" />
                  ) : (
                    <FileText className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 opacity-70">
                    Editing Lesson
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading leading-none">
                    {editingLesson?.title || lesson.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                    <span className="capitalize">
                      {lesson.type.toLowerCase()}
                    </span>
                    <span>•</span>
                    <span>{lesson.contents?.length || 0} materials</span>
                    <span>•</span>
                    <span>{lesson.exercises?.length || 0} assessments</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleUpdateLessonSave}
                  className="gap-2 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white h-11 px-6 shadow-lg shadow-primary/20 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteLesson(lesson.id)}
                  className="gap-2 text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold h-11 px-4 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Lesson Tabs */}
          <Tabs
            value={lessonActiveTab}
            onValueChange={setLessonActiveTab}
            className="w-full"
          >
            <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-8">
              <TabsTrigger
                value="materials"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-500 data-[state=active]:text-slate-900 pb-3 px-0 transition-all capitalize"
              >
                Learning Materials
              </TabsTrigger>
              <TabsTrigger
                value="assessments"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-500 data-[state=active]:text-slate-900 pb-3 px-0 transition-all capitalize"
              >
                Assessments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="mt-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-slate-900 font-heading">
                    Learning Materials
                  </h4>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl gap-2 font-bold"
                    onClick={() =>
                      onAddContent(selectedItem.moduleId!, lesson.id)
                    }
                  >
                    <Plus className="w-4 h-4" /> Add Material
                  </Button>
                </div>

                <div className="space-y-3">
                  {lesson.contents?.map((content: any) => (
                    <div
                      key={content.id}
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 flex items-center justify-between group hover:border-primary/20 hover:bg-white transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary">
                          {content.type === "VIDEO" ? (
                            <PlayCircle className="w-5 h-5" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-bold text-slate-700">
                          {content.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-primary rounded-lg"
                          onClick={() => setSelectItem(content)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg"
                          onClick={() => onDeleteContent(content.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!lesson.contents || lesson.contents.length === 0) && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <MonitorPlay className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        No materials yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assessments" className="mt-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-slate-900 font-heading">
                    Lesson Assessments
                  </h4>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl gap-2 font-bold"
                    onClick={() =>
                      onAddExercise(selectedItem.moduleId!, lesson.id)
                    }
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </Button>
                </div>

                <div className="space-y-3">
                  {lesson.exercises?.length > 0 && (
                    <div
                      className="p-5 rounded-[24px] border border-amber-100 bg-amber-50/30 flex items-center justify-between group hover:border-amber-200 hover:bg-white transition-all cursor-pointer"
                      onClick={() =>
                        onSetSelectedItem({
                          type: "QUIZ_SESSION",
                          data: lesson.exercises,
                          moduleId: selectedItem.moduleId,
                          lessonId: lesson.id,
                        })
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm">
                          <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            Lesson Assessment
                          </span>
                          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                            {lesson.exercises.length} Questions • Click to
                            Manage
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 transition-all">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {(!lesson.exercises || lesson.exercises.length === 0) && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        No assessments yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    if (type === "CONTENT") {
      if (data.type === "VIDEO") {
        const isYT =
          data.url &&
          (data.url.includes("youtube.com") || data.url.includes("youtu.be"));
        const embedUrl = data.url
          ? isYT
            ? getEmbedUrl(data.url)
            : getFullUrl(data.url)
          : null;

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="aspect-video w-full rounded-[32px] overflow-hidden bg-black shadow-2xl relative">
              {embedUrl ? (
                isYT ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen
                  />
                ) : (
                  <video src={embedUrl} controls className="w-full h-full" />
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/50">
                  <Video className="w-12 h-12 mb-2 opacity-20" />
                  <p>No video URL available</p>
                </div>
              )}
            </div>
            {isYT && data.url && (
              <div className="flex flex-col items-center gap-3 p-6 rounded-[32px] bg-slate-50 border border-slate-200 border-dashed">
                <p className="text-sm font-medium text-slate-500 text-center max-w-md">
                  If the video player doesn't load here, it may have embedding
                  restricted by the owner. You can watch it directly on YouTube.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2 font-black rounded-xl h-12 px-8 shadow-sm"
                >
                  <a href={data.url} target="_blank" rel="noopener noreferrer">
                    <Youtube size={16} />
                    Open on YouTube
                  </a>
                </Button>
              </div>
            )}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-none font-bold"
                >
                  Video Content
                </Badge>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {data.title}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                {data.title}
              </h3>
            </div>
          </div>
        );
      }

      if (data.type === "PDF") {
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-full h-[600px] rounded-[32px] overflow-hidden border border-slate-200 bg-white shadow-lg">
              {data.url ? (
                <iframe
                  src={`${getFullUrl(data.url)}#toolbar=0`}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <FileText className="w-12 h-12 mb-2" />
                  <p>No PDF available</p>
                </div>
              )}
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-600 border-none font-bold mb-3"
              >
                Document
              </Badge>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                {data.title}
              </h3>
            </div>
          </div>
        );
      }
    }

    if (type === "EXERCISE") {
      const exercise = data;
      const options = parseOptions(exercise.options);
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="p-10 rounded-[32px] bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-100/50 shadow-sm relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ClipboardList className="w-32 h-32 text-amber-900" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Badge className="bg-amber-100 text-amber-700 border-none font-black uppercase tracking-widest text-[10px] px-3 py-1">
                  Question Preview
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold border-amber-200 text-amber-700 hover:bg-amber-50 h-8"
                    onClick={() =>
                      onSetSelectedItem({
                        type: "QUIZ_SESSION",
                        data:
                          course?.modules
                            ?.flatMap((m) => m.lessons)
                            ?.find((l) => l?.id === selectedItem.lessonId)
                            ?.exercises || [],
                        moduleId: selectedItem.moduleId,
                        lessonId: selectedItem.lessonId,
                      })
                    }
                  >
                    Back to Quiz
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold h-8"
                    onClick={() => {
                      onDeleteExercise(exercise.id);
                      onSetSelectedItem(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-8 font-heading leading-tight max-w-xl">
                {exercise.question}
              </h3>

              <div className="space-y-3 max-w-2xl">
                {options.map((opt: string, idx: number) => {
                  const isCorrect = exercise.correctAnswer === opt;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm shadow-emerald-100"
                          : "border-white bg-white/60 text-slate-600"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                          isCorrect
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-bold flex-1">{opt}</span>
                      {isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === "QUIZ_SESSION") {
      const exercises = data;
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 shadow-sm">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 font-heading">
                      Lesson Assessment
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      Manage all questions for this knowledge check
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-amber-100 text-amber-700 border-none font-bold px-4 py-2 rounded-xl">
                    {exercises.length} Questions
                  </Badge>
                  <Button
                    onClick={() =>
                      onAddExercise(
                        selectedItem.moduleId!,
                        selectedItem.lessonId!,
                      )
                    }
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {exercises.map((exercise: any, idx: number) => {
              const options = parseOptions(exercise.options);
              return (
                <div
                  key={exercise.id}
                  className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500 text-xs font-black border border-amber-100">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {exercise.title || "Untitled Question"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl"
                        onClick={() =>
                          onSetSelectedItem({
                            type: "EXERCISE",
                            data: exercise,
                            moduleId: selectedItem.moduleId,
                            lessonId: selectedItem.lessonId,
                          })
                        }
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                        onClick={() => onDeleteExercise(exercise.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-slate-900 mb-6 leading-snug">
                    {exercise.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {options.map((opt: string, oIdx: number) => {
                      const isCorrect = exercise.correctAnswer === opt;
                      return (
                        <div
                          key={oIdx}
                          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                            isCorrect
                              ? "border-emerald-500 bg-emerald-50/50 text-emerald-900"
                              : "border-slate-100 bg-slate-50/30 text-slate-600"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                              isCorrect
                                ? "bg-emerald-500 text-white"
                                : "bg-white text-slate-400 border border-slate-200"
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span className="text-sm font-bold flex-1">
                            {opt}
                          </span>
                          {isCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {exercises.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
              <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                No questions yet
              </h4>
              <p className="text-slate-500 mb-8">
                Start building your assessment by adding your first question.
              </p>
              <Button
                onClick={() =>
                  onAddExercise(selectedItem.moduleId!, selectedItem.lessonId!)
                }
                className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl"
              >
                Add First Question
              </Button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      {renderPreview() || (
        <div className="min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[32px] border border-dashed border-slate-200 shadow-sm">
          <div className="w-24 h-24 rounded-3xl bg-primary/5 shadow-xl shadow-primary/5 flex items-center justify-center mb-8 text-primary">
            <MonitorPlay className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 font-heading">
            Curriculum Builder
          </h3>
          <p className="text-slate-500 max-w-sm font-medium">
            Select a module or lesson from the sidebar to start building your
            course content.
          </p>
        </div>
      )}
    </div>
  );
};
