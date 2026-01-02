import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentApi } from "../api/enrollmentApi";
import { courseApi } from "../api/courseApi";
import type { Course } from "../components/types.d";

export const useAllCourses = () => {
  return useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const response = await courseApi.getPublishedCourses({ status: "PUBLISHED" });
      const payload = (response.data && response.data.items) ? response.data.items : response.data;
      return Array.isArray(payload) ? payload : [];
    },
  });
};

export const useTrendingCourses = () => {
  return useQuery({
    queryKey: ["trending-courses"],
    queryFn: async () => {
      const response = await courseApi.getPublishedCourses({ status: "PUBLISHED" });
      const payload = (response.data && response.data.items) ? response.data.items : response.data;
      const coursesData = Array.isArray(payload) ? payload : [];
      return coursesData.slice(0, 5);
    },
  });
};

export const useEnrolledCourses = (userId?: string) => {
  return useQuery({
    queryKey: ["enrolled-courses", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const response = await enrollmentApi.getEnrollmentsByUserId(userId);
      // Extract course data from the enrollment response
      const coursesData = response.data.map((enrollment: any) => 
        convertEnrollmentCourseToCourse(enrollment.course)
      );
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
      return enrollmentApi.createEnrollment(enrollmentData);
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

// Helper function to convert enrollment course data to Course interface
const convertEnrollmentCourseToCourse = (enrollmentCourse: any): Course => {
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
      return refCourse.skills.some(skill => course.skills.includes(skill));
    }
    return false;
  });
};