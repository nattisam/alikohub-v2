import api from "@/lib/api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  SelectRoleRequest,
  SwitchRoleRequest,
  InstructorApplicationRequest,
  User,
} from "@/types/auth";

export const isTokenValid = (token: string | null) => {
  if (!token) return false;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return false;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token is expired
    }
    return true; // Token is valid
  } catch (error) {
    return false; // Error decoding token
  }
};

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

    // Check if token exists and is valid
    if (accessToken && !isTokenValid(accessToken)) {
      // Token is expired, clean up session
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return { accessToken: null, user: null };
    }

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
