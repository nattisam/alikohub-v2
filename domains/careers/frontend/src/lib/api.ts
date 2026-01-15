import axios from "axios"

// Base API client for careers services
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3006';

// API client for authenticated requests
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

// API client for public requests (no auth required)
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

// Request interceptor for authenticated API client
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export types
export type AuthRole = "USER" | "ADMIN" | "RECRUITER"

export interface AuthUser {
  id: string
  email: string
  role: AuthRole
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}


