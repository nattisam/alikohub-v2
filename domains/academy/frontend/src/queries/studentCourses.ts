import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "../services/enrollment-service";
import { courseService } from "../services/course-service";
import type { Course } from "../services/course-service";

export const useAllCourses = () => {
  return useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const response = await courseService.getPublishedCourses();
      const payload = (response && response.items) ? response.items : response;
      return Array.isArray(payload) ? payload : [];
    },
    staleTime: 30 * 60 * 1000,     // 30 minutes - cache longer to reduce API calls
    gcTime: 45 * 60 * 1000,        // 45 minutes - keep in cache longer
    refetchOnWindowFocus: false,   // prevent refetch on window focus
    refetchOnReconnect: false,     // prevent refetch on reconnect
    retry: (failureCount, error: Error | unknown) => {
      // Don't retry on 429 - let axios handle it to prevent cascading retries
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 429) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

export const useTrendingCourses = (allCourses: Course[] = []) => {
  return allCourses.slice(0, 5);
};

export const useEnrolledCourses = (userId?: string) => {
  return useQuery({
    queryKey: ["enrolled-courses", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const requestData = await enrollmentService.getEnrollmentsByUserId(userId);
      // Extract course data from the enrollment response
      const coursesData = requestData.map((enrollment: { course: EnrollmentCourseData }) => {
        // Ensure thumbnail is a string or provide a default
        const courseData = {
          ...enrollment.course,
          thumbnail: enrollment.course.thumbnail || ""
        };
        return convertEnrollmentCourseToCourse(courseData);
      });
      return coursesData;
    },
    enabled: !!userId,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => {
      const enrollmentData = {
        courseId: courseId
      };
      return enrollmentService.createEnrollment(enrollmentData);
    },
    onSuccess: () => {
      // Invalidate enrolled courses to refresh the list
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      // Also invalidate all courses to update enrollment counts
      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      queryClient.invalidateQueries({ queryKey: ["trending-courses"] });
    },
  });
};

interface EnrollmentCourseData {
  id: number;
  title: string;
  shortDescription?: string;
  thumbnail: string;
  category: string;
  level?: string;
  rating?: number;
  price?: number;
}

// Helper function to convert enrollment course data to Course interface
const convertEnrollmentCourseToCourse = (enrollmentCourse: EnrollmentCourseData): Course => {
  return {
    id: enrollmentCourse.id,
    title: enrollmentCourse.title,
    longDescription: enrollmentCourse.shortDescription || "",
    shortDescription: enrollmentCourse.shortDescription || "",
    thumbnail: enrollmentCourse.thumbnail,
    category: enrollmentCourse.category as "Technology" | "STEM" | "Health",
    instructorId: "", // This will be filled when we fetch full course data
    status: "PUBLISHED",
    skills: [],
    conceptsLearned: [],
    estimatedTime: null,
    targetLevel: enrollmentCourse.level || null,
    enrolledNum: 0,
    rating: enrollmentCourse.rating || null,
    price: enrollmentCourse.price || null,
    progress: null,
    prerequisites: [],
    languages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instructor: {
      id: 0,
      firebaseId: "",
      firstname: "",
      lastname: "",
      email: "",
      globalRole: "USER",
      role: "INSTRUCTOR",
      bio: null,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  };
};

export const getSimilarCourses = (refCourse: Course, allCourses: Course[]): Course[] => {
  if (!Array.isArray(allCourses)) return [];
  
  return allCourses.filter(course => {
    if (course.category === refCourse.category && course.id !== refCourse.id) {
      return refCourse.skills?.some(skill => course.skills?.includes(skill));
    }
    return false;
  });
};