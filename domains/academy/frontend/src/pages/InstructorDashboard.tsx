import React, { useState, useEffect } from "react";
import Message from "../components/Messages";
import UserProfileCard from "../components/UserProfileCard";
import Notification from "../components/Notification";
import type { Course } from "../components/types.d";
import type { Instructor } from "../components/types.d.tsx"; // Separate import for Instructor
import CreateCourseForm from "../components/CreateCourseForm";
import { useInstructorCourses } from "../hooks/useInstructorCourses";
import { useAuth } from "../contexts/AuthContext";
import EditCourseForm from "../components/EditCourseForm";
import CourseView from "../components/CourseView";
import TeachingSchedule from "../components/TeachingSchedules";
import AddTeachingSessionSchedule from "../components/AddTeachingSessionSchedule";
import profilePic1 from "../assets/profilePic1.png"
import profilePic2 from "../assets/profilePic2.png"
import ConfirmationModal from "../components/ConfirmationModal";
import { academyAPI } from "../services/api";

import InstructorCourseCard from "../components/InstructorCourseCard";
import { FaPlus, FaChalkboardTeacher, FaComments, FaBell, FaChartBar, FaBook, FaUsers } from "react-icons/fa";
import ManageTeachingSchedules from "../components/ManageTeachingSchedules";
import CourseAnalytics from "../components/CourseAnalytics"; // Added import
import RoleSelectionModal from "../components/RoleSelectionModal";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user: currentUser, refreshProfile, refetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { courses, updateCourse, removeCourse, creatingCourse, removingCourse } = useInstructorCourses();
  useEffect(() => {
    if (!currentUser) return;

    const activeRole = currentUser.academyUser?.activeRole;

    if (activeRole === "INSTRUCTOR") {
      return; // allowed
    }

    navigate("/academy/select-role");
  }, [currentUser, navigate]);
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
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Kalidan Zenebe",
      time: "2 hours ago",
      message: "Question about AWS IAM policies...",
      profilePic: profilePic1
    },
    {
      id: 2,
      name: "Biniyam",
      time: "5 hours ago",
      message: "Help with Docker containers setup...",
      profilePic: profilePic2
    },
  ]);

  // Fetch real notifications/messages
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await academyAPI.get("/notifications/me");
        // Set the actual notifications
        setNotifications(response.data);
        console.log("Real notifications:", response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Fallback to empty array if API fails
        setNotifications([]);
      }
    };

    if (currentUser) {
      fetchMessages();
    }
  }, [currentUser]);
  const [showAddSessionForm, setShowAddSessionForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [key, setKey] = useState(0); // Add this state for force update

  // Function to force update the component
  const forceUpdate = () => setKey(prev => prev + 1);

  const [instructorStats, setInstructorStats] = useState({
    experience: 10,
    courses: 0,
    students: 0,
    rating: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Check the active role from the user's academyUser
  const activeRole = currentUser?.academyUser?.activeRole;
  const hasSelectedRole = currentUser?.hasSelectedRole || currentUser?.academyUser?.hasSelectedRole;
  
  // If user hasn't selected a role yet, show role selection modal
  if (currentUser && !hasSelectedRole) {
    // Show role selection modal
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Role</h2>
            <p className="text-gray-600 mb-6">
              To access the instructor dashboard, please select the Instructor role.
            </p>
            <RoleSelectionModal onClose={() => window.location.href = '/'} />
          </div>
        </div>
      </div>
    );
  }

  // Check if user is an instructor but their application is pending or rejected
  if (currentUser && 
      (currentUser.currentRole === 'INSTRUCTOR' || currentUser.academyRole === 'INSTRUCTOR') && 
      (currentUser.roleStatus?.instructor === 'pending' || currentUser.roleStatus?.instructor === 'rejected')) {
    // Show pending/rejected message
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentUser.roleStatus?.instructor === 'pending' ? 'Instructor Application Pending' : 'Instructor Application Rejected'}
            </h2>
            <p className="text-gray-600 mb-6">
              {currentUser.roleStatus?.instructor === 'pending' 
                ? 'Your instructor application is currently under review. You will be notified once a decision is made.'
                : 'Your instructor application has been rejected. Please contact support for more information.'}
            </p>
            <button 
              onClick={() => {
                // Refresh profile to check if status has changed
                if (refreshProfile) {
                  refreshProfile();
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    );
  }



  // Fetch instructor stats
  useEffect(() => {
    const fetchInstructorStats = async () => {
      try {
        setLoadingStats(true);
        const response = await academyAPI.get("/progress/instructor/stats");
        setInstructorStats({
          experience: response.data.yearsOfExperience || 10,
          courses: response.data.totalCourses || courses.length,
          students: response.data.totalStudents || 0,
          rating: response.data.averageRating || 0
        });
      } catch (error) {
        console.error("Error fetching instructor stats:", error);
        // Fallback to mock data
        setInstructorStats({
          experience: 10,
          courses: courses.length,
          students: 847,
          rating: 4.9
        });
      } finally {
        setLoadingStats(false);
      }
    };

    if (currentUser) {
      fetchInstructorStats();
    }
  }, [currentUser, courses.length]);

  const handleReply = (id: number) => {
    // Functionality to reply to message
    console.log(`Replying to message ${id}`);
    // Add reply form or API call logic here
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await academyAPI.patch(`/notifications/${id}/read`);
      // In a real implementation, we would update the UI to reflect the read status
      console.log(`Message ${id} marked as read`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleEditMessage = (id: number, newMessage: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, message: newMessage } : msg
      )
    );
  };

  const handleDeleteCourse = async (courseId: number) => {
    const success = await removeCourse(courseId);
    if (success) {
      alert("Course deleted successfully!");
    } else if (removingCourse.error) {
      alert(`Error deleting course: ${removingCourse.errorMessage}`);
    }
  };

  // Check if user has the required role for CRUD operations
  const canPerformCRUD = (currentUser?.academyRole === 'INSTRUCTOR' && currentUser?.roleStatus?.instructor === 'active') || currentUser?.academyRole === 'ADMIN';

  // Dummy functions for when CRUD is not allowed
  const dummyFunction = () => {};

  return (      
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-5">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your courses, schedule, and student interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <UserProfileCard
              name={`${currentUser?.firstname} ${currentUser?.lastname}`}
              title={(currentUser as Instructor)?.title}
              certifications={["AWS Certified"]}
              className="bg-white p-6 rounded-2xl shadow-lg h-full border border-gray-100"
              experience={instructorStats.experience}
              courses={instructorStats.courses}
              students={instructorStats.students}
              rating={instructorStats.rating}

            />
          </div>
          
          <div className="lg:col-span-2">
            <ManageTeachingSchedules 
              key={key} // Add key prop to trigger re-render
              refreshKey={key} // Pass refreshKey to component
              className="h-full" 
              courses={courses.map(course => ({ id: course.id, title: course.title }))} 
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaBook className="mr-3 text-blue-600" /> My Courses
              </h2>
              <p className="text-gray-600 mt-1">Manage and create your course content</p>
            </div>
            {canPerformCRUD && (
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
                onClick={() => setCreatingCourseForm(true)}
              >
                <FaPlus className="mr-2" /> Create Course
              </button>
            )}
          </div>
          
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {

                const { title, thumbnail, enrolledNum, progress, id } = course;
                return (
                  <InstructorCourseCard
                    key={id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"

                    title={title}
                    thumbnail={thumbnail ?? ""}
                    enrolledNum={enrolledNum ?? 0}
                    progress={progress ?? 0}
                    onEdit={canPerformCRUD ? () => setEditingCourse({ editing: true, courseId: id }) : dummyFunction}
                    onView={() => setViewingCourse(course)}
                    onDelete={canPerformCRUD ? () => {
                      setCourseToDelete(id);
                      setShowDeleteModal(true);
                    } : dummyFunction}
                    onAnalytics={canPerformCRUD ? () => setViewingAnalytics({ viewing: true, courseId: id }) : dummyFunction} // Added analytics handler
                    onSchedule={() => {
                      setSelectedCourseId(id);
                      setShowAddSessionForm(true);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-gray-400 mb-4">
                <FaChalkboardTeacher className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by creating your first course and sharing your knowledge with students around the world.</p>
              {canPerformCRUD && (
                <button
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setCreatingCourseForm(true)}
                >
                  Create Your First Course
                </button>
              )}
            </div>
          )}
        </div>

        {creatingCourseForm && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={() => setCreatingCourseForm(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-gray-200">
              <CreateCourseForm onClose={() => setCreatingCourseForm(false)} />
            </div>
          </div>
        )}
        {editingCourse.editing && editingCourse.courseId && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={() => setEditingCourse({ editing: false, courseId: null })}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-gray-200">
              <EditCourseForm
                course={
                  courses.filter(
                    (course) => course.id === editingCourse.courseId
                  )[0]
                }
                onClose={() =>
                  setEditingCourse({ editing: false, courseId: null })
                }
                onSubmit={async (updatedCourse) => {
                  const success = await updateCourse(updatedCourse);
                  if (success) {
                    setEditingCourse({ editing: false, courseId: null });
                  }
                  return success;
                }}
              />
            </div>
          </div>
        )}
        {viewingCourse && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={() => setViewingCourse(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-gray-200">
              <CourseView
                course={viewingCourse}
                onDelete={() => {
                  handleDeleteCourse(viewingCourse.id);
                  setViewingCourse(null);
                }}
                onClose={() => setViewingCourse(null)}
              />
            </div>
          </div>
        )}
        {/* Added analytics modal */}
        {viewingAnalytics.viewing && viewingAnalytics.courseId && (
          <CourseAnalytics
            course={
              courses.filter(
                (course) => course.id === viewingAnalytics.courseId
              )[0]
            }
            onClose={() =>
              setViewingAnalytics({ viewing: false, courseId: null })
            }
          />
        )}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (courseToDelete) {
              handleDeleteCourse(courseToDelete);
              setCourseToDelete(null);
            }
          }}
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone."
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
        {showAddSessionForm && (
            <AddTeachingSessionSchedule
              key={key} // Add key prop to trigger re-render
              courseId={selectedCourseId || 0}
              onAdd={() => {
                // Refresh schedules after adding
                setShowAddSessionForm(false);
                // Instead of reloading the page, we can trigger a state update to refresh components
                // This will cause a re-render without a full page reload
                forceUpdate(); // This will trigger a re-render
              }}
              onClose={() => setShowAddSessionForm(false)}
            />
          )}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <FaComments className="mr-3 text-green-600" /> Recent Messages & Notifications
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-bold text-xl mb-4 flex items-center text-blue-800">
                <FaUsers className="mr-2" /> Student Questions
              </h3>
              <div className="space-y-4">

                {messages.map((msg) => (
                  <Message
                    key={msg.id}
                    id={msg.id}
                    name={msg.name}
                    time={msg.time}
                    profilePic={msg.profilePic}
                    message={msg.message}
                    onReply={() => handleReply(msg.id)}
                    onEdit={(newMessage) =>
                      handleEditMessage(msg.id, newMessage)
                    }
                    onMarkAsRead={() => handleMarkAsRead(msg.id)}
                  />
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100">
              <h3 className="font-bold text-xl mb-4 flex items-center text-amber-800">
                <FaBell className="mr-2" /> Alerts & Notifications
              </h3>
              <div className="space-y-4">

                {notifications &&
                  notifications.length > 0 &&
                  notifications.map((notification: any) => (
                    <Notification key={notification.id} message={notification.message} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;