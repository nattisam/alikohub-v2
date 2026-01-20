import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/course-service";

export const useCourseModules = (courseId: number) => {
  return useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: async () => {
      const modulesRes = await courseService.getModules(courseId);

      // Fetch all lessons for all modules in parallel to reduce the number of requests
      const allLessonsPromises = modulesRes.map(async (module: { id: number; [key: string]: unknown }) => {
        try {
          const lessonsRes = await courseService.getLessons(module.id);
          return { moduleId: module.id, lessons: lessonsRes };
        } catch {
          return { moduleId: module.id, lessons: [] };
        }
      });
      
      const allLessonsResults = await Promise.all(allLessonsPromises);
      
      // Combine modules with their respective lessons
      const modulesWithLessons = modulesRes.map((module: { id: number; [key: string]: unknown }) => {
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