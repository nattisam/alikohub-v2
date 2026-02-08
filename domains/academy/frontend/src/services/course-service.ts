import { api } from "../lib/api";
import type {
  Course,
  CourseModule,
  CourseLesson,
  Cohort,
  LessonContent,
} from "../components/common/types.d";
export type { Course, CourseModule, CourseLesson, Cohort, LessonContent };

export interface Instructor {
  id: number;
  firebaseId: string;
  firstname: string;
  lastname?: string;
  email: string;
  globalRole: "USER" | "ADMIN";
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  profilePicture?: string | null;
  bio?: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  title?: string;
  certifications?: string[];
}

export interface BaseCourse {
  id: number;
  title: string;
  longDescription: string;
  shortDescription: string;
  thumbnail?: string;
  category: "Technology" | "STEM" | "Health" | string;
  subCategory?: string;
  instructorId?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING_APPROVAL" | "REJECTED";
  skills?: string[];
  conceptsLearned?: string[];
  estimatedTime?: number | null;
  targetLevel?: string | null;
  enrolledNum?: number | null;
  rating?: number | null;
  price?: number | null;
  progress?: number | null;
  prerequisites?: string[];
  languages?: string[];
  createdAt?: string;
  updatedAt?: string;
  instructor?: Instructor;
  createDefaultCohort?: boolean;
  difficulty?: string; // Kept for backward compatibility if needed, though not in types.d.tsx
  duration?: number; // Kept for backward compatibility
}

export interface BaseCourseLesson {
  id: number;
  title: string;
  moduleId: number;
}

export const courseService = {
  // Public method to get published courses - requires authentication
  getPublishedCourses: async (
    params?: Record<string, unknown>,
  ): Promise<Course[]> => {
    // Fetch only published courses - requires authentication
    const response = await api.get("/academy/courses", {
      params: { ...params, status: "PUBLISHED" },
    });

    return response.data?.items || response.data || [];
  },

  // Courses (authenticated)
  getCourses: async (params?: Record<string, unknown>): Promise<Course[]> => {
    try {
      // All course endpoints require authentication in the backend
      // Use the authenticated API for all requests
      const response = await api.get("/academy/courses", { params });
      return response.data?.items || response.data || [];
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  getCourse: async (courseId: number): Promise<Course> => {
    const response = await api.get(`/academy/courses/${courseId}`);
    return response.data;
  },
  createCourse: async (data: unknown): Promise<Course> => {
    const response = await api.post("/academy/courses", data);
    return response.data;
  },
  updateCourse: async (id: number, data: unknown): Promise<Course> => {
    const response = await api.patch(`academy/courses/${id}`, data);
    return response.data;
  },
  deleteCourse: async (id: number): Promise<void> => {
    await api.delete(`/academy/courses/${id}`);
  },

  // Modules
  getModules: async (courseId: number): Promise<CourseModule[]> => {
    const response = await api.get(`/academy/modules/course/${courseId}`);
    return response.data?.items || response.data || [];
  },
  getModule: async (id: number): Promise<CourseModule> => {
    const response = await api.get(`/academy/modules/${id}`);
    return response.data;
  },
  createModule: async (data: unknown): Promise<CourseModule> => {
    const response = await api.post("/academy/modules", data);
    return response.data;
  },
  updateModule: async (id: number, data: unknown): Promise<CourseModule> => {
    const response = await api.put(`/academy/modules/${id}`, data);
    return response.data;
  },
  deleteModule: async (id: number): Promise<void> => {
    await api.delete(`/academy/modules/${id}`);
  },

  // Cohorts
  getCohorts: async (courseId: number): Promise<Cohort[]> => {
    const response = await api.get(`/academy/cohorts`, {
      params: { courseId },
    });
    return response.data;
  },
  getCohort: async (id: number): Promise<Cohort> => {
    const response = await api.get(`/academy/cohorts/${id}`);
    return response.data;
  },
  createCohort: async (data: unknown): Promise<Cohort> => {
    const response = await api.post("/academy/cohorts", data);
    return response.data;
  },
  updateCohort: async (id: number, data: unknown): Promise<Cohort> => {
    const response = await api.patch(`/academy/cohorts/${id}`, data);
    return response.data;
  },
  deleteCohort: async (id: number): Promise<void> => {
    await api.delete(`/academy/cohorts/${id}`);
  },

  // Lessons
  getLessons: async (moduleId: number): Promise<CourseLesson[]> => {
    const response = await api.get(`/academy/lessons/module/${moduleId}`);
    return response.data?.items || response.data || [];
  },
  getLesson: async (id: number): Promise<CourseLesson> => {
    const response = await api.get(`/academy/lessons/${id}`);
    return response.data;
  },
  createLesson: async (data: unknown): Promise<CourseLesson> => {
    const response = await api.post("/academy/lessons", data);
    return response.data;
  },
  updateLesson: async (id: number, data: unknown): Promise<CourseLesson> => {
    const response = await api.put(`/academy/lessons/${id}`, data);
    return response.data;
  },
  deleteLesson: async (id: number): Promise<void> => {
    await api.delete(`/academy/lessons/${id}`);
  },

  // Content
  getContent: async (lessonId: number): Promise<LessonContent[]> => {
    const response = await api.get(`/academy/content/lesson/${lessonId}`);
    return response.data?.items || response.data || [];
  },
  createContent: async (data: unknown): Promise<LessonContent> => {
    const response = await api.post("/academy/content", data);
    return response.data;
  },
  updateContent: async (id: number, data: unknown): Promise<LessonContent> => {
    const response = await api.patch(`/academy/content/${id}`, data);
    return response.data;
  },
  deleteContent: async (id: number): Promise<void> => {
    await api.delete(`/academy/content/${id}`);
  },

  // Course Approval Workflow
  submitForApproval: async (id: number) => {
    const response = await api.post(`/academy/courses/${id}/submit`);
    return response.data;
  },
  approveCourse: async (id: number) => {
    const response = await api.post(`/academy/courses/${id}/approve`);
    return response.data;
  },
  rejectCourse: async (id: number, reason: string) => {
    const response = await api.post(`/academy/courses/${id}/reject`, {
      reason,
    });
    return response.data;
  },
  updateCourseStatus: async (id: number, status: string) => {
    const response = await api.patch(`/academy/courses/${id}/status`, {
      status,
    });
    return response.data;
  },
};
