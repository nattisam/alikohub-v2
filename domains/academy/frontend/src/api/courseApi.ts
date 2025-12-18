import { academyApi } from "../api";
import { enrollmentApi } from "./enrollmentApi";

// Course APIs
export const courseApi = {
  // Courses
  getCourses: async (params?: any) => {
    try {
      const response = await academyApi.get("/courses", { params });
      console.log("Raw API Response:", response);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  getCourse: (id: number) => academyApi.get(`/courses/${id}`),
  createCourse: (data: any) => academyApi.post("/courses", data),
  updateCourse: (id: number, data: any) => academyApi.patch(`/courses/${id}`, data),
  deleteCourse: (id: number) => academyApi.delete(`/courses/${id}`),

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