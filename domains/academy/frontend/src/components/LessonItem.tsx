import type { CourseLesson } from "./types.d";
import { FaPlay } from "react-icons/fa";
interface LessonItemProps {
  lesson: CourseLesson;
  onStart: () => void;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, onStart }) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
    <div>
      <p className="text-sm font-medium">{lesson.title} ({lesson.type})</p>
      <p className="text-xs text-gray-500">Progress: {lesson.progress || 0}%</p>
    </div>
    <button
      onClick={onStart}
      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 flex items-center"
    >
      <FaPlay className="mr-1 h-3 w-3" /> Start
    </button>
  </div>
);

export default LessonItem;