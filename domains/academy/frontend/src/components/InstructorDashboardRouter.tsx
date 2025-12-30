import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RoleSelectionModal from "./RoleSelectionModal";
import InstructorDashboardMain from "../Pages/InstructorDashboard";
import InstructorMyCourses from "../Pages/InstructorMyCourses";
import InstructorCreateCourse from "../Pages/InstructorCreateCourse";
import InstructorSubmissions from "../Pages/InstructorSubmissions";
import InstructorAnalytics from "../Pages/InstructorAnalytics";
import InstructorDashboardLayout from "./InstructorDashboardLayout";

const InstructorDashboardRouter: React.FC = () => {
  const { user: currentUser } = useAuth();
  const location = useLocation();

  // Check the active role from the user's academyUser
  const activeRole = currentUser?.academyUser?.activeRole;
  const hasSelectedRole = currentUser?.hasSelectedRole || currentUser?.academyUser?.hasSelectedRole;

  // If user hasn't selected a role yet, show role selection modal
  if (currentUser && !hasSelectedRole) {
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <InstructorDashboardLayout>
      <Routes>
        <Route path="" element={<InstructorDashboardMain />} />
        <Route path="/mycourses" element={<InstructorMyCourses />} />
        <Route path="/create-course" element={<InstructorCreateCourse />} />
        <Route path="/submissions" element={<InstructorSubmissions />} />
        <Route path="/analytics" element={<InstructorAnalytics />} />
      </Routes>
    </InstructorDashboardLayout>
  );
};

export default InstructorDashboardRouter;