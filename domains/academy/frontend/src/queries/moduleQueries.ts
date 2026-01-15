import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../api/courseApi";

export const useCourseModules = (courseId: number) => {
  return useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: async () => {
      const modulesRes = await courseApi.getModules(courseId);

      // Fetch all lessons for all modules in parallel to reduce the number of requests
      const allLessonsPromises = modulesRes.data.map(async (module: any) => {
        try {
          const lessonsRes = await courseApi.getLessons(module.id);
          return { moduleId: module.id, lessons: lessonsRes.data };
        } catch {
          return { moduleId: module.id, lessons: [] };
        }
      });
      
      const allLessonsResults = await Promise.all(allLessonsPromises);
      
      // Combine modules with their respective lessons
      const modulesWithLessons = modulesRes.data.map((module: any) => {
        const lessonData = allLessonsResults.find(result => result.moduleId === module.id);
        return { ...module, lessons: lessonData?.lessons || [] };
      });

      return modulesWithLessons;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // Updated from deprecated cacheTime
    refetchOnWindowFocus: false,
    retry: 1,
  });
};