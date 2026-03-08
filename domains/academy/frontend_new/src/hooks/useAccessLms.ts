import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUser,
  useSelectAcademyRole,
  useSwitchAcademyRole,
} from "@/hooks/useAuth";
import { toast } from "sonner";

export const useAccessLms = () => {
  const queryClient = useQueryClient();
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
      // Strictly target 'student' role for this flow
      const targetRole = "student" as const;

      // Get latest state directly from cache to avoid stale closure variables
      const currentUser = queryClient.getQueryData(["user"]) as any;
      const academyUser = currentUser?.academyUser;
      const currentRole = (academyUser?.role || "USER").toUpperCase();
      const currentActive = (academyUser?.activeRole || "USER").toUpperCase();

      console.log(
        `[LMS Access] Initial State - Role: ${currentRole}, Active: ${currentActive}`,
      );

      // Step 1: Promote to 'STUDENT' if current role is 'USER' or missing
      if (currentRole === "USER" || !academyUser) {
        console.log(
          `[LMS Access] Triggering Step 1: POST /auth/academy/select-role with payload: { role: "student" }`,
        );

        await selectRoleMutation.mutateAsync({
          role: "student",
        });

        console.log(
          `[LMS Access] Step 1 Success. Refreshing local permission state...`,
        );

        // MANUALLY OVERRIDE cached user to STUDENT regardless of what Step 1 response said
        // to ensure Step 2 logic has the correct local 'identity' to proceed.
        queryClient.setQueryData(["user"], (old: any) => ({
          ...old,
          academyRole: "STUDENT",
          academyUser: {
            ...(old?.academyUser || {}),
            role: "STUDENT",
          },
        }));

        const freshUser = queryClient.getQueryData(["user"]) as any;
        const confirmedRole = (
          freshUser?.academyUser?.role || ""
        ).toUpperCase();

        console.log(
          `[LMS Access] Local Role State Check (Forced): ${confirmedRole}`,
        );

        if (confirmedRole !== targetRole.toUpperCase()) {
          console.warn(
            `[LMS Access] Warning: Base role check failed. Forcing Student state in next step.`,
          );
        }
      } else {
        console.log(
          `[LMS Access] Skipping Step 1: User already has role '${currentRole}'`,
        );
      }

      // Re-verify ACTIVE role from the LATEST cache state
      const latestUser = queryClient.getQueryData(["user"]) as any;
      const latestActive = (
        latestUser?.academyUser?.activeRole || "USER"
      ).toUpperCase();

      if (latestActive !== "STUDENT") {
        console.log(
          `[LMS Access] Step 2: POST /auth/academy/switch-role with payload: { newRole: "student" }`,
        );
        await switchRoleMutation.mutateAsync({ newRole: "student" });
        console.log("[LMS Access] Step 2 Success. Role active.");
        toast.success(`Accessing LMS as ${targetRole}!`);
      } else {
        console.log("[LMS Access] Already active as student. Skipping Step 2.");
        toast.success("Accessing LMS!");
      }

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
