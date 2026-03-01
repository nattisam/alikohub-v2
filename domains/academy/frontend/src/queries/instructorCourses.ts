import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/course-service";
import type { Course } from "../services/course-service";
import { courseKeys } from "./courseKeys";

export const useInstructorCourses = (instructorId?: string) => {
  return useQuery({
    queryKey: courseKeys.instructor(instructorId || ""),
    queryFn: () => {
      if (!instructorId) return Promise.resolve([]);
      return courseService.getCourses({ instructorId });
    },
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Course>) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) =>
      courseService.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
};
