import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../api/courseApi";

export const useCourseModules = (courseId: number) => {
  return useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: async () => {
      const modulesRes = await courseApi.getModules(courseId);

      const modulesWithLessons = await Promise.all(
        modulesRes.data.map(async (module: any) => {
          try {
            const lessonsRes = await courseApi.getLessons(module.id);
            return { ...module, lessons: lessonsRes.data };
          } catch {
            return { ...module, lessons: [] };
          }
        })
      );

      return modulesWithLessons;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};