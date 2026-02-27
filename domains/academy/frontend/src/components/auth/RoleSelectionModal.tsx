import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TeacherApplicationModal from "./TeacherApplicationModal";
import { X } from "lucide-react";

interface RoleSelectionModalProps {
  onClose?: () => void;
  allowAdditionalRoles?: boolean;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  onClose,
  allowAdditionalRoles = false,
}) => {
  const { user, isLoading: authLoading, selectRoleMutation } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showInstructorApplication, setShowInstructorApplication] =
    useState<boolean>(false);

  const handleRoleSelect = (role: "STUDENT" | "INSTRUCTOR") => {
    setSelectedRole(role);
    setError("");
  };

  const handleSubmitRole = async () => {
    if (!selectedRole) {
      setError("Please select a role first.");
      return;
    }

    setError("");

    if (selectedRole === "INSTRUCTOR") {
      setShowInstructorApplication(true);
      return;
    }

    try {
      await selectRoleMutation.mutateAsync({
        role: selectedRole as "STUDENT" | "INSTRUCTOR",
      });
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Error selecting role:", err);
      setError("Failed to select role. Please try again.");
    }
  };

  const hasSelectedRole =
    user?.hasSelectedRole || user?.academyUser?.hasSelectedRole;

  if (hasSelectedRole && !allowAdditionalRoles) {
    return null;
  }

  return (
    <>
      {showInstructorApplication ? (
        <TeacherApplicationModal
          onClose={() => setShowInstructorApplication(false)}
          onSuccess={() => {
            setShowInstructorApplication(false);
            if (onClose) onClose();
            navigate("/dashboard");
          }}
        />
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 z-20">
            <div className="absolute top-4 right-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Select Your Role
              </h2>
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
              {/* Student Role */}
              <div
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                  selectedRole === "STUDENT"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => handleRoleSelect("STUDENT")}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {selectedRole === "STUDENT" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Student
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Access courses, assignments, and learning materials
                  </p>
                </div>
              </div>

              {/* Instructor Role */}
              <div
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                  selectedRole === "INSTRUCTOR"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => handleRoleSelect("INSTRUCTOR")}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {selectedRole === "INSTRUCTOR" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Instructor
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Create and manage courses, grade assignments
                  </p>
                  {user?.roleStatus?.instructor === "pending" && (
                    <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Application Pending
                    </span>
                  )}
                  {user?.roleStatus?.instructor === "rejected" && (
                    <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Application Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="mt-6">
              <button
                onClick={handleSubmitRole}
                disabled={
                  !selectedRole || selectRoleMutation.isPending || authLoading
                }
                className={`w-full py-3 px-4 rounded-full font-medium text-white flex items-center justify-center shadow-lg transition ${
                  !selectedRole || selectRoleMutation.isPending || authLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {selectRoleMutation.isPending || authLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
      )}
    </>
  );
};

export default RoleSelectionModal;
