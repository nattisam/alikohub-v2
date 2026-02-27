import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../../../../../libraries/ui-libraries/components/auth/AuthLayout";
import AuthHeader from "../../../../../../libraries/ui-libraries/components/auth/AuthHeader";
import AcademySignupForm from "../../components/auth/AcademySignupForm";
import type { SignupFormData } from "../../components/auth/AcademySignupForm";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle } from "lucide-react";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isLoading: signupLoading, signupError } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect");
  const message = searchParams.get("message");

  const buildRedirectQuery = () => {
    const params = new URLSearchParams();
    if (redirectPath) params.set("redirect", redirectPath);
    if (message) params.set("message", message);
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const handleSignup = async (data: SignupFormData) => {
    try {
      await signup({
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
        captchaToken: data.captchaToken,
      });
      // Redirect back to the login page after signup, preserving redirect param
      navigate(`/auth/login${buildRedirectQuery()}`);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleSwitchToLogin = () => {
    navigate(`/auth/login${buildRedirectQuery()}`);
  };

  return (
    <>
      <AuthLayout heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AuthHeader />

          {message && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">{message}</p>
            </div>
          )}

          <AcademySignupForm
            onSubmit={handleSignup}
            onSwitchToLogin={handleSwitchToLogin}
            loading={signupLoading}
            serverError={signupError}
          />
        </div>
      </AuthLayout>
    </>
  );
};

export default SignupPage;
