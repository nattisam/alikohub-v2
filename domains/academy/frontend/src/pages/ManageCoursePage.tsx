import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CourseModule, CourseLesson } from '../components/types.d';
import { courseApi } from '../api/courseApi';
import AddLessonModal from '../components/AddLessonModal';

// Icons
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  Eye, 
  Edit3, 
  BookOpen, 
  Users,
  FileText,
  Video,
  File,
  Clock,
  Award
} from 'lucide-react';

const ManageCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = parseInt(id || '0', 10);
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Record<number, CourseLesson[]>>({});
  const [lessonsLoading, setLessonsLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Uncomment when backend authentication is fixed
      // Fetch course details using the authenticated API directly
      // const courseResponse = await academyApi.get(`/academy/courses/${courseId}`);
      // setCourse(courseResponse.data);
      
      // For now, using mock course data
      const mockCourse = {
        id: courseId,
        title: `Course ${courseId}`,
        status: 'Published',
        category: 'Technology',
        enrolledNum: 0,
        createdAt: new Date().toISOString(),
      };
      setCourse(mockCourse);
      
      // Fetch modules for the course
      const modulesResponse = await courseApi.getModules(courseId);
      const modulesData = modulesResponse.data;
      setModules(modulesData);
      
      // Pre-populate moduleLessons with data from modules if available
      const initialLessons: Record<number, CourseLesson[]> = {};
      modulesData.forEach((module: CourseModule) => {
        // If the module has lessons property, use it, otherwise initialize as empty array
        initialLessons[module.id] = module.lessons || [];
      });
      setModuleLessons(initialLessons);
    } catch (err: any) {
      console.error('Error fetching course details:', err);
      setError(err.response?.data?.message || 'Failed to fetch course details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonsForModule = async (moduleId: number) => {
    setLessonsLoading(prev => ({ ...prev, [moduleId]: true }));
    
    try {
      // Check if lessons are already loaded for this module
      if (moduleLessons[moduleId] && moduleLessons[moduleId].length > 0) {
        // Lessons are already loaded, no need to fetch again
        return;
      }
      
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

  const handleBackClick = () => {
    navigate('/instructor/mycourses');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to My Courses</span>
            </button>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to My Courses</span>
            </button>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button 
            onClick={() => navigate('/instructor/mycourses')}
            className="hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <span>My Courses</span>
          </button>
          <ChevronRight size={16} />
          <span className="text-indigo-600 font-medium">{course?.title}</span>
        </div>

      {/* Course Header Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${course?.status === 'Published' ? 'bg-green-100 text-green-800' : course?.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                {course?.status}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />
                Last updated 2 days ago
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {course?.title}
            </h1>

            <p className="text-gray-600 max-w-2xl text-lg mb-6">
              Manage modules, lessons, and course structure.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen size={18} className="text-indigo-500" />
                <span>{modules.length} Modules</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText size={18} className="text-indigo-500" />
                <span>{Object.values(moduleLessons).flat().length} Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={18} className="text-indigo-500" />
                <span>{course?.enrolledNum || 0} Students</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-md">
              <Edit3 size={16} />
              Edit Details
            </button>
            <button className="flex items-center gap-2 border border-indigo-200 px-5 py-3 rounded-xl text-sm text-indigo-700 hover:bg-indigo-50 transition-colors">
              <Eye size={16} />
              Preview
            </button>
          </div>
        </div>
      </div>

    {/* Course Curriculum */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <BookOpen size={24} className="text-indigo-600" />
        Course Curriculum
      </h2>
    </div>

    {/* Modules */}
    <div className="space-y-4">
      {modules.map(module => (
        <div
          key={module.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          {/* Module Header */}
          <div
            onClick={() => toggleModule(module.id)}
            className="flex justify-between items-center p-6 cursor-pointer hover:bg-indigo-50 transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                {module.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <FileText size={14} className="text-indigo-500" />
                {moduleLessons[module.id]?.length || 0} lessons
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {moduleLessons[module.id]?.length || 0} lessons
              </span>
              <span className="text-gray-400">
                {expandedModuleId === module.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </div>
          </div>

          {/* Lessons */}
          {expandedModuleId === module.id && (
            <div className="border-t border-gray-100 bg-gray-50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <Play size={18} className="text-indigo-500" />
                  Lessons
                </h4>
                <button
                  onClick={() => handleAddLessonClick(module.id)}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Add Lesson
                </button>
              </div>

              {lessonsLoading[module.id] ? (
                <div className="flex justify-center py-6">
                  <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : moduleLessons[module.id]?.length ? (
                <div className="space-y-3">
                  {moduleLessons[module.id].map(lesson => (
                    <div
                      key={lesson.id}
                      className="flex justify-between items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                          {lesson.type === 'VIDEO' && <Video size={20} />}
                          {lesson.type === 'QUIZ' && <FileText size={20} />}
                          {lesson.type === 'WEBINAR' && <Users size={20} />}
                          {lesson.type === 'ASSIGNMENT' && <File size={20} />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {lesson.title}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {lesson.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg transition-colors">
                        <Edit3 size={16} />
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-3">
                    <FileText size={40} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 italic">
                    No lessons added yet
                  </p>
                  <button
                    onClick={() => handleAddLessonClick(module.id)}
                    className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add your first lesson
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Add Lesson Modal */}
    {showAddLessonModal && selectedModuleId && (
      <AddLessonModal
        moduleId={selectedModuleId}
        isOpen={showAddLessonModal}
        onClose={() => setShowAddLessonModal(false)}
        onLessonAdded={handleLessonAdded}
      />
    )}
  </div>
  </div>
  );

};

export default ManageCoursePage;