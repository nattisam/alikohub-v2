import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import RoleSelectionModal from './components/RoleSelectionModal';
import AcademyHeader from './components/AcademyHeader';
import AcademyHomePage from './pages/AcademyHomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Layout components
const DefaultLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Outlet />
    </div>
  );
};

const PublicLayout = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/auth/signup");
  };

  const handleLogout = () => {
    console.log('App.tsx: PublicLayout handleLogout called');
    logout();
    console.log('App.tsx: PublicLayout logout function completed');
  };

  const handleLogoutComplete = () => {
    console.log('App.tsx: PublicLayout handleLogoutComplete called, navigating to home');
    navigate("/");
  };

  return (
    <>
      <AcademyHeader
        currentTab="/" 
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
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tab, setTab] = useState<"overview" | "profile">("overview");
  const { currentUser, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/auth/signup");
  };

  const handleUserAvatarClick = () => {
    // Navigate to user profile or dashboard
    navigate("/dashboard");
  };

  const handleLogout = () => {
    console.log('App.tsx: DashboardLayout handleLogout called');
    logout();
    console.log('App.tsx: DashboardLayout logout function completed');
  };

  const handleLogoutComplete = () => {
    console.log('App.tsx: DashboardLayout handleLogoutComplete called, navigating to home');
    navigate("/");
  };

  // If user is not logged in, redirect to login (except for public routes)
  if (!currentUser && !['/', '/about', '/contact', '/courses', '/courses/:courseId'].includes(location.pathname)) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if we need to redirect instructors to their dashboard
  if (currentUser && currentUser.hasSelectedRole && 
      (currentUser.academyRole === 'INSTRUCTOR' || currentUser.academyRole === 'ADMIN') &&
      location.pathname === '/dashboard') {
    return <Navigate to="/instructor" replace />;
  }

  // Check if we need to show the role selection modal
  // Show the modal if the user is logged in but hasn't selected a role yet
  const shouldShowRoleModal = currentUser && !currentUser.hasSelectedRole;

  // If user hasn't selected a role and is on a dashboard route, show role selection modal
  const handleModalClose = () => {
    // Instead of just hiding the modal, we should check if the user has selected a role
    // If they have, redirect them appropriately
    if (currentUser && currentUser.hasSelectedRole) {
      if (currentUser.academyRole === 'INSTRUCTOR' || currentUser.academyRole === 'ADMIN') {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    }
    setShowRoleModal(false);
  };

  if (shouldShowRoleModal) {
    return (
      <>
        <AcademyHeader 
          currentTab={location.pathname} 
          currentUser={currentUser || undefined}
          onSignUpClick={handleSignUpClick}
          onUserAvatarClick={handleUserAvatarClick}
          onLogout={handleLogout}
          onLogoutComplete={handleLogoutComplete}
        />
        <RoleSelectionModal onClose={handleModalClose} />
        <div className="min-h-screen bg-gray-50 pt-16">
          <Outlet />
        </div>
      </>
    );
  }

  // If user has selected a role or is on a public route, show normal layout
  return (
    <div className="min-h-screen bg-gray-50">
      <AcademyHeader 
        currentTab={location.pathname} 
        currentUser={currentUser || undefined}
        onSignUpClick={handleSignUpClick}
        onUserAvatarClick={handleUserAvatarClick}
        onLogout={handleLogout}
        onLogoutComplete={handleLogoutComplete}
      />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

// Create a wrapper component for the instructor dashboard that uses hooks safely
// const InstructorDashboardWrapper = () => {
//   const { currentUser } = useUser();
//   const navigate = useNavigate();

//   // If user is not logged in, redirect to login
//   if (!currentUser) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   // If user hasn't selected a role, redirect to role selection
//   if (!currentUser.hasSelectedRole) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   // If user is not an instructor or admin, redirect to student dashboard
//   if (currentUser.academyRole !== 'INSTRUCTOR' && currentUser.academyRole !== 'ADMIN') {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <InstructorDashboard />;
// };

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<AcademyHomePage />} />
        </Route>

        {/* Authentication routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
        </Route>

        {/* Dashboard routes (protected) */}
        {/* <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AcademyStudentDashboard />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/instructor" element={<InstructorDashboardWrapper />} />
          <Route path="/instructor/profile" element={<ProfilePage />} />
        </Route> */}

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;