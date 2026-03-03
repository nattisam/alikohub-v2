import { api as consolidatedApi } from "./lib/api";
import { progressApi } from "./api/progressApi";
import { enrollmentApi } from "./api/enrollmentApi";

/**
 * Root API compatibility layer.
 * All existing services should eventually transition to using the consolidated client in lib/api.ts.
 * Currently, this file re-exports existing APIs for backward compatibility.
 */

// Use the same instance for academyApi to ensure unified interceptors and state
export const academyApi = consolidatedApi;

// authApi has a specific /auth subpath. For now, we still use a dedicated instance
// but ensure it follows the same defaults.
// Note: Transitioning this to consolidatedApi requires updating all calls from .post('/login') to .post('/auth/login')
import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.consultancy.alikohub.com";

export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Sync authApi with the same token logic
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { progressApi, enrollmentApi };
export default consolidatedApi;
