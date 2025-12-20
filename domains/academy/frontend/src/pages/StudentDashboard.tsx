import React, { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { academyApi } from "../api";
import type { Course } from "../components/types.d";
import StudentCourseCard from "../components/StudentCourseCard";
import StudentProgressTracker from "../components/StudentProgressTracker";
import { FaBook, FaChartLine, FaGraduationCap, FaBookReader } from "react-icons/fa";

const StudentDashboard: React.FC = () => {
  const { currentUser } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

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

  useEffect(() => {
    if (currentUser) {
      fetchEnrolledCourses();
    }
  }, [currentUser, refreshKey]); // Add refreshKey to dependencies

  // Fetch student stats
  const [studentStats, setStudentStats] = useState({
    conceptsViewed: 0,
    lessonsViewed: 0,
    quizzesCompleted: 0,
    projectsPassed: 0,
    programsCompleted: 0
  });

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const response = await academyApi.get("/progress/analytics/student");
        setStudentStats(response.data);
      } catch (err) {
        console.error("Error fetching student stats:", err);
      }
    };

    if (currentUser) {
      fetchStudentStats();
    }
  }, [currentUser, refreshKey]); // Add refreshKey to dependencies

  // Function to trigger dashboard refresh
  const handleEnrollmentComplete = () => {
    // Increment the refresh key to trigger re-render
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-5">
        <div className="container mx-auto px-4 py-6">
          <p>Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your learning progress and manage your courses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaBookReader className="text-blue-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Concepts Viewed</p>
                <p className="text-xl font-bold text-gray-900">
                  {studentStats.conceptsViewed}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaBook className="text-green-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Lessons Viewed</p>
                <p className="text-xl font-bold text-gray-900">
                  {studentStats.lessonsViewed}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaChartLine className="text-yellow-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Quizzes Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {studentStats.quizzesCompleted}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaGraduationCap className="text-purple-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Projects Passed</p>
                <p className="text-xl font-bold text-gray-900">
                  {studentStats.projectsPassed}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaBookReader className="text-red-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Programs Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {studentStats.programsCompleted}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          </div>
          
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
              <div className="text-gray-400 mb-4">
                <FaBook className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses yet</h3>
              <p className="text-gray-500 mb-4">Browse and enroll in courses to start learning</p>
            </div>
          )}
        </div>

        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Progress for "{selectedCourse.title}"
                  </h2>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                
                <StudentProgressTracker 
                  course={selectedCourse} 
                  userId={currentUser?.firebaseId || ""} 
                />
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;