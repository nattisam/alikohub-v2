import React, { useState, useEffect } from "react";
import { academyApi } from "../api";
import type { Course, User } from "./types.d";
import { FaCheckCircle, FaCircle, FaPlayCircle } from "react-icons/fa";

interface ProgressItem {
  moduleId: number;
  moduleTitle: string;
  status: string;
  lessons: Array<{
    lessonId: number;
    lessonTitle: string;
    status: string;
    contents: Array<{
      contentId: number;
      contentTitle: string;
      contentType: string;
      status: string;
      score?: number;
    }>;
  }>;
}

interface StudentProgressDetailsProps {
  course: Course;
  studentId: string;
  onClose: () => void;
}

const StudentProgressDetails: React.FC<StudentProgressDetailsProps> = ({
  course,
  studentId,
  onClose,
}) => {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        // Fetch student details
        const studentResponse = await academyApi.get(`/users/${studentId}`);
        setStudent(studentResponse.data);
        
        // Fetch detailed progress
        const progressResponse = await academyApi.get(
          `/progress/course/${course.id}/user/${studentId}`
        );
        setProgress(progressResponse.data);
      } catch (err) {
        console.error("Error fetching student progress:", err);
        setError("Failed to load student progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [course.id, studentId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <FaCheckCircle className="text-green-500" />;
      case "IN_PROGRESS":
        return <FaPlayCircle className="text-yellow-500" />;
      default:
        return <FaCircle className="text-gray-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completed";
      case "IN_PROGRESS":
        return "In Progress";
      default:
        return "Not Started";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p>Loading student progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-red-500">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {student?.firstname} {student?.lastname}'s Progress
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
            <p className="text-gray-600">Course Progress Details</p>
          </div>
          
          <div className="space-y-6">
            {progress.map((module) => (
              <div key={module.moduleId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {module.moduleTitle}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(module.status)}
                    <span className="text-sm text-gray-600">
                      {getStatusText(module.status)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 ml-4">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.lessonId} className="border-l-2 border-gray-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-700">
                          {lesson.lessonTitle}
                        </h5>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(lesson.status)}
                          <span className="text-sm text-gray-600">
                            {getStatusText(lesson.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-2">
                        {lesson.contents.map((content) => (
                          <div 
                            key={content.contentId} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {content.contentTitle}
                              </p>
                              <p className="text-xs text-gray-500">
                                {content.contentType}
                                {content.score !== undefined && ` • Score: ${content.score}`}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(content.status)}
                              <span className="text-xs text-gray-600">
                                {getStatusText(content.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressDetails;