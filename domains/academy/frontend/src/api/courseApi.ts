import { academyApi } from "../api";
import { enrollmentApi } from "./enrollmentApi";
import axios from "axios";

// Since backend requires auth for all course endpoints, we'll use the regular academyApi
const publicAcademyApi = academyApi;

// Course APIs
export const courseApi = {
  // Public method to get published courses - requires authentication
  getPublishedCourses: async (params?: any) => {
    try {
      // Fetch only published courses - requires authentication
      const response = await academyApi.get("/academy/courses", { 
        params: { ...params, status: "PUBLISHED" } 
      });
      return response;
    } catch (error) {
      console.error("API Error fetching published courses:", error);
      throw error;
    }
  },
  
  // Courses (authenticated)
  getCourses: async (params?: any) => {
    try {
      // All course endpoints require authentication in the backend
      // Use the authenticated API for all requests
      const response = await academyApi.get("/academy/courses", { params });
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  getCourse: (id: number) => academyApi.get(`academy/courses/${id}`),
  createCourse: (data: any) => academyApi.post("academy/courses", data),
  updateCourse: (id: number, data: any) => academyApi.patch(`academy/courses/${id}`, data),
  deleteCourse: (id: number) => academyApi.delete(`academy/courses/${id}`),

  // Modules
  getModules: (courseId: number) => academyApi.get(`/modules/course/${courseId}`),
  getModule: (id: number) => academyApi.get(`/modules/${id}`),
  createModule: (data: any) => academyApi.post("/modules", data),
  updateModule: (id: number, data: any) => academyApi.put(`/modules/${id}`, data),
  deleteModule: (id: number) => academyApi.delete(`/modules/${id}`),

  // Cohorts
  getCohorts: (courseId: number) => academyApi.get(`/cohorts`, { params: { courseId } }),
  getCohort: (id: number) => academyApi.get(`/cohorts/${id}`),
  createCohort: (data: any) => academyApi.post("/cohorts", data),
  updateCohort: (id: number, data: any) => academyApi.patch(`/cohorts/${id}`, data),
  deleteCohort: (id: number) => academyApi.delete(`/cohorts/${id}`),

  // Lessons
  getLessons: (moduleId: number) => academyApi.get(`/lessons/module/${moduleId}`),
  getLesson: (id: number) => academyApi.get(`/lessons/${id}`),
  createLesson: (data: any) => academyApi.post("/lessons", data),
  updateLesson: (id: number, data: any) => academyApi.put(`/lessons/${id}`, data),
  deleteLesson: (id: number) => academyApi.delete(`/lessons/${id}`),

  // Content
  getContent: (lessonId: number) => academyApi.get(`/content/lesson/${lessonId}`),
  createContent: (data: any) => academyApi.post("/content", data),
  updateContent: (id: number, data: any) => academyApi.put(`/content/${id}`, data),
  deleteContent: (id: number) => academyApi.delete(`/content/${id}`),
};

// Export enrollmentApi as well
export { enrollmentApi };