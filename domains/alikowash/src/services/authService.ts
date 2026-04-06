import api from "../lib/api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";

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

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/users/profile");
    return response.data;
  },
};
