import { useInstructorCourses as useInstructorCoursesQuery, useCreateCourse, useUpdateCourse, useDeleteCourse } from "../queries/instructorCourses";
import { useTeachingSchedules, useAddTeachingSchedule } from "../queries/instructorStats";
import { useAuth } from "../contexts/AuthContext";
import type { Course } from "../services/course-service";
import type { ITeachingSchedule } from "../components/common/types.d";

export const useInstructorCourses = () => {
  const { user: currentUser } = useAuth();
  const instructorId = currentUser?.firebaseId;
  
  const coursesQuery = useInstructorCoursesQuery(instructorId);
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  
  const teachingSchedulesQuery = useTeachingSchedules();
  const addTeachingScheduleMutation = useAddTeachingSchedule();

  return {
    // Courses data and queries
    courses: coursesQuery.data || [],
    isLoadingCourses: coursesQuery.isLoading,
    isFetchingCourses: coursesQuery.isFetching,
    isErrorCourses: coursesQuery.isError,
    refetchCourses: coursesQuery.refetch,
    
    // Course mutations
    createCourse: async (course: Partial<Course>) => {
      try {
        const response = await createCourseMutation.mutateAsync(course);
        return response?.id || -1;
      } catch (error) {
        console.error("Error creating course:", error);
        return -1;
      }
    },
    updateCourse: async (course: Partial<Course>) => {
      if (!course.id) return false;
      try {
        await updateCourseMutation.mutateAsync({ id: course.id, data: course });
        return true;
      } catch (error) {
        console.error("Error updating course:", error);
        return false;
      }
    },
    removeCourse: async (courseId: number) => {
      try {
        await deleteCourseMutation.mutateAsync(courseId);
        return true;
      } catch (error) {
        console.error("Error removing course:", error);
        return false;
      }
    },
    
    // Teaching schedules data and queries
    teachingSchedules: teachingSchedulesQuery.data || [],
    isLoadingTeachingSchedules: teachingSchedulesQuery.isLoading,
    isFetchingTeachingSchedules: teachingSchedulesQuery.isFetching,
    isErrorTeachingSchedules: teachingSchedulesQuery.isError,
    refetchTeachingSchedules: teachingSchedulesQuery.refetch,
    
    addTeachingSchedules: (teachingSchedule: ITeachingSchedule) => {
      addTeachingScheduleMutation.mutate(teachingSchedule);
    },
    
    // Loading and error states for mutations
    creatingCourse: { 
      loading: createCourseMutation.isPending, 
      error: createCourseMutation.isError, 
      errorMessage: createCourseMutation.error?.message || "" 
    },
    updatingCourse: { 
      loading: updateCourseMutation.isPending, 
      error: updateCourseMutation.isError, 
      errorMessage: updateCourseMutation.error?.message || "" 
    },
    removingCourse: { 
      loading: deleteCourseMutation.isPending, 
      error: deleteCourseMutation.isError, 
      errorMessage: deleteCourseMutation.error?.message || "" 
    },
  };
};