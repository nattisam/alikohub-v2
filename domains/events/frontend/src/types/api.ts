export interface CurrentUser {
  id?: number;
  firebaseId: string;
  firstname: string;
  lastname: string;
  email: string;
  globalRole?: string;
  profilePicture?: string;
  bio?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Events-specific user data
  eventsUser?: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  // Additional frontend-specific properties
  eventsRole?: string;
  eventsStatus?: string;
  [key: string]: any; // Allow additional properties
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface RoleAssignment {
  requestedRole: "USER" | "ORGANIZER";
}

export interface RoleAssignmentResponse {
  role: "USER" | "ORGANIZER";
  status: string;
}

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  error?: {
    error: string;
    message?: string;
    statusCode?: number;
  };
}