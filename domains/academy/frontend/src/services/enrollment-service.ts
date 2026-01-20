import { api } from '../lib/api';

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

export interface Course {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_APPROVAL' | 'REJECTED';
    enrolledNum: number;
    instructor?: {
      firstname: string;
      lastname: string;
    };
    createdAt?: string;
    updatedAt?: string;
    difficulty?: string;
    duration?: number;
}

// Enrollment APIs
export const enrollmentService = {
  // Create a new enrollment
  createEnrollment: async (data: CreateEnrollmentDto) => {
    console.log("Enrollment API - Sending data:", data);
    const response = await api.post<Enrollment>("/academy/enrollment", data);
    return response.data;
  },

  // Get all enrollments for the current user
  getMyEnrollments: async () => {
    const response = await api.get<EnrollmentWithCourse[]>('/academy/enrollment/me');
    return response.data;
  },

  // Get all enrolled courses for the current user (simplified)
  getMyCourses: async () => {
    const response = await api.get<Course[]>('/academy/enrollment/my-courses');
    return response.data;
  },

  // Get all enrollments (admin only)
  getAllEnrollments: async () => {
    const response = await api.get<Enrollment[]>("/academy/enrollment");
    return response.data;
  },

  // Get enrollments by cohort
  getEnrollmentsByCohort: async (cohortId: number) => {
    const response = await api.get<Enrollment[]>(`/academy/enrollment/cohort/${cohortId}`);
    return response.data;
  },

  // Get enrollments by user ID
  getEnrollmentsByUserId: async (userId: string) => {
    const response = await api.get<EnrollmentWithCourse[]>(`/academy/enrollment/user/${userId}`);
    return response.data;
  },

  // Delete an enrollment
  deleteEnrollment: async (id: number) => {
    const response = await api.delete(`/academy/enrollment/${id}`);
    return response.data;
  }
};
