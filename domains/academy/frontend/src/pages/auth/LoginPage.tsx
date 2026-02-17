import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../../../../libraries/ui-libraries/components/auth/AuthLayout";
import AuthHeader from "../../../../../../libraries/ui-libraries/components/auth/AuthHeader";
import AcademyLoginForm from "../../components/auth/AcademyLoginForm";
import type { LoginFormData } from "../../components/auth/AcademyLoginForm";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginMutation, loginError } = useAuth();
  const loginLoading = loginMutation.isPending;

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      // Successfully logged in - determine redirect path
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.globalRole === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } catch (e) {
          navigate("/dashboard");
        }
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
