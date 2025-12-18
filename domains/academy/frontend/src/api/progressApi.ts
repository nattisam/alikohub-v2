import { academyApi } from "../api";

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
export const progressApi = {
  // Get student dashboard data with progress information
  getStudentDashboard: () => academyApi.get<CourseProgress[]>("/progress/dashboard"),

  // Get overall analytics data
  getOverallAnalytics: () => academyApi.get<OverallStats>("/progress/analytics/overall"),

  // Get student stats for sidebar
  getStudentStats: () => academyApi.get<OverallStats>("/progress/analytics/student"),

  // Get instructor statistics
  getInstructorStats: () => academyApi.get<InstructorStats>("/progress/instructor/stats"),

  // Get course progress details
  getCourseProgress: (courseId: number) => academyApi.get<CourseProgress>(`/progress/course/${courseId}`),

  // Update progress for a specific lesson/content
  updateProgress: (data: { courseId: number; moduleId?: number; lessonId?: number; progress: number }) =>
    academyApi.post("/progress/update", data),

  // Get detailed student progress for a course
  getDetailedStudentProgress: (courseId: number, studentId: string) =>
    academyApi.get<ProgressModule[]>(`/progress/course/${courseId}/user/${studentId}`),

  // Get all students progress for a course (instructor view)
  getCourseStudentsProgress: (courseId: number) =>
    academyApi.get<StudentProgress[]>(`/progress/course/${courseId}/students`),

  // Update content progress
  updateContentProgress: (
    courseId: number,
    moduleId: number,
    lessonId: number,
    contentId: number,
    status: string,
    score?: number
  ) => academyApi.post(
    `/progress/course/${courseId}/module/${moduleId}/lesson/${lessonId}/content/${contentId}`,
    { status, score }
  ),
};