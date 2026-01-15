import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { academyApi } from "../api";
import type { Course } from "../components/types.d";

export const useInstructorCourses = (instructorId?: string) => {
  return useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: async () => {
      if (!instructorId) {
        return [];
      }
      
      const res = await academyApi.get("/academy/courses", {
        params: { instructorId }
      });
      return res.data.items ?? res.data;
    },
    enabled: !!instructorId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Course>) =>
      academyApi.post("/academy/courses", data),
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
      academyApi.patch(`/courses/${id}`, data),
    onSuccess: () => {
      // Invalidate all instructor courses to refresh the list
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) =>
      academyApi.delete(`/courses/${courseId}`),
    onSuccess: () => {
      // Invalidate all instructor courses to refresh the list
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
};