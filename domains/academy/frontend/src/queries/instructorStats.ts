import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService } from "../services/progress-service";
import { api } from "../lib/api";
import type { ITeachingSchedule } from "../components/common/types.d";

export const useInstructorStats = () => {
  return useQuery({
    queryKey: ["instructor-stats"],
    queryFn: async () => {
      const res = await progressService.getInstructorStats();
      return res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false;
      return failureCount < 2;
    },
  });
};

export const useTeachingSchedules = () => {
  return useQuery({
    queryKey: ["teaching-schedules"],
    queryFn: async () => {
      try {
        const response = await api.get(
          "/academy/teaching-schedules/instructor",
        );
        return response.data;
      } catch (error: unknown) {
        // Return empty array if user doesn't have permission
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          ((error as any).response?.status === 403 ||
            (error as any).response?.status === 401)
        ) {
          return [];
        }
        // Re-throw other errors
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false;
      return failureCount < 1;
    },
  });
};

export const useAddTeachingSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teachingSchedule: ITeachingSchedule) =>
      Promise.resolve(teachingSchedule), // This would be an actual API call in a real implementation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teaching-schedules"] });
    },
  });
};
