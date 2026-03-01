/**
 * Query key factory for course-related queries.
 * Ensures consistent cache keys throughout the application.
 */
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: string | Record<string, unknown>) =>
    [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
  instructor: (instructorId: string) =>
    [...courseKeys.lists(), "instructor", instructorId] as const,
  modules: (courseId: number) =>
    [...courseKeys.detail(courseId), "modules"] as const,
  lessons: (moduleId: number) => ["modules", moduleId, "lessons"] as const,
};
