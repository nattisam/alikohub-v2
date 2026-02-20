import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PageLoader from "./components/common/PageLoader";

// Lazy-loaded components
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const AcademyHomePage = lazy(() => import("./pages/user/AcademyHomePage"));
const AcademyAboutPage = lazy(() => import("./pages/user/AcademyAboutPage"));
const AcademyContactUsPage = lazy(
  () => import("./pages/user/AcademyContactUsPage"),
);
const CourseDetailsPage = lazy(() => import("./pages/user/CourseDetailsPage"));
const CategoryPage = lazy(() => import("./pages/user/CategoryPage"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const NotFoundState = lazy(() => import("./components/states/NotFoundState"));

const InstructorDashboardRouter = lazy(
  () => import("./components/layout/InstructorDashboardRouter"),
);
const StudentDashboardRouter = lazy(
  () => import("./components/layout/StudentDashboardRouter"),
);
const DashboardRouter = lazy(
  () => import("./components/layout/DashboardRouter"),
);

const TeacherApplicationsDashboard = lazy(
  () => import("./admin/TeacherApplicationsDashboard"),
);
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const CoursesManagementPage = lazy(
  () => import("./admin/CoursesManagementPage"),
);

import RequireAuthWithRedirect from "./components/auth/RequireAuthWithRedirect";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import AcademyHeader from "./components/layout/AcademyHeader";
import RoleSelectionModal from "./components/auth/RoleSelectionModal";
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

const RoleModalContainer = () => {
  const { isRoleModalOpen, setRoleModalOpen } = useAuth();

  if (!isRoleModalOpen) return null;

  return (
    <RoleSelectionModal
      onClose={() => setRoleModalOpen(false)}
      allowAdditionalRoles={true}
    />
  );
};

// -------------------- App --------------------

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <RoleModalContainer />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes - with admin redirection */}
            <Route element={<PublicLayout />}>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <AcademyHomePage />
                  </PublicRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <PublicRoute>
                    <AcademyAboutPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicRoute>
                    <AcademyContactUsPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/courses/:courseId"
                element={
                  <RequireAuthWithRedirect message="Please log in or sign up to view this course.">
                    <CourseDetailsPage />
                  </RequireAuthWithRedirect>
                }
              />
              <Route
                path="/category/:categoryName"
                element={
                  <PublicRoute>
                    <CategoryPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/login"
                element={
                  <RedirectIfAuthenticated redirectPath="/">
                    <LoginPage />
                  </RedirectIfAuthenticated>
                }
              />

              <Route
                path="/auth/signup"
                element={
                  <RedirectIfAuthenticated redirectPath="/">
                    <SignupPage />
                  </RedirectIfAuthenticated>
                }
              />
            </Route>

            {/* Smart dashboard router */}
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* Student dashboard tree */}
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
                  <AppRoute allowNoRole={true}>
                    <ProfilePage />
                  </AppRoute>
                }
              />
            </Route>

            {/* Admin routes - completely separate tree */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route
                path="teacher-applications"
                element={<TeacherApplicationsDashboard />}
              />
              <Route path="courses" element={<CoursesManagementPage />} />
              <Route path="*" element={<NotFoundState />} />
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={
                <NotFoundState
                  title="Page Not Found"
                  message="The page you are looking for does not exist."
                />
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
