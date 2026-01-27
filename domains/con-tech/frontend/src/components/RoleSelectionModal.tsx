import { useState } from "react";
import { Shield, Building2, HardHat, Loader2 } from "lucide-react";
import { useUser } from "../hooks";
import { useNavigate } from "react-router-dom";
import contechBg from "../assets/bg1.png";

type ConTechRole = "CLIENT" | "CONTRACTOR" | "ADMIN";

interface RoleSelectionModalProps {
  onClose: () => void;
}

const roles = [
  {
    id: "ADMIN" as ConTechRole,
    label: "System Admin",
    description: "Complete system oversight & management",
    icon: Shield,
    color: "blue",
  },
  {
    id: "CLIENT" as ConTechRole,
    label: "Project Client",
    description: "Transparent oversight & progress monitoring",
    icon: Building2,
    color: "emerald",
  },
  {
    id: "CONTRACTOR" as ConTechRole,
    label: "Lead Contractor",
    description: "Operational execution & milestone reporting",
    icon: HardHat,
    color: "amber",
  },
];

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onClose }) => {
  const { selectRole, refreshProfile } = useUser();
  const [selectedRole, setSelectedRole] = useState<ConTechRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role: ConTechRole) => {
    setSelectedRole(role);
    setError(null);
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
      await refreshProfile();
      onClose();
      if (selectedRole === "CLIENT") {
        navigate("/client");
      } else if (selectedRole === "CONTRACTOR") {
        navigate("/contractor");
      } else if (selectedRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Failed to select role. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getButtonStyles = (roleId: ConTechRole, color: string, isSelected: boolean) => {
    const base = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group";
    if (isSelected) {
      if (color === "blue") return `${base} border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10`;
      if (color === "emerald") return `${base} border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10`;
      if (color === "amber") return `${base} border-amber-500 bg-amber-50 shadow-lg shadow-amber-500/10`;
    }
    return `${base} border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white`;
  };

  const getIconStyles = (color: string, isSelected: boolean) => {
    const base = "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300";
    if (isSelected) {
      if (color === "blue") return `${base} bg-blue-500 text-white`;
      if (color === "emerald") return `${base} bg-emerald-500 text-white`;
      if (color === "amber") return `${base} bg-amber-500 text-white`;
    }
    return `${base} bg-slate-100 text-slate-400 group-hover:text-slate-600`;
  };

  const getIndicatorStyles = (color: string, isSelected: boolean) => {
    const base = "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200";
    if (isSelected) {
      if (color === "blue") return `${base} border-blue-500 bg-blue-500`;
      if (color === "emerald") return `${base} border-emerald-500 bg-emerald-500`;
      if (color === "amber") return `${base} border-amber-500 bg-amber-500`;
    }
    return `${base} border-slate-300`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${contechBg})` }}
      >
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" />
      </div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-white/50 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-1 bg-blue-500 rounded-full" />
              <div className="w-2 h-1 bg-blue-500/50 rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Select Your Role
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Define your operational scope within the Aliko ConTech platform
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-3 mb-8">
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;
              const Icon = role.icon;

              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={getButtonStyles(role.id, role.color, isSelected)}
                >
                  <div className={getIconStyles(role.color, isSelected)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900">
                      {role.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {role.description}
                    </div>
                  </div>
                  {/* Selection indicator */}
                  <div className={getIndicatorStyles(role.color, isSelected)}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3.5 px-4 text-slate-500 hover:text-slate-700 font-medium text-sm rounded-xl transition-colors border border-slate-200 hover:border-slate-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedRole}
              className="flex-[2] py-3.5 px-4 bg-slate-900 text-white font-medium rounded-xl text-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming...</span>
                </>
              ) : (
                "Confirm Selection"
              )}
            </button>
          </div>
        </div>

        {/* Subtle branding */}
        <p className="text-center text-white/60 text-xs mt-4 font-medium">
          Aliko ConTech Platform
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
