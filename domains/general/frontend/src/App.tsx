import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage.tsx";
import GeneralLoginPage from "./pages/LoginPage.tsx";
import GeneralSignupPage from "./pages/SignupPage.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<GeneralLoginPage />} />
          <Route path="/auth/signup" element={<GeneralSignupPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;