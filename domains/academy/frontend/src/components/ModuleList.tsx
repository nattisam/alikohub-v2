import type { CourseModule, CourseLesson, LessonContent } from "./types.d";
import { FaTrash } from "react-icons/fa";
import LessonInput from "./LessonInput";
import LessonList from "./LessonList";

interface ModuleListProps {
  modules: CourseModule[];
  onRemove: (moduleId: number) => void;
  onAddLesson: (moduleId: number, lesson: CourseLesson) => void;
  onAddContent: (moduleId: number, lessonId: number, content: LessonContent) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({ modules, onRemove, onAddLesson, onAddContent }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800">Modules</h3>
    {modules.map((module) => (
      <div key={module.id} className="border p-4 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-700">{module.title}</h4>
          <button
            type="button"
            onClick={() => onRemove(module.id)}
            className="text-red-500 hover:text-red-700"
            aria-label={`Remove module ${module.title}`}
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600">{module.description}</p>
        <LessonInput moduleId={module.id} onAdd={(lesson) => onAddLesson(module.id, lesson)} />
        {module.lessons.length > 0 && (
          <LessonList
            lessons={module.lessons}
            onRemove={(lessonId) => onAddLesson(module.id, { id: lessonId, moduleId: module.id, title: "", type: "TEXT", contents: [], createdAt: "", updatedAt: "" })}
            onAddContent={(lessonId, content) => onAddContent(module.id, lessonId, content)}
          />
        )}
      </div>
    ))}
  </div>
);

export default ModuleList;