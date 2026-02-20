import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage.tsx";
import GeneralLoginPage from "./pages/LoginPage.tsx";
import GeneralSignupPage from "./pages/SignupPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ErrorBoundary from "./components/common/ErrorBoundary";
import NotFoundState from "./components/states/NotFoundState";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<GeneralLoginPage />} />
            <Route path="/auth/signup" element={<GeneralSignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={
                <NotFoundState
                  title="Page Not Found"
                  message="The page you are looking for does not exist."
                />
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
