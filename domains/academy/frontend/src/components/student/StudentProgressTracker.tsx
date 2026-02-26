import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaCircle, FaPlayCircle } from "react-icons/fa";
import type { Course } from "../common/types.d";
import { progressApi } from "../../api/progressApi";
import type { ProgressModule } from "../../api/progressApi";

interface StudentProgressTrackerProps {
  course: Course;
  userId: string;
}

const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({
  course,
  userId,
}) => {
  const [progress, setProgress] = useState<ProgressModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        // Fetch detailed progress
        const response = await progressApi.getDetailedStudentProgress(
          course.id,
          userId,
        );
        setProgress(response.data);
      } catch (err) {
        console.error("Error fetching student progress:", err);
        setError("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [course.id, userId]);

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

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!Array.isArray(progress) || progress.length === 0) return 0;

    let totalItems = 0;
    let completedItems = 0;

    progress.forEach((module) => {
      if (Array.isArray(module?.lessons)) {
        module.lessons.forEach((lesson) => {
          totalItems += 1;
          if (lesson?.status === "COMPLETED") completedItems += 1;

          if (Array.isArray(lesson?.contents)) {
            lesson.contents.forEach((content) => {
              totalItems += 1;
              if (content?.status === "COMPLETED") completedItems += 1;
            });
          }
        });
      }
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p>Loading progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Progress</h3>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <span className="text-lg font-semibold text-gray-700">
            {overallProgress}%
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {Array.isArray(progress) &&
          progress.map((module) => (
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
                {Array.isArray(module?.lessons) &&
                  module.lessons.map((lesson) => (
                    <div
                      key={lesson.lessonId}
                      className="border-l-2 border-gray-200 pl-4 py-2"
                    >
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
                        {Array.isArray(lesson?.contents) &&
                          lesson.contents.map((content) => (
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
                                  {content.score !== undefined &&
                                    ` • Score: ${content.score}`}
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
    </div>
  );
};

export default StudentProgressTracker;
