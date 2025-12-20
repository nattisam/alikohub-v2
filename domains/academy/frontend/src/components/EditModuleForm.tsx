import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { academyApi } from "../api";
import type { CourseModule, CourseLesson, LessonContent } from "./types.d.tsx";

interface EditModuleFormProps {
  moduleId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditModuleForm: React.FC<EditModuleFormProps> = ({ moduleId, onClose, onUpdate }) => {
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [moduleInput, setModuleInput] = useState({ title: "", description: "" });
  const [lessonInput, setLessonInput] = useState({ 
    title: "", 
    type: "VIDEO",
    dueDate: "",
    maxScore: "",
    passingScore: ""
  });
  const [contentInput, setContentInput] = useState({ title: "", type: "TEXT", url: "" });
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const response = await academyApi.get(`/modules/${moduleId}`);
      setModule(response.data);
      setModuleInput({
        title: response.data.title,
        description: response.data.description
      });
      
      // Fetch lessons for this module
      const lessonsResponse = await academyApi.get(`/lessons/module/${moduleId}`);
      setModule((prev: CourseModule | null) => prev ? { ...prev, lessons: lessonsResponse.data } : null);
    } catch (err) {
      setError("Failed to load module data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModuleInput(prev => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLessonInput(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContentInput(prev => ({ ...prev, [name]: value }));
  };

  const updateModule = async () => {
    try {
      setSaving(true);
      await academyApi.put(`/modules/${moduleId}`, {
        title: moduleInput.title,
        description: moduleInput.description
      });
      onUpdate();
      alert("Module updated successfully!");
    } catch (err) {
      setError("Failed to update module");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const createLesson = async () => {
    if (!lessonInput.title.trim() || !module) return;
    
    try {
      setSaving(true);
      const lessonData = {
        title: lessonInput.title,
        type: lessonInput.type,
        moduleId: module.id,
        dueDate: lessonInput.dueDate || undefined,
        maxScore: lessonInput.maxScore ? Number(lessonInput.maxScore) : undefined,
        passingScore: lessonInput.passingScore ? Number(lessonInput.passingScore) : undefined
      };
      
      const response = await academyApi.post('/lessons', lessonData);
      
      // Add the new lesson to the module
      setModule((prev: CourseModule | null) => prev ? {
        ...prev,
        lessons: [...prev.lessons, response.data]
      } : null);
      
      // Reset lesson input
      setLessonInput({
        title: "",
        type: "VIDEO",
        dueDate: "",
        maxScore: "",
        passingScore: ""
      });
      
      alert("Lesson created successfully!");
    } catch (err) {
      setError("Failed to create lesson");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateLesson = async (lessonId: number, updates: Partial<CourseLesson>) => {
    try {
      setSaving(true);
      const response = await academyApi.put(`/lessons/${lessonId}`, updates);
      
      // Update the lesson in the module
      setModule((prev: CourseModule | null) => prev ? {
        ...prev,
        lessons: prev.lessons.map((lesson: CourseLesson) => 
          lesson.id === lessonId ? { ...lesson, ...response.data } : lesson
        )
      } : null);
      
      alert("Lesson updated successfully!");
    } catch (err) {
      setError("Failed to update lesson");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (lessonId: number) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    
    try {
      setSaving(true);
      await academyApi.delete(`/lessons/${lessonId}`);
      
      // Remove the lesson from the module
      setModule((prev: CourseModule | null) => prev ? {
        ...prev,
        lessons: prev.lessons.filter((lesson: CourseLesson) => lesson.id !== lessonId)
      } : null);
      
      alert("Lesson deleted successfully!");
    } catch (err) {
      setError("Failed to delete lesson");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const createContent = async () => {
    if (!contentInput.title.trim() || !contentInput.url.trim() || !currentLessonId) return;
    
    try {
      setSaving(true);
      const contentData = {
        title: contentInput.title,
        type: contentInput.type,
        url: contentInput.url,
        lessonId: currentLessonId
      };
      
      const response = await academyApi.post('/content', contentData);
      
      // Add the new content to the lesson
      setModule((prev: CourseModule | null) => prev ? {
        ...prev,
        lessons: prev.lessons.map((lesson: CourseLesson) => 
          lesson.id === currentLessonId 
            ? { 
                ...lesson, 
                contents: [...(lesson.contents || []), response.data] 
              } 
            : lesson
        )
      } : null);
      
      // Reset content input
      setContentInput({ title: "", type: "TEXT", url: "" });
      
      alert("Content created successfully!");
    } catch (err) {
      setError("Failed to create content");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (contentId: number, lessonId: number) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    
    try {
      setSaving(true);
      await academyApi.delete(`/content/${contentId}`);
      
      // Remove the content from the lesson
      setModule((prev: CourseModule | null) => prev ? {
        ...prev,
        lessons: prev.lessons.map((lesson: CourseLesson) => 
          lesson.id === lessonId 
            ? { 
                ...lesson, 
                contents: (lesson.contents || []).filter((content: LessonContent) => content.id !== contentId) 
              } 
            : lesson
        )
      } : null);
      
      alert("Content deleted successfully!");
    } catch (err) {
      setError("Failed to delete content");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <FaSpinner className="animate-spin text-2xl" />
          <p className="mt-2">Loading module data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2">Module not found</h3>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Module: {module.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <FaXmark />
            </button>
          </div>
          
          {/* Module Details */}
          <div className="mb-8 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Module Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={moduleInput.title}
                  onChange={handleModuleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={moduleInput.description}
                  onChange={handleModuleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={updateModule}
                disabled={saving}
                className={`px-4 py-2 text-white rounded-lg ${
                  saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save Module"}
              </button>
            </div>
          </div>
          
          {/* Lessons Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lessons</h3>
              <button
                onClick={createLesson}
                disabled={saving}
                className={`px-3 py-1 text-white rounded-lg text-sm ${
                  saving ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <FaPlus className="inline mr-1" /> Add Lesson
              </button>
            </div>
            
            {/* Add Lesson Form */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3">Add New Lesson</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={lessonInput.title}
                    onChange={handleLessonChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={lessonInput.type}
                    onChange={handleLessonChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="WEBINAR">Webinar</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={lessonInput.dueDate}
                    onChange={handleLessonChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score (Optional)
                  </label>
                  <input
                    type="number"
                    name="maxScore"
                    value={lessonInput.maxScore}
                    onChange={handleLessonChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Lessons List */}
            <div className="space-y-4">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{lesson.title} ({lesson.type})</h4>
                    <div>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this lesson?")) {
                            deleteLesson(lesson.id);
                          }
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={lesson.dueDate ? lesson.dueDate.split('T')[0] : ""}
                        onChange={(e) => updateLesson(lesson.id, { dueDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Score
                      </label>
                      <input
                        type="number"
                        value={lesson.maxScore || ""}
                        onChange={(e) => updateLesson(lesson.id, { maxScore: Number(e.target.value) || undefined })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passing Score
                      </label>
                      <input
                        type="number"
                        value={lesson.passingScore || ""}
                        onChange={(e) => updateLesson(lesson.id, { passingScore: Number(e.target.value) || undefined })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => setCurrentLessonId(currentLessonId === lesson.id ? null : lesson.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {currentLessonId === lesson.id ? "Hide Content" : "Manage Content"}
                    </button>
                    
                    {currentLessonId === lesson.id && (
                      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <h5 className="font-medium mb-3">Content for "{lesson.title}"</h5>
                        
                        {/* Add Content Form */}
                        <div className="mb-4 p-3 border rounded bg-white">
                          <h6 className="font-medium mb-2">Add New Content</h6>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={contentInput.title}
                                onChange={handleContentChange}
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                              </label>
                              <select
                                name="type"
                                value={contentInput.type}
                                onChange={handleContentChange}
                                className="w-full px-3 py-2 border rounded-lg"
                              >
                                <option value="VIDEO">Video</option>
                                <option value="PDF">PDF</option>
                                <option value="QUIZ">Quiz</option>
                                <option value="ASSIGNMENT">Assignment</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL
                              </label>
                              <input
                                type="text"
                                name="url"
                                value={contentInput.url}
                                onChange={handleContentChange}
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                            </div>
                          </div>
                          <button
                            onClick={createContent}
                            disabled={saving}
                            className={`mt-2 px-3 py-1 text-white rounded text-sm ${
                              saving ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
                            }`}
                          >
                            <FaPlus className="inline mr-1" /> Add Content
                          </button>
                        </div>
                        
                        {/* Content List */}
                        <div>
                          <h6 className="font-medium mb-2">Existing Content</h6>
                          {lesson.contents && lesson.contents.length > 0 ? (
                            <div className="space-y-2">
                              {lesson.contents.map((content) => (
                                <div key={content.id} className="flex justify-between items-center p-2 bg-white rounded border">
                                  <div>
                                    <span className="font-medium">{content.title}</span>
                                    <span className="text-sm text-gray-500 ml-2">({content.type})</span>
                                  </div>
                                  <button
                                    onClick={() => deleteContent(content.id, lesson.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No content added yet</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModuleForm;