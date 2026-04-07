import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StateProvider } from "@/contexts/StateContext";

// Auth & Layout
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import InstructorRoute from "@/components/InstructorRoute";

// Pages - Auth
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";

import NotFound from "@/pages/NotFound";

// Pages - Dashboard
import StudentDashboard from "@/pages/Dashboard/Student";
import InstructorDashboard from "@/pages/Dashboard/Instructor";
import ApplyInstructor from "@/pages/ApplyInstructor";
import PaymentSuccess from "@/pages/PaymentSuccess";

// Pages - Courses
import CourseDetails from "@/pages/Courses/Details";
import CourseExplorer from "@/pages/Courses/Explorer";
import InstructorCourses from "@/pages/Courses/InstructorCourses";
import CreateCourse from "@/pages/Courses/CreateCourse";
import CourseEditor from "@/pages/Courses/Editor";

// Pages - Lessons
import LessonView from "@/pages/Lessons/Index";

// Pages - Progress
import StudentProgress from "@/pages/Progress/Student";
import InstructorAnalytics from "@/pages/Progress/InstructorAnalytics";
import Submissions from "@/pages/Progress/Submissions";

// Pages - Instructor/Admin
import AdminDashboard from "@/pages/Admin/Index";
import Schedules from "@/pages/Instructor/Schedules";
import InstructorSettings from "@/pages/Instructor/Settings";

// Pages - Account
import Profile from "@/pages/Account/Profile";
import Settings from "@/pages/Account/Settings";
import AccountSecurity from "@/pages/Account/AccountSecurity";
import Certifications from "@/pages/Account/Certifications";
import Notifications from "@/pages/Account/Notifications";
import Photo from "@/pages/Account/Photo";
import Subscriptions from "@/pages/Account/Subscriptions";
import CareerHub from "@/pages/Account/CareerHub";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Runs inside BrowserRouter + QueryClientProvider so hooks work correctly */
const AppInner = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Default Redirect */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected Portal Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Student & Shared Protected Routes */}
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/courses" element={<CourseExplorer />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/learning" element={<StudentProgress />} />
        <Route path="/learn/:id" element={<LessonView />} />
        <Route path="/instructor/apply" element={<ApplyInstructor />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />

        {/* Account Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/account-security" element={<AccountSecurity />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/career-hub" element={<CareerHub />} />

        {/* Instructor Routes */}
        <Route element={<InstructorRoute />}>
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<InstructorCourses />} />
          <Route path="/instructor/courses/new" element={<CreateCourse />} />
          <Route path="/instructor/courses/:id" element={<CourseEditor />} />
          <Route
            path="/instructor/analytics"
            element={<InstructorAnalytics />}
          />
          <Route path="/instructor/submissions" element={<Submissions />} />
          <Route path="/instructor/schedules" element={<Schedules />} />
          <Route path="/instructor/settings" element={<InstructorSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StateProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </TooltipProvider>
    </StateProvider>
  </QueryClientProvider>
);

export default App;
