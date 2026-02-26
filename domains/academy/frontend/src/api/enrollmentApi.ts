import { academyApi } from "../api";
import type { Course } from "../components/common/types.d";

// Define the enrollment types
export interface Enrollment {
  id: number;
  userId: string;
  cohortId: number | null;
  courseId: number;
  enrolledAt: string;
  progress: number;
  enrollmentType: string;
  paymentStatus: string;
  status: string;
  checkoutUrl?: string; // URL for Stripe checkout redirect
  cohort?: any;
  user?: {
    id: number;
    firebaseId: string;
    firstname: string;
    lastname: string;
    email: string;
    profilePicture: string | null;
    globalRole: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    academyUser?: {
      id: string;
      userId: string;
      role: string;
      activeRole: string;
      status: string;
    };
  };
}

export interface CreateEnrollmentDto {
  userId?: string;
  cohortId?: number;
  courseId: number;
  paymentGateway?: string; // optional payment gateway identifier
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
    return academyApi.post<Enrollment>("/academy/enrollment", data);
  },

  // Get all enrollments for the current user
  getMyEnrollments: () =>
    academyApi.get<EnrollmentWithCourse[]>("/academy/enrollment/me"),

  // Get all enrolled courses for the current user (simplified)
  getMyCourses: () =>
    academyApi.get<Course[]>("/academy/enrollment/my-courses"),

  // Get all enrollments (admin only)
  getAllEnrollments: () => academyApi.get<Enrollment[]>("/academy/enrollment"),

  // Get enrollments by cohort
  getEnrollmentsByCohort: (cohortId: number) =>
    academyApi.get<Enrollment[]>(`/academy/enrollment/cohort/${cohortId}`),

  // Get enrollments by user ID
  getEnrollmentsByUserId: (userId: string) =>
    academyApi.get<EnrollmentWithCourse[]>(
      `/academy/enrollment/user/${userId}`,
    ),

  // Delete an enrollment
  deleteEnrollment: (id: number) =>
    academyApi.delete(`/academy/enrollment/${id}`),
};
