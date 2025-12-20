import { useContext } from "react";
import { InstructorCourseContext } from "../contexts/InstructorCourseContext";
import type { InstructorCourseContextType } from "../contexts/InstructorCourseContext";

export const useInstructorCourses = (): InstructorCourseContextType => {
  const instructorCoursesContext = useContext(InstructorCourseContext);

  if (!instructorCoursesContext) {
    // Return default values instead of throwing an error
    return {
      courses: [],
      createCourse: async () => -1,
      updateCourse: async () => false,
      removeCourse: async () => false,
      teachingSchedules: [],
      addTeachingSchedules: () => { },
      creatingCourse: { loading: false, error: false, errorMessage: "" },
      removingCourse: { loading: false, error: false, errorMessage: "" },
      updatingCourse: { loading: false, error: false, errorMessage: "" },
    };
  }

  return instructorCoursesContext;
};