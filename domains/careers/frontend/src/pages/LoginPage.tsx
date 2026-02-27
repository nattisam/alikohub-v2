"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email: formData.email, password: formData.password });
      // After successful login, redirect based on role
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.globalRole === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (user.globalRole === "RECRUITER") {
        navigate("/recruiter", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="/AlikoLogo.svg"
            alt="AlikoLogo"
            className="h-16 mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-navy-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white text-gray-900 placeholder-gray-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white text-gray-900 placeholder-gray-500 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={false}
              className="py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 w-full cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              Need an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
