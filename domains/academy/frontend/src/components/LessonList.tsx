import type { LessonContent, CourseLesson } from "./types.d";
import { FaTrash } from "react-icons/fa";
import ContentInput from "./ContentInput";
import ContentList from "./ContentList";

interface LessonListProps {
  lessons: CourseLesson[];
  onRemove: (lessonId: number) => void;
  onAddContent: (lessonId: number, content: LessonContent) => void;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, onRemove, onAddContent }) => (
  <div className="mt-4 space-y-2">
    <h5 className="text-sm font-semibold text-gray-800">Lessons</h5>
    {lessons.map((lesson) => (
      <div key={lesson.id} className="border p-3 rounded-lg bg-white">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {lesson.title} ({lesson.type})
          </span>
          <button
            type="button"
            onClick={() => onRemove(lesson.id)}
            className="text-red-500 hover:text-red-700"
            aria-label={`Remove lesson ${lesson.title}`}
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
        {lesson.maxScore && (
          <p className="text-sm text-gray-600">Max Score: {lesson.maxScore}</p>
        )}
        {lesson.passingScore && (
          <p className="text-sm text-gray-600">Passing Score: {lesson.passingScore}</p>
        )}
        {lesson.dueDate && (
          <p className="text-sm text-gray-600">Due Date: {lesson.dueDate}</p>
        )}
        <ContentInput lessonId={lesson.id} onAdd={(content) => onAddContent(lesson.id, content)} />
        {lesson.contents.length > 0 && (
          <ContentList
            contents={lesson.contents}
            onRemove={(contentId) => onAddContent(lesson.id, { id: contentId, lessonId: lesson.id, type: "TEXT", url: "", createdAt: "", updatedAt: "" })}
          />
        )}
      </div>
    ))}
  </div>
);

export default LessonList;