import { useAllCourses, useTrendingCourses, useEnrolledCourses, useEnrollCourse, getSimilarCourses } from "../queries/studentCourses";
import { useAuth } from "../contexts/AuthContext";
import type { Course } from "../components/types.d";

export const useStudentCourses = () => {
  const { user: currentUser } = useAuth();
  const userId = currentUser?.firebaseId;
  
  const allCoursesQuery = useAllCourses();
  const trendingCourses = useTrendingCourses(allCoursesQuery.data || []);
  const enrolledCoursesQuery = useEnrolledCourses(userId);
  const enrollCourseMutation = useEnrollCourse();

  return {
    // All courses data
    courses: allCoursesQuery.data || [],
    isLoadingCourses: allCoursesQuery.isLoading,
    isFetchingCourses: allCoursesQuery.isFetching,
    isErrorCourses: allCoursesQuery.isError,
    
    // Trending courses data
    trendingCourses: trendingCourses || [],
    isLoadingTrending: allCoursesQuery.isLoading,
    isFetchingTrending: allCoursesQuery.isFetching,
    isErrorTrending: allCoursesQuery.isError,
    
    // Enrolled courses data
    enrolledCourses: enrolledCoursesQuery.data || [],
    isLoadingEnrolled: enrolledCoursesQuery.isLoading,
    isFetchingEnrolled: enrolledCoursesQuery.isFetching,
    isErrorEnrolled: enrolledCoursesQuery.isError,
    
    // Course enrollment
    enrollCourse: async (courseId: number) => {
      try {
        const response = await enrollCourseMutation.mutateAsync(courseId);
        return true;
      } catch (error) {
        console.error("Error enrolling course:", error);
        return false;
      }
    },
    
    // Helper function
    getSimilarCourses: (refCourse: Course) => {
      return getSimilarCourses(refCourse, allCoursesQuery.data || []);
    },
    
    // Loading states for mutations
    isEnrollingCourse: enrollCourseMutation.isPending,
    enrollCourseError: enrollCourseMutation.error,
  };
};