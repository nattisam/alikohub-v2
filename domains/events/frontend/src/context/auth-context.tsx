"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Define types
export type AuthRole = "USER" | "ADMIN" | "CONTENT_MANAGER";

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
  globalRole?: AuthRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.consultancy.alikohub.com";

// Create API client for general auth
const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Access Token for API authentication
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // Clear authentication data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        // Dispatch a custom event to notify other tabs about logout
        window.dispatchEvent(new CustomEvent("userLoggedOut"));
      }
    }
    return Promise.reject(error);
  },
);

function readStoredAuth(): { token: string; user: AuthUser } | null {
  try {
    const userData = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (!userData || !accessToken) return null;

    const user = JSON.parse(userData);

    // Normalize role on read to recover form possible bad state
    if (user.role) {
      user.role = user.role.toUpperCase() as AuthRole;
    }

    return { token: accessToken, user };
  } catch {
    return null;
  }
}

function writeStoredAuth(data: { token: string; user: AuthUser } | null) {
  if (!data) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    return;
  }

  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("accessToken", data.token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setBootstrapped(true);
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    // Map globalRole to role if role is missing (SSO compatibility)
    // Normalize role to uppercase to match AuthRole type
    const rawRole = data.user.role || data.user.globalRole || "USER";
    const normalizedRole = rawRole.toUpperCase() as AuthRole;

    const userData = {
      ...data.user,
      role: normalizedRole,
    } as AuthUser;

    setUser(userData);
    setToken(data.accessToken);

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", data.accessToken);
  };

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await authApiClient.post<AuthResponse>(
        "/auth/login",
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      handleAuthSuccess(data);
      // Fresh sync of events profile after login
      syncEventsProfile(data.accessToken);
    },
  });

  const syncEventsProfile = async (authToken: string) => {
    setIsSyncing(true);
    try {
      // Updated endpoint as per user instruction
      const res = await axios.get(`${API_BASE_URL}/manage/events/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.data?.role) {
        // Ensure role is normalized to uppercase
        const normalizedRole = res.data.role.toUpperCase() as AuthRole;

        setUser((prev) => {
          if (!prev) return null;
          const updatedUser = { ...prev, role: normalizedRole };
          // Persist to localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return updatedUser;
        });
      }
    } catch (error) {
      console.warn("Could not sync events profile:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (token) {
      syncEventsProfile(token);
    }
  }, [token]);

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await authApiClient.post<AuthResponse>(
        "/auth/register",
        payload,
      );
      return res.data;
    },
    onSuccess: handleAuthSuccess,
  });

  const login = async (payload: LoginPayload) => {
    await loginMutation.mutateAsync(payload);
  };

  const register = async (payload: RegisterPayload) => {
    await registerMutation.mutateAsync(payload);
  };

  const logout = async () => {
    try {
      // Call the logout API endpoint
      await authApiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    // Clear local authentication data
    setUser(null);
    setToken(null);
    writeStoredAuth(null);

    // Redirect to home
    window.location.href = "/";
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading:
      !bootstrapped ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      isSyncing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useHasRole(required: AuthRole | AuthRole[]) {
  const { user } = useAuth();
  if (!user) return false;
  const roles = Array.isArray(required) ? required : [required];
  return roles.includes(user.role);
}
