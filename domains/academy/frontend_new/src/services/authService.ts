import api from "@/lib/api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  SelectRoleRequest,
  SwitchRoleRequest,
  InstructorApplicationRequest,
} from "@/types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentials,
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  setSession: (accessToken: string, refreshToken: string, user: any) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getSession: () => {
    const accessToken = localStorage.getItem("accessToken");
    const userJson = localStorage.getItem("user");
    return {
      accessToken,
      user: userJson ? JSON.parse(userJson) : null,
    };
  },

  selectAcademyRole: async (roleData: SelectRoleRequest): Promise<any> => {
    const response = await api.post("/academy/profile/select-role", roleData);
    return response.data;
  },

  switchAcademyRole: async (roleData: SwitchRoleRequest): Promise<any> => {
    const response = await api.post("/auth/academy/switch-role", roleData);
    return response.data;
  },

  applyInstructor: async (
    applicationData: InstructorApplicationRequest,
  ): Promise<any> => {
    const response = await api.post(
      "/auth/academy/apply-teacher",
      applicationData,
    );
    return response.data;
  },
};
