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
import { useSSO } from "@/hooks/useSSO";
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

// Technology Category Pages
import TechIndex from "./pages/categories/technology/Index";
import TechPrograms from "./pages/categories/technology/Programs";
import TechProgramDetail from "./pages/categories/technology/ProgramDetail";
import TechLearningPaths from "./pages/categories/technology/LearningPaths";
import TechSkillAssessment from "./pages/categories/technology/SkillAssessment";
import TechCareerServices from "./pages/categories/technology/CareerServices";
import TechProjects from "./pages/categories/technology/Projects";
import TechOutcomes from "./pages/categories/technology/Outcomes";
import TechTuition from "./pages/categories/technology/Tuition";
import TechAdmissions from "./pages/categories/technology/Admissions";
import TechApply from "./pages/categories/technology/Apply";
import TechMentors from "./pages/categories/technology/Mentors";
import TechPartners from "./pages/categories/technology/Partners";
import TechHireGraduates from "./pages/categories/technology/HireGraduates";
import TechVerifyCredential from "./pages/categories/technology/VerifyCredential";
import TechComparePrograms from "./pages/categories/technology/ComparePrograms";
import TechContact from "./pages/categories/technology/Contact";
import TechPolicies from "./pages/categories/technology/Policies";
import TechStudentLogin from "./pages/categories/technology/StudentLogin";
import TechEnterprise from "./pages/categories/technology/EnterpriseTraining";
import TechNotFound from "./pages/categories/technology/NotFound";

// Technology Admin Pages
import TechAdminLogin from "./pages/categories/technology/admin/AdminLogin";
import TechAdminDashboard from "./pages/categories/technology/admin/Dashboard";
import TechAdminPrograms from "./pages/categories/technology/admin/AdminPrograms";
import TechAdminProgramEditor from "./pages/categories/technology/admin/ProgramEditor";
import TechAdminApplications from "./pages/categories/technology/admin/AdminApplications";
import TechAdminCohorts from "./pages/categories/technology/admin/AdminCohorts";
import TechAdminPartners from "./pages/categories/technology/admin/AdminPartners";
import TechAdminSupport from "./pages/categories/technology/admin/AdminSupport";
import TechAdminReports from "./pages/categories/technology/admin/AdminReports";
import TechAdminUsers from "./pages/categories/technology/admin/AdminUsers";
import TechAdminAuditLogs from "./pages/categories/technology/admin/AdminAuditLogs";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

function SSOProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useSSO();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        queryClient.setQueryData(["user"], user);
      } else {
        queryClient.setQueryData(["user"], null);
      }
    }
  }, [isAuthenticated, isLoading, user, queryClient]);

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SSOProvider>
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
              <Route
                path="/lms/certifications"
                element={<LmsCertifications />}
              />
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

            {/* STEM Category Routes */}
            <Route path="/stem" element={<StemIndex />} />
            <Route path="/stem/programs" element={<StemPrograms />} />
            <Route
              path="/stem/programs/:slug"
              element={<StemProgramDetail />}
            />
            <Route path="/stem/enterprise" element={<StemEnterprise />} />
            <Route path="/stem/partners" element={<StemPartners />} />
            <Route path="/stem/about" element={<StemAbout />} />
            <Route path="/stem/contact" element={<StemContact />} />
            <Route path="/stem/policies" element={<StemPolicies />} />
            <Route path="/stem/curriculum" element={<StemCurriculum />} />
            <Route
              path="/stem/certifications"
              element={<StemCertifications />}
            />
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
            <Route
              path="/health/partnerships"
              element={<HealthPartnerships />}
            />
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

            {/* Technology Category Routes */}
            <Route path="/technology" element={<TechIndex />} />
            <Route path="/technology/programs" element={<TechPrograms />} />
            <Route
              path="/technology/programs/career-tracks/:slug"
              element={<TechProgramDetail />}
            />
            <Route
              path="/technology/programs/short-courses/:slug"
              element={<TechProgramDetail />}
            />
            <Route
              path="/technology/learning-paths"
              element={<TechLearningPaths />}
            />
            <Route
              path="/technology/skill-assessment"
              element={<TechSkillAssessment />}
            />
            <Route
              path="/technology/career-services"
              element={<TechCareerServices />}
            />
            <Route path="/technology/projects" element={<TechProjects />} />
            <Route path="/technology/outcomes" element={<TechOutcomes />} />
            <Route path="/technology/tuition" element={<TechTuition />} />
            <Route path="/technology/admissions" element={<TechAdmissions />} />
            <Route path="/technology/apply" element={<TechApply />} />
            <Route path="/technology/mentors" element={<TechMentors />} />
            <Route path="/technology/partners" element={<TechPartners />} />
            <Route
              path="/technology/hire-graduates"
              element={<TechHireGraduates />}
            />
            <Route
              path="/technology/verify-credential"
              element={<TechVerifyCredential />}
            />
            <Route
              path="/technology/compare"
              element={<TechComparePrograms />}
            />
            <Route path="/technology/contact" element={<TechContact />} />
            <Route
              path="/technology/policies/:policy"
              element={<TechPolicies />}
            />
            <Route
              path="/technology/student-login"
              element={<TechStudentLogin />}
            />
            <Route path="/technology/enterprise" element={<TechEnterprise />} />

            {/* Technology Admin Routes */}
            <Route
              path="/technology/admin/login"
              element={<TechAdminLogin />}
            />
            <Route element={<AdminRoute />}>
              <Route
                path="/technology/admin"
                element={<TechAdminDashboard />}
              />
              <Route
                path="/technology/admin/programs"
                element={<TechAdminPrograms />}
              />
              <Route
                path="/technology/admin/programs/new"
                element={<TechAdminProgramEditor />}
              />
              <Route
                path="/technology/admin/programs/:id/edit"
                element={<TechAdminProgramEditor />}
              />
              <Route
                path="/technology/admin/applications"
                element={<TechAdminApplications />}
              />
              <Route
                path="/technology/admin/cohorts"
                element={<TechAdminCohorts />}
              />
              <Route
                path="/technology/admin/partners"
                element={<TechAdminPartners />}
              />
              <Route
                path="/technology/admin/support"
                element={<TechAdminSupport />}
              />
              <Route
                path="/technology/admin/reports"
                element={<TechAdminReports />}
              />
              <Route
                path="/technology/admin/users"
                element={<TechAdminUsers />}
              />
              <Route
                path="/technology/admin/audit-logs"
                element={<TechAdminAuditLogs />}
              />
            </Route>

            {/* STEM Admin Routes - Auth removed */}
            <Route path="/stem/admin" element={<StemAdminOverview />} />
            <Route
              path="/stem/admin/programs"
              element={<StemAdminPrograms />}
            />
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
        </SSOProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
