export interface User {
  id: number | string;
  email: string;
  firstname?: string;
  lastname?: string;
  globalRole?: string;
  academyRole?: string;
  academyActiveRole?: string;
  academyUser?: {
    role: string;
    activeRole: string;
  };
  [key: string]: any;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  captchaToken?: string;
}
