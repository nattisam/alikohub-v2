import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/course-service";
import type { CourseModule } from "../components/common/types.d";
import { courseKeys } from "./courseKeys";

/**
 * Hook to fetch all modules for a course, including their lessons.
 */
export const useCourseModules = (courseId: number) => {
  return useQuery<CourseModule[]>({
    queryKey: courseKeys.modules(courseId),
    queryFn: async () => {
      const modulesRes = await courseService.getModules(courseId);

      // Fetch all lessons for all modules in parallel to reduce the number of requests
      const allLessonsResults = await Promise.all(
        modulesRes.map(async (module: CourseModule) => {
          try {
            const lessonsRes = await courseService.getLessons(module.id);
            return { moduleId: module.id, lessons: lessonsRes };
          } catch {
            return { moduleId: module.id, lessons: [] };
          }
        }),
      );

      // Combine modules with their respective lessons
      return modulesRes.map((module: CourseModule) => {
        const lessonData = allLessonsResults.find(
          (result) => result.moduleId === module.id,
        );
        return {
          ...module,
          lessons: lessonData?.lessons || [],
        } as CourseModule;
      });
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
