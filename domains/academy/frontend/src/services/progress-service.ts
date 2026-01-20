import { api } from '../lib/api';

// Define the progress tracking types
export interface CourseProgress {
  courseId: number;
  course: string;
  percentage: number;
  lastAccessed?: string;
  modulesCompleted?: number;
  totalModules?: number;
}

export interface OverallStats {
  conceptsViewed: number;
  lessonsViewed: number;
  quizzesCompleted: number;
  projectsPassed: number;
  programsCompleted: number;
}

export interface InstructorStats {
  yearsOfExperience: number;
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  // This type was empty in original file but these fields are inferred from api call below
}

// Detailed progress tracking types
export interface ProgressContent {
  contentId: number;
  contentTitle: string;
  contentType: string;
  status: string;
  score?: number;
}

export interface ProgressLesson {
  lessonId: number;
  lessonTitle: string;
  status: string;
  contents: ProgressContent[];
}

export interface ProgressModule {
  moduleId: number;
  moduleTitle: string;
  status: string;
  lessons: ProgressLesson[];
}

export interface StudentProgress {
  student: {
    id: string;
    name: string;
  };
  totalLessons: number;
  completed: number;
  percentage: number;
}

// Progress Tracking APIs
export const progressService = {
  // Get student dashboard data with progress information
  getStudentDashboard: async () => {
    const response = await api.get<CourseProgress[]>("/academy/progress/dashboard");
    return response.data;
  },

  // Get overall analytics data
  getOverallAnalytics: async () => {
    const response = await api.get<OverallStats>("/academy/progress/analytics/overall");
    return response.data;
  },

  // Get student stats for sidebar
  getStudentStats: async () => {
    const response = await api.get<OverallStats>("/academy/progress/analytics/student");
    return response.data;
  },

  // Get instructor statistics
  getInstructorStats: async () => {
    const response = await api.get<InstructorStats>("/academy/progress/instructor/stats");
    return response.data;
  },

  // Get course progress details
  getCourseProgress: async (courseId: number) => {
    const response = await api.get<CourseProgress>(`/academy/progress/course/${courseId}`);
    return response.data;
  },

  // Update progress for a specific lesson/content
  updateProgress: async (data: {
    courseId: number;
    moduleId?: number;
    lessonId?: number;
    progress: number;
  }) => {
    const response = await api.post("/academy/progress/update", data);
    return response.data;
  },

  // Get detailed student progress for a course
  getDetailedStudentProgress: async (courseId: number, studentId: string) => {
    const response = await api.get<ProgressModule[]>(
      `/academy/progress/course/${courseId}/user/${studentId}`
    );
    return response.data;
  },

  // Get all students progress for a course (instructor view)
  getCourseStudentsProgress: async (courseId: number) => {
    const response = await api.get<StudentProgress[]>(
      `/academy/progress/course/${courseId}/students`
    );
    return response.data;
  },

  // Update content progress
  updateContentProgress: async (
    courseId: number,
    moduleId: number,
    lessonId: number,
    contentId: number,
    status: string,
    score?: number
  ) => {
    const response = await api.post(
      `/academy/progress/course/${courseId}/module/${moduleId}/lesson/${lessonId}/content/${contentId}`,
      { status, score }
    );
    return response.data;
  }
};
