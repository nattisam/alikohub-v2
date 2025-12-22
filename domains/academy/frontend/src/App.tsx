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
  const { user: currentUser, logout } = useAuth();
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
  const { user: currentUser, logout } = useAuth();
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

        {/* Student dashboard routes */}
        <Route element={<DashboardLayout />}> 
          <Route
            path="/dashboard"
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

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
