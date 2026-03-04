import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

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
          <Route path="/apply-instructor" element={<ApplyInstructor />} />

          {/* Public Auth Routes (Redirect if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Protected LMS Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/lms" element={<LmsDashboard />} />
            <Route path="/instructor/lms" element={<InstructorDashboard />} />
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
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
