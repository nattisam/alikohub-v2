import axios from "axios";
import apiClient from "./lib/api";
import { progressApi } from "./api/progressApi";
import { enrollmentApi } from "./api/enrollmentApi";

const env = import.meta.env.MODE as "development" | "production" | "test";

const PORT = import.meta.env.VITE_API_PORT || 3006;

// Choose academy base URL depending on environment
const ACADEMY_BASE_URL =
  env === "development"
    ? `http://localhost:${PORT}` // your local dev server
    : "https://alikohub.com/api/academy"; // production server

// Auth service URL
const AUTH_BASE_URL =
  env === "development"
    ? `http://localhost:${PORT}/auth`
    : "https://alikohub.com/api/auth";

// Create a new instance with the same interceptors by using the same defaults
export const academyApi = axios.create({
  baseURL: ACADEMY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Manually add the same interceptors as apiClient
academyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
academyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("firebaseCustomToken");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // Add this to send cookies with requests
});

// Export all API modules
export { progressApi, enrollmentApi };
