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
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};