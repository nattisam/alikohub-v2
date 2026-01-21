 import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { academyApi } from "../../api";
import type { CourseModule } from "../common/types.d.tsx";
import LessonView from "../instructor/LessonView";

interface StudentModuleViewProps {
  courseId: number;
  onClose: () => void;
}

const StudentModuleView: React.FC<StudentModuleViewProps> = ({ courseId, onClose }) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [moduleIdForLesson, setModuleIdForLesson] = useState<number | null>(null);

  useEffect(() => {
    fetchCourseStructure();
  }, [courseId]);

  const fetchCourseStructure = async () => {
    try {
      setLoading(true);
      
      // Fetch modules for this course
      console.log(`Fetching modules for course ${courseId}`);
      const modulesResponse = await academyApi.get(`/modules/course/${courseId}`);
      console.log("Modules response:", modulesResponse);
      const modulesData: CourseModule[] = modulesResponse.data;
      
      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        modulesData.map(async (module) => {
          try {
            console.log(`Fetching lessons for module ${module.id}`);
            const lessonsResponse = await academyApi.get(`/lessons/module/${module.id}`);
            console.log(`Lessons response for module ${module.id}:`, lessonsResponse);
            return { ...module, lessons: lessonsResponse.data };
          } catch (lessonError) {
            console.error(`Error fetching lessons for module ${module.id}:`, lessonError);
            return { ...module, lessons: [] };
          }
        })
      );
      
      setModules(modulesWithLessons);
    } catch (err: any) {
      console.error("Error loading course structure:", err);
      setError("Failed to load course structure");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleViewLesson = (lessonId: number, moduleId: number) => {
    setSelectedLessonId(lessonId);
    setModuleIdForLesson(moduleId);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading course content...</p>
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
          
          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="border rounded-lg">
                  <div 
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleModule(module.id)}
                  >
                    <h3 className="font-medium text-lg">{module.title}</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {module.lessons?.length || 0} lessons
                      </span>
                      {expandedModules[module.id] ? 
                        <FaChevronDown className="text-gray-500" /> : 
                        <FaChevronRight className="text-gray-500" />
                      }
                    </div>
                  </div>
                  
                  {expandedModules[module.id] && module.lessons && (
                    <div className="p-4 border-t">
                      {module.lessons.length > 0 ? (
                        <div className="space-y-3">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="border rounded p-3">
                              <div className="flex justify-between items-center">
                                <h4 
                                  className="font-medium cursor-pointer text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewLesson(lesson.id, module.id)}
                                >
                                  {lesson.title}
                                </h4>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {lesson.type}
                                </span>
                              </div>
                              
                              {lesson.dueDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Due: {new Date(lesson.dueDate).toLocaleDateString()}
                                </p>
                              )}
                              
                              <button
                                onClick={() => handleViewLesson(lesson.id, module.id)}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                              >
                                View Lesson
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No lessons in this module</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No modules available for this course yet.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Lesson View Modal */}
      {selectedLessonId && moduleIdForLesson && (
        <LessonView
          lessonId={selectedLessonId}
          moduleId={moduleIdForLesson}
          onClose={() => {
            setSelectedLessonId(null);
            setModuleIdForLesson(null);
          }}
          onEdit={() => {}}
          isInstructorView={false}
        />
      )}
    </div>
  );
};

export default StudentModuleView;