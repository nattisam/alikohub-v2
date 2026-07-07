export interface AcademyUser {
  id: string;
  userId: string;
  role: string;
  activeRole: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareersUser {
  id: string;
  userId: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  firebaseId: string;
  firstname: string;
  lastname: string;
  email: string;
  globalRole: string;
  authProvider?: string;
  profilePicture: string | null;
  bio: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  academyUser: AcademyUser | null;
  consultancyUser: any | null;
  contechUser: any | null;
  eventsUser: any | null;
  careersUser: CareersUser | null;
  academyRole: string;
  academyActiveRole: string;
  academyStatus: string;
  careersRole: string;
  careersStatus: string;
  hasTeacherApplication?: boolean;
  instructorStatus?: "PENDING" | "ACCEPTED" | "REJECTED" | "APPROVED";
  roleStatus?: {
    instructor?: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  firebaseCustomToken?: string;
  firebaseIdToken?: string;
  isNewUser?: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
}

export interface SelectRoleRequest {
  role: "student" | "instructor";
}

export interface SwitchRoleRequest {
  newRole: "student" | "instructor";
}

export interface InstructorApplicationRequest {
  personalDetails: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  };
  teachingCategories: string[];
  resumeUrl: string;
  interviewResponses: {
    question: string;
    answer: string;
  }[];
}

export interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
}
