import React, { useState } from "react";
import AcademyAuthInput from "./AcademyAuthInput";
import AuthButton from "../../../../../../libraries/ui-libraries/components/auth/AuthButton";
import SocialLoginButton from "../../../../../../libraries/ui-libraries/components/auth/SocialLoginButton";
import { validateEmail } from "../../utils/validation";

interface AcademyLoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onSwitchToSignup: () => void;
  loading?: boolean;
  serverError?: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const AcademyLoginForm: React.FC<AcademyLoginFormProps> = ({
  onSubmit,
  onSwitchToSignup,
  loading = false,
  serverError,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] =
    useState<LoginFormData | null>(null);

  const validateField = (name: string, value: string) => {
    if (name === "email") {
      return validateEmail(value);
    }
    if (name === "password") {
      if (!value) return "Password is required";
    }
    return null;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, (formData as any)[field]);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.email = validateEmail(formData.email) || undefined;
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setWasSubmitted(true);
      setLastSubmittedData({ ...formData });
      onSubmit(formData);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  // Determine if we should show the server error
  // If we have a server error, show it under email unless there's a more specific frontend error
  // We only show it if the user hasn't changed the fields since the last failed attempt
  const isDataChanged =
    lastSubmittedData &&
    (lastSubmittedData.email !== formData.email ||
      lastSubmittedData.password !== formData.password);

  const displayEmailError = (errors.email ||
    (wasSubmitted && serverError && !isDataChanged
      ? serverError
      : undefined)) as string | undefined;

  return (
    <div className="w-full mt-24">
      <div className="mb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AcademyAuthInput
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(val) => handleChange("email", val)}
          onBlur={() => handleBlur("email")}
          error={displayEmailError}
          required
          disabled={loading}
        />

        <AcademyAuthInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(val) => handleChange("password", val)}
          onBlur={() => handleBlur("password")}
          error={touched.password ? errors.password : undefined}
          showPasswordToggle
          required
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => handleChange("rememberMe", e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>

        <div className="pt-4">
          <AuthButton
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Sign in
          </AuthButton>
        </div>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
          Or sign in with
        </span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="space-y-3">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialLogin("google")}
        />
      </div>
    </div>
  );
};

export default AcademyLoginForm;
