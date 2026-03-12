import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ApplyInstructor from "./pages/ApplyInstructor";
import AdminDashboard from "./pages/AdminDashboard";
import LmsDashboard from "./pages/lms/LmsDashboard";
import InstructorDashboard from "./pages/lms/InstructorDashboard";
import LmsExplore from "./pages/lms/LmsExplore";
import LmsMyLearning from "./pages/lms/LmsMyLearning";
import LmsCertifications from "./pages/lms/LmsCertifications";
import LmsProfile from "./pages/lms/LmsProfile";
import LmsPhoto from "./pages/lms/LmsPhoto";
import LmsAccountSecurity from "./pages/lms/LmsAccountSecurity";
import LmsSubscriptions from "./pages/lms/LmsSubscriptions";
import LmsNotifications from "./pages/lms/LmsNotifications";
import LmsSettings from "./pages/lms/LmsSettings";
import InstructorCourses from "./pages/lms/InstructorCourses";
import InstructorCourseEditor from "./pages/lms/InstructorCourseEditor";
import InstructorCreateCourse from "./pages/lms/InstructorCreateCourse";
import InstructorAnalytics from "./pages/lms/InstructorAnalytics";
import InstructorSchedules from "./pages/lms/InstructorSchedules";
import InstructorSettings from "./pages/lms/InstructorSettings";
import TeacherApplicationDetail from "./pages/admin/TeacherApplicationDetail";
import CourseDetails from "./pages/lms/CourseDetails";
import LmsLearn from "./pages/lms/LmsLearn";
import PaymentSuccess from "./pages/PaymentSuccess";
import VerifyEmail from "./pages/VerifyEmail";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetch on window focus
      retry: 1, // Limit retries to prevent flooding the backend on errors
      staleTime: 30 * 1000, // 30 seconds default stale time
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Public Auth Routes (Redirect if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Email Verification Route */}
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Payment Success Route */}
          <Route path="/payment/success" element={<PaymentSuccess />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route
              path="/admin/applications/:id"
              element={<TeacherApplicationDetail />}
            />
          </Route>

          {/* Protected LMS Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/apply-instructor" element={<ApplyInstructor />} />
            <Route path="/lms" element={<LmsDashboard />} />
            <Route path="/instructor/lms" element={<InstructorDashboard />} />
            <Route
              path="/instructor/lms/courses"
              element={<InstructorCourses />}
            />
            <Route
              path="/instructor/lms/courses/new"
              element={<InstructorCreateCourse />}
            />
            <Route
              path="/instructor/lms/courses/:id"
              element={<InstructorCourseEditor />}
            />
            <Route
              path="/instructor/lms/analytics"
              element={<InstructorAnalytics />}
            />
            <Route
              path="/instructor/lms/schedules"
              element={<InstructorSchedules />}
            />
            <Route
              path="/instructor/lms/settings"
              element={<InstructorSettings />}
            />
            <Route path="/lms/explore" element={<LmsExplore />} />
            <Route path="/lms/my-learning" element={<LmsMyLearning />} />
            <Route path="/lms/certifications" element={<LmsCertifications />} />
            <Route path="/lms/profile" element={<LmsProfile />} />
            <Route path="/lms/photo" element={<LmsPhoto />} />
            <Route
              path="/lms/account-security"
              element={<LmsAccountSecurity />}
            />
            <Route path="/lms/subscriptions" element={<LmsSubscriptions />} />
            <Route path="/lms/notifications" element={<LmsNotifications />} />
            <Route path="/lms/settings" element={<LmsSettings />} />
            <Route path="/lms/course/:id" element={<CourseDetails />} />
            <Route path="/lms/learn/:id" element={<LmsLearn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
