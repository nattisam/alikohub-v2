import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../../../../../libraries/ui-libraries/components/auth/AuthLayout";
import AuthHeader from "../../../../../../libraries/ui-libraries/components/auth/AuthHeader";
import AcademyLoginForm from "../../components/auth/AcademyLoginForm";
import type { LoginFormData } from "../../components/auth/AcademyLoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle } from "lucide-react";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginMutation, loginError } = useAuth();
  const loginLoading = loginMutation.isPending;

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect");
  const message = searchParams.get("message");

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      // If we have a specific redirect path from a previous page, use it
      if (redirectPath) {
        navigate(redirectPath);
      }
      // Otherwise, we do nothing and let the parent PublicRoute
      // handle the dashboard redirection automatically once state is updated
    } catch (error: any) {
      console.error("Login call failed:", error);
    }
  };

  const handleSwitchToSignup = () => {
    // Preserve redirect param when switching to signup
    const search = location.search;
    navigate(`/auth/signup${search}`);
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

          <AcademyLoginForm
            onSubmit={handleLogin}
            onSwitchToSignup={handleSwitchToSignup}
            loading={loginLoading}
            serverError={loginError}
          />
        </div>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
