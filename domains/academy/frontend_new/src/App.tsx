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
import InstructorCourses from "./pages/lms/InstructorCourses";
import InstructorCourseEditor from "./pages/lms/InstructorCourseEditor";
import InstructorCreateCourse from "./pages/lms/InstructorCreateCourse";
import InstructorAnalytics from "./pages/lms/InstructorAnalytics";
import InstructorSchedules from "./pages/lms/InstructorSchedules";
import InstructorSettings from "./pages/lms/InstructorSettings";
import TeacherApplicationDetail from "./pages/admin/TeacherApplicationDetail";
import CourseDetails from "./pages/lms/CourseDetails";

// STEM Category Pages
import StemIndex from "./pages/categories/stem/Index";
import StemPrograms from "./pages/categories/stem/Programs";
import StemProgramDetail from "./pages/categories/stem/ProgramDetail";
import StemEnterprise from "./pages/categories/stem/Enterprise";
import StemPartners from "./pages/categories/stem/Partners";
import StemAbout from "./pages/categories/stem/About";
import StemContact from "./pages/categories/stem/Contact";
import StemPolicies from "./pages/categories/stem/Policies";
import StemCurriculum from "./pages/categories/stem/Curriculum";
import StemCertifications from "./pages/categories/stem/Certifications";
import StemStudentLogin from "./pages/categories/stem/StudentLogin";
import StemApply from "./pages/categories/stem/Apply";
import StemMyApplications from "./pages/categories/stem/MyApplications";
import StemNotFound from "./pages/categories/stem/NotFound";

// STEM Admin Pages
import StemAdminOverview from "./pages/categories/stem/admin/Overview";
import StemAdminPrograms from "./pages/categories/stem/admin/Programs";
import StemAdminApplications from "./pages/categories/stem/admin/Applications";
import StemAdminInquiries from "./pages/categories/stem/admin/Inquiries";
import StemAdminUsers from "./pages/categories/stem/admin/Users";
import StemAdminAudit from "./pages/categories/stem/admin/AuditLog";
// Health Category Pages
import HealthIndex from "./pages/categories/health/Index";
import HealthPrograms from "./pages/categories/health/Programs";
import HealthProgramDetail from "./pages/categories/health/ProgramDetail";
import HealthEnterprise from "./pages/categories/health/Enterprise";
import HealthPartners from "./pages/categories/health/Partners";
import HealthAbout from "./pages/categories/health/About";
import HealthContact from "./pages/categories/health/Contact";
import HealthPolicies from "./pages/categories/health/Policies";
import HealthStudentLogin from "./pages/categories/health/StudentLogin";
import HealthApply from "./pages/categories/health/Apply";
import HealthAdmissions from "./pages/categories/health/Admissions";
import HealthExamPrep from "./pages/categories/health/ExamPrepPrograms";
import HealthExamPrepDetail from "./pages/categories/health/ExamPrepDetail";
import HealthSchedule from "./pages/categories/health/Schedule";
import HealthTuition from "./pages/categories/health/Tuition";
import HealthCareerServices from "./pages/categories/health/CareerServices";
import HealthPartnerships from "./pages/categories/health/Partnerships";
import HealthInstitutionalTraining from "./pages/categories/health/InstitutionalTraining";
import HealthInstitutionalDetail from "./pages/categories/health/InstitutionalCategoryDetail";
import HealthAccreditation from "./pages/categories/health/Accreditation";
import HealthNotFound from "./pages/categories/health/NotFound";
// Health Admin Pages
import HealthAdminLogin from "./pages/categories/health/admin/AdminLogin";
import HealthAdminDashboard from "./pages/categories/health/admin/Dashboard";
import HealthAdminPrograms from "./pages/categories/health/admin/AdminPrograms";
import HealthAdminCohorts from "./pages/categories/health/admin/AdminCohorts";
import HealthAdminStudents from "./pages/categories/health/admin/AdminStudents";
import HealthAdminApplications from "./pages/categories/health/admin/AdminApplications";
import HealthAdminEnterpriseLeads from "./pages/categories/health/admin/AdminEnterpriseLeads";
import HealthAdminExamPrep from "./pages/categories/health/admin/AdminExamPrep";
import HealthAdminContent from "./pages/categories/health/admin/AdminContent";
import HealthAdminInstitutional from "./pages/categories/health/admin/AdminInstitutional";
import HealthAdminPartnerships from "./pages/categories/health/admin/AdminPartnerships";
import HealthAdminPartners from "./pages/categories/health/admin/AdminPartners";

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

          {/* Public Auth Routes (Redirect if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminDashboard />} />
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
            <Route
              path="/lms/learn/:slug"
              element={
                <div className="p-20 text-center">
                  Course Player (Coming Soon)
                </div>
              }
            />
          </Route>

          {/* STEM Category Routes */}
          <Route path="/stem" element={<StemIndex />} />
          <Route path="/stem/programs" element={<StemPrograms />} />
          <Route path="/stem/programs/:slug" element={<StemProgramDetail />} />
          <Route path="/stem/enterprise" element={<StemEnterprise />} />
          <Route path="/stem/partners" element={<StemPartners />} />
          <Route path="/stem/about" element={<StemAbout />} />
          <Route path="/stem/contact" element={<StemContact />} />
          <Route path="/stem/policies" element={<StemPolicies />} />
          <Route path="/stem/curriculum" element={<StemCurriculum />} />
          <Route path="/stem/certifications" element={<StemCertifications />} />
          <Route path="/stem/student-login" element={<StemStudentLogin />} />
          <Route path="/stem/apply" element={<StemApply />} />
          <Route
            path="/stem/my-applications"
            element={<StemMyApplications />}
          />

          {/* Health Category Routes */}
          <Route path="/health" element={<HealthIndex />} />
          <Route path="/health/programs" element={<HealthPrograms />} />
          <Route
            path="/health/programs/:programId"
            element={<HealthProgramDetail />}
          />
          <Route path="/health/enterprise" element={<HealthEnterprise />} />
          <Route path="/health/partners" element={<HealthPartners />} />
          <Route path="/health/about" element={<HealthAbout />} />
          <Route path="/health/contact" element={<HealthContact />} />
          <Route path="/health/policies" element={<HealthPolicies />} />
          <Route
            path="/health/student-login"
            element={<HealthStudentLogin />}
          />
          <Route path="/health/apply" element={<HealthApply />} />
          <Route path="/health/admissions" element={<HealthAdmissions />} />
          <Route path="/health/exam-prep" element={<HealthExamPrep />} />
          <Route
            path="/health/exam-prep/:programId"
            element={<HealthExamPrepDetail />}
          />
          <Route path="/health/schedule" element={<HealthSchedule />} />
          <Route path="/health/tuition" element={<HealthTuition />} />
          <Route
            path="/health/career-services"
            element={<HealthCareerServices />}
          />
          <Route path="/health/partnerships" element={<HealthPartnerships />} />
          <Route
            path="/health/institutional-training"
            element={<HealthInstitutionalTraining />}
          />
          <Route
            path="/health/institutional-training/:categorySlug"
            element={<HealthInstitutionalDetail />}
          />
          <Route
            path="/health/accreditation"
            element={<HealthAccreditation />}
          />

          {/* Health Admin Routes */}
          <Route path="/health/admin/login" element={<HealthAdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/health/admin" element={<HealthAdminDashboard />} />
            <Route
              path="/health/admin/programs"
              element={<HealthAdminPrograms />}
            />
            <Route
              path="/health/admin/cohorts"
              element={<HealthAdminCohorts />}
            />
            <Route
              path="/health/admin/students"
              element={<HealthAdminStudents />}
            />
            <Route
              path="/health/admin/applications"
              element={<HealthAdminApplications />}
            />
            <Route
              path="/health/admin/enterprise-leads"
              element={<HealthAdminEnterpriseLeads />}
            />
            <Route
              path="/health/admin/exam-prep"
              element={<HealthAdminExamPrep />}
            />
            <Route
              path="/health/admin/content"
              element={<HealthAdminContent />}
            />
            <Route
              path="/health/admin/institutional"
              element={<HealthAdminInstitutional />}
            />
            <Route
              path="/health/admin/partnerships"
              element={<HealthAdminPartnerships />}
            />
            <Route
              path="/health/admin/partners"
              element={<HealthAdminPartners />}
            />
          </Route>

          {/* STEM Admin Routes - Auth removed */}
          <Route path="/stem/admin" element={<StemAdminOverview />} />
          <Route path="/stem/admin/programs" element={<StemAdminPrograms />} />
          <Route
            path="/stem/admin/applications"
            element={<StemAdminApplications />}
          />
          <Route
            path="/stem/admin/inquiries"
            element={<StemAdminInquiries />}
          />
          <Route path="/stem/admin/users" element={<StemAdminUsers />} />
          <Route path="/stem/admin/audit" element={<StemAdminAudit />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<StemNotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
