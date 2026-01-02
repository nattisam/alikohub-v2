import React, { useState, useEffect } from 'react';
import type { CourseModule, CourseLesson } from "./types.d";
import { courseApi } from '../api/courseApi';
import AddLessonModal from './AddLessonModal';

interface CourseManagementViewProps {
  course: any; // Course type
  isOpen: boolean;
  onClose: () => void;
  onModuleAdded: () => void;
}

const CourseManagementView: React.FC<CourseManagementViewProps> = ({ 
  course, 
  isOpen, 
  onClose,
  onModuleAdded
}) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Record<number, CourseLesson[]>>({});
  const [lessonsLoading, setLessonsLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isOpen && course?.id) {
      fetchModules();
    }
  }, [isOpen, course?.id, onModuleAdded]);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await courseApi.getModules(course.id);
      const modulesData = response.data;
      setModules(modulesData);
      
      // Pre-populate moduleLessons with empty arrays
      const initialLessons: Record<number, CourseLesson[]> = {};
      modulesData.forEach((module: CourseModule) => {
        initialLessons[module.id] = [];
      });
      setModuleLessons(initialLessons);
    } catch (err: any) {
      console.error('Error fetching modules:', err);
      setError(err.response?.data?.message || 'Failed to fetch modules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonsForModule = async (moduleId: number) => {
    setLessonsLoading(prev => ({ ...prev, [moduleId]: true }));
    
    try {
      const response = await courseApi.getLessons(moduleId);
      setModuleLessons(prev => ({
        ...prev,
        [moduleId]: response.data
      }));
    } catch (err: any) {
      console.error(`Error fetching lessons for module ${moduleId}:`, err);
      setError(err.response?.data?.message || 'Failed to fetch lessons. Please try again.');
    } finally {
      setLessonsLoading(prev => ({ ...prev, [moduleId]: false }));
    }
  };

  const toggleModule = (moduleId: number) => {
    if (expandedModuleId === moduleId) {
      // Collapse the module
      setExpandedModuleId(null);
    } else {
      // Expand the module and fetch lessons
      setExpandedModuleId(moduleId);
      fetchLessonsForModule(moduleId);
    }
  };

  const handleAddLessonClick = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setShowAddLessonModal(true);
  };

  const handleLessonAdded = () => {
    // Refresh the lessons for the current module
    if (selectedModuleId) {
      fetchLessonsForModule(selectedModuleId);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Course: {course.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{course.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{course.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrolled Students</p>
                <p className="font-medium">{course.enrolledNum || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Modules</h3>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading modules...</p>
              </div>
            ) : modules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No modules added yet. Start by adding your first module.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map(module => (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                          {(moduleLessons[module.id]?.length || 0)} {(moduleLessons[module.id]?.length || 0) === 1 ? 'lesson' : 'lessons'}
                        </span>
                        <button className="text-gray-500">
                          {expandedModuleId === module.id ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>
                    
                    {expandedModuleId === module.id && (
                      <div className="p-4 bg-white border-t">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-medium text-gray-800">Lessons</h5>
                          <button
                            onClick={() => handleAddLessonClick(module.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            + Add Lesson
                          </button>
                        </div>
                        
                        {lessonsLoading[module.id] ? (
                          <div className="flex justify-center py-4">
                            <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : moduleLessons[module.id] && moduleLessons[module.id].length > 0 ? (
                          <div className="space-y-2">
                            {moduleLessons[module.id].map(lesson => (
                              <div key={lesson.id} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-xs text-gray-500">{lesson.type}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  Edit
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No lessons added yet</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddLessonModal && selectedModuleId && (
        <AddLessonModal
          moduleId={selectedModuleId}
          isOpen={showAddLessonModal}
          onClose={() => setShowAddLessonModal(false)}
          onLessonAdded={handleLessonAdded}
        />
      )}
    </div>
  );
};

export default CourseManagementView;