import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { courseApi } from "../api/courseApi";
import { progressApi } from "../api/progressApi";
import CourseSchedule from "../components/CourseSchedule";
import { FaPlay, FaFileAlt, FaClipboardList, FaLock } from "react-icons/fa";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  category: string;
  level: string;
  duration: string;
  modules?: Module[];
}

interface Module {
  id: number;
  title: string;
  description: string;
  courseId: number;
  order: number;
  lessons?: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  moduleId: number;
  order: number;
  type: string;
  duration: string;
}

const StudentCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch course details
        const courseResponse = await courseApi.getCourse(parseInt(courseId));
        setCourse(courseResponse.data);
        
        // Fetch progress data
        const progressResponse = await progressApi.getCourseProgress(parseInt(courseId));
        setProgress(progressResponse.data.percentage || 0);
      } catch (err: any) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const fetchModuleLessons = async (moduleId: number) => {
    try {
      const response = await courseApi.getLessons(moduleId);
      return response.data;
    } catch (err) {
      console.error("Error fetching lessons:", err);
      return [];
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <FaPlay className="text-blue-500" />;
      case "PDF":
        return <FaFileAlt className="text-red-500" />;
      case "QUIZ":
        return <FaClipboardList className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="mt-2">{error || "Course not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600 mt-2">{course.description}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Your Progress</div>
                <div className="text-2xl font-bold text-blue-600">{progress}%</div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Modules Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                <div className="space-y-4">
                  {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                        </div>
                        <div className="p-4">
                          {module.lessons && module.lessons.length > 0 ? (
                            <div className="space-y-2">
                              {module.lessons.map((lesson) => (
                                <div 
                                  key={lesson.id} 
                                  className="flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <div className="mr-3">
                                    {getContentTypeIcon(lesson.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{lesson.title}</div>
                                    <div className="text-sm text-gray-500">{lesson.duration}</div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {lesson.type}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">No lessons available</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No modules available for this course</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Schedule */}
            <CourseSchedule courseId={course.id} className="bg-white rounded-lg shadow p-6" />
            
            {/* Course Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{course.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursePage;