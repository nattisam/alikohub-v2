import { useNavigate } from "react-router-dom";
import {
  useUser,
  useSelectAcademyRole,
  useSwitchAcademyRole,
} from "@/hooks/useAuth";
import { toast } from "sonner";

export const useAccessLms = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const selectRoleMutation = useSelectAcademyRole();
  const switchRoleMutation = useSwitchAcademyRole();

  const accessLms = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Get current academy roles (standardize to lowercase)
      const academyRole = user.academyUser?.role?.toLowerCase();
      const activeRole = user.academyUser?.activeRole?.toLowerCase();
      const academyStatus = user.academyUser?.status?.toUpperCase();

      // As per request, we now default to the student dashboard as the primary landing spot
      // from the main website, even for users with instructor permissions.
      const targetRole: "student" | "instructor" = "student";

      // Step 1: Ensure the role is selected in the session
      if (academyRole !== targetRole) {
        await selectRoleMutation.mutateAsync({
          role: targetRole,
        });
      }

      // Step 2: Switch to the active role for pathing/permissions
      if (activeRole !== targetRole) {
        await switchRoleMutation.mutateAsync({
          newRole: targetRole,
        });
        toast.success(`Accessing LMS as ${targetRole}!`);
      } else {
        toast.success("Accessing LMS!");
      }

      // Navigate to the dashboard for the selected role (defaulting to student)
      navigate("/lms");
    } catch (error: any) {
      console.error("Failed to access LMS:", error);
      // Fallback: stay on current role's dashboard or go to student if unsure
      const currentActive = user.academyUser?.activeRole?.toLowerCase();
      navigate(currentActive === "instructor" ? "/instructor/lms" : "/lms");
    }
  };

  return {
    accessLms,
    isLoading: selectRoleMutation.isPending || switchRoleMutation.isPending,
  };
};
