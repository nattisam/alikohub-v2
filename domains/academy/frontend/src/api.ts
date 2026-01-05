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

// Create academy API instance that reuses the interceptors from apiClient
export const academyApi = axios.create({
  baseURL: ACADEMY_BASE_URL,
  headers: {
    ...apiClient.defaults.headers,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Copy interceptors from apiClient to maintain consistent authentication handling
academyApi.interceptors.request.handlers = [...apiClient.interceptors.request.handlers];
academyApi.interceptors.response.handlers = [...apiClient.interceptors.response.handlers];

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

// Copy interceptors from apiClient to authApi as well
authApi.interceptors.request.handlers = [...apiClient.interceptors.request.handlers];
authApi.interceptors.response.handlers = [...apiClient.interceptors.response.handlers];

// Export all API modules
export { progressApi, enrollmentApi };
