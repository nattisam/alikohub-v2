import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RoleSelectionModal from "../components/RoleSelectionModal";

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

  // If user has already selected a role, redirect them to dashboard
  const hasSelectedRole = currentUser?.hasSelectedRole || currentUser?.academyUser?.hasSelectedRole;
  
  if (hasSelectedRole) {
    // Redirect to appropriate dashboard based on selected role
    if (currentUser?.academyRole === 'INSTRUCTOR' || currentUser?.currentRole === 'INSTRUCTOR') {
      navigate('/instructor');
    } else if (currentUser?.academyRole === 'ADMIN' || currentUser?.currentRole === 'ADMIN') {
      navigate('/admin');
    } else {
      // Default to student dashboard
      navigate('/student-dashboard');
    }
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <RoleSelectionModal 
            onClose={() => {
              // After role selection, redirect to dashboard
              navigate('/dashboard');
            }} 
          />
        </div>
      </div>
    </div>
  );
}