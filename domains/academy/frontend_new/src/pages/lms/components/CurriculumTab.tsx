import React from "react";
import {
  Book,
  PlusCircle,
  Settings,
  Trash2,
  Video,
  FileText,
  ChevronRight,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  PlayCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/academy";

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
  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Course Curriculum
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Structure your course by adding modules, lessons, and learning
            materials.
          </p>
        </div>
        <Button
          onClick={onAddModule}
          className="gap-2 bg-primary px-6 h-11 shadow-md hover:shadow-lg transition-all rounded-xl"
        >
          <PlusCircle className="w-4 h-4" /> Add Module
        </Button>
      </div>

      <div className="space-y-10">
        {course?.modules?.map((module, mIdx) => (
          <div
            key={module.id}
            className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-card transition-all hover:shadow-card-hover"
          >
            {/* Module Header */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-lg font-bold text-primary shadow-sm">
                  {mIdx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                      {module.lessons?.length || 0} Lessons
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddLesson(module.id)}
                  className="h-9 px-4 rounded-lg text-xs font-bold gap-2 border-slate-200 hover:bg-white hover:border-primary hover:text-primary transition-all shadow-sm"
                  disabled={isRejected}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Lesson
                </Button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => onDeleteModule(module.id)}
                  disabled={isRejected}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-2 space-y-2 bg-slate-50/30">
              {module.lessons?.map((lesson, lIdx) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm group hover:border-slate-300 transition-all"
                >
                  {/* Lesson Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:text-primary transition-all">
                        {lesson.type === "VIDEO" ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">
                          {lesson.title}
                        </h4>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {lesson.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[11px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5 gap-2 rounded-lg"
                        onClick={() => onDeleteLesson(lesson.id)}
                        disabled={isRejected}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-slate-400 font-normal">
                          Delete Lesson
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Materials & Quizzes Grid - Mirroring Student Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Learning Materials */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                          Learning Materials
                        </h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[10px] font-bold uppercase text-primary hover:bg-primary/5 px-2 rounded-md"
                          onClick={() => onAddContent(module.id, lesson.id)}
                          disabled={isRejected}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {lesson.contents?.map((content) => (
                          <div
                            key={content.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 bg-white shadow-inset hover:bg-slate-50 transition-all hover:shadow-card-hover group/item"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover/item:bg-white transition-colors">
                              {content.type === "VIDEO" ? (
                                <PlayCircle className="w-5 h-5 text-slate-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-slate-500" />
                              )}
                            </div>

                            <span className="flex-1 text-sm font-semibold text-slate-700 truncate pr-2">
                              {content.title}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary"
                                onClick={() => onView(content)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500"
                                onClick={() => onDeleteContent(content.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {!lesson.contents?.length && (
                          <div className="py-8 px-4 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                              No learning materials
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assessments */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                          Assessments
                        </h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[10px] font-bold uppercase text-primary hover:bg-primary/5 px-2 rounded-md"
                          onClick={() => onAddExercise(module.id, lesson.id)}
                          disabled={isRejected}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {lesson.exercises?.map((exercise) => (
                          <div
                            key={exercise.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 bg-white shadow-inset hover:bg-slate-50 transition-all hover:shadow-card-hover relative overflow-hidden group/item"
                          >
                            <div className="absolute left-0 top-0 h-full w-0.5 bg-amber-400 opacity-50" />
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 group-hover/item:bg-white transition-colors">
                              <HelpCircle className="w-5 h-5 text-amber-600" />
                            </div>

                            <span className="flex-1 text-sm font-semibold text-slate-700 truncate pr-2">
                              {exercise.title || exercise.question}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary"
                                onClick={() =>
                                  onView({
                                    ...exercise,
                                    type: exercise.type || "QUIZ",
                                    content: exercise.question,
                                    options: exercise.options,
                                  })
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500"
                                onClick={() => onDeleteExercise(exercise.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {!lesson.exercises?.length && (
                          <div className="py-8 px-4 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                              No assessments
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {!module.lessons?.length && (
                <div className="py-12 text-center bg-white m-2 rounded-2xl border border-dashed border-slate-200 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <Video className="w-6 h-6 text-slate-300" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Empty Module
                  </h4>
                  <p className="text-sm text-slate-500 mb-6 font-medium">
                    This module doesn't have any lessons yet.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => onAddLesson(module.id)}
                    className="h-10 px-6 rounded-xl font-bold bg-primary"
                  >
                    Add First Lesson
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {!course?.modules?.length && (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200 shadow-card">
            <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-8 rotate-3 border border-slate-100 shadow-sm">
              <Book className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Start Building Curriculum
            </h3>
            <p className="text-base text-slate-500 max-w-sm mx-auto mb-10 font-medium">
              Structure your learning path by creating modules to group your
              lessons.
            </p>
            <Button
              onClick={onAddModule}
              className="bg-primary px-10 h-14 rounded-[20px] font-bold text-lg shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Create First Module
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
