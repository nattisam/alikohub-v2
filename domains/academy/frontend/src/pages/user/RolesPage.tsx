import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RoleSelectionModal from "../../components/auth/RoleSelectionModal";

export default function RolesPage() {
  const { user: currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Show loading state if user data is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!currentUser) {
    window.location.href = '/auth/login';
    return null;
  }

  // Allow users to access this page to select additional roles
  // Don't redirect users who have already selected a role, let them use the modal
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <RoleSelectionModal 
            onClose={() => {
              // After role selection, redirect to dashboard
              navigate('/dashboard');
            }} 
            allowAdditionalRoles={true}
          />
        </div>
      </div>
    </div>
  );
}