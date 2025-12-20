import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import type {CourseLesson, LessonType, } from "./types.d";


interface LessonInputProps {
  moduleId: number;
  onAdd: (lesson: CourseLesson) => void;
}

const LessonInput: React.FC<LessonInputProps> = ({ moduleId, onAdd }) => {
  const [lessonInput, setLessonInput] = useState<{
    title: string;
    type: LessonType;
    maxScore: string;
    passingScore: string;
    dueDate: string;
  }>({
    title: "",
    type: "TEXT",
    maxScore: "",
    passingScore: "",
    dueDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLessonInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (lessonInput.title.trim()) {
      const newLesson: CourseLesson = {
        id: Date.now(),
        title: lessonInput.title,
        moduleId,
        type: lessonInput.type,
        contents: [],
        maxScore: lessonInput.maxScore ? parseInt(lessonInput.maxScore) : undefined,
        passingScore: lessonInput.passingScore ? parseInt(lessonInput.passingScore) : undefined,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: lessonInput.dueDate || undefined,
      };
      onAdd(newLesson);
      setLessonInput({ title: "", type: "TEXT", maxScore: "", passingScore: "", dueDate: "" });
    }
  };

  return (
    <div className="flex flex-col space-y-2 mt-4">
      <h5 className="text-sm font-semibold text-gray-800">Add Lesson</h5>
      <div className="flex flex-col space-y-2">
        <label htmlFor={`lessonTitle-${moduleId}`} className="text-sm font-medium text-gray-700">
          Lesson Title
        </label>
        <input
          id={`lessonTitle-${moduleId}`}
          type="text"
          name="title"
          placeholder="Enter lesson title"
          value={lessonInput.title}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor={`lessonType-${moduleId}`} className="text-sm font-medium text-gray-700">
          Lesson Type
        </label>
        <select
          name="type"
          value={lesson.type}
          onChange={handleLessonChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="VIDEO">Video</option>
          <option value="WEBINAR">Webinar</option>
          <option value="ASSIGNMENT">Assignment</option>
          <option value="QUIZ">Quiz</option>
        </select>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor={`maxScore-${moduleId}`} className="text-sm font-medium text-gray-700">
          Max Score (optional)
        </label>
        <input
          id={`maxScore-${moduleId}`}
          type="number"
          name="maxScore"
          placeholder="Enter max score"
          value={lessonInput.maxScore}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor={`passingScore-${moduleId}`} className="text-sm font-medium text-gray-700">
          Passing Score (optional)
        </label>
        <input
          id={`passingScore-${moduleId}`}
          type="number"
          name="passingScore"
          placeholder="Enter passing score"
          value={lessonInput.passingScore}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor={`dueDate-${moduleId}`} className="text-sm font-medium text-gray-700">
          Due Date (optional)
        </label>
        <input
          id={`dueDate-${moduleId}`}
          type="date"
          name="dueDate"
          value={lessonInput.dueDate}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
      >
        <FaPlus className="mr-2 h-4 w-4" /> Add Lesson
      </button>
    </div>
  );
};

export default LessonInput;