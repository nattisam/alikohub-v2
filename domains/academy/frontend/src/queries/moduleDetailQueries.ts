import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/course-service";
import { courseKeys } from "./courseKeys";

/**
 * Hook to fetch only modules for a course (without pre-fetching lessons).
 */
export const useCourseModulesOnly = (courseId: number) => {
  return useQuery({
    queryKey: [...courseKeys.modules(courseId), "only"],
    queryFn: () => courseService.getModules(courseId),
    enabled: !!courseId,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
