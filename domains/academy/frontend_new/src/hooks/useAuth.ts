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
  return useQuery({
    queryKey: ["user"],
    queryFn: () => authService.getSession().user,
    staleTime: Infinity,
  });
};

export const useSelectAcademyRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData: { role: "student" | "instructor" }) =>
      authService.selectAcademyRole(roleData),
    onSuccess: (data) => {
      // Update user data in cache
      const currentUser = queryClient.getQueryData<User>(["user"]);
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          academyUser: currentUser.academyUser
            ? {
                ...currentUser.academyUser,
                role:
                  data.user?.academyUser?.role || currentUser.academyUser?.role,
              }
            : null,
        };
        queryClient.setQueryData(["user"], updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
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
    onSuccess: (data) => {
      // Update user data in cache
      const currentUser = queryClient.getQueryData<User>(["user"]);
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          academyActiveRole:
            data.user?.academyActiveRole || currentUser.academyActiveRole,
          academyUser: currentUser.academyUser
            ? {
                ...currentUser.academyUser,
                activeRole:
                  data.user?.academyUser?.activeRole ||
                  currentUser.academyUser?.activeRole,
              }
            : null,
        };
        queryClient.setQueryData(["user"], updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to switch academy role";
      toast.error(message);
    },
  });
};

export const useApplyInstructor = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (applicationData: InstructorApplicationRequest) =>
      authService.applyInstructor(applicationData),
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      navigate("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to submit application";
      toast.error(message);
    },
  });
};
