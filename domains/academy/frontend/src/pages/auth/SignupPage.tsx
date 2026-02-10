import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../../../../libraries/ui-libraries/components/auth/AuthLayout";
import AuthHeader from "../../../../../../libraries/ui-libraries/components/auth/AuthHeader";
import type { SignupFormData } from "../../../../../../libraries/ui-libraries/components/auth/SignupForm";
import { useAuth } from "../../contexts/AuthContext";
import SignupForm from "../../../../../../libraries/ui-libraries/components/auth/SignupForm";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, signupMutation, signupError } = useAuth();
  const signupLoading = signupMutation.isPending;

  const handleSignup = async (data: SignupFormData) => {
    try {
      await signup({
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
        captchaToken: data.captchaToken,
      });
      // Redirect back to the home page after signup
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      // Error handling is managed by the context (signupError state)
    }
  };

  const handleSwitchToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <>
      <AuthLayout heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AuthHeader />

          {signupError && (
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
                  Registration Failed
                </p>
                <p className="text-xs text-red-600 font-medium leading-relaxed mt-0.5">
                  {signupError}
                </p>
              </div>
            </div>
          )}

          <SignupForm
            onSubmit={handleSignup}
            onSwitchToLogin={handleSwitchToLogin}
            loading={signupLoading}
            recaptchaSiteKey={"6LdnZEMsAAAAAO9XTu3-JBnoVSTQ6GY1MUgdR7YV"}
          />
        </div>
      </AuthLayout>
    </>
  );
};

export default SignupPage;
