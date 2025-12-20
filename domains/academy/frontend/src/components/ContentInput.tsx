import { useState } from "react";
import type { LessonContent, ContentType } from "./types.d.tsx";
import { FaPlus } from "react-icons/fa";

interface ContentInputProps {
  lessonId: number;
  onAdd: (content: LessonContent) => void;
}

const ContentInput: React.FC<ContentInputProps> = ({ lessonId, onAdd }) => {
  const [contentInput, setContentInput] = useState({
    title: "Content",
    type: "VIDEO",
    url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContentInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (contentInput.url.trim()) {
      const newContent: LessonContent = {
        id: Date.now(),
        lessonId,
        title: contentInput.title,
        type: contentInput.type as ContentType,
        url: contentInput.url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAdd(newContent);
      setContentInput({ title: "Content", type: "VIDEO", url: "" });
    }
  };

  return (
    <div className="flex flex-col space-y-2 mt-3">
      <h6 className="text-xs font-semibold text-gray-800">Add Content</h6>
      <div className="flex flex-col space-y-2">
        <label
          htmlFor={`contentTitle-${lessonId}`}
          className="text-sm font-medium text-gray-700"
        >
          Content Title
        </label>
        <input
          id={`contentTitle-${lessonId}`}
          type="text"
          name="title"
          placeholder="Enter content title"
          value={contentInput.title}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label
          htmlFor={`contentType-${lessonId}`}
          className="text-sm font-medium text-gray-700"
        >
          Content Type
        </label>
        <select
          name="type"
          value={contentInput.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="VIDEO">Video</option>
          <option value="PDF">PDF</option>
          <option value="QUIZ">Quiz</option>
          <option value="ASSIGNMENT">Assignment</option>
        </select>
      </div>
      <div className="flex flex-col space-y-2">
        <label
          htmlFor={`contentUrl-${lessonId}`}
          className="text-sm font-medium text-gray-700"
        >
          Content URL
        </label>
        <input
          id={`contentUrl-${lessonId}`}
          type="text"
          name="url"
          placeholder="Enter content URL"
          value={contentInput.url}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
      >
        <FaPlus className="mr-2 h-4 w-4" /> Add Content
      </button>
    </div>
  );
};

export default ContentInput;