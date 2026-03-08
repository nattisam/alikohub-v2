import { useQuery } from "@tanstack/react-query";
import { techService } from "@/services/categories/technology/techService";

export const useTechCourses = (params?: any) => {
  return useQuery({
    queryKey: ["tech-courses", params],
    queryFn: async () => {
      const response = await techService.getTechCourses(params);
      return response.data;
    },
  });
};

export const useTechCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["tech-course", courseId],
    queryFn: async () => {
      const response = await techService.getTechCourseDetails(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};
