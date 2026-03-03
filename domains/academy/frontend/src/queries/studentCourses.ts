import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  enrollmentService,
  type EnrollmentWithCourse,
} from "../services/enrollment-service";
import { type Course } from "../services/course-service";
import { enrollmentKeys } from "./enrollmentKeys";
import { courseKeys } from "./courseKeys";

// Note: useAllCourses is deprecated in favor of useCourses hook in src/hooks/useCourses.ts
// which uses the unified select pattern and centralized constants.

export const useTrendingCourses = (allCourses: any = []) => {
  const payload = allCourses?.items || allCourses;
  return Array.isArray(payload) ? payload.slice(0, 5) : [];
};

export const useEnrolledCourses = (userId?: string) => {
  return useQuery({
    queryKey: enrollmentKeys.byUser(userId || ""),
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return enrollmentService.getEnrollmentsByUserId(userId);
    },
    enabled: !!userId,
    select: (data) => {
      if (!Array.isArray(data)) return [];
      return data
        .map((enrollment: EnrollmentWithCourse) => {
          if (!enrollment?.course) return null;
          return convertEnrollmentCourseToCourse({
            ...enrollment.course,
            thumbnail: enrollment.course.thumbnail || "",
          });
        })
        .filter((c): c is Course => c !== null);
    },
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) =>
      enrollmentService.createEnrollment({ courseId }),
    onSuccess: () => {
      // Invalidate using the unified keys
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
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
const convertEnrollmentCourseToCourse = (
  enrollmentCourse: EnrollmentCourseData,
): Course => {
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
    },
  };
};

export const getSimilarCourses = (
  refCourse: Course,
  allCourses: Course[],
): Course[] => {
  if (!Array.isArray(allCourses)) return [];

  return allCourses.filter((course) => {
    if (course.category === refCourse.category && course.id !== refCourse.id) {
      return refCourse.skills?.some((skill: string) =>
        course.skills?.includes(skill),
      );
    }
    return false;
  });
};
