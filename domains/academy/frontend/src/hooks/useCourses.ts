import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/course-service";
import { courseKeys } from "../queries/courseKeys";
import { COURSE_CATEGORIES, DEFAULT_CATEGORIES } from "../constants/course";

/**
 * Hook to fetch all published courses.
 * Uses the select option to move transformation logic out of the hook.
 */
export const useCourses = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: courseKeys.lists(),
    queryFn: async () => {
      const response = await courseService.getPublishedCourses();
      return Array.isArray(response) ? response : [];
    },
    select: (courses) => {
      // Extract unique valid categories from courses
      const uniqueCategories = Array.from(
        new Set(
          courses
            .map((course: any) => course.category)
            .filter(
              (category): category is string =>
                typeof category === "string" &&
                category.length > 0 &&
                (COURSE_CATEGORIES as unknown as string[]).includes(category),
            ),
        ),
      );

      return {
        courses,
        categories:
          uniqueCategories.length > 0 ? uniqueCategories : DEFAULT_CATEGORIES,
        // Helper function for filtering
        filterCoursesByCategory: (targetCategory: string) => {
          return courses.filter((course: any) => {
            if (
              !course.category ||
              !(COURSE_CATEGORIES as unknown as string[]).includes(
                course.category,
              )
            )
              return false;
            return (
              course.category.toLowerCase() === targetCategory.toLowerCase()
            );
          });
        },
      };
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 45 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    courses: data?.courses || [],
    categories: data?.categories || DEFAULT_CATEGORIES,
    loading: isLoading,
    error: isError ? (error as any)?.message || "Failed to load courses" : null,
    filterCoursesByCategory: data?.filterCoursesByCategory || (() => []),
  };
};
