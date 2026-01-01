import { academyApi } from "../api";
import { enrollmentApi } from "./enrollmentApi";
import axios from "axios";

const env = import.meta.env.MODE as "development" | "production" | "test";

const PORT = import.meta.env.VITE_API_PORT || 3006;

// Choose academy base URL depending on environment
const ACADEMY_BASE_URL =
  env === "development"
    ? `http://localhost:${PORT}` // your local dev server
    : "https://alikohub.com/api/academy"; // production server

// Create a public API instance that doesn't require authentication for published courses
const publicAcademyApi = axios.create({
  baseURL: ACADEMY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  // Ensure no credentials are sent
  withCredentials: false,
});

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
  getCourse: async (id: number) => {
    try {
      // Try public API first (for published courses)
      const response = await publicAcademyApi.get(`/academy/courses/${id}`);
      return response;
    } catch (error: any) {
      // If public access fails (401/403), try with authentication for private courses
      if (error.response?.status === 401 || error.response?.status === 403) {
        return academyApi.get(`/academy/courses/${id}`);
      }
      throw error;
    }
  },
  createCourse: (data: any) => academyApi.post("/academy/courses", data),
  updateCourse: (id: number, data: any) => academyApi.patch(`academy/courses/${id}`, data),
  deleteCourse: (id: number) => academyApi.delete(`/academy/courses/${id}`),

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