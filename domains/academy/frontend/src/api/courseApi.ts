import { academyApi } from "../api";
import { enrollmentApi } from "./enrollmentApi";



export interface CourseLesson {
  id: number;
  title: string;
  moduleId: number;
}


// Course APIs
export const courseApi = {
  // Public method to get published courses - requires authentication
  getPublishedCourses: async (params?: Record<string, unknown>) => {
    // Fetch only published courses - requires authentication
    const response = await academyApi.get("/academy/courses", { 
      params: { ...params, status: "PUBLISHED" } 
    });
      
    return response;
  },
  
  // Courses (authenticated)
  getCourses: async (params?: Record<string, unknown>) => {
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
  createCourse: (data: unknown) => academyApi.post("/academy/courses", data),
  updateCourse: (id: number, data: unknown) => academyApi.patch(`academy/courses/${id}`, data),
  deleteCourse: (id: number) => academyApi.delete(`/academy/courses/${id}`),

  // Modules
  getModules: (courseId: number) => academyApi.get(`/academy/modules/course/${courseId}`),
  getModule: (id: number) => academyApi.get(`/academy/modules/${id}`),
  createModule: (data: unknown) => academyApi.post("/academy/modules", data),
  updateModule: (id: number, data: unknown) => academyApi.put(`/academy/modules/${id}`, data),
  deleteModule: (id: number) => academyApi.delete(`/academy/modules/${id}`),

  // Cohorts
  getCohorts: (courseId: number) => academyApi.get(`/academy/cohorts`, { params: { courseId } }),
  getCohort: (id: number) => academyApi.get(`/academy/cohorts/${id}`),
  createCohort: (data: unknown) => academyApi.post("/academy/cohorts", data),
  updateCohort: (id: number, data: unknown) => academyApi.patch(`/academy/cohorts/${id}`, data),
  deleteCohort: (id: number) => academyApi.delete(`/academy/cohorts/${id}`),

  // Lessons
  getLessons: (moduleId: number) => academyApi.get(`/academy/lessons/module/${moduleId}`),
  getLesson: (id: number) => academyApi.get(`/academy/lessons/${id}`),
  createLesson: (data: unknown) => academyApi.post("/academy/lessons", data),
  updateLesson: (id: number, data: unknown) => academyApi.put(`/academy/lessons/${id}`, data),
  deleteLesson: (id: number) => academyApi.delete(`/academy/lessons/${id}`),

  // Content
  getContent: (lessonId: number) => academyApi.get(`/content/lesson/${lessonId}`),
  createContent: (data: unknown) => academyApi.post("/content", data),
  updateContent: (id: number, data: unknown) => academyApi.put(`/content/${id}`, data),
  deleteContent: (id: number) => academyApi.delete(`/content/${id}`),

  // Course Approval Workflow
  submitForApproval: (id: number) => academyApi.post(`/academy/courses/${id}/submit`),
  approveCourse: (id: number) => academyApi.post(`/academy/courses/${id}/approve`),
  rejectCourse: (id: number, reason: string) => academyApi.post(`/academy/courses/${id}/reject`, { reason }),
  updateCourseStatus: (id: number, status: string) => academyApi.patch(`/academy/courses/${id}/status`, { status }),
};

// Export enrollmentApi as well
export { enrollmentApi };