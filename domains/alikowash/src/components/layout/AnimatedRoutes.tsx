import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import HowWeDoIt from "@/pages/HowWeDoIt";
import Projects from "@/pages/Projects";
import Partners from "@/pages/Partners";
import Contact from "@/pages/Contact";
import OurStory from "@/pages/OurStory";
import Donate from "@/pages/Donate";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/Login";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminPartners from "@/pages/admin/AdminPartners";
import AdminTeam from "@/pages/admin/AdminTeam";
import AdminStories from "@/pages/admin/AdminStories";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminDonations from "@/pages/admin/AdminDonations";
import AdminSettings from "@/pages/admin/AdminSettings";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/services"
          element={
            <PageTransition>
              <Services />
            </PageTransition>
          }
        />
        <Route
          path="/how-we-do-it"
          element={
            <PageTransition>
              <HowWeDoIt />
            </PageTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <PageTransition>
              <Projects />
            </PageTransition>
          }
        />
        <Route
          path="/partners"
          element={
            <PageTransition>
              <Partners />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/our-story"
          element={
            <PageTransition>
              <OurStory />
            </PageTransition>
          }
        />
        <Route
          path="/donate"
          element={
            <PageTransition>
              <Donate />
            </PageTransition>
          }
        />

        {/* Auth Routes - Simplified to only admin login */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/register"
          element={<Navigate to="/admin/login" replace />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="stories" element={<AdminStories />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
