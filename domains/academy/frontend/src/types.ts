export interface CurrentUser {
  id: number;
  firebaseId: string;
  firstname: string;
  lastname: string;
  email: string;
  globalRole: string;
  profilePicture: string | null;
  bio: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  academyUser: {
    id: string;
    userId: string;
    role: string;
    activeRole: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  consultancyUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  contechUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  eventsUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  // Additional frontend-specific properties
  hasSelectedRole?: boolean;
  availableRoles?: string[];
  currentRole?: string;
  academyRole?: string;
  academyActiveRole?: string;
  academyStatus?: string;
  contechRole?: string;
  contechStatus?: string;
  eventsRole?: string;
  eventsStatus?: string;
  roleStatus?: {
    instructor: 'active' | 'pending' | 'rejected';
    applicationDate?: string;
    approvalDate?: string;
  };
  academyProfile?: {
    id: string;
    userId: string;
    role: string;
    hasSelectedRole: boolean;
    bio?: string | null;
    expertise?: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
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
  captchaToken?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_APPROVAL' | 'REJECTED';
  enrolledNum: number;
  instructor?: {
    firstname: string;
    lastname: string;
  };
  createdAt?: string;
  updatedAt?: string;
  difficulty?: string;
  duration?: number;
}