// src/services/healthService.ts
import api from "@/lib/api";

export const healthService = {
  // Fetch health courses by category (Health)
  getHealthCourses: (params?: any) => {
    return api.get("/academy/courses/category/Health", { params });
  },
  // Fetch details for a specific health course by id or slug
  getHealthCourseDetails: (courseId: string) => {
    return api.get(`/academy/courses/${courseId}`);
  },
};
