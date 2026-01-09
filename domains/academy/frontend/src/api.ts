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

// Function to attach auth interceptor to any axios instance
const attachAuthInterceptor = (instance: any) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

// Create academy API instance
export const academyApi = axios.create({
  baseURL: ACADEMY_BASE_URL,
  headers: {
    ...apiClient.defaults.headers,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Create auth API instance for auth service
export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    ...apiClient.defaults.headers,
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // Add this to send cookies with requests
});

// Attach the auth interceptor to each instance
attachAuthInterceptor(apiClient);
attachAuthInterceptor(academyApi);
attachAuthInterceptor(authApi);

// Export all API modules
export { progressApi, enrollmentApi };
