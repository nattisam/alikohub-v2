import { useQuery, type QueryClient } from "@tanstack/react-query";
import { courseService } from "../services/course-service";
import { courseKeys } from "./courseKeys";

/**
 * Hook to fetch course details by ID.
 */
export const useCourse = (courseId: number) => {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => courseService.getCourse(courseId),
    staleTime: 15 * 60 * 1000, // 15 minutes - longer cache
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
    refetchOnWindowFocus: false, // stop spam
    retry: 1, // don't hammer server
    enabled: !!courseId,
  });
};

/**
 * Preload course data to prevent multiple requests when navigating.
 */
export const prefetchCourse = async (
  queryClient: QueryClient,
  courseId: number,
) => {
  await queryClient.prefetchQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => courseService.getCourse(courseId),
    staleTime: 15 * 60 * 1000, // 15 minutes - longer cache
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
  });
};
