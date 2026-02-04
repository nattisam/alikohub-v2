import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFoundState from './components/states/NotFoundState';

import LoginPage from './pages/auth/LoginPage';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import SignupPage from "./pages/auth/SignupPage";
import AcademyHomePage from "./pages/user/AcademyHomePage";
import AcademyAboutPage from "./pages/user/AcademyAboutPage";
import AcademyContactUsPage from "./pages/user/AcademyContactUsPage";

import InstructorDashboardRouter from "./components/layout/InstructorDashboardRouter";
import StudentDashboardRouter from "./components/layout/StudentDashboardRouter";
import CoursesPage from "./pages/user/CoursesPage";
import CourseDetailsPage from "./pages/user/CourseDetailsPage";
import AcademyHeader from "./components/layout/AcademyHeader";
import EventDetailsPage from "./pages/user/EventDetailsPage";

import DashboardRouter from "./components/layout/DashboardRouter";
import RolesPage from "./pages/user/RolesPage";
import ProfilePage from "./pages/user/ProfilePage";

import TeacherApplicationsDashboard from "./admin/TeacherApplicationsDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import CoursesManagementPage from "./admin/CoursesManagementPage";
import ModulePage from "./pages/student/ModulePage";

import AppRoute from "./components/common/AppRoute";
import AdminRoute from "./components/common/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";
import PublicRoute from "./components/common/PublicRoute";

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
        {/* Public routes - with admin redirection */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={
            <PublicRoute>
              <AcademyHomePage />
            </PublicRoute>
          } />
          <Route path="/about" element={
            <PublicRoute>
              <AcademyAboutPage />
            </PublicRoute>
          } />
          <Route path="/contact" element={
            <PublicRoute>
              <AcademyContactUsPage />
            </PublicRoute>
          } />
          <Route path="/courses" element={
            <PublicRoute>
              <CoursesPage />
            </PublicRoute>
          } />
          <Route path="/courses/:courseId" element={
            <PublicRoute>
              <CourseDetailsPage />
            </PublicRoute>
          } />
          <Route path="/events/:eventId" element={
            <PublicRoute>
              <EventDetailsPage />
            </PublicRoute>
          } />
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
              <AppRoute requiredRole="STUDENT">
                <StudentDashboardRouter />
              </AppRoute>
            }
          />
        </Route>
        
        {/* Clean student module view without sidebar */}
        <Route
          path="/student-module/:courseId/modules"
          element={
            <AppRoute requiredRole="STUDENT">
              <ModulePage />
            </AppRoute>
          }
        />
        


        {/* Instructor dashboard */}
        <Route element={<DashboardLayout />}>  
          <Route
            path="/instructor/*"
            element={
              <AppRoute requiredRole="INSTRUCTOR">
                <InstructorDashboardRouter />
              </AppRoute>
            }
          />
        </Route>



        {/* Profile & settings - only accessible by non-admin users */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/profile"
            element={
              <AppRoute>
                <ProfilePage />
              </AppRoute>
            }
          />

        </Route>
        
        {/* Admin routes - completely separate tree */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="teacher-applications" element={<TeacherApplicationsDashboard />} />
          <Route path="courses" element={<CoursesManagementPage />} />
          <Route path="*" element={<NotFoundState />} />
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
