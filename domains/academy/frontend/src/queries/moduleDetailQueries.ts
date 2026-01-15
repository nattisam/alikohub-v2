import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../api/courseApi";

export const useCourseModulesOnly = (courseId: number) => {
  return useQuery({
    queryKey: ["course-modules-only", courseId],
    queryFn: async () => {
      const modulesRes = await courseApi.getModules(courseId);
      return modulesRes.data;
    },
    enabled: !!courseId,
    staleTime: 15 * 60 * 1000,     // 15 minutes - longer cache
    gcTime: 30 * 60 * 1000,        // 30 minutes - keep in cache longer
    refetchOnWindowFocus: false,
    retry: 1,
  });
};