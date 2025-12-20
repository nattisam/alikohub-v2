import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import type { CourseModule, CourseLesson, LessonContent } from "./types.d.tsx";

interface ModuleInputProps {
  onAdd: (module: CourseModule) => void;
}

const ModuleInput: React.FC<ModuleInputProps> = ({ onAdd }) => {
  const [moduleInput, setModuleInput] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  
  const [lessonInput, setLessonInput] = useState<{ 
    title: string; 
    type: string;
    dueDate?: string;
    maxScore?: number;
    passingScore?: number;
  }>({
    title: "",
    type: "VIDEO",
    dueDate: "",
    maxScore: undefined,
    passingScore: undefined,
  });
  
  const [contentInput, setContentInput] = useState<{
    title: string;
    type: string;
    url: string;
  }>({
    title: "",
    type: "VIDEO",
    url: "",
  });
  
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null);

  const handleModuleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setModuleInput((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleLessonChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLessonInput((prev) => ({ 
      ...prev, 
      [name]: name === 'maxScore' || name === 'passingScore' ? (value ? Number(value) : undefined) : value 
    }));
  };
  
  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContentInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLesson = () => {
    if (lessonInput.title.trim()) {
      const newLesson: CourseLesson = {
        id: Date.now(),
        title: lessonInput.title,
        moduleId: 0, // Will be set when module is created
        type: lessonInput.type as any,
        contents: [],
        maxScore: lessonInput.maxScore,
        passingScore: lessonInput.passingScore,
        dueDate: lessonInput.dueDate || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setLessons((prev) => [...prev, newLesson]);
      setLessonInput({
        title: "",
        type: "VIDEO",
        dueDate: "",
        maxScore: undefined,
        passingScore: undefined,
      });
    }
  };
  
  const handleRemoveLesson = (index: number) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
    if (currentLessonIndex === index) {
      setCurrentLessonIndex(null);
    } else if (currentLessonIndex !== null && currentLessonIndex > index) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };
  
  const handleSelectLesson = (index: number) => {
    setCurrentLessonIndex(index);
  };
  
  const handleAddContent = () => {
    if (contentInput.title.trim() && contentInput.url.trim() && currentLessonIndex !== null) {
      const newContent: LessonContent = {
        id: Date.now(),
        lessonId: 0, // Will be set when lesson is created
        title: contentInput.title,
        type: contentInput.type as any,
        url: contentInput.url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setLessons((prev) => 
        prev.map((lesson, index) => 
          index === currentLessonIndex 
            ? { ...lesson, contents: [...(lesson.contents || []), newContent] } 
            : lesson
        )
      );
      
      setContentInput({
        title: "",
        type: "VIDEO",
        url: "",
      });
    }
  };
  
  const handleRemoveContent = (lessonIndex: number, contentIndex: number) => {
    setLessons((prev) => 
      prev.map((lesson, index) => 
        index === lessonIndex 
          ? { 
              ...lesson, 
              contents: (lesson.contents || []).filter((_, i) => i !== contentIndex) 
            } 
          : lesson
      )
    );
  };

  const handleAddModule = () => {
    if (moduleInput.title.trim() && moduleInput.description.trim()) {
      const newModule: CourseModule = {
        id: Date.now(),
        title: moduleInput.title,
        description: moduleInput.description,
        courseId: 0, // Will be set on submit
        lessons: lessons,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAdd(newModule);
      
      // Reset form
      setModuleInput({ title: "", description: "" });
      setLessonInput({
        title: "",
        type: "VIDEO",
        dueDate: "",
        maxScore: undefined,
        passingScore: undefined,
      });
      setContentInput({
        title: "",
        type: "VIDEO",
        url: "",
      });
      setLessons([]);
      setCurrentLessonIndex(null);
    }
  };

  return (
    <div className="flex flex-col space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold text-gray-800">Add Module</h3>
      
      {/* Module Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="moduleTitle" className="text-sm font-medium text-gray-700">
            Module Title
          </label>
          <input
            id="moduleTitle"
            type="text"
            name="title"
            placeholder="Enter module title"
            value={moduleInput.title}
            onChange={handleModuleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="moduleDescription" className="text-sm font-medium text-gray-700">
            Module Description
          </label>
          <input
            id="moduleDescription"
            type="text"
            name="description"
            placeholder="Enter module description"
            value={moduleInput.description}
            onChange={handleModuleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Lessons Section */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-3">Lessons</h4>
        
        {/* Lesson Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col space-y-2">
            <label htmlFor="lessonTitle" className="text-sm font-medium text-gray-700">
              Lesson Title
            </label>
            <input
              id="lessonTitle"
              type="text"
              name="title"
              placeholder="Enter lesson title"
              value={lessonInput.title}
              onChange={handleLessonChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="lessonType" className="text-sm font-medium text-gray-700">
              Lesson Type
            </label>
            <select
              name="type"
              value={lessonInput.type}
              onChange={handleLessonChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="VIDEO">Video</option>
              <option value="WEBINAR">Webinar</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="maxScore" className="text-sm font-medium text-gray-700">
              Max Score (Optional)
            </label>
            <input
              id="maxScore"
              type="number"
              name="maxScore"
              placeholder="Enter max score"
              value={lessonInput.maxScore || ""}
              onChange={handleLessonChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="passingScore" className="text-sm font-medium text-gray-700">
              Passing Score (Optional)
            </label>
            <input
              id="passingScore"
              type="number"
              name="passingScore"
              placeholder="Enter passing score"
              value={lessonInput.passingScore || ""}
              onChange={handleLessonChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleAddLesson}
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center text-sm"
        >
          <FaPlus className="mr-1 h-3 w-3" /> Add Lesson
        </button>
        
        {/* Lessons List */}
        {lessons.length > 0 && (
          <div className="mt-3">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Added Lessons:</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lessons.map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  className={`flex justify-between items-center p-2 rounded ${currentLessonIndex === index ? 'bg-blue-100' : 'bg-gray-50'}`}
                >
                  <div 
                    className="cursor-pointer flex-1"
                    onClick={() => handleSelectLesson(index)}
                  >
                    <span className="font-medium">{lesson.title}</span>
                    <span className="text-xs text-gray-500 ml-2">({lesson.type})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Content Section (only when a lesson is selected) */}
        {currentLessonIndex !== null && (
          <div className="mt-4 pt-3 border-t">
            <h5 className="font-medium mb-3">Content for "{lessons[currentLessonIndex]?.title}"</h5>
            
            {/* Content Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="flex flex-col space-y-2">
                <label htmlFor="contentTitle" className="text-sm font-medium text-gray-700">
                  Content Title
                </label>
                <input
                  id="contentTitle"
                  type="text"
                  name="title"
                  placeholder="Enter content title"
                  value={contentInput.title}
                  onChange={handleContentChange}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="contentType" className="text-sm font-medium text-gray-700">
                  Content Type
                </label>
                <select
                  name="type"
                  value={contentInput.type}
                  onChange={handleContentChange}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="ASSIGNMENT">Assignment</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="contentUrl" className="text-sm font-medium text-gray-700">
                  Content URL
                </label>
                <input
                  id="contentUrl"
                  type="text"
                  name="url"
                  placeholder="Enter content URL"
                  value={contentInput.url}
                  onChange={handleContentChange}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleAddContent}
              className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center text-sm"
            >
              <FaPlus className="mr-1 h-3 w-3" /> Add Content
            </button>
            
            {/* Content List */}
            {lessons[currentLessonIndex]?.contents && lessons[currentLessonIndex].contents.length > 0 && (
              <div className="mt-3">
                <h6 className="text-sm font-medium text-gray-700 mb-2">Added Content:</h6>
                <div className="space-y-2">
                  {lessons[currentLessonIndex].contents.map((content, contentIndex) => (
                    <div key={content.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{content.title}</span>
                        <span className="text-xs text-gray-500 ml-2">({content.type})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveContent(currentLessonIndex, contentIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <button
        type="button"
        onClick={handleAddModule}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
      >
        <FaPlus className="mr-2 h-4 w-4" /> Add Module
      </button>
    </div>
  );
};

export default ModuleInput;