/**
 * Query key factory for progress-related queries.
 */
export const progressKeys = {
  all: ["progress"] as const,
  dashboard: () => [...progressKeys.all, "dashboard"] as const,
  analytics: () => [...progressKeys.all, "analytics"] as const,
  overallAnalytics: () => [...progressKeys.analytics(), "overall"] as const,
  studentStats: () => [...progressKeys.analytics(), "student"] as const,
  instructorStats: () => [...progressKeys.analytics(), "instructor"] as const,
  course: (courseId: number) =>
    [...progressKeys.all, "course", courseId] as const,
  detailed: (courseId: number, studentId: string) =>
    [...progressKeys.course(courseId), "user", studentId] as const,
  studentsProgress: (courseId: number) =>
    [...progressKeys.course(courseId), "students"] as const,
};
