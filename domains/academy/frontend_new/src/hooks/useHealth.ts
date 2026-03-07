// src/hooks/useHealth.ts
import { useQuery } from "@tanstack/react-query";
import { healthService } from "@/services/healthService";

export const useHealthCourses = (params?: any) => {
  return useQuery({
    queryKey: ["health-courses", params],
    queryFn: async () => {
      const response = await healthService.getHealthCourses(params);
      return response.data;
    },
  });
};

export const useHealthCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["health-course", courseId],
    queryFn: async () => {
      const response = await healthService.getHealthCourseDetails(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};
