import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaGraduationCap, FaBook, FaSpinner } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { academyApi } from "../api";
import type { CourseModule, CourseLesson } from "./types.d.tsx";
import EditModuleForm from "./EditModuleForm";
import LessonView from "./LessonView";

interface ModuleDetailViewProps {
  moduleId: number;
  onClose: () => void;
  onEdit: (moduleId: number) => void;
  isInstructorView?: boolean;
}

const ModuleDetailView: React.FC<ModuleDetailViewProps> = ({ moduleId, onClose, onEdit, isInstructorView = false }) => {
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "VIDEO"
  });
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const response = await academyApi.get(`/modules/${moduleId}`);
      setModule(response.data);
      
      // Fetch lessons for this module
      const lessonsResponse = await academyApi.get(`/lessons/module/${moduleId}`);
      
      // Fetch content for each lesson
      const lessonsWithContent = await Promise.all(
        lessonsResponse.data.map(async (lesson: CourseLesson) => {
          try {
            const contentResponse = await academyApi.get(`/content/lesson/${lesson.id}`);
            return { ...lesson, contents: contentResponse.data };
          } catch {
            return { ...lesson, contents: [] };
          }
        })
      );
      
      setModule({ ...response.data, lessons: lessonsWithContent });
    } catch (err) {
      setError("Failed to load module data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const lessonData = {
        title: newLesson.title,
        type: newLesson.type,
        moduleId: moduleId
      };
      
      const response = await academyApi.post('/lessons', lessonData);
      
      // Update the module with the new lesson
      if (module) {
        setModule({
          ...module,
          lessons: [...(module.lessons || []), response.data]
        });
      }
      
      setNewLesson({ title: "", type: "VIDEO" });
      setShowAddLessonForm(false);
    } catch (error) {
      console.error("Error adding lesson:", error);
      alert("Failed to add lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    
    try {
      await academyApi.delete(`/lessons/${lessonId}`);
      
      // Update the module by removing the lesson
      if (module) {
        setModule({
          ...module,
          lessons: (module.lessons || []).filter(lesson => lesson.id !== lessonId)
        });
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Failed to delete lesson");
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <FaGraduationCap className="text-red-500" />;
      case "PDF":
        return <FaBook className="text-red-600" />;
      case "QUIZ":
        return <FaBook className="text-green-500" />;
      case "ASSIGNMENT":
        return <FaBook className="text-blue-500" />;
      default:
        return <FaGraduationCap className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <FaSpinner className="animate-spin text-3xl text-blue-600 mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading module data...</p>
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

  if (!module) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-center mb-4">
            <FaBook className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Module not found</h3>
          <p className="mb-6 text-gray-600 text-center">The requested module could not be found.</p>
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
                <FaBook className="mr-3 text-blue-600" /> Module: {module.title}
              </h2>
              <p className="text-gray-600 mt-1">Manage lessons and content within this module</p>
            </div>
            <div className="flex space-x-2 mt-3 sm:mt-0">
              <button
                onClick={() => onEdit(moduleId)}
                className="p-3 hover:bg-blue-100 rounded-xl text-blue-600 transition-colors"
                title="Edit module"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                title="Close"
              >
                <FaXmark size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700">{module.description}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaGraduationCap className="mr-3 text-blue-600" /> Lessons
                </h3>
                <p className="text-gray-600 mt-1">Manage and organize lessons within this module</p>
              </div>
              {isInstructorView && (
                <button
                  onClick={() => setShowAddLessonForm(true)}
                  className="mt-3 sm:mt-0 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium flex items-center text-sm shadow transition-all"
                >
                  <FaPlus className="mr-2" size={14} /> Add Lesson
                </button>
              )}
            </div>
            
            {module.lessons && module.lessons.length > 0 ? (
              <div className="space-y-4">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                      <div className="flex items-center">
                        <div className="mr-3 p-2 bg-white rounded-lg shadow">
                          {getLessonIcon(lesson.type)}
                        </div>
                        <h4 
                          className="font-bold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => setSelectedLessonId(lesson.id)}
                        >
                          {lesson.title}
                        </h4>
                      </div>
                      <span className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800 border border-gray-200">
                        {lesson.type}
                      </span>
                    </div>
                    
                    {lesson.dueDate && (
                      <p className="text-sm text-gray-600 mb-2">
                        Due Date: {new Date(lesson.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {(lesson.maxScore || lesson.passingScore) && (
                      <p className="text-sm text-gray-600 mb-3">
                        Score: {lesson.maxScore ? `Max ${lesson.maxScore}` : ""} 
                        {lesson.passingScore ? `, Pass ${lesson.passingScore}` : ""}
                      </p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                        {lesson.contents?.length || 0} content items
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedLessonId(lesson.id)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium text-sm shadow transition-all"
                        >
                          View Details
                        </button>
                        {isInstructorView && (
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium text-sm shadow transition-all"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-gray-400 mb-4">
                  <FaGraduationCap className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No lessons created yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first lesson to organize your module content.</p>
                {isInstructorView && (
                  <button
                    onClick={() => setShowAddLessonForm(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    <FaPlus className="mr-2" /> Add Your First Lesson
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      {selectedLessonId && (
        <LessonView
          lessonId={selectedLessonId}
          moduleId={moduleId}
          onClose={() => setSelectedLessonId(null)}
          onEdit={(lessonId) => {
            // For now, we'll just close the lesson view and let the parent handle editing
            setSelectedLessonId(null);
            // You can implement lesson editing functionality here
          }}
          isInstructorView={isInstructorView}
        />
      )}
      
      {showEditForm && (
        <EditModuleForm
          moduleId={moduleId}
          onClose={() => setShowEditForm(false)}
          onUpdate={() => {
            setShowEditForm(false);
            fetchModule(); // Refresh the module data
          }}
        />
      )}
      
      {/* Add Lesson Form Modal */}
      {showAddLessonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaGraduationCap className="mr-3 text-blue-600" /> Add New Lesson
                </h3>
                <button
                  onClick={() => setShowAddLessonForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaXmark size={20} className="text-gray-600" />
                </button>
              </div>
              
              <form onSubmit={handleAddLesson} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Enter lesson title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Type
                  </label>
                  <select
                    value={newLesson.type}
                    onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLessonForm(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Add Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDetailView;