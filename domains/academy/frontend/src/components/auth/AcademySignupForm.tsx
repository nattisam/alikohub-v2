import React, { useState } from "react";
import AcademyAuthInput from "./AcademyAuthInput";
import AuthButton from "../../../../../../libraries/ui-libraries/components/auth/AuthButton";
import SocialLoginButton from "../../../../../../libraries/ui-libraries/components/auth/SocialLoginButton";
import ReCAPTCHA from "react-google-recaptcha";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from "../../utils/validation";

interface AcademySignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  onSwitchToLogin: () => void;
  loading?: boolean;
  recaptchaSiteKey?: string;
  serverError?: string | null;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms: boolean;
  captchaToken?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  captchaToken?: string;
}

const AcademySignupForm: React.FC<AcademySignupFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  loading = false,
  recaptchaSiteKey,
  serverError,
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    captchaToken: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState<string | null>(
    null,
  );
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const validateField = (name: string, value: any) => {
    let error: string | null = null;
    switch (name) {
      case "firstName":
        error = validateName(value, "First name");
        break;
      case "lastName":
        error = validateName(value, "Last name");
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value);
        break;
      case "agreeToTerms":
        if (!value) error = "You must agree to the terms and conditions";
        break;
      default:
        break;
    }
    return error;
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

    // Special case: if password changes, re-validate confirmPassword
    if (field === "password" && touched.confirmPassword) {
      const confirmError = validateConfirmPassword(
        value,
        formData.confirmPassword || "",
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError || undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.firstName =
      validateName(formData.firstName, "First name") || undefined;
    newErrors.lastName =
      validateName(formData.lastName, "Last name") || undefined;
    newErrors.email = validateEmail(formData.email) || undefined;
    newErrors.password = validatePassword(formData.password) || undefined;
    newErrors.confirmPassword =
      validateConfirmPassword(
        formData.password,
        formData.confirmPassword || "",
      ) || undefined;

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    if (recaptchaSiteKey && !formData.captchaToken) {
      newErrors.captchaToken = "Please complete the security check";
    }

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    });

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setWasSubmitted(true);
      setLastSubmittedEmail(formData.email);
      onSubmit(formData);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setFormData((prev) => ({
      ...prev,
      captchaToken: token || undefined,
    }));

    if (token) {
      setCaptchaError(null);
      setErrors((prev) => ({ ...prev, captchaToken: undefined }));
    } else {
      setCaptchaError("Please complete the security check");
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Signup with ${provider}`);
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let strength = 0;
    if (p.length >= 8) strength++;
    if (/[A-Z]/.test(p)) strength++;
    if (/[0-9]/.test(p)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColors = [
    "bg-gray-200",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-green-400",
  ];
  const strengthLabels = ["Empty", "Weak", "Fair", "Good", "Strong"];

  const emailChanged = lastSubmittedEmail !== formData.email;

  const displayEmailError = (errors.email ||
    (wasSubmitted &&
    serverError?.toLowerCase().includes("email") &&
    !emailChanged
      ? serverError
      : undefined)) as string | undefined;

  return (
    <div className="w-full mt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create an account
        </h1>
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AcademyAuthInput
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(val) => handleChange("firstName", val)}
            onBlur={() => handleBlur("firstName")}
            error={touched.firstName ? errors.firstName : undefined}
            required
            disabled={loading}
          />
          <AcademyAuthInput
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(val) => handleChange("lastName", val)}
            onBlur={() => handleBlur("lastName")}
            error={touched.lastName ? errors.lastName : undefined}
            required
            disabled={loading}
          />
        </div>

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

        <div className="space-y-2">
          <AcademyAuthInput
            type="password"
            placeholder="Create password"
            value={formData.password}
            onChange={(val) => handleChange("password", val)}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
            showPasswordToggle
            required
            disabled={loading}
          />

          {formData.password && (
            <div className="px-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                  Password Strength:{" "}
                  <span className={strength === 4 ? "text-green-600" : ""}>
                    {strengthLabels[strength]}
                  </span>
                </span>
              </div>
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-300 ${
                      i <= strength ? strengthColors[strength] : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <AcademyAuthInput
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword || ""}
          onChange={(val) => handleChange("confirmPassword", val)}
          onBlur={() => handleBlur("confirmPassword")}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          showPasswordToggle
          required
          disabled={loading}
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="agreeToTerms"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                terms & conditions
              </a>
            </label>
          </div>
          {touched.agreeToTerms && errors.agreeToTerms && (
            <p className="text-xs font-medium text-red-600">
              {errors.agreeToTerms}
            </p>
          )}
        </div>

        <div className="pt-4">
          {(recaptchaSiteKey && recaptchaSiteKey.length > 0) ||
          (import.meta.env.VITE_RECAPTCHA_SITE_KEY &&
            import.meta.env.VITE_RECAPTCHA_SITE_KEY.length > 0) ? (
            <ReCAPTCHA
              sitekey={
                recaptchaSiteKey || import.meta.env.VITE_RECAPTCHA_SITE_KEY
              }
              onChange={handleCaptchaChange}
              onErrored={() => {
                setCaptchaError(
                  "reCAPTCHA error occurred. Please refresh the page and try again.",
                );
              }}
            />
          ) : (
            <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
              reCAPTCHA is not configured. Contact settings to set up security.
            </div>
          )}
          {touched.captchaToken && errors.captchaToken && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {errors.captchaToken}
            </p>
          )}
          {captchaError && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {captchaError}
            </p>
          )}
        </div>

        <div className="pt-4">
          <AuthButton
            type="submit"
            variant="primary"
            loading={loading}
            disabled={
              !!(loading || (recaptchaSiteKey && !formData.captchaToken))
            }
          >
            Create account
          </AuthButton>
        </div>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
          Or sign up with
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

export default AcademySignupForm;
