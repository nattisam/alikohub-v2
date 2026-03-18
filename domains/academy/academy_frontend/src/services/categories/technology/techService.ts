import api from "@/lib/api";

export const techService = {
  // Fetch technology courses by category (Technology)
  getTechCourses: (params?: any) => {
    return api.get("/academy/courses/category/Technology", { params });
  },
  // Fetch details for a specific tech course by id or slug
  getTechCourseDetails: (courseId: string) => {
    return api.get(`/academy/courses/${courseId}`);
  },
};
