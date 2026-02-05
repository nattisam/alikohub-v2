import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/course-service";
import type { Course } from "../services/course-service";

export const useInstructorCourses = (instructorId?: string) => {
  return useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: async () => {
      if (!instructorId) {
        return [];
      }

      const res = await courseService.getCourses({ instructorId });
      const coursesData = (res as any).items || res;
      return Array.isArray(coursesData) ? coursesData : [];
    },
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 429 - let axios handle it
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Course>) => courseService.createCourse(data),
    onSuccess: () => {
      // Invalidate all instructor courses to refresh the list
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) =>
      courseService.updateCourse(id, data),
    onSuccess: () => {
      // Invalidate all instructor courses to refresh the list
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      // Invalidate all instructor courses to refresh the list
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
};
