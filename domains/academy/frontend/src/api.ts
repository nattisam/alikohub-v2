import axios from "axios";
import { progressApi } from "./api/progressApi";
import { enrollmentApi } from "./api/enrollmentApi";

const env = import.meta.env.MODE as "development" | "production" | "test";

const PORT = import.meta.env.VITE_API_PORT || 3000;

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

export const academyApi = axios.create({
  baseURL: ACADEMY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // Add this to send cookies with requests
});

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
