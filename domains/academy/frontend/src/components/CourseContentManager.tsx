import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaChevronDown, FaChevronRight, FaFile, FaVideo, FaFilePdf, FaQuestionCircle, FaTasks, FaBook, FaGraduationCap, FaSpinner } from "react-icons/fa";
import { courseApi } from "../api/courseApi";
import AddModuleForm from "./AddModuleForm";
import AddLessonForm from "./AddLessonForm";
import AddContentForm from "./AddContentForm";
import type { CourseModule, CourseLesson, LessonContent } from "./types.d.tsx";

interface CourseContentManagerProps {
  courseId: number;
  onClose: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId, onClose }) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<number, boolean>>({});
  
  // State for modals
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [moduleIdForLesson, setModuleIdForLesson] = useState<number | null>(null);
  const [lessonIdForContent, setLessonIdForContent] = useState<number | null>(null);
  
  // State for editing
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [editingModuleData, setEditingModuleData] = useState({ title: "", description: "" });
  
  const [editingLesson, setEditingLesson] = useState<number | null>(null);
  const [editingLessonData, setEditingLessonData] = useState({
    title: "",
    type: "VIDEO",
    dueDate: "",
    maxScore: "",
    passingScore: ""
  });

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      
      // Fetch modules for this course
      const modulesResponse = await courseApi.getModules(courseId);
      const modulesData: CourseModule[] = modulesResponse.data;
      
      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        modulesData.map(async (module) => {
          try {
            const lessonsResponse = await courseApi.getLessons(module.id);
            
            // Fetch content for each lesson
            const lessonsWithContent = await Promise.all(
              lessonsResponse.data.map(async (lesson: CourseLesson) => {
                try {
                  const contentResponse = await courseApi.getContent(lesson.id);
                  return { ...lesson, contents: contentResponse.data };
                } catch {
                  return { ...lesson, contents: [] };
                }
              })
            );
            
            return { ...module, lessons: lessonsWithContent };
          } catch {
            return { ...module, lessons: [] };
          }
        })
      );
      
      setModules(modulesWithLessons);
    } catch (err) {
      setError("Failed to load course content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleAdded = (newModule: CourseModule) => {
    setModules(prev => [...prev, { ...newModule, lessons: [] }]);
    setShowAddModuleForm(false);
  };

  const handleLessonAdded = (newLesson: CourseLesson) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleIdForLesson 
          ? { ...module, lessons: [...(module.lessons || []), { ...newLesson, contents: [] }] } 
          : module
      )
    );
    setModuleIdForLesson(null);
  };

  const handleContentAdded = (newContent: LessonContent) => {
    setModules(prev => 
      prev.map(module => ({
        ...module,
        lessons: module.lessons?.map(lesson => 
          lesson.id === lessonIdForContent 
            ? { ...lesson, contents: [...(lesson.contents || []), newContent] } 
            : lesson
        ) || []
      }))
    );
    setLessonIdForContent(null);
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!window.confirm("Are you sure you want to delete this module and all its content?")) return;
    
    try {
      await courseApi.deleteModule(moduleId);
      setModules(prev => prev.filter(module => module.id !== moduleId));
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module");
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm("Are you sure you want to delete this lesson and all its content?")) return;
    
    try {
      await courseApi.deleteLesson(lessonId);
      
      // Remove lesson from state
      setModules(prev => 
        prev.map(module => ({
          ...module,
          lessons: module.lessons?.filter(lesson => lesson.id !== lessonId) || []
        }))
      );
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Failed to delete lesson");
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    
    try {
      await courseApi.deleteContent(contentId);
      
      // Remove content from state
      setModules(prev => 
        prev.map(module => ({
          ...module,
          lessons: module.lessons?.map(lesson => ({
            ...lesson,
            contents: lesson.contents?.filter(content => content.id !== contentId) || []
          })) || []
        }))
      );
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content");
    }
  };

  const handleStartEditModule = (module: CourseModule) => {
    setEditingModule(module.id);
    setEditingModuleData({
      title: module.title,
      description: module.description || ""
    });
  };

  const handleUpdateModule = async (moduleId: number) => {
    try {
      const updatedModule = await courseApi.updateModule(moduleId, editingModuleData);
      
      // Update module in state
      setModules(prev => 
        prev.map(module => 
          module.id === moduleId ? { ...module, ...updatedModule.data } : module
        )
      );
      
      setEditingModule(null);
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Failed to update module");
    }
  };

  const handleStartEditLesson = (lesson: CourseLesson) => {
    setEditingLesson(lesson.id);
    setEditingLessonData({
      title: lesson.title,
      type: lesson.type,
      dueDate: lesson.dueDate ? new Date(lesson.dueDate).toISOString().split('T')[0] : "",
      maxScore: lesson.maxScore ? lesson.maxScore.toString() : "",
      passingScore: lesson.passingScore ? lesson.passingScore.toString() : ""
    });
  };

  const handleUpdateLesson = async (lessonId: number) => {
    try {
      const lessonPayload: any = {
        ...editingLessonData,
        maxScore: editingLessonData.maxScore ? parseInt(editingLessonData.maxScore) : null,
        passingScore: editingLessonData.passingScore ? parseInt(editingLessonData.passingScore) : null
      };
      
      // Remove empty dueDate
      if (!editingLessonData.dueDate) {
        delete lessonPayload.dueDate;
      }
      
      const updatedLesson = await courseApi.updateLesson(lessonId, lessonPayload);
      
      // Update lesson in state
      setModules(prev => 
        prev.map(module => ({
          ...module,
          lessons: module.lessons?.map(lesson => 
            lesson.id === lessonId ? { ...lesson, ...updatedLesson.data } : lesson
          ) || []
        }))
      );
      
      setEditingLesson(null);
    } catch (error) {
      console.error("Error updating lesson:", error);
      alert("Failed to update lesson");
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <FaVideo className="text-red-500" />;
      case "PDF":
        return <FaFilePdf className="text-red-600" />;
      case "QUIZ":
        return <FaQuestionCircle className="text-blue-500" />;
      case "ASSIGNMENT":
        return <FaTasks className="text-green-500" />;
      default:
        return <FaFile className="text-blue-500" />;
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <FaVideo className="text-red-500 mr-2" />;
      case "PDF":
        return <FaFilePdf className="text-red-600 mr-2" />;
      case "QUIZ":
        return <FaQuestionCircle className="text-blue-500 mr-2" />;
      case "ASSIGNMENT":
        return <FaTasks className="text-green-500 mr-2" />;
      default:
        return <FaFile className="text-blue-500 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <FaSpinner className="animate-spin text-3xl text-blue-600 mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-red-600 mb-3">Error</h3>
          <p className="mb-5 text-gray-700">{error}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaBook className="mr-3 text-blue-600" /> Course Content Manager
              </h2>
              <p className="text-gray-600 mt-1">Organize your course content in modules, lessons, and content items</p>
            </div>
            <button
              onClick={onClose}
              className="mt-3 sm:mt-0 px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
          
          <div className="mb-6">
            <button
              onClick={() => setShowAddModuleForm(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-medium flex items-center shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <FaPlus className="mr-2" /> Add Module
            </button>
          </div>
          
          {modules.length > 0 ? (
            <div className="space-y-5">
              {modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Module Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                    {editingModule === module.id ? (
                      <div className="flex-1 mr-3 w-full">
                        <input
                          type="text"
                          value={editingModuleData.title}
                          onChange={(e) => setEditingModuleData({...editingModuleData, title: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-bold"
                          placeholder="Module title"
                        />
                        <textarea
                          value={editingModuleData.description}
                          onChange={(e) => setEditingModuleData({...editingModuleData, description: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2 text-sm"
                          rows={2}
                          placeholder="Module description"
                        />
                      </div>
                    ) : (
                      <div 
                        className="flex items-center cursor-pointer flex-1 w-full"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="bg-white p-2 rounded-lg mr-3 shadow">
                          {expandedModules[module.id] ? 
                            <FaChevronDown className="text-blue-600" /> : 
                            <FaChevronRight className="text-blue-600" />
                          }
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">{module.title}</h3>
                          {module.description && (
                            <p className="text-gray-600 mt-1 text-sm">{module.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      {editingModule === module.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateModule(module.id)}
                            className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow transition-all"
                            title="Save changes"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingModule(null)}
                            className="p-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow transition-all"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEditModule(module)}
                            className="p-2.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            title="Edit module"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setModuleIdForLesson(module.id)}
                            className="p-2.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                            title="Add lesson"
                          >
                            <FaPlus />
                          </button>
                          <button
                            onClick={() => handleDeleteModule(module.id)}
                            className="p-2.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                            title="Delete module"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Lessons */}
                  {expandedModules[module.id] && (
                    <div className="p-5 bg-white">
                      {module.lessons && module.lessons.length > 0 ? (
                        <div className="space-y-4">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                              {/* Lesson Header */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                {editingLesson === lesson.id ? (
                                  <div className="flex-1 mr-3 w-full mb-3 sm:mb-0">
                                    <input
                                      type="text"
                                      value={editingLessonData.title}
                                      onChange={(e) => setEditingLessonData({...editingLessonData, title: e.target.value})}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                      placeholder="Lesson title"
                                    />
                                  </div>
                                ) : (
                                  <div 
                                    className="flex items-center cursor-pointer flex-1 w-full"
                                    onClick={() => toggleLesson(lesson.id)}
                                  >
                                    <div className="bg-white p-1.5 rounded-lg mr-3 shadow">
                                      {expandedLessons[lesson.id] ? 
                                        <FaChevronDown className="text-gray-600 text-sm" /> : 
                                        <FaChevronRight className="text-gray-600 text-sm" />
                                      }
                                    </div>
                                    <div className="flex items-center">
                                      {getLessonIcon(lesson.type)}
                                      <div>
                                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {lesson.type}
                                          </span>
                                          {lesson.dueDate && (
                                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                              Due: {new Date(lesson.dueDate).toLocaleDateString()}
                                            </span>
                                          )}
                                          {lesson.maxScore && (
                                            <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                              Max: {lesson.maxScore}
                                            </span>
                                          )}
                                          {lesson.passingScore && (
                                            <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                              Pass: {lesson.passingScore}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex space-x-1 mt-2 sm:mt-0">
                                  {editingLesson === lesson.id ? (
                                    <>
                                      <button
                                        onClick={() => handleUpdateLesson(lesson.id)}
                                        className="p-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 shadow transition-all"
                                        title="Save changes"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingLesson(null)}
                                        className="p-1.5 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 shadow transition-all"
                                        title="Cancel"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleStartEditLesson(lesson)}
                                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                        title="Edit lesson"
                                      >
                                        <FaEdit size={14} />
                                      </button>
                                      <button
                                        onClick={() => setLessonIdForContent(lesson.id)}
                                        className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                                        title="Add content"
                                      >
                                        <FaPlus size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(lesson.id)}
                                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                                        title="Delete lesson"
                                      >
                                        <FaTrash size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Content */}
                              {expandedLessons[lesson.id] && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="flex justify-between items-center mb-3">
                                    <h5 className="font-bold text-gray-900 flex items-center">
                                      <FaGraduationCap className="mr-2 text-blue-600" /> Content Items
                                    </h5>
                                  </div>
                                  
                                  {lesson.contents && lesson.contents.length > 0 ? (
                                    <div className="space-y-3">
                                      {lesson.contents.map((content) => (
                                        <div key={content.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                          <div className="flex items-center">
                                            <div className="mr-3 p-2 bg-gray-100 rounded-lg">
                                              {getContentIcon(content.type)}
                                            </div>
                                            <div>
                                              <p className="font-medium text-gray-900">{content.title}</p>
                                              <p className="text-xs text-gray-500 mt-1">{content.type}</p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleDeleteContent(content.id)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete content"
                                          >
                                            <FaTrash size={16} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                      <p className="text-gray-500">
                                        No content added yet. Add content to this lesson.
                                      </p>
                                    </div>
                                  )}
                                  
                                  <div className="mt-4">
                                    <button
                                      onClick={() => setLessonIdForContent(lesson.id)}
                                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium flex items-center text-sm shadow transition-all"
                                    >
                                      <FaPlus className="mr-2" size={14} /> Add Content
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <p className="text-gray-500 mb-4">No lessons in this module yet.</p>
                          <button
                            onClick={() => setModuleIdForLesson(module.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium flex items-center mx-auto shadow transition-all"
                          >
                            <FaPlus className="mr-2" /> Add Your First Lesson
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-5 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setModuleIdForLesson(module.id)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium flex items-center text-sm shadow transition-all"
                        >
                          <FaPlus className="mr-2" size={14} /> Add Lesson
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="text-gray-400 mb-4">
                <FaBook className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No modules created yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by creating your first module to organize your course content.</p>
              <button
                onClick={() => setShowAddModuleForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Add Your First Module
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Module Form */}
      {showAddModuleForm && (
        <AddModuleForm
          courseId={courseId}
          onModuleAdded={handleModuleAdded}
          onCancel={() => setShowAddModuleForm(false)}
        />
      )}
      
      {/* Add Lesson Form */}
      {moduleIdForLesson && (
        <AddLessonForm
          moduleId={moduleIdForLesson}
          onLessonAdded={handleLessonAdded}
          onCancel={() => setModuleIdForLesson(null)}
        />
      )}
      
      {/* Add Content Form */}
      {lessonIdForContent && (
        <AddContentForm
          lessonId={lessonIdForContent}
          onContentAdded={handleContentAdded}
          onCancel={() => setLessonIdForContent(null)}
        />
      )}
    </div>
  );
};

export default CourseContentManager;