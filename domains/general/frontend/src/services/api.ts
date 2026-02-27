import apiClient from "../lib/api";
import type {
  LoginCredentials,
  SignupCredentials,
  CurrentUser,
} from "../types";

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },

  register: async (credentials: SignupCredentials) => {
    const { data } = await apiClient.post("/auth/register", credentials);
    return data;
  },

  verifyToken: async (token: string) => {
    const { data } = await apiClient.post("/auth/verify", {
      type: "token",
      value: token,
    });
    return data;
  },

  checkEmailAvailability: async (email: string) => {
    try {
      await apiClient.post("/auth/login", {
        email,
        password: "dummy-password",
      });
      return false;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return false;
      } else if (error?.response?.status === 400) {
        return true;
      }
      return false;
    }
  },

  updateProfile: async (profileData: Partial<CurrentUser>) => {
    const { data } = await apiClient.patch("/users/profile", profileData);
    return data;
  },

  updatePassword: async (passwordData: any) => {
    const { data } = await apiClient.put("/auth/change-password", passwordData);
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  },
};

// General API for general domain specific endpoints
export const generalAPI = {
  // Contact API
  sendMessage: async (messageData: any) => {
    const { data } = await apiClient.post("/contact", messageData);
    return data;
  },

  // Dashboard API
  getStats: async () => {
    const { data } = await apiClient.get("/dashboard/stats");
    // Dashboard endpoint returns { success: true, data: stats }
    // Return the inner stats object to make it easier for callers
    return data.data;
  },

  // User Management API
  // Get all users (admin only)
  getAll: async () => {
    const { data } = await apiClient.get("/users");
    return data.data;
  },

  // Create a new user (admin only)
  create: async (userData: any) => {
    const { data } = await apiClient.post("/users", userData);
    return data.data;
  },

  // Delete a user (admin only)
  delete: async (userId: any) => {
    const { data } = await apiClient.delete(`/users/${userId}`);
    return data;
  },

  // Update user role (admin only)
  updateRole: async (userId: any, role: any) => {
    const { data } = await apiClient.put(`/users/${userId}/role`, { role });
    return data.data;
  },

  // Get user by ID (admin only)
  getById: async (userId: any) => {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data.data;
  },
};
