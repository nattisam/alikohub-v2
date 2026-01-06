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
