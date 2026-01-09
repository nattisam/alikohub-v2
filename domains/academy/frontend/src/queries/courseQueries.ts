import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "../api/courseApi";
import type { Course } from "../components/types.d";

export const useCourse = (courseId: number) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await courseApi.getCourse(courseId);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,      // 5 minutes
    cacheTime: 10 * 60 * 1000,     // 10 minutes
    refetchOnWindowFocus: false,   // stop spam
    retry: 1,                      // don't hammer server
    enabled: !!courseId,
  });
};

// Preload course data to prevent multiple requests
export const prefetchCourse = async (queryClient: any, courseId: number) => {
  await queryClient.prefetchQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await courseApi.getCourse(courseId);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};