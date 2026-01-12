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

// Cache for storing recent responses to reduce API calls
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds cache duration

// Track ongoing requests to prevent duplicate calls
const ongoingRequests = new Map<string, Promise<any>>();


export interface CourseLesson {
  id: number;
  title: string;
  moduleId: number;
}


// Course APIs
export const courseApi = {
  // Public method to get published courses - requires authentication
  getPublishedCourses: async (params?: any) => {
    // Create a cache key based on the params to identify unique requests
    const cacheKey = `/academy/courses?${new URLSearchParams({ ...params, status: "PUBLISHED" }).toString()}`;
    const now = Date.now();
    
    // Check if we have a cached response that's still valid
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_DURATION) {
      console.log(`Returning cached response for ${cacheKey}`);
      return cachedResponse.data;
    }
    
    // Check if there's already an ongoing request for this cache key
    if (ongoingRequests.has(cacheKey)) {
      console.log(`Deduplicating request for ${cacheKey}`);
      return ongoingRequests.get(cacheKey);
    }
    
    const fetchWithRetry = async (maxRetries = 3, delay = 2000) => { // Increased delay to 2s
      let retries = 0;
      
      while (retries <= maxRetries) {
        try {
          // Fetch only published courses - requires authentication
          const response = await academyApi.get("/academy/courses", { 
            params: { ...params, status: "PUBLISHED" } 
          });
          
          // Cache the successful response
          responseCache.set(cacheKey, {
            data: response,
            timestamp: now
          });
          
          // Remove from ongoing requests
          ongoingRequests.delete(cacheKey);
          
          return response;
        } catch (error: any) {
          // Check if it's a 429 error (Too Many Requests)
          if (error.response?.status === 429 && retries < maxRetries) {
            console.warn(`Rate limited on ${cacheKey}, retrying in ${delay * Math.pow(2, retries)}ms...`);
            // Exponential backoff: wait longer after each retry
            await new Promise((resolve) =>
              setTimeout(resolve, delay * Math.pow(2, retries))
            );
            retries++;
          } else {
            // Remove from ongoing requests on error too
            ongoingRequests.delete(cacheKey);
            // For non-429 errors, don't cache the error response
            throw error; // Re-throw other errors or max retries reached
          }
        }
      }
    };
    
    // Store the promise to prevent duplicate requests
    const requestPromise = fetchWithRetry();
    ongoingRequests.set(cacheKey, requestPromise);
    
    try {
      return await requestPromise;
    } catch (error) {
      // Remove from ongoing requests if it fails
      ongoingRequests.delete(cacheKey);
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