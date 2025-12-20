import { useContext } from "react";
import { StudentCourseContext } from "../contexts/StudentCoursesContext";
import type { CourseContextType } from "../contexts/StudentCoursesContext";

export const useStudentCourses = (): CourseContextType => {
  const studentCoursesContext = useContext(StudentCourseContext);

  if (!studentCoursesContext) {
    // Return default values instead of throwing an error
    return {
      courses: [],
      enrolledCourses: [],
      trendingCourses: [],
      getSimilarCourses: () => [],
      setCourses: () => { },
      enrollCourse: async () => false
    };
  }

  return studentCoursesContext;
};