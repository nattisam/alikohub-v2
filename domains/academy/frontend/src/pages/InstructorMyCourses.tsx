import React, { useState } from "react";
import { useInstructorCourses } from "../hooks/useInstructorCourses";
import InstructorCourseCard from "../components/InstructorCourseCard";
import { useAuth } from "../contexts/AuthContext";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Course } from "../components/types.d.tsx";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import AccessDenied from "../components/states/AccessDenied";

const InstructorMyCourses: React.FC = () => {
  const { courses, updateCourse, removeCourse, creatingCourse, removingCourse } = useInstructorCourses();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Check if user has instructor role
  const activeRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const mainRole = currentUser?.academyRole || currentUser?.academyUser?.role;
  
  // Check if user has access to instructor courses page
  const hasInstructorAccess = activeRole === 'INSTRUCTOR' || mainRole === 'INSTRUCTOR' || activeRole === 'ADMIN';
  
  if (!hasInstructorAccess) {
    return (
      <div className="p-6">
        <AccessDenied 
          title="Access Denied" 
          message="You don't have permission to access the instructor courses page."
          showHomeButton={true}
          showBackButton={true}
        />
      </div>
    );
  }

  // Check if user has the required role for CRUD operations
  const canPerformCRUD = (currentUser?.academyRole === 'INSTRUCTOR' && currentUser?.roleStatus?.instructor === 'active') || currentUser?.academyRole === 'ADMIN';

  // Dummy functions for when CRUD is not allowed
  const dummyFunction = () => {};

  const handleDeleteCourse = async (courseId: number) => {
    const success = await removeCourse(courseId);
    if (success) {
      alert("Course deleted successfully!");
    } else if (removingCourse.error) {
      alert(`Error deleting course: ${removingCourse.errorMessage}`);
    }
  };

  const [creatingCourseForm, setCreatingCourseForm] = useState(false);
  const [viewingCourse, setViewingCourse] = useState<null | Course>(null);
  const [editingCourse, setEditingCourse] = useState({
    editing: false,
    courseId: null as number | null,
  });
  const [viewingAnalytics, setViewingAnalytics] = useState<{ // Added state for analytics
    viewing: boolean;
    courseId: number | null;
  }>({
    viewing: false,
    courseId: null,
  });

  const [showAddSessionForm, setShowAddSessionForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [key, setKey] = useState(0); // Add this state for force update

  // Function to force update the component
  const forceUpdate = () => setKey(prev => prev + 1);



  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-gray-500">
            Manage and track the performance of your courses.
          </p>
        </div>
        {canPerformCRUD && (
          <button
            onClick={() => navigate('/instructor/create-course')}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Create New Course
          </button>
        )}
      </div>

      {/* Courses */}
      <div className="bg-white rounded-xl p-6 shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">All Courses</h2>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map(course => (
              <InstructorCourseCard
                key={course.id}
                title={course.title}
                thumbnail={course.thumbnail ?? ""}
                enrolledNum={course.enrolledNum ?? 0}
                progress={course.progress ?? 0}
                onEdit={canPerformCRUD ? () =>
                  setEditingCourse({ editing: true, courseId: course.id })
                : dummyFunction}
                onView={() => setViewingCourse(course)}
                onDelete={canPerformCRUD ? () => {
                  setCourseToDelete(course.id);
                  setShowDeleteModal(true);
                } : dummyFunction}
                onAnalytics={canPerformCRUD ? () =>
                  setViewingAnalytics({ viewing: true, courseId: course.id })
                : dummyFunction}
                onSchedule={() => {
                  setSelectedCourseId(course.id);
                  setShowAddSessionForm(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No courses yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorMyCourses;