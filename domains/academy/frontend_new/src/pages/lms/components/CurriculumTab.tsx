import React, { useState } from "react";
import {
  Book,
  PlusCircle,
  Trash2,
  Video,
  FileText,
  ChevronRight,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  PlayCircle,
  Plus,
  MonitorPlay,
  ClipboardList,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/academy";
import { Badge } from "@/components/ui/badge";

interface CurriculumTabProps {
  course?: Course;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
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
  onAddModule,
  onAddLesson,
  onAddContent,
  onAddExercise,
  onDeleteModule,
  onDeleteLesson,
  onDeleteContent,
  onDeleteExercise,
  onView,
  isRejected,
}: CurriculumTabProps) => {
  const [selectedItem, setSelectedItem] = useState<{
    type: "CONTENT" | "EXERCISE" | "OVERVIEW";
    data: any;
    moduleId?: string;
    lessonId?: string;
  } | null>(null);

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
      } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const renderPreview = () => {
    if (!selectedItem) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6 text-slate-300">
            <MonitorPlay className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Content Preview
          </h3>
          <p className="text-slate-500 max-w-sm font-medium">
            Select a learning material or assessment from the curriculum to
            preview how it looks for students.
          </p>
        </div>
      );
    }

    const { type, data } = selectedItem;

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
          <div className="space-y-6">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl relative">
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
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
          <div className="space-y-6">
            <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
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
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
      const options = parseOptions(data.options);
      return (
        <div className="space-y-6">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-sm relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ClipboardList className="w-32 h-32 text-amber-900" />
            </div>

            <div className="relative z-10">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 border-none font-bold mb-6"
              >
                Assessment Preview
              </Badge>
              <h3 className="text-3xl font-bold text-slate-900 mb-8 font-heading leading-tight">
                {data.title || "Untitled Assessment"}
              </h3>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/40 shadow-sm mb-8">
                <p className="text-slate-800 font-semibold text-xl leading-relaxed">
                  {data.question || data.content || "No question text defined."}
                </p>
              </div>

              <div className="space-y-4 max-w-2xl">
                {options.length > 0 ? (
                  options.map((opt: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border-2 border-white bg-white/60 flex items-center gap-5 transition-all hover:bg-white hover:shadow-md group"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-white text-slate-400 group-hover:text-amber-600 shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-bold text-slate-700 text-lg">
                        {opt}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-amber-200 bg-amber-50/50 text-center text-amber-600 font-medium">
                    No options defined for this multiple choice question.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between text-amber-700/60 font-bold text-[10px] uppercase tracking-[0.2em]">
              <span>Multiple Choice</span>
              <span>10 Points</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <Layers className="w-4 h-4" />
              <span>Exercise ID: {data.id}</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Curriculum Builder
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Design your course journey with interactive lessons and assessments.
          </p>
        </div>
        <Button
          onClick={onAddModule}
          className="gap-2 bg-slate-900 text-white hover:bg-slate-800 px-6 h-12 shadow-xl hover:shadow-slate-200/50 transition-all rounded-2xl font-bold"
        >
          <PlusCircle className="w-5 h-5" /> Add New Module
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Curriculum Structure */}
        <div className="lg:col-span-5 space-y-6 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
          {course?.modules?.map((module, mIdx) => (
            <div
              key={module.id}
              className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Module Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                    {mIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {module.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {module.lessons?.length || 0} Lessons
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-primary rounded-lg"
                    onClick={() => onAddLesson(module.id)}
                    disabled={isRejected}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-300 hover:text-red-500 rounded-lg"
                    onClick={() => onDeleteModule(module.id)}
                    disabled={isRejected}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-2 space-y-1">
                {module.lessons?.map((lesson, lIdx) => (
                  <div key={lesson.id} className="space-y-1">
                    <div className="flex items-center justify-between p-3 pl-4 rounded-xl hover:bg-slate-50 group transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-primary shadow-sm transition-all text-xs font-bold">
                          {lIdx + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Add Learning Material (Video/PDF)"
                          className="h-8 w-8 text-slate-400 hover:text-primary"
                          onClick={() => onAddContent(module.id, lesson.id)}
                        >
                          <MonitorPlay className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Add Assessment/Quiz"
                          className="h-8 w-8 text-slate-400 hover:text-primary"
                          onClick={() => onAddExercise(module.id, lesson.id)}
                        >
                          <ClipboardList className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Lesson"
                          className="h-8 w-8 text-slate-300 hover:text-red-500"
                          onClick={() => onDeleteLesson(lesson.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Lesson Content Sub-items */}
                    <div className="pl-10 space-y-1 pr-2">
                      {lesson.contents?.map((content) => (
                        <button
                          key={content.id}
                          onClick={() =>
                            setSelectedItem({
                              type: "CONTENT",
                              data: content,
                              moduleId: module.id,
                              lessonId: lesson.id,
                            })
                          }
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                            selectedItem?.data?.id === content.id
                              ? "bg-primary/5 border border-primary/20 shadow-sm"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${selectedItem?.data?.id === content.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
                          >
                            {content.type === "VIDEO" ? (
                              <PlayCircle className="w-3.5 h-3.5" />
                            ) : (
                              <FileText className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-semibold truncate flex-1 ${selectedItem?.data?.id === content.id ? "text-primary" : "text-slate-600"}`}
                          >
                            {content.title}
                          </span>
                          {selectedItem?.data?.id === content.id && (
                            <ArrowRight className="w-3 h-3 text-primary" />
                          )}
                        </button>
                      ))}

                      {lesson.exercises?.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() =>
                            setSelectedItem({
                              type: "EXERCISE",
                              data: {
                                ...exercise,
                                type: exercise.type || "QUIZ",
                              },
                              moduleId: module.id,
                              lessonId: lesson.id,
                            })
                          }
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                            selectedItem?.data?.id === exercise.id
                              ? "bg-amber-50 border border-amber-200 shadow-sm text-amber-700"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${selectedItem?.data?.id === exercise.id ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-600"}`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </div>
                          <span
                            className={`text-xs font-semibold truncate flex-1 ${selectedItem?.data?.id === exercise.id ? "text-amber-800" : "text-slate-600"}`}
                          >
                            {exercise.title || exercise.question}
                          </span>
                          {selectedItem?.data?.id === exercise.id && (
                            <ArrowRight className="w-3 h-3 text-amber-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!course?.modules?.length && (
            <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
              <Book className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">
                No modules yet
              </h3>
              <p className="text-sm text-slate-500 mt-2 mb-6">
                Start by adding your first module to the course.
              </p>
              <Button
                onClick={onAddModule}
                variant="outline"
                className="rounded-xl border-slate-200"
              >
                Add First Module
              </Button>
            </div>
          )}
        </div>

        {/* Right Side: Content Preview (The "LmsLearn" Feel) */}
        <div className="lg:col-span-7 sticky top-36 h-fit min-h-[600px]">
          <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden p-4 md:p-8 h-full">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};
