import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../../../libraries/ui-libraries/components/auth/AuthLayout';
import AuthHeader from '../../../../../libraries/ui-libraries/components/auth/AuthHeader';
import LoginForm from '../../../../../libraries/ui-libraries/components/auth/LoginForm';
import ErrorModal from '../../../../../libraries/ui-libraries/components/auth/ErrorModal';
import type { LoginFormData } from '../../../../../libraries/ui-libraries/components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading: loginLoading, loginError, logout } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Redirect back to the home page after login
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      // Error handling is managed by the context (loginError state)
    }
  };

  const handleCloseErrorModal = () => {
    logout(); // Clear any error state
  };

  const handleSwitchToSignup = () => {
    navigate('/auth/signup');
  };

  return (
    <>
      <AuthLayout heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AuthHeader />
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToSignup={handleSwitchToSignup}
            loading={loginLoading}
          />
        </div>
      </AuthLayout>
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={!!loginError}
        onClose={handleCloseErrorModal}
        title="Login Failed"
        message={loginError || undefined}
      />
    </>
  );
};

export default LoginPage;