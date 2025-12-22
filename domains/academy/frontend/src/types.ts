export interface CurrentUser {
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  role?: string;
  globalRole?: string;
  academyRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  hasSelectedRole?: boolean;
  academyProfile?: {
    id: number;
    userId: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    hasSelectedRole: boolean;
    bio?: string | null;
    expertise?: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  status?: string;
  profilePicture?: string;
  bio?: string;
  [key: string]: any; // Allow additional properties
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}