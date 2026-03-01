import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService } from "../services/progress-service";
import { api } from "../lib/api";
import { progressKeys } from "./progressKeys";
import type { ITeachingSchedule } from "../components/common/types.d";

export const useInstructorStats = () => {
  return useQuery({
    queryKey: progressKeys.instructorStats(),
    queryFn: () => progressService.getInstructorStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTeachingSchedules = () => {
  return useQuery({
    queryKey: ["teaching-schedules"], // Keeping this for now as it's separate
    queryFn: async () => {
      try {
        const response = await api.get(
          "/academy/teaching-schedules/instructor",
        );
        return response.data;
      } catch (error: any) {
        // Return empty array if user doesn't have permission
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          return [];
        }
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
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
