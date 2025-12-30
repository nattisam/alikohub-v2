import React from "react";
import { useAuth } from "../contexts/AuthContext";
import StudentCourseCard from "../components/StudentCourseCard";
import type { Course } from "../components/types.d";
import { academyApi } from "../api";

const StudentMyCourses: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await academyApi.get("/enrollments/my-courses");
        setCourses(response.data);
      } catch (err: any) {
        console.error("Error fetching enrolled courses:", err);
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchEnrolledCourses();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-5">
        <div className="container mx-auto px-4 py-6">
          <p>Loading your courses...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <StudentCourseCard
                  key={course.id}
                  course={course}
                  onEnroll={() => {}}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses yet</h3>
              <p className="text-gray-500 mb-4">Browse and enroll in courses to start learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMyCourses;