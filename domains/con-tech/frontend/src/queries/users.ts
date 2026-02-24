import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI, contechAPI } from "../services/api";
import type { User } from "../components/types";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await authAPI.getProfile();
      return response;
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_data: Partial<User>) => {
      throw new Error("Update profile not implemented in API");
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["userProfile"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      return contechAPI.createUser(data);
    },
    onSuccess: () => {
      // FIX: Invalidate the root "users" key to catch all sub-queries like ["users", "CONTRACTOR"]
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_data: Partial<User>) => {
      throw new Error("Create profile not implemented in API");
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(["userProfile"], newUser);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUsersByRole = (role: string) => {
  return useQuery({
    // Nested query key: ["users", "CONTRACTOR"]
    queryKey: ["users", role],
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false;
      return failureCount < 1;
    },
    queryFn: async () => {
      const response = await contechAPI.getUsersByRole(role, 1, 100);
      return response.items || [];
    },
  });
};
