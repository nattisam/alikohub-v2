import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface RoleSelectionModalProps {
  onClose?: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onClose }) => {
  const { user, selectRole, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRoleSelect = (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    setSelectedRole(role);
    setError("");
  };

  const handleSubmitRole = async () => {
    if (!selectedRole) {
      setError("Please select a role first.");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      const result = await selectRole(selectedRole as "STUDENT" | "INSTRUCTOR" | "ADMIN");
      
      // Check if this is the special instructor application response
      if (result && result.error === 'INSTRUCTOR_APPLICATION_REQUIRED') {
        // Don't close the modal, let the parent component handle showing the application modal
        setError("");
        setIsSubmitting(false);
        
        // Close this modal and let parent handle instructor application
        if (onClose) {
          onClose();
        }
        
        // Navigate to dashboard where instructor application modal will appear
        navigate('/dashboard');
        return;
      }
      
      // Navigate based on selected role
      switch (selectedRole) {
        case "STUDENT":
          navigate("/dashboard");
          break;
        case "INSTRUCTOR":
          // For instructor, we need to show the application modal instead of navigating
          // The error thrown in AuthContext will be caught and handled here
          setError("INSTRUCTOR_APPLICATION_REQUIRED");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
      
      // Close the modal if provided
      if (onClose) {
        onClose();
      }
    } catch (err: any) {
      console.error("Error selecting role:", err);
      
      setError("Failed to select role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user already has a role, don't show the modal
  if (user?.hasSelectedRole) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Role</h2>
            <p className="text-gray-600">
              Choose the role you want to use in the academy platform
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Student Role Card */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedRole === "STUDENT" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
              onClick={() => handleRoleSelect("STUDENT")}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                  {selectedRole === "STUDENT" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Student</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Access courses, assignments, and learning materials
                  </p>
                </div>
              </div>
            </div>

            {/* Instructor Role Card */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedRole === "INSTRUCTOR" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
              onClick={() => handleRoleSelect("INSTRUCTOR")}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                  {selectedRole === "INSTRUCTOR" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Instructor</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Create and manage courses, grade assignments
                  </p>
                  {user?.roleStatus?.instructor === "pending" && (
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Application Pending
                    </span>
                  )}
                  {user?.roleStatus?.instructor === "rejected" && (
                    <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Application Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Role Card */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedRole === "ADMIN" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
              onClick={() => handleRoleSelect("ADMIN")}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                  {selectedRole === "ADMIN" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Administrator</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage users, courses, and platform settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmitRole}
              disabled={!selectedRole || isSubmitting || authLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                !selectedRole || isSubmitting || authLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting || authLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Confirm Role Selection"
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>You can change your role later in your profile settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;