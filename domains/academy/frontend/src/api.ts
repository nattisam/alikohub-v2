import axios, { AxiosError } from "axios";

// Define the type locally since AxiosRequestConfig is not a named export
interface AxiosRequestConfigWithRetry extends import('axios').AxiosRequestConfig {
  __retryCount?: number;
}
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

// Retry configuration - reduced retries to prevent cascading
const MAX_RETRIES = 1; // Only retry once to avoid cascading with React Query
const RETRY_DELAY = 2000; // Initial delay in ms - longer to give server time
const MAX_RETRY_DELAY = 5000; // Maximum delay in ms

// Helper function to calculate exponential backoff delay
const getRetryDelay = (retryCount: number): number => {
  const delay = Math.min(RETRY_DELAY * Math.pow(2, retryCount), MAX_RETRY_DELAY);
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
};

// Helper function to add retry config to request
const addRetryConfig = (config: any & { __retryCount?: number }, retryCount: number = 0) => {
  config.__retryCount = retryCount;
  return config;
};

// Response interceptor for handling 429 errors with retry logic
const createRetryInterceptor = (instance: typeof academyApi | typeof authApi) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as AxiosRequestConfigWithRetry | undefined;
      
      // Only retry on 429 errors
      if (error.response?.status === 429 && config) {
        const retryCount = config.__retryCount || 0;
        
        if (retryCount < MAX_RETRIES) {
          const delay = getRetryDelay(retryCount);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Update retry count and retry the request
          const newConfig = addRetryConfig({ ...config }, retryCount + 1);
          return instance.request(newConfig);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Create academy API instance
export const academyApi = axios.create({
  baseURL: ACADEMY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth header to academyApi
academyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

// Add auth header to authApi
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add retry interceptors to both API clients
createRetryInterceptor(academyApi);
createRetryInterceptor(authApi);

// Export all API modules
export { progressApi, enrollmentApi };
