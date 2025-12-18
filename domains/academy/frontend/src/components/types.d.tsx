import type { HTMLAttributes } from "react";

export interface User {
  id: number;
  firebaseId: string;
  firstname: string;
  lastname?: string;
  email: string;
  /**
   * globalRole is role of the user over all alikohub platform
   */
  globalRole: "USER" | "ADMIN";
  /**
   * role is alikohub academy specific role of the user.
   */
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  profilePicture?: string | null;
  bio?: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Instructor extends User {
  role: "INSTRUCTOR";
  title?: string;
  bio: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  certifications?: string[];
}

export type Language = "Amh" | "En" | "Swahili";
export interface Cohort {
  id: number;
  name: string;
  courseId: number;
  enrollments: Enrollment[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  userId: string;
  cohortId: number;
  courseId: number;
  progress: number;
  enrolledAt: string;
}

export interface Course {
  id: number;
  title: string;
  longDescription: string;
  shortDescription: string;
  thumbnail?: string;
  category: "Technology" | "STEM" | "Health";
  subCategory?: string;
  instructorId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  skills: string[];
  conceptsLearned: string[];
  estimatedTime: number | null;
  targetLevel: string | null;
  enrolledNum: number | null;
  rating: number | null;
  price: number | null;
  progress?: number | null;
  prerequisites: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
  instructor: Instructor;
  // Add the new field for cohort creation
  createDefaultCohort?: boolean;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  courseId: number;
  lessons: CourseLesson[];
  createdAt: string;
  updatedAt: string;
}

export type LessonType = "QUIZ" | "VIDEO" | "WEBINAR" | "ASSIGNMENT";

export type ContentType = "VIDEO" | "PDF" | "QUIZ" | "ASSIGNMENT";

export interface CourseLesson {
  id: number;
  title: string;
  moduleId: number;
  type: LessonType;
  contents: LessonContent[];
  maxScore?: number;
  passingScore?: number;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface LessonContent {
  id: number;
  lessonId: number;
  title: string;
  type: ContentType;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingCourseCardProps {
  course: Course;
  onEnroll: () => void;
}

export interface TestimonyCardProps {
  image: string;
  name: string;
  testimony: string;
  className?: HTMLAttributes<string>["className"];
  style?: object;
  cardColor?: string;
}

export interface INotification {
  id: number;
  userId: string;
  type?: string;
  message: string;
  isRead: boolean;
}

export interface EnrollmentNotification extends INotification {
  courseId: number;
}

export interface ITeachingSchedule {
  title: string;
  startTime: string;
  endTime: string;
  type: "Live" | "Recording" | "Q&A";
}
export interface SignupForm {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
