import { FaTrash, FaPlus, FaEdit, FaBook, FaGraduationCap } from "react-icons/fa";
import CourseHeader from "./CourseHeader";
import CourseOverview from "./CourseOverview";
import ModuleCard from "./ModuleCard";
import type { Course, CourseModule } from "./types.d.tsx";
import { useEffect, useState } from "react";
import { academyApi } from "../api";
import { FaXmark } from "react-icons/fa6";
import ConfirmationModal from "./ConfirmationModal";
import ModuleDetailView from "./ModuleDetailView";
import EditModuleForm from "./EditModuleForm";
import CourseContentManager from "./CourseContentManager";

interface CourseViewProps {
  course: Course;
  onDelete: () => void;
  onClose: () => void;
}

const CourseView: React.FC<CourseViewProps> = ({
  course,
  onDelete,
  onClose,
}) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "edit">("list");
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showContentManager, setShowContentManager] = useState(false);

  useEffect(() => {
    academyApi.get(`/modules/course/${course.id}`).then((response) => {
      const modules = response.data;
      if (modules) setModules(modules);
    });
  }, [course.id]);

  const handleAddModule = async (moduleData: any) => {
    try {
      const response = await academyApi.post('/modules', {
        ...moduleData,
        courseId: course.id
      });
      
      setModules((prev) => [...prev, response.data]);
      setShowAddModuleForm(false);
      return response.data.id;
    } catch (error) {
      console.error("Error adding module:", error);
      alert("Failed to add module");
      return null;
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    
    try {
      await academyApi.delete(`/modules/${moduleId}`);
      setModules((prev) => prev.filter((module) => module.id !== moduleId));
      alert("Module deleted successfully!");
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center px-5 py-4 bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaBook className="mr-3 text-blue-600" /> Course Modules
            </h2>
            <p className="text-gray-600 mt-1">Manage your course structure and content</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaXmark size={20} className="text-gray-600" />
          </button>
        </div>
        
        <CourseHeader course={course} />
        <CourseOverview course={course} />
        
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FaGraduationCap className="mr-3 text-blue-600" /> Course Modules
              </h3>
              <p className="text-gray-600 mt-1">Organize your course content into modules</p>
            </div>
            <div className="flex space-x-3 mt-3 sm:mt-0">
              <button
                onClick={() => setShowContentManager(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium flex items-center text-sm shadow transition-all"
              >
                <FaEdit className="mr-2" size={14} /> Manage Content
              </button>
              <button
                onClick={() => setShowAddModuleForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium flex items-center text-sm shadow transition-all"
              >
                <FaPlus className="mr-2" size={14} /> Add Module
              </button>
            </div>
          </div>
          
          <div className="space-y-5">
            {modules.map((module) => (
              <div key={module.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{module.title}</h4>
                    <p className="text-gray-600 mt-2">{module.description}</p>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => {
                        setSelectedModuleId(module.id);
                        setViewMode("detail");
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium text-sm shadow transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModuleId(module.id);
                        setViewMode("edit");
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-medium text-sm shadow transition-all"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium text-sm shadow transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800 border border-gray-200">
                    {module.lessons?.length || 0} lessons
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {modules.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-gray-400 mb-4">
                <FaBook className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No modules created yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first module to organize your course content.</p>
              <button
                onClick={() => setShowAddModuleForm(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <FaPlus className="mr-2" /> Add Your First Module
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium transition-all shadow-md hover:shadow-lg mt-6 flex items-center justify-center"
        >
          <FaTrash className="mr-2 h-5 w-5" /> Delete Course
        </button>
      </div>
      
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
      {selectedModuleId && viewMode === "detail" && (
        <ModuleDetailView
          moduleId={selectedModuleId}
          onClose={() => {
            setSelectedModuleId(null);
            setViewMode("list");
          }}
          onEdit={(moduleId) => {
            setSelectedModuleId(moduleId);
            setViewMode("edit");
          }}
          isInstructorView={true}
        />
      )}
      
      {selectedModuleId && viewMode === "edit" && (
        <EditModuleForm
          moduleId={selectedModuleId}
          onClose={() => {
            setSelectedModuleId(null);
            setViewMode("list");
          }}
          onUpdate={() => {
            // Refresh modules list
            academyApi.get(`/modules/course/${course.id}`).then((response) => {
              const modules = response.data;
              if (modules) setModules(modules);
            });
            setSelectedModuleId(null);
            setViewMode("list");
          }}
        />
      )}
      
      {showAddModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaBook className="mr-3 text-blue-600" /> Add New Module
                </h3>
                <button
                  onClick={() => setShowAddModuleForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaXmark size={20} className="text-gray-600" />
                </button>
              </div>
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const title = formData.get("title") as string;
                  const description = formData.get("description") as string;
                  
                  if (title && description) {
                    await handleAddModule({ title, description });
                  }
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Enter module title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Enter module description"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModuleForm(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Add Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Course Content Manager */}
      {showContentManager && (
        <CourseContentManager
          courseId={course.id}
          onClose={() => setShowContentManager(false)}
        />
      )}
    </div>
  );
};

export default CourseView;