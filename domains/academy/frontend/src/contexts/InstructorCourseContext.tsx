import { createContext } from "react";
import type { Course, ITeachingSchedule } from "../components/types.d";

export interface InstructorCourseContextType {
  courses: Course[];
  createCourse: (course: Partial<Course>) => Promise<number>;
  updateCourse: (course: Partial<Course>) => Promise<boolean>;
  removeCourse: (courseId: number) => Promise<boolean>;
  teachingSchedules: ITeachingSchedule[];
  addTeachingSchedules: (teachingSchedule: ITeachingSchedule) => void;
  creatingCourse: { loading: boolean; error: boolean; errorMessage: string };
  removingCourse: { loading: boolean; error: boolean; errorMessage: string };
  updatingCourse: { loading: boolean; error: boolean; errorMessage: string };
}
export const InstructorCourseContext = createContext<
  InstructorCourseContextType | undefined
>(undefined);