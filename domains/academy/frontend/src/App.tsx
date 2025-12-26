import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import AcademyHomePage from "./Pages/AcademyHomePage";
import AcademyAboutPage from "./Pages/AcademyAboutPage";
import AcademyContactUsPage from "./Pages/AcademyContactUsPage";
import AcademyStudentDashboard from "./Pages/AcademyStudentDashboard";
import InstructorDashboard from "./Pages/InstructorDashboard";
import CoursesPage from "./Pages/CoursesPage";
import CourseDetailsPage from "./Pages/CourseDetailsPage";
import AcademyHeader from "./components/AcademyHeader";
import EventDetailsPage from "./Pages/EventDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRouter from "./components/DashboardRouter";
import RolesPage from "./Pages/RolesPage";
import TeacherApplicationModal from "./components/TeacherApplicationModal";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";


// Layout components
const DefaultLayout = () => {
  return <Outlet />;
};

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Outlet />
    </div>
  );
};

const PublicLayout = () => {
  const { user: currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUpClick = () => {
    navigate("/auth/signup");
  };

  const handleLogout = () => {
    console.log("App.tsx: PublicLayout handleLogout called");
    logout();
    console.log("App.tsx: PublicLayout logout function completed");
  };

  const handleLogoutComplete = () => {
    console.log(
      "App.tsx: PublicLayout handleLogoutComplete called, navigating to home"
    );
    navigate("/");
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <>
        <header className="bg-white shadow-md fixed w-full top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </header>
        <Outlet />
      </>
    );
  }

  return (
    <>
      <AcademyHeader
        currentTab={location.pathname}
        currentUser={currentUser || undefined}
        onSignUpClick={handleSignUpClick}
        onLogout={handleLogout}
        onLogoutComplete={handleLogoutComplete}
      />
      <Outlet />
    </>
  );
};

const DashboardLayout = () => {
  const { user: currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUpClick = () => {
    navigate("/auth/signup");
  };

  const handleLogout = () => {
    console.log("App.tsx: DashboardLayout handleLogout called");
    logout();
    console.log("App.tsx: DashboardLayout logout function completed");
  };

  const handleLogoutComplete = () => {
    console.log(
      "App.tsx: DashboardLayout handleLogoutComplete called, navigating to home"
    );
    navigate("/");
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md fixed w-full top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </header>
        <div className="pt-16">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AcademyHeader
        currentTab={location.pathname}
        currentUser={currentUser || undefined}
        onSignUpClick={handleSignUpClick}
        onLogout={handleLogout}
        onLogoutComplete={handleLogoutComplete}
      />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}> 
          <Route path="/" element={<AcademyHomePage />} />
          <Route path="/about" element={<AcademyAboutPage />} />
          <Route path="/contact" element={<AcademyContactUsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
        </Route>

        {/* Authentication routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
        </Route>

        {/* Smart dashboard router - redirects based on role */}
        <Route path="/dashboard" element={<DashboardRouter />} />
        
        {/* Role selection page */}
        <Route path="/role" element={<RolesPage />} />

        {/* Student dashboard routes */}
        <Route element={<DashboardLayout />}> 
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <AcademyStudentDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Instructor dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/instructor"
            element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <div>Admin Dashboard (To be implemented)</div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Profile and Settings routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
