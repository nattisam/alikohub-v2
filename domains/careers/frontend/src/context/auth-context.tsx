"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Define types
export type AuthRole = "USER" | "ADMIN" | "RECRUITER";

export interface AuthUser {
  id: string;
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  globalRole?: string;
  role: AuthRole;
  careersRole?: string;
  careersStatus?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  // captchaToken: string
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  firebaseCustomToken: string;
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
        localStorage.removeItem("firebaseCustomToken");
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
    return { token: accessToken, user };
  } catch {
    return null;
  }
}

function writeStoredAuth(data: { token: string; user: AuthUser } | null) {
  if (!data) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("firebaseCustomToken");
    return;
  }

  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("accessToken", data.token);
  localStorage.setItem(
    "firebaseCustomToken",
    (data.user as any).firebaseCustomToken || "",
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setBootstrapped(true);
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    // Convert the user from the general auth service to our careers format
    // Prioritize careers-specific role if available, otherwise use global role
    const careersRole = data.user.careersRole || data.user.role;
    const globalRole = data.user.globalRole;

    let mappedRole: AuthRole;
    if (careersRole === "RECRUITER") {
      mappedRole = "RECRUITER";
    } else if (globalRole === "ADMIN") {
      mappedRole = "ADMIN";
    } else if (globalRole === "USER") {
      mappedRole = "USER";
    } else {
      // Default to USER if user doesn't have proper global role
      mappedRole = "USER";
    }

    const careersUser: AuthUser = {
      id: data.user.id?.toString() || "",
      firebaseId: data.user.firebaseId,
      email: data.user.email,
      firstname: data.user.firstname,
      lastname: data.user.lastname,
      globalRole: globalRole,
      careersRole: careersRole,
      careersStatus: data.user.careersStatus,
      role: mappedRole,
    };

    setUser(careersUser);
    setToken(data.accessToken);

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(careersUser));
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);
  };

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await authApiClient.post<AuthResponse>(
        "/auth/login",
        payload,
      );
      return res.data;
    },
    onSuccess: handleAuthSuccess,
  });

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
    await registerMutation.mutateAsync({
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      password: payload.password,
      // captchaToken: payload.captchaToken
    });
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

    // Redirect to login
    window.location.href = "/login";
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading:
      !bootstrapped || loginMutation.isPending || registerMutation.isPending,
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

export function useHasGlobalRole(globalRole: string) {
  const { user } = useAuth();
  return user?.globalRole === globalRole;
}

export function useHasCareersRole(careersRole: string) {
  const { user } = useAuth();
  return user?.careersRole === careersRole;
}
