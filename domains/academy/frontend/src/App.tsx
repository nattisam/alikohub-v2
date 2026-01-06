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
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFoundState from './components/states/NotFoundState';

import LoginPage from './Pages/auth/LoginPage';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import SignupPage from "./Pages/auth/SignupPage";
import AcademyHomePage from "./Pages/user/AcademyHomePage";
import AcademyAboutPage from "./Pages/user/AcademyAboutPage";
import AcademyContactUsPage from "./Pages/user/AcademyContactUsPage";
import AcademyStudentDashboard from "./Pages/student/AcademyStudentDashboard";
import InstructorDashboardRouter from "./components/layout/InstructorDashboardRouter";
import StudentDashboardRouter from "./components/layout/StudentDashboardRouter";
import CoursesPage from "./Pages/user/CoursesPage";
import CourseDetailsPage from "./Pages/user/CourseDetailsPage";
import AcademyHeader from "./components/layout/AcademyHeader";
import EventDetailsPage from "./Pages/user/EventDetailsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute";
import DashboardRouter from "./components/layout/DashboardRouter";
import RolesPage from "./Pages/user/RolesPage";
import ProfilePage from "./Pages/user/ProfilePage";
import SettingsPage from "./Pages/user/SettingsPage";
import TeacherApplicationsDashboard from "./admin/TeacherApplicationsDashboard";
import AdminDashboard from "./admin/AdminDashboard";

// -------------------- Layouts --------------------

const PublicLayout = () => {
  const { user: currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUpClick = () => navigate("/auth/signup");

  const handleLogout = () => logout();

  const handleLogoutComplete = () => navigate("/");

  if (isLoading) {
    return (
      <>
        <header className="bg-white shadow-md fixed w-full top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="flex space-x-4">
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md fixed w-full top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="flex space-x-4">
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
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
        onSignUpClick={() => navigate("/auth/signup")}
        onLogout={logout}
        onLogoutComplete={() => navigate("/")}
      />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

// -------------------- App --------------------

function App() {
  return (
    <ErrorBoundary>
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

        {/* Auth routes — redirect authenticated users */}
        <Route path="/auth/login" element={
          <RedirectIfAuthenticated redirectPath="/">
            <LoginPage />
          </RedirectIfAuthenticated>
        } />
        <Route path="/auth/signup" element={
          <RedirectIfAuthenticated redirectPath="/">
            <SignupPage />
          </RedirectIfAuthenticated>
        } />

        {/* Smart dashboard router */}
        <Route path="/dashboard" element={<DashboardRouter />} />

        {/* Role selection */}
        <Route path="/role" element={<RolesPage />} />

        {/* Student dashboard */}
        <Route element={<DashboardLayout />}>  
          <Route
            path="/student-dashboard/*"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentDashboardRouter />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Instructor dashboard */}
        <Route element={<DashboardLayout />}>  
          <Route
            path="/instructor/*"
            element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <InstructorDashboardRouter />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin dashboard */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/teacher-applications"
            element={
              <AdminProtectedRoute>
                <TeacherApplicationsDashboard />
              </AdminProtectedRoute>
            }
          />
        </Route>

        {/* Profile & settings */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={
          <NotFoundState 
            title="Page Not Found" 
            message="The page you are looking for does not exist."
          /> 
        } />
      </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
