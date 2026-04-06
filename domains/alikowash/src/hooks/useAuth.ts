import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
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
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Successfully logged in!");

      // Always redirect to /admin as this is an administrative app
      navigate("/admin");
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
    queryFn: async () => {
      const { accessToken } = authService.getSession();
      if (!accessToken) return null;

      try {
        const remoteUser = await authService.getProfile();
        // Sync back to localStorage
        const refreshToken = localStorage.getItem("refreshToken") || "";
        authService.setSession(accessToken, refreshToken, remoteUser);
        return remoteUser;
      } catch (e: any) {
        if (e.response?.status === 401) {
          authService.logout();
          return null;
        }
        console.error("Failed to fetch remote profile", e);
        throw e;
      }
    },
    placeholderData: () => {
      const { accessToken, user } = authService.getSession();
      return accessToken ? user || undefined : null;
    },
    staleTime: 5000,
    retry: false,
  });
};
