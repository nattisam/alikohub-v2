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
  });
};

export const useTeachingSchedules = () => {
  return useQuery({
    queryKey: ["teaching-schedules"],
    queryFn: async () => {
      try {
        const response = await api.get("/academy/teaching-schedules/instructor");
        return response.data;
      } catch (error) {
        // Return empty array if user doesn't have permission
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          return [];
        }
        // Re-throw other errors
        throw error;
      }
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