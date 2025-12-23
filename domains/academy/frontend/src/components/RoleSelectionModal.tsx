import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export type AcademyRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

interface RoleSelectionModalProps {
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onClose }) => {
  const { user: currentUser, selectRole } = useAuth();
  console.log('RoleSelectionModal: Rendering with currentUser:', currentUser);
  const [selectedRole, setSelectedRole] = useState<AcademyRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = async (role: AcademyRole) => {
    console.log('RoleSelectionModal: handleRoleSelect called with role:', role);
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    console.log('RoleSelectionModal: handleSubmit called with selectedRole:', selectedRole);
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Update the user's role in the auth context
      console.log('RoleSelectionModal: Calling selectRole with:', selectedRole);
      await selectRole(selectedRole);
      
      // Navigate to the appropriate dashboard based on selected role
      console.log('RoleSelectionModal: Navigating to dashboard for role:', selectedRole);
      if (selectedRole === "STUDENT") {
        navigate("/dashboard");
      } else if (selectedRole === "INSTRUCTOR") {
        navigate("/instructor");
      } else if (selectedRole === "ADMIN") {
        navigate("/admin");
      }
      
      // Close the modal
      console.log('RoleSelectionModal: Calling onClose');
      onClose();
    } catch (err) {
      setError("Failed to select role. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-scroll mx-auto  z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Role</h2>
        <p className="text-gray-600 mb-6">
          Welcome! Please select your role in the Academy platform to continue.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleRoleSelect("STUDENT")}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedRole === "STUDENT"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="font-medium text-gray-900">Student</div>
            <div className="text-sm text-gray-600">
              Enroll in courses, complete assignments, and earn certificates
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("INSTRUCTOR")}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedRole === "INSTRUCTOR"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="font-medium text-gray-900">Instructor</div>
            <div className="text-sm text-gray-600">
              Create and manage courses, assignments, and track student progress
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("ADMIN")}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedRole === "ADMIN"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="font-medium text-gray-900">Admin</div>
            <div className="text-sm text-gray-600">
              Manage the platform, users, courses, and system configurations
            </div>
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              // If user cancels, log them out
              console.log('RoleSelectionModal: User cancelled role selection, logging out');
              // We don't have access to logout function directly here, but the cancel button
              // should just close the modal and let the protected route handle navigation
              onClose();
            }}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedRole}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;