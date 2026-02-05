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
    mutationFn: (data: Partial<User>) => {
      // Update profile functionality would need to be added to the API
      throw new Error("Update profile not implemented in API");
      // return authAPI.updateProfile(data);
    },
    onSuccess: (updatedUser) => {
      // Update the user profile in the cache
      queryClient.setQueryData(["userProfile"], updatedUser);
      // Invalidate other related queries if needed
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => {
      // Create profile functionality would need to be added to the API
      throw new Error("Create profile not implemented in API");
    },
    onSuccess: (newUser) => {
      // Update the user profile in the cache
      queryClient.setQueryData(["userProfile"], newUser);
      // Invalidate other related queries if needed
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUsersByRole = (role: string) => {
  return useQuery({
    queryKey: ["users", role],
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: Error | unknown) => {
      // Don't retry on 429 - let axios handle it
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 429) {
        return false;
      }
      return failureCount < 1;
    },
    queryFn: async () => {
      const response = await contechAPI.getUsersByRole(role, 1, 100);
      return response.items || [];
    },
  });
};
