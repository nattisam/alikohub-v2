import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  InstructorApplicationRequest,
  User,
} from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      authService.setSession(data.accessToken, data.refreshToken, data.user);
      queryClient.setQueryData(["user"], data.user);
      toast.success("Successfully logged in!");

      // If user is admin, redirect to /admin
      if (data.user.globalRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to login. Please check your credentials.";
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (data: AuthResponse) => {
      authService.setSession(data.accessToken, data.refreshToken, data.user);
      queryClient.setQueryData(["user"], data.user);
      toast.success("Successfully registered!");
      navigate("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    authService.logout();
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };
};

export const useUser = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { accessToken, user: localUser } = authService.getSession();
      if (!accessToken) return null;
      try {
        const remoteUser = await authService.getProfile();

        let mergedUser = { ...remoteUser };

        // Fetch academy status to complement profile data, similar to old frontend
        try {
          const academyStatus = await authService.getUserAcademyStatus(
            remoteUser.id.toString(),
          );
          mergedUser = { ...mergedUser, ...academyStatus };
        } catch (statusError) {
          console.error("Failed to fetch academy status:", statusError);
        }

        // Sync back to localStorage
        const refreshToken = localStorage.getItem("refreshToken") || "";
        authService.setSession(accessToken, refreshToken, mergedUser);
        return mergedUser;
      } catch (e) {
        console.error("Failed to fetch remote profile:", e);
        return localUser;
      }
    },
    staleTime: 30000, // Trust cache for 30s to prevent 429s on rapid navigation
    retry: 1,
  });
};

export const useSelectAcademyRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData: { role: "student" | "instructor" }) =>
      authService.selectAcademyRole(roleData),
    onSuccess: (data: any, variables: { role: "student" | "instructor" }) => {
      // 1. Adopt tokens immediately
      if (data.accessToken) {
        const currentRefresh =
          data.refreshToken || localStorage.getItem("refreshToken") || "";
        const existingUser = queryClient.getQueryData(["user"]) || {};
        authService.setSession(
          data.accessToken,
          currentRefresh,
          data.user || existingUser,
        );
      }

      // 2. Aggressively patch local cache to the target role
      // This is crucial because if the backend returns the old 'USER' role in its response,
      // it will block Step 2 (switch-role). We FORCE it to our selected target locally.
      queryClient.setQueryData(["user"], (old: any) => {
        const base = data.user || old || {};
        return {
          ...base,
          academyRole: variables.role.toUpperCase(), // Sync flat property
          academyUser: {
            ...(base.academyUser || {}),
            role: variables.role.toUpperCase(), // Sync nested object
          },
        };
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to select academy role";
      toast.error(message);
    },
  });
};

export const useSwitchAcademyRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData: { newRole: "student" | "instructor" }) =>
      authService.switchAcademyRole(roleData),
    onSuccess: (
      data: any,
      variables: { newRole: "student" | "instructor" },
    ) => {
      // Adopt new tokens if returned
      if (data.accessToken) {
        const currentRefresh =
          data.refreshToken || localStorage.getItem("refreshToken") || "";
        const existingUser = queryClient.getQueryData(["user"]) || {};
        authService.setSession(
          data.accessToken,
          currentRefresh,
          data.user || existingUser,
        );
      }

      // Update user data in cache
      queryClient.setQueryData(["user"], (old: any) => {
        const base = data.user || old || {};
        return {
          ...base,
          academyUser: {
            ...(base.academyUser || {}),
            activeRole: variables.newRole, // Manually ensure the active role reflects our switch
          },
        };
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to switch academy role";
      toast.error(message);
    },
  });
};

export const useApplyInstructor = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (applicationData: InstructorApplicationRequest) =>
      authService.applyInstructor(applicationData),
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      // Invalidate the user query to re-fetch and see the new status
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to submit application";
      toast.error(message);
    },
  });
};

export const useUploadResume = () => {
  return useMutation({
    mutationFn: (file: File) => authService.uploadResume(file),
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload resume";
      toast.error(message);
    },
  });
};
