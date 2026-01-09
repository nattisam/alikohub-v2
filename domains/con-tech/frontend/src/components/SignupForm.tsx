import React, { useState } from "react";
import { useUser } from "../hooks";
import { FiLoader } from "react-icons/fi";
import type { SignupCredentials as SignupFormType } from "../type";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';

const CSignupForm = () => {
  const { signup, signupLoading, signupError } = useUser();
  const [userInfo, setUserInfo] = useState<SignupFormType>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    
    if (token) {
      setCaptchaError(null);
      setCaptchaLoaded(true);
    } else {
      setCaptchaError('Please complete the security check');
    }
  };

  // Redirect to login after successful signup
  React.useEffect(() => {
    if (signupSuccess) {
      // Auto-redirect to login after 3 seconds
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [signupSuccess, navigate]);

  const validateUser = (userInfo: SignupFormType) => {
    const errors: string[] = [];
    
    if (!userInfo.firstname || userInfo.firstname.trim().length < 2) {
      errors.push("First name is required");
    }
    if (!userInfo.lastname || userInfo.lastname.trim().length < 2) {
      errors.push("Last name is required");
    }
    if (!validateEmail(userInfo.email)) {
      errors.push("Invalid email format");
    }
    if (!userInfo.password || userInfo.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    
    // Validate captcha
    if (!captchaToken) {
      errors.push("Please complete the security check");
    }
    
    setErrorMessages(errors);
    return errors.length === 0;
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages([]);
    if (validateUser(userInfo) && captchaToken) {
      try {
        // Call signup with all required fields including captcha token
        await signup({
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          email: userInfo.email,
          password: userInfo.password,
          captchaToken: captchaToken
        });
        setSignupSuccess(true);
      } catch (error) {
        console.error('Signup error:', error);
        setErrorMessages([error instanceof Error ? error.message : 'An error occurred during signup']);
      }
    }
  };

  const getError = (field: string) => {
    return errorMessages.find(msg => msg.toLowerCase().includes(field.toLowerCase()));
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4e9] to-[#e6e0d4] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#C2B58F]/30 text-center">
          <div className="flex justify-center">
            <svg className="h-16 w-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Created Successfully!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Thank you for signing up with ConTech. Please check your email to verify your account.
          </p>
          <p className="mt-4 text-center text-sm text-gray-600">
            You will be redirected to the login page shortly, or you can <Link to="/login" className="font-medium text-[#FFC107] hover:text-[#FFC107]/80 transition duration-300">click here</Link> to login now.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#FFC107]/70 hover:bg-[#FFC107]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC107] transition duration-300"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4e9] to-[#e6e0d4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#C2B58F]/30">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join ConTech to revolutionize your construction projects
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {signupError && !signupLoading && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Sign up failed. Please try again.
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className={`appearance-none block w-full px-3 py-3 border ${
                    getError("first") ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-[#FFC107] focus:border-[#FFC107]"
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300`}
                  placeholder="John"
                  value={userInfo.firstname}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, firstname: e.target.value })
                  }
                />
                {getError("first") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {getError("first") && (
                <p className="mt-2 text-sm text-red-600">{getError("first")}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className={`appearance-none block w-full px-3 py-3 border ${
                    getError("last") ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-[#FFC107] focus:border-[#FFC107]"
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300`}
                  placeholder="Doe"
                  value={userInfo.lastname}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, lastname: e.target.value })
                  }
                />
                {getError("last") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {getError("last") && (
                <p className="mt-2 text-sm text-red-600">{getError("last")}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full px-3 py-3 border ${
                    getError("email") ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-[#FFC107] focus:border-[#FFC107]"
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300`}
                  placeholder="john@example.com"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                />
                {getError("email") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {getError("email") && (
                <p className="mt-2 text-sm text-red-600">{getError("email")}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none block w-full px-3 py-3 border ${
                    getError("password") ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-[#FFC107] focus:border-[#FFC107]"
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-300`}
                  placeholder="••••••••"
                  value={userInfo.password}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {getError("password") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {getError("password") && (
                <p className="mt-2 text-sm text-red-600">{getError("password")}</p>
              )}
            </div>


          </div>

          {/* reCAPTCHA Widget */}
          <div className="pt-4">
            <ReCAPTCHA
              sitekey="6LdnZEMsAAAAAO9XTu3-JBnoVSTQ6GY1MUgdR7YV"
              onChange={handleCaptchaChange}
              onErrored={() => {
                setCaptchaError('reCAPTCHA error occurred. Please refresh the page and try again.');
              }}
            />
            {captchaError && (
              <p className="mt-1 text-sm text-red-600">{captchaError}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={signupLoading || !captchaLoaded || !captchaToken}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#FFC107]/70 hover:bg-[#FFC107]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC107] transition duration-300 disabled:opacity-50"
            >
              {signupLoading ? (
                <span className="flex items-center">
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Signing up...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#FFC107] hover:text-[#FFC107]/80 transition duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const validateEmail = (email: string) => {
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/;
  return re.test(email);
};

export default CSignupForm;