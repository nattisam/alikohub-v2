import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { progressApi } from "../api/progressApi";
import type { CourseProgress } from "../api/progressApi";
import { FaCertificate, FaDownload, FaBook } from "react-icons/fa";

const StudentCertificates: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [completedCourses, setCompletedCourses] = React.useState<CourseProgress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCompletedCourses = async () => {
      try {
        setLoading(true);
        const response = await progressApi.getStudentDashboard();
        // Filter to only completed courses (100% progress)
        const completed = response.data.filter((course: CourseProgress) => course.percentage === 100);
        setCompletedCourses(completed);
      } catch (err: any) {
        console.error("Error fetching completed courses:", err);
        setError(err.message || "Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchCompletedCourses();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-5">
        <div className="container mx-auto px-4 py-6">
          <p>Loading your certificates...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-2">Download and share your achievements</p>
        </div>

        {completedCourses && completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaCertificate className="text-yellow-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h3>
                    <p className="text-gray-600 text-sm mt-1">Completed on {new Date().toLocaleDateString()}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <FaBook className="mr-1" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <button className="mt-4 flex items-center text-blue-600 hover:text-blue-800 font-medium">
                      <FaDownload className="mr-1" />
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <FaCertificate className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No certificates yet</h3>
            <p className="text-gray-500 mb-4">Complete courses to earn certificates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCertificates;