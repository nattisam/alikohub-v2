import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import AcademyHeader from "./components/AcademyHeader";
import AcademyHomePage from "./pages/AcademyHomePage";

// Layout for all public pages
const PublicLayout = () => {
  return (
    <>
      <AcademyHeader currentTab="/" />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
};

// Minimal auth pages layout
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<AcademyHomePage />} />
        </Route>

        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<div>Login Page</div>} />
          <Route path="/auth/signup" element={<div>Signup Page</div>} />
        </Route>

        {/* Redirect all unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
