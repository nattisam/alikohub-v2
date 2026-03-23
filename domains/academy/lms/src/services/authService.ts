import api from "@/lib/api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  SelectRoleRequest,
  SwitchRoleRequest,
  InstructorApplicationRequest,
  User,
} from "@/types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        if (!error.response.data) error.response.data = {};
        error.response.data.message =
          "Too many login attempts. Please try again later.";
      }
      throw error;
    }
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
    localStorage.removeItem("auth_provider");
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
    const response = await api.post("/auth/academy/select-role", roleData);
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

  uploadResume: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/users/profile");
    return response.data;
  },

  getUserAcademyStatus: async (userId: string): Promise<any> => {
    const response = await api.get(`/auth/academy/user-status/${userId}`);
    return response.data;
  },
};
