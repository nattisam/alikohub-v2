import { academyApi } from "../api";
import type { Course } from "../components/types.d";

// Define the enrollment types
export interface Enrollment {
  id: number;
  userId: string;
  cohortId: number;
  courseId: number;
  progress: number;
  enrolledAt: string;
}

export interface CreateEnrollmentDto {
  userId?: string;
  cohortId?: number;
  courseId: number;
}

export interface EnrollmentWithCourse {
  id: number;
  userId: string;
  cohortId: number;
  courseId: number;
  progress: number;
  enrolledAt: string;
  course: {
    id: number;
    title: string;
    shortDescription: string;
    thumbnail?: string;
    category: string;
    level: string;
    duration: string;
    price: number;
    rating: number;
  };
}

// Enrollment APIs
export const enrollmentApi = {
  // Create a new enrollment
  createEnrollment: (data: CreateEnrollmentDto) => {
    console.log("Enrollment API - Sending data:", data);
    return academyApi.post<Enrollment>("/enrollment", data);
  },

  // Get all enrollments for the current user
  getMyEnrollments: () =>
    academyApi.get<EnrollmentWithCourse[]>("/enrollment/me"),

  // Get all enrolled courses for the current user (simplified)
  getMyCourses: () =>
    academyApi.get<Course[]>("/enrollments/my-courses"),

  // Get all enrollments (admin only)
  getAllEnrollments: () =>
    academyApi.get<Enrollment[]>("/enrollment"),

  // Get enrollments by cohort
  getEnrollmentsByCohort: (cohortId: number) =>
    academyApi.get<Enrollment[]>(`/enrollment/cohort/${cohortId}`),

  // Get enrollments by user ID
  getEnrollmentsByUserId: (userId: string) =>
    academyApi.get<EnrollmentWithCourse[]>(`/enrollment/user/${userId}`),

  // Delete an enrollment
  deleteEnrollment: (id: number) =>
    academyApi.delete(`/enrollment/${id}`),
};