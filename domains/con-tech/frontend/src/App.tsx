import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ConTechHomePage from "./pages/ConTechHomePage";
import ConTechAboutUsPage from "./pages/ConTechAboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import { useUser } from "./hooks";
import LoginForm from "./components/LoginForm";
import CSignupForm from "./components/SignupForm";
import RoleSelectionModal from "./components/RoleSelectionModal";
import ProjectsPage from "./pages/ProjectsPage";
import ReportsPage from "./pages/ReportsPage";
import UserManagementPage from "./pages/UserManagementPage";
import ProfilePage from "./pages/ProfilePage";
import CreateProjectForm from "./components/CreateProjectForm";
import ConTechServicesPage from "./pages/ConTechServicesPage";
import ClientDashboard from "./pages/ClientDashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import PMDashboard from "./pages/PMDashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";
// import DashboardHome from "./pages/DashboardHome";



function DefaultLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <Header
        navLinks={[
          { label: "Home", link: "/" },
          { label: "About", link: "/about" },
          { label: "Services", link: "/services" },
          { label: "Contact", link: "/contact" },
        ]}
        currentPage={pathname}
      />
      <Outlet />
      <Footer />
    </>
  );
}


function RoleSelectionWrapper() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  const handleCloseModal = () => {
    const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
    // Close modal and redirect to appropriate dashboard based on role
    if (isGlobalAdmin || currentUser?.role === "PROJECT_MANAGER" || currentUser?.role === "ADMIN") {
      navigate("/admin");
    } else if (currentUser?.role === "CONTRACTOR") {
      navigate("/contractor");
    } else if (currentUser?.role === "CLIENT") {
      navigate("/client");
    } else {
      navigate("/");
    }
  };
  
  // If user has selected a role, redirect away from role selection
  if (currentUser?.hasSelectedRole || currentUser?.globalRole === 'ADMIN') {
    const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
    const destination = isGlobalAdmin || currentUser?.role === "PROJECT_MANAGER" || currentUser?.role === "ADMIN" 
      ? "/admin" 
      : currentUser?.role === "CONTRACTOR" 
        ? "/contractor" 
        : currentUser?.role === "CLIENT" 
          ? "/client" 
          : "/";
          
    return <Navigate to={destination} replace />;
  }
  
  // If user hasn't selected a role, show the role selection modal
  return <RoleSelectionModal onClose={handleCloseModal} />;
}

function LoginLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default function App() {
  const { currentUser } = useUser();
  console.log(currentUser); // Keep this to avoid unused variable

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        { index: true, element: <ConTechHomePage /> },
        { path: "about", element: <ConTechAboutUsPage /> },
        { path: "contact", element: <ContactUsPage /> },
        { path: "services", element: <ConTechServicesPage /> }
      ],
    },
    {
      path: "/login",
      element: <LoginLayout />,
      children: [{ index: true, element: <LoginForm /> }],
    },
    {
      path: "/signup",
      element: <LoginLayout />,
      children: [{ index: true, element: <CSignupForm /> }],
    },
    {
      path: "/role-selection",
      element: <RoleSelectionWrapper />,
    },
    // Admin Dashboard Routes
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRole="PROJECT_MANAGER">
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <PMDashboard /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "projects/new", element: <CreateProjectForm /> },
        { path: "projects/:projectId", element: <ProjectDetails /> },
        { path: "contractors", element: <UserManagementPage /> },
        { path: "clients", element: <UserManagementPage /> },
        { path: "reports", element: <ReportsPage /> },
        { path: "profile", element: <ProfilePage /> },
      ]
    },
    // Contractor Dashboard Routes
    {
      path: "/contractor",
      element: (
        <ProtectedRoute requiredRole="CONTRACTOR">
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <ContractorDashboard /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "projects/:projectId", element: <ProjectDetails /> },
        { path: "profile", element: <ProfilePage /> },
      ]
    },
    // Client Dashboard Routes
    {
      path: "/client",
      element: (
        <ProtectedRoute requiredRole="CLIENT">
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <ClientDashboard /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "projects/:projectId", element: <ProjectDetails /> },
        { path: "profile", element: <ProfilePage /> },
      ]
    },
    // Legacy Dashboard Redirect (for backward compatibility during migration)
    {
      path: "/dashboard/*",
      element: <Navigate to="/role-selection" replace />,
    },
    {
      path: "/profile",
      element: <Navigate to="/role-selection" replace />,
    }
  ]);

  return <RouterProvider router={router} />;
}
