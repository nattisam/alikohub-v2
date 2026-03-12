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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Course Curriculum
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Add modules, lessons, and materials to build your course.
          </p>
        </div>
        <Button
          onClick={onAddModule}
          className="gap-2 bg-slate-900 shadow-lg shadow-slate-200"
        >
          <PlusCircle className="w-4 h-4" /> Add Module
        </Button>
      </div>

      <div className="space-y-6">
        {course?.modules?.map((module, mIdx) => (
          <div
            key={module.id}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
          >
            <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-900 text-sm shadow-sm">
                  {mIdx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none mb-1">
                    {module.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {module.lessons?.length || 0} Lessons
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddLesson(module.id)}
                  className="text-xs font-bold gap-1 border-slate-200"
                  disabled={isRejected}
                >
                  <PlusCircle className="w-3 h-3" /> Add Lesson
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-red-500"
                  onClick={() => onDeleteModule(module.id)}
                  disabled={isRejected}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {module.lessons?.map((lesson, lIdx) => (
                <div key={lesson.id} className="p-4 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-xl transition-colors ${
                          lesson.type === "VIDEO"
                            ? "bg-blue-50 text-blue-500"
                            : "bg-emerald-50 text-emerald-500"
                        }`}
                      >
                        {lesson.type === "VIDEO" ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">
                            {lesson.title}
                          </p>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                            {lesson.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-500 gap-1 hover:text-accent"
                        onClick={() => onAddContent(module.id, lesson.id)}
                      >
                        <PlusCircle className="w-3 h-3" /> Material
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-500 gap-1 hover:text-accent"
                        onClick={() => onAddExercise(module.id, lesson.id)}
                      >
                        <PlusCircle className="w-3 h-3" /> Quiz
                      </Button>
                      <div className="w-px h-4 bg-slate-100 mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                        onClick={() => onDeleteLesson(lesson.id)}
                        disabled={isRejected}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Materials & Quizzes List */}
                  <div className="ml-12 space-y-2">
                    {/* Content/Materials */}
                    {lesson.contents?.map((content) => (
                      <div
                        key={content.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50/50 border border-slate-100/50 group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-white flex items-center justify-center border border-slate-100 shadow-xs">
                            <LinkIcon className="w-2.5 h-2.5 text-slate-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate max-w-xs">
                            {content.title}
                          </span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200/50 text-slate-500 uppercase tracking-tighter">
                            {content.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-400 hover:text-accent"
                            onClick={() => onView(content)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                            onClick={() => onDeleteContent(content.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Exercises/Quizzes */}
                    {lesson.exercises?.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50/40 border border-amber-100/40 group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-white flex items-center justify-center border border-amber-100 shadow-xs">
                            <HelpCircle className="w-2.5 h-2.5 text-amber-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate max-w-xs">
                            {exercise.title}
                          </span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 uppercase tracking-tighter">
                            {exercise.points} PTS
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-400 hover:text-accent"
                            onClick={() =>
                              onView({
                                ...exercise,
                                type: exercise.type || "QUIZ",
                                content: exercise.question,
                                options: exercise.options,
                              })
                            }
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                            onClick={() => onDeleteExercise(exercise.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {!lesson.contents?.length && !lesson.exercises?.length && (
                      <div className="py-2 text-center border border-dashed border-slate-100 rounded-lg">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          No extra materials or quizzes
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {!module.lessons?.length && (
                <div className="py-8 text-center bg-slate-50/30 m-4 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-2 shadow-sm border border-slate-100">
                    <Video className="w-4 h-4 text-slate-300" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Empty Module
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Add your first lesson to get started.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => onAddLesson(module.id)}
                    variant="outline"
                    className="h-8 text-xs font-bold"
                  >
                    Add First Lesson
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {!course?.modules?.length && (
          <div className="py-24 text-center bg-white rounded-[32px] border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6 rotate-3">
              <Book className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Start Building Curriculum
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8 font-medium">
              Create modules to group your lessons and structure your learning
              path.
            </p>
            <Button
              onClick={onAddModule}
              className="bg-slate-900 px-8 h-12 rounded-xl font-bold"
            >
              Create First Module
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
