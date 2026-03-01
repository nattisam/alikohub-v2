import axios from "axios";

// Base API URL for all services
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.consultancy.alikohub.com";

// API client for authenticated requests
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// API client for public requests (no auth required)
export const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Request interceptor for authenticated API client
// Dynamically pulls the token from localStorage for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export default instance for backward compatibility
export default api;
