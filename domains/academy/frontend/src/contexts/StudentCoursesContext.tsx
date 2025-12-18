import { createContext } from "react";
import type { Course } from "../components/types.d";

export interface CourseContextType {
  courses: Course[];
  enrolledCourses: Course[];
  trendingCourses: Course[];
  getSimilarCourses: (refCourse: Course) => Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  enrollCourse: (courseId: number, userId: string) => Promise<boolean>;
}

export const StudentCourseContext = createContext<CourseContextType | undefined>(
  undefined
);
