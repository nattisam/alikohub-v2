import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { progressApi } from "../api/progressApi";
import type { CourseProgress } from "../api/progressApi";
import { FaBook, FaChartLine, FaGraduationCap, FaBookReader } from "react-icons/fa";

const StudentProgressPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [progress, setProgress] = React.useState<CourseProgress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await progressApi.getStudentDashboard();
        setProgress(response.data);
      } catch (err: any) {
        console.error("Error fetching progress:", err);
        setError(err.message || "Failed to load progress");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProgress();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-5">
        <div className="container mx-auto px-4 py-6">
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-5">
        <div className="container mx-auto px-4 py-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-5">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
          <p className="text-gray-600 mt-2">Track your learning achievements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaBookReader className="text-blue-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="text-xl font-bold text-gray-900">
                  {progress.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaBook className="text-green-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Completed Courses</p>
                <p className="text-xl font-bold text-gray-900">
                  {progress.filter(course => course.percentage === 100).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaChartLine className="text-yellow-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Avg. Progress</p>
                <p className="text-xl font-bold text-gray-900">
                  {progress.length > 0 
                    ? Math.round(progress.reduce((sum, course) => sum + course.percentage, 0) / progress.length) + '%' 
                    : '0%'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaGraduationCap className="text-purple-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-xl font-bold text-gray-900">
                  {progress.filter(course => course.percentage === 100).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Progress</h2>
          
          {progress && progress.length > 0 ? (
            <div className="space-y-4">
              {progress.map((courseProgress) => (
                <div key={courseProgress.courseId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">{courseProgress.courseTitle}</h3>
                    <span className="text-sm font-semibold">
                      {courseProgress.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${courseProgress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {courseProgress.completedLessons} of {courseProgress.totalLessons} lessons completed
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No progress data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressPage;