import { useState } from "react";
import { useUser } from "../hooks";
import { useNavigate } from "react-router-dom";
type ConTechRole = "CLIENT" | "CONTRACTOR" | "PROJECT_MANAGER" | "ADMIN";

interface RoleSelectionModalProps {
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onClose }) => {
  const { selectRole } = useUser();
  const [selectedRole, setSelectedRole] = useState<ConTechRole | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshProfile } = useUser();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle role selection based on user's role

  const handleRoleSelect = async (role: ConTechRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await selectRole(selectedRole);
      // Refresh the profile to update user role information
      await refreshProfile();
      onClose();
      // Redirect to the appropriate dashboard based on selected role
      if (selectedRole === "CLIENT") {
        navigate("/client");
      } else if (selectedRole === "CONTRACTOR") {
        navigate("/contractor");
      } else if (selectedRole === "PROJECT_MANAGER" || selectedRole === "ADMIN") {
        navigate("/admin");
      } else {
        // For other roles, go to the default dashboard
        navigate("/");
      }
    } catch (err) {
      setError("Failed to select role. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="inset-0 bg-black bg-opacity-50 overflow-scroll mx-auto  z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Role</h2>
        <p className="text-gray-600 mb-6">
          Welcome! Please select your role in the ConTech platform to continue.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleRoleSelect("CLIENT")}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedRole === "CLIENT"
                ? "border-[#FFC107] bg-[#FFC107]/10"
                : "border-gray-200 hover:border-[#C2B58F]"
            }`}
          >
            <div className="font-medium text-gray-900">Client</div>
            <div className="text-sm text-gray-600">
              Manage projects, view reports, and communicate with contractors
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("CONTRACTOR")}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedRole === "CONTRACTOR"
                ? "border-[#FFC107] bg-[#FFC107]/10"
                : "border-gray-200 hover:border-[#C2B58F]"
            }`}
          >
            <div className="font-medium text-gray-900">Contractor</div>
            <div className="text-sm text-gray-600">
              Execute project tasks, submit reports, and manage work assignments
            </div>
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedRole}
            className="px-4 py-2 bg-[#FFC107] text-black font-medium rounded-md hover:bg-[#FFC107]/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;