export interface CurrentUser {
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  role?: string;
  globalRole?: string;
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
