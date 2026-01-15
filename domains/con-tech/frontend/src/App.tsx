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
import TasksPage from "./pages/TasksPage";
import InspectionsPage from "./pages/InspectionsPage";
import ReportsPage from "./pages/ReportsPage";
import UserApplicationsPage from "./pages/UserApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";
import FinancialTracking from "./pages/FinancialTracking";
import ClientApproval from "./pages/ClientApprovals";
import CreateProjectForm from "./components/CreateProjectForm";
import ConTechServicesPage from "./pages/ConTechServicesPage";
import ContractsPage from "./pages/ContractsPage";
import ClientDashboard from "./pages/ClientDashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import PMDashboard from "./pages/PMDashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";
import DashboardHome from "./pages/DashboardHome";



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
    // Close modal and redirect to appropriate dashboard based on role
    if (currentUser?.role === "CLIENT") {
      navigate("/client-dashboard");
    } else if (currentUser?.role === "CONTRACTOR") {
      navigate("/contractor-dashboard");
    } else if (currentUser?.role === "PROJECT_MANAGER") {
      navigate("/pm-dashboard");
    } else {
      navigate("/dashboard");
    }
  };
  
  // If user has selected a role, redirect away from role selection
  if (currentUser?.hasSelectedRole) {
    if (currentUser?.role === "CLIENT") {
      navigate("/client-dashboard");
    } else if (currentUser?.role === "CONTRACTOR") {
      navigate("/contractor-dashboard");
    } else if (currentUser?.role === "PROJECT_MANAGER") {
      navigate("/pm-dashboard");
    } else {
      navigate("/dashboard");
    }
    return <Navigate to={
      currentUser?.role === "CLIENT" ? "/client-dashboard" :
      currentUser?.role === "CONTRACTOR" ? "/contractor-dashboard" :
      currentUser?.role === "PROJECT_MANAGER" ? "/pm-dashboard" : "/dashboard"
    } replace />;
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

const RoleProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't selected a role, they should go through role selection first
  if (!currentUser.hasSelectedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

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
      path: "/client-dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute requiredRole="CLIENT">
              <ClientDashboard />
            </ProtectedRoute>
          ),
        }
      ]
    },
    {
      path: "/contractor-dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute requiredRole="CONTRACTOR">
              <ContractorDashboard />
            </ProtectedRoute>
          ),
        }
      ]
    },
    {
      path: "/pm-dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute requiredRole="PROJECT_MANAGER">
              <DashboardHome />
            </ProtectedRoute>
          ),
        }
      ]
    },
    {
      path: "/role-selection",
      element: <RoleSelectionWrapper />,
    },
    {
      path: "/profile",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute>
              <ProfilePage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "client",
          element: (
            <ProtectedRoute requiredRole="CLIENT">
              <ClientDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "pm",
          element: (
            <ProtectedRoute requiredRole="PROJECT_MANAGER">
              <PMDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "contractor",
          element: (
            <ProtectedRoute requiredRole="CONTRACTOR">
              <ContractorDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "projects",
          element: (
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "projects/new",
          element: (
            <ProtectedRoute>
              <CreateProjectForm />
            </ProtectedRoute>
          ),
        },
        {
          path: "projects/:projectId",
          element: (
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "tasks",
          element: (
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "tasks/:taskId",
          element: (
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "inspections",
          element: (
            <ProtectedRoute>
              <InspectionsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "inspections/:inspectionId",
          element: (
            <ProtectedRoute>
              <InspectionsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "contracts",
          element: (
            <ProtectedRoute>
              <ContractsPage />
            </ProtectedRoute>
          )
        },
        {
          path: "reports",
          element: (
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "reports/:reportId",
          element: (
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "applications",
          element: (
            <ProtectedRoute>
              <UserApplicationsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "applications/:applicationId",
          element: (
            <ProtectedRoute>
              <UserApplicationsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "inspection-reports",
          element: (
            <ProtectedRoute>
              <InspectionsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "financial-tracking",
          element: (
            <ProtectedRoute>
              <FinancialTracking />
            </ProtectedRoute>
          ),
        },
        {
          path: "approvals",
          element: (
            <ProtectedRoute>
              <ClientApproval />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
