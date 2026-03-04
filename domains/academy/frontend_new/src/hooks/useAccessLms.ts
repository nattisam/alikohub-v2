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

      // Default to 'student'.
      let targetRole: "student" | "instructor" = "student";

      if (academyRole === "instructor" && academyStatus === "ACTIVE") {
        targetRole = "instructor";
      } else if (academyRole === "student") {
        targetRole = "student";
      }

      // Step 1: Select role if it's not already the current academy role
      if (academyRole !== targetRole) {
        await selectRoleMutation.mutateAsync({
          role: targetRole as "student" | "instructor",
        });
      }

      // Step 2: Switch to the target role if it's not already active
      if (activeRole !== targetRole) {
        await switchRoleMutation.mutateAsync({
          newRole: targetRole as "student" | "instructor",
        });
        toast.success(`Accessing LMS as ${targetRole}!`);
      } else {
        toast.success("Accessing LMS!");
      }

      // Navigate to LMS after role operations complete
      navigate("/lms");
    } catch (error: any) {
      console.error("Failed to access LMS:", error);
      // Still try to navigate even if role switch fails
      navigate("/lms");
    }
  };

  return {
    accessLms,
    isLoading: selectRoleMutation.isPending || switchRoleMutation.isPending,
  };
};
