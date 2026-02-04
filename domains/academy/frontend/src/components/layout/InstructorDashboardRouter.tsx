import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RoleSelectionModal from "../auth/RoleSelectionModal";
import InstructorDashboardMain from "../../pages/instructor/InstructorDashboard";
import InstructorMyCourses from "../../pages/instructor/InstructorMyCourses";
import InstructorCreateCourse from "../../pages/instructor/InstructorCreateCourse";
import InstructorAnalytics from "../../pages/instructor/InstructorAnalytics";
import InstructorDashboardLayout from "./InstructorDashboardLayout";
import ManageCoursePage from "../../pages/instructor/ManageCoursePage";
import NotFoundState from "../states/NotFoundState";

const InstructorDashboardRouter: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Check the active role from the user's academyUser
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
            <RoleSelectionModal onClose={() => navigate('/')} />
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
        <Route path="/mycourses/manage/:id" element={<ManageCoursePage />} />
        <Route path="/create-course" element={<InstructorCreateCourse />} />
        <Route path="/analytics" element={<InstructorAnalytics />} />
        <Route 
          path="*" 
          element={
            <NotFoundState 
              title="Page Not Found" 
              message="The page you are looking for does not exist in the instructor dashboard."
            /> 
          } 
        />
      </Routes>
    </InstructorDashboardLayout>
  );
};

export default InstructorDashboardRouter;