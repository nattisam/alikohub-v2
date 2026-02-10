import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../../../../libraries/ui-libraries/components/auth/AuthLayout";
import AuthHeader from "../../../../../../libraries/ui-libraries/components/auth/AuthHeader";
import LoginForm from "../../../../../../libraries/ui-libraries/components/auth/LoginForm";
import type { LoginFormData } from "../../../../../../libraries/ui-libraries/components/auth/LoginForm";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginMutation, loginError } = useAuth();
  const loginLoading = loginMutation.isPending;

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      // After login, check user role from localStorage to determine redirect
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // If user is an admin, redirect to admin panel directly
          if (user.globalRole === "ADMIN") {
            navigate("/admin");
          } else {
            // For non-admin users, go to dashboard for role-based routing
            navigate("/dashboard");
          }
        } catch (parseError) {
          // Fallback to dashboard if parsing fails
          navigate("/dashboard");
        }
      } else {
        // Fallback to dashboard if no user data in localStorage
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Error handling is managed by the context (loginError state)
    }
  };

  const handleSwitchToSignup = () => {
    navigate("/auth/signup");
  };

  return (
    <>
      <AuthLayout heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AuthHeader />

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="mt-0.5 bg-red-500 rounded-full p-1 shadow-sm shadow-red-200 flex-shrink-0">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 tracking-tight">
                  Login Failed
                </p>
                <p className="text-xs text-red-600 font-medium leading-relaxed mt-0.5">
                  {loginError}
                </p>
              </div>
            </div>
          )}

          <LoginForm
            onSubmit={handleLogin}
            onSwitchToSignup={handleSwitchToSignup}
            loading={loginLoading}
          />
        </div>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
