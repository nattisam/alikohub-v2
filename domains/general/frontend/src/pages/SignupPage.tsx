import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../../../libraries/ui-libraries/components/auth/AuthLayout';
import AuthHeader from '../../../../../libraries/ui-libraries/components/auth/AuthHeader';
import ErrorModal from '../../../../../libraries/ui-libraries/components/auth/ErrorModal';
import type { SignupFormData } from '../../../../../libraries/ui-libraries/components/auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';
import SignupForm from '../../../../../libraries/ui-libraries/components/auth/SignupForm';

const GeneralSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading: signupLoading, loginError: signupError, logout } = useAuth();

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
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      // Error handling is managed by the context (signupError state)
    }
  };

  const handleCloseErrorModal = () => {
    logout(); // Clear any error state
  };

  const handleSwitchToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <>
      <AuthLayout heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AuthHeader />
          <SignupForm
            onSubmit={handleSignup}
            onSwitchToLogin={handleSwitchToLogin}
            loading={signupLoading}
            recaptchaSiteKey={"6LdnZEMsAAAAAO9XTu3-JBnoVSTQ6GY1MUgdR7YV"}
          />
        </div>
      </AuthLayout>
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={!!signupError}
        onClose={handleCloseErrorModal}
        title="Registration Failed"
        message={signupError || undefined}
      />
    </>
  );
};

export default GeneralSignupPage;
