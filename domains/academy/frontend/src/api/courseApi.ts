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


export interface CourseLesson {
  id: number;
  title: string;
  moduleId: number;
}


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
  getCourse: async (courseId: number) => {
    // Use authenticated API directly - backend handles authorization
    return academyApi.get(`/academy/courses/${courseId}`);
  },
  createCourse: (data: any) => academyApi.post("/academy/courses", data),
  updateCourse: (id: number, data: any) => academyApi.patch(`academy/courses/${id}`, data),
  deleteCourse: (id: number) => academyApi.delete(`/academy/courses/${id}`),

  // Modules
  getModules: (courseId: number) => academyApi.get(`/academy/modules/course/${courseId}`),
  getModule: (id: number) => academyApi.get(`/academy/modules/${id}`),
  createModule: (data: any) => academyApi.post("/academy/modules", data),
  updateModule: (id: number, data: any) => academyApi.put(`/academy/modules/${id}`, data),
  deleteModule: (id: number) => academyApi.delete(`/academy/modules/${id}`),

  // Cohorts
  getCohorts: (courseId: number) => academyApi.get(`/academy/cohorts`, { params: { courseId } }),
  getCohort: (id: number) => academyApi.get(`/academy/cohorts/${id}`),
  createCohort: (data: any) => academyApi.post("/academy/cohorts", data),
  updateCohort: (id: number, data: any) => academyApi.patch(`/academy/cohorts/${id}`, data),
  deleteCohort: (id: number) => academyApi.delete(`/academy/cohorts/${id}`),

  // Lessons
  getLessons: (moduleId: number) => academyApi.get(`/academy/lessons/module/${moduleId}`),
  getLesson: (id: number) => academyApi.get(`/academy/lessons/${id}`),
  createLesson: (data: any) => academyApi.post("/academy/lessons", data),
  updateLesson: (id: number, data: any) => academyApi.put(`/academy/lessons/${id}`, data),
  deleteLesson: (id: number) => academyApi.delete(`/academy/lessons/${id}`),

  // Content
  getContent: (lessonId: number) => academyApi.get(`/content/lesson/${lessonId}`),
  createContent: (data: any) => academyApi.post("/content", data),
  updateContent: (id: number, data: any) => academyApi.put(`/content/${id}`, data),
  deleteContent: (id: number) => academyApi.delete(`/content/${id}`),
};

// Export enrollmentApi as well
export { enrollmentApi };