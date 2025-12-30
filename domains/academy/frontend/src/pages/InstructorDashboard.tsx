import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useInstructorCourses } from "../hooks/useInstructorCourses";
import { academyApi } from "../api";
import { FaChalkboardTeacher, FaBook, FaUsers, FaStar } from "react-icons/fa";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import AccessDenied from "../components/states/AccessDenied";

const InstructorDashboardMain: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { courses } = useInstructorCourses();

  const [instructorStats, setInstructorStats] = useState({
    experience: 10,
    courses: 0,
    students: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInstructorStats = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const response = await academyApi.get(
          "/academy/progress/instructor/stats"
        );
        setInstructorStats({
          experience: response.data.yearsOfExperience || 10,
          courses: response.data.totalCourses || 0,
          students: response.data.totalStudents || 0,
          rating: response.data.averageRating || 0,
        });
      } catch (err) {
        setError(err as Error);
        // Set default stats in case of error
        setInstructorStats({
          experience: 10,
          courses: courses.length,
          students: 847,
          rating: 4.9,
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchInstructorStats();
  }, [currentUser]);

  // Check if user has instructor role
  const activeRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const mainRole = currentUser?.academyRole || currentUser?.academyUser?.role;

  // Check if user has access to instructor dashboard
  const hasInstructorAccess =
    activeRole === "INSTRUCTOR" ||
    mainRole === "INSTRUCTOR" ||
    activeRole === "ADMIN";

  if (!hasInstructorAccess) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <AccessDenied
          title="Access Denied"
          message="You don't have permission to access the instructor dashboard."
          showHomeButton={true}
          showBackButton={true}
        />
      </div>
    );
  }

  // Check for error state
  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <ErrorState
          title="Failed to Load Dashboard"
          message="There was an error loading your dashboard data. Please try again later."
          error={error}
          onRetry={() => {
            // Retry the data fetch
            const fetchInstructorStats = async () => {
              try {
                setLoading(true);
                setError(null);
                const response = await academyApi.get(
                  "/progress/instructor/stats"
                );
                setInstructorStats({
                  experience: response.data.yearsOfExperience || 10,
                  courses: response.data.totalCourses || 0,
                  students: response.data.totalStudents || 0,
                  rating: response.data.averageRating || 0,
                });
              } catch (err) {
                setError(err as Error);
                setInstructorStats({
                  experience: 10,
                  courses: courses.length,
                  students: 847,
                  rating: 4.9,
                });
              } finally {
                setLoading(false);
              }
            };
            fetchInstructorStats();
          }}
        />
      </div>
    );
  }

  // Check for empty state - if instructor has no courses
  if (!loading && instructorStats.courses === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <EmptyState
          title="No Courses Yet"
          message="You haven't created any courses yet. Start by creating your first course."
          showAction={true}
          actionText="Create Course"
          onAction={() => (window.location.href = "/instructor/create-course")}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.firstname}
        </h1>
        <p className="text-gray-500 mt-1">
          Here is an overview of your course performance today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Experience */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <FaChalkboardTeacher size={22} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Experience</p>
          <p className="text-3xl font-bold text-gray-900">
            {instructorStats.experience} yrs
          </p>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <FaBook size={22} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Courses</p>
          <p className="text-3xl font-bold text-gray-900">
            {instructorStats.courses}
          </p>
        </div>

        {/* Students */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <FaUsers size={22} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Students</p>
          <p className="text-3xl font-bold text-gray-900">
            {instructorStats.students.toLocaleString()}
          </p>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <FaStar size={22} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Rating</p>
          <p className="text-3xl font-bold text-gray-900">
            {instructorStats.rating}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardMain;
