/**
 * Query key factory for enrollment-related queries.
 */
export const enrollmentKeys = {
  all: ["enrollments"] as const,
  lists: () => [...enrollmentKeys.all, "list"] as const,
  byUser: (userId: string) => [...enrollmentKeys.lists(), { userId }] as const,
  byCohort: (cohortId: number) =>
    [...enrollmentKeys.lists(), { cohortId }] as const,
  myCourses: () => [...enrollmentKeys.all, "my-courses"] as const,
};
