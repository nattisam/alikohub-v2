import type { CourseModule, CourseLesson } from "./types.d";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import LessonItem from "./LessonItem";
import { academyApi } from "../api";

interface ModuleCardProps {
  module: CourseModule;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);

  useEffect(() => {
    if (isOpen && lessons.length === 0) {
      // Fetch lessons when module is opened
      academyApi.get(`/lessons/module/${module.id}`).then((response) => {
        setLessons(response.data);
      });
    }
  }, [isOpen, module.id, lessons.length]);

  return (
    <div className="bg-white shadow-md rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex justify-between items-center font-semibold text-gray-800 hover:bg-gray-50"
      >
        <span>{module.title}</span>
        {isOpen ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t">
          <p className="text-sm text-gray-600 mb-4">{module.description}</p>
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                onStart={() => alert(`Starting ${lesson.title}`)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No lessons available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;