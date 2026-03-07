import api from "@/lib/api";
import {
  Course,
  Module,
  Lesson,
  Content,
  InstructorStats,
  TeacherApplication,
  Enrollment,
} from "@/types/academy";

export const academyService = {
  // Public Endpoints
  getCourses: async (params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    difficulty?: string;
    status?: string;
  }) => {
    const response = await api.get<{ courses: Course[]; total: number }>(
      "/academy/courses",
      { params },
    );
    // Backend returns { items, total, ... } but frontend expects { courses, total }
    return {
      courses: (response.data as any).items || response.data.courses,
      total: response.data.total,
    };
  },

  getCoursesByCategory: async (
    category: string,
    params?: { page?: number; pageSize?: number },
  ) => {
    const response = await api.get(`/academy/courses/category/${category}`, {
      params,
    });
    return {
      courses: response.data.items || response.data.courses || [],
      total: response.data.total || 0,
      page: response.data.page || 1,
      pageSize: response.data.pageSize || 10,
      totalPages: response.data.totalPages || 1,
    };
  },

  getCourseDetails: async (courseId: string) => {
    const response = await api.get<Course>(`/academy/courses/${courseId}`);
    return response.data;
  },

  // Student Endpoints
  enrollInCourse: async (courseId: string) => {
    const response = await api.post<Enrollment>("/academy/enrollment", {
      courseId,
    });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get<Enrollment[]>("/academy/enrollment/me");
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/academy/profile");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.post("/academy/profile", data);
    return response.data;
  },

  getCourseCurriculum: async (courseId: string) => {
    const response = await api.get<Module[]>(
      `/academy/modules/course/${courseId}`,
    );
    return response.data;
  },

  getLessonContent: async (lessonId: string) => {
    const response = await api.get<Content[]>(
      `/academy/content/lesson/${lessonId}`,
    );
    return response.data;
  },

  markLessonComplete: async (courseId: string, lessonId: string) => {
    const response = await api.post(
      `/academy/progress/course/${courseId}/lesson/${lessonId}/complete`,
    );
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get("/academy/notifications/me");
    return response.data;
  },

  markNotificationRead: async (notifId: string) => {
    const response = await api.patch(`/academy/notifications/${notifId}/read`);
    return response.data;
  },

  deleteNotification: async (notifId: string) => {
    const response = await api.delete(`/academy/notifications/${notifId}`);
    return response.data;
  },

  // Instructor Endpoints
  instructor: {
    getMyCourses: async (params?: {
      page?: number;
      pageSize?: number;
      status?: string;
    }) => {
      const response = await api.get<{ courses: Course[]; total: number }>(
        "/academy/courses/instructor/my",
        { params },
      );
      // Backend returns { items, total, ... } but frontend expects { courses, total }
      return {
        courses: (response.data as any).items || response.data.courses,
        total: response.data.total,
      };
    },

    getStats: async () => {
      const response = await api.get<InstructorStats>(
        "/academy/progress/instructor/stats",
      );
      return response.data;
    },

    createCourse: async (formData: FormData) => {
      const response = await api.post<Course>("/academy/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },

    updateCourse: async (courseId: string, formData: FormData) => {
      const response = await api.patch<Course>(
        `/academy/courses/${courseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },

    deleteCourse: async (courseId: string) => {
      const response = await api.delete(`/academy/courses/${courseId}`);
      return response.data;
    },

    submitCourseForApproval: async (courseId: string) => {
      const response = await api.post(`/academy/courses/${courseId}/submit`);
      return response.data;
    },

    // Modules
    createModule: async (data: {
      courseId: string;
      title: string;
      description?: string;
    }) => {
      const response = await api.post<Module>("/academy/modules", data);
      return response.data;
    },

    updateModule: async (
      moduleId: string,
      data: { title?: string; description?: string },
    ) => {
      const response = await api.put<Module>(
        `/academy/modules/${moduleId}`,
        data,
      );
      return response.data;
    },

    deleteModule: async (moduleId: string) => {
      const response = await api.delete(`/academy/modules/${moduleId}`);
      return response.data;
    },

    // Lessons
    createLesson: async (data: {
      moduleId: string;
      title: string;
      type: string;
    }) => {
      const response = await api.post<Lesson>("/academy/lessons", data);
      return response.data;
    },

    updateLesson: async (
      lessonId: string,
      data: { title?: string; type?: string },
    ) => {
      const response = await api.put<Lesson>(
        `/academy/lessons/${lessonId}`,
        data,
      );
      return response.data;
    },

    deleteLesson: async (lessonId: string) => {
      const response = await api.delete(`/academy/lessons/${lessonId}`);
      return response.data;
    },

    // Content
    uploadContent: async (formData: FormData) => {
      const response = await api.post<Content>(
        "/academy/content/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },

    deleteContent: async (contentId: string) => {
      const response = await api.delete(`/academy/content/${contentId}`);
      return response.data;
    },
  },

  // Admin Endpoints
  admin: {
    getAllApplications: async () => {
      const response = await api.get<TeacherApplication[]>(
        "/auth/academy/teacher-applications",
      );
      return response.data;
    },

    getAllCourses: async () => {
      const response = await api.get<Course[]>("/academy/courses/all");
      return response.data;
    },

    approveApplication: async (appId: string, reviewNotes: string) => {
      const response = await api.post(
        `/auth/academy/approve-teacher/${appId}`,
        { reviewNotes },
      );
      return response.data;
    },

    rejectApplication: async (appId: string, reviewNotes: string) => {
      const response = await api.post(`/auth/academy/reject-teacher/${appId}`, {
        reviewNotes,
      });
      return response.data;
    },

    getPendingCourses: async () => {
      const response = await api.get<Course[]>("/academy/courses/pending");
      return response.data;
    },

    approveCourse: async (courseId: string) => {
      const response = await api.post(`/academy/courses/${courseId}/approve`);
      return response.data;
    },

    rejectCourse: async (courseId: string, reason: string) => {
      const response = await api.post(`/academy/courses/${courseId}/reject`, {
        reason,
      });
      return response.data;
    },
  },
};
