import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "../services/course-service";
import { courseService } from "../services/course-service";

export const useCourses = () => {
  // Use React Query with the same queryKey as useAllCourses to share cache
  const { data: courses = [], isLoading, isError, error: queryError } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const response = await courseService.getPublishedCourses();
      const coursesData = response.items || response;
      return Array.isArray(coursesData) ? coursesData : [];
    },
    staleTime: 30 * 60 * 1000,     // 30 minutes - cache longer to reduce API calls
    gcTime: 45 * 60 * 1000,        // 45 minutes - keep in cache longer
    refetchOnWindowFocus: false,   // prevent refetch on window focus
    refetchOnReconnect: false,     // prevent refetch on reconnect
    retry: (failureCount, error: any) => {
      // Don't retry on 429 - let axios handle it to prevent cascading retries
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 1;
    },
  });

  // Extract categories from courses using useMemo for performance
  const categories = useMemo(() => {
    const validCategories = ['Technology', 'STEM', 'Health'];
    const uniqueCategories = Array.from(
      new Set(
        courses
          .map(course => course.category)
          .filter((category): category is string => 
            typeof category === 'string' && 
            category.length > 0 && 
            validCategories.includes(category)
          )
      )
    );
    
    // Fallback to default categories if no valid categories found
    return uniqueCategories.length > 0 ? uniqueCategories : ["Technology", "STEM", "Health"];
  }, [courses]);

  // Format error message
  const error = useMemo(() => {
    if (!isError) return null;
    
    const status = (queryError as any)?.response?.status;
    if (status === 401) {
      return "Please log in to view courses.";
    } else if (status === 429) {
      return "Too many requests. Please try again in a moment.";
    }
    return "Failed to load courses. Please try again later.";
  }, [isError, queryError]);

  const filterCoursesByCategory = (targetCategory: string) => {
    // Only include courses with valid categories
    const validCategories = ['Technology', 'STEM', 'Health'];
    return courses.filter((course) => {
      if (!course.category || !validCategories.includes(course.category)) return false;
      return course.category.toLowerCase() === targetCategory.toLowerCase();
    });
  };

  return { 
    courses, 
    categories, 
    loading: isLoading, 
    error, 
    filterCoursesByCategory 
  };
};