import React from "react";
import { Book, PlusCircle, Settings, Trash2, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/academy";

interface CurriculumTabProps {
  course?: Course;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  isRejected: boolean;
}

export const CurriculumTab = ({ course, onAddModule, onAddLesson, isRejected }: CurriculumTabProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Course Curriculum
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Add modules and lessons to structure your course.
          </p>
        </div>
        <Button onClick={onAddModule} className="gap-2 bg-slate-900">
          <PlusCircle className="w-4 h-4" /> Add Module
        </Button>
      </div>

      <div className="space-y-6">
        {course?.modules?.map((module, mIdx) => (
          <div
            key={module.id}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
          >
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-slate-900 text-sm shadow-sm">
                  {mIdx + 1}
                </div>
                <h3 className="font-bold text-slate-900">
                  {module.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddLesson(module.id)}
                  className="text-xs font-bold gap-1 text-accent"
                  disabled={isRejected}
                >
                  <PlusCircle className="w-3 h-3" /> Add Lesson
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  disabled={isRejected}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-2">
              {module.lessons?.map((lesson, lIdx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-white transition-colors">
                      {lesson.type === "VIDEO" ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {lesson.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isRejected}
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400"
                      disabled={isRejected}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {!module.lessons?.length && (
                <div className="py-8 text-center bg-slate-50/50 rounded-xl m-2 border border-dashed border-slate-200">
                  <p className="text-xs font-medium text-slate-400">
                    No lessons in this module yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {!course?.modules?.length && (
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Start with Modules
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8">
              Your course needs at least one module before you can add
              lessons.
            </p>
            <Button onClick={onAddModule} className="bg-slate-900">
              Create First Module
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
