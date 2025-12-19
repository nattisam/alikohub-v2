import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import GeneralLoginPage from "./pages/LoginPage.tsx";
import GeneralSignupPage from "./pages/SignupPage.tsx";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<GeneralLoginPage />} />
        <Route path="/auth/signup" element={<GeneralSignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
