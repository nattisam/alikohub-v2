import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useInstructorStats } from "../../queries/instructorStats";
import { FaChalkboardTeacher, FaBook, FaUsers, FaStar } from "react-icons/fa";
import ErrorState from "../../components/states/ErrorState";
import EmptyState from "../../components/states/EmptyState";
import AccessDenied from "../../components/states/AccessDenied";

const InstructorDashboardMain: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    data: instructorStats,
    isLoading,
    isError,
    error,
  } = useInstructorStats();

  // Check if user has instructor role
  const activeRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const mainRole = currentUser?.academyRole || currentUser?.academyUser?.role;

  // Check if user has access to instructor dashboard
  const hasInstructorAccess =
    activeRole === "INSTRUCTOR" || mainRole === "INSTRUCTOR";

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
  if (isError) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <ErrorState
          title="Failed to Load Dashboard"
          message="There was an error loading your dashboard data. Please try again later."
          error={error as Error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Check for empty state - if instructor has no courses
  if (!isLoading && instructorStats?.totalCourses === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <EmptyState
          title="No Courses Yet"
          message="You haven't created any courses yet. Start by creating your first course."
          showAction={true}
          actionText="Create Course"
          onAction={() => navigate("/instructor/create-course")}
        />
      </div>
    );
  }

  if (isLoading) {
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
            {instructorStats?.yearsOfExperience || 0} yrs
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
            {instructorStats?.totalCourses || 0}
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
            {(instructorStats?.totalStudents || 0).toLocaleString()}
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
            {instructorStats?.averageRating || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardMain;
