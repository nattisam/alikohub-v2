import axios, { AxiosError } from "axios"

// Base API client for events services
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.consultancy.alikohub.com';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Initial delay in ms
const MAX_RETRY_DELAY = 10000; // Maximum delay in ms

// Helper function to calculate exponential backoff delay
const getRetryDelay = (retryCount: number): number => {
  const delay = Math.min(RETRY_DELAY * Math.pow(2, retryCount), MAX_RETRY_DELAY);
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
};

// Helper function to add retry config to request
const addRetryConfig = (config: any, retryCount: number = 0) => {
  config.__retryCount = retryCount;
  return config;
};

// Response interceptor for handling 429 errors with retry logic
const createRetryInterceptor = (instance: typeof api | typeof publicApi) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as (any & { __retryCount?: number }) | undefined;
      
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

// Add retry interceptors to both API clients
createRetryInterceptor(api);
createRetryInterceptor(publicApi);

// Export types
export type AuthRole = "USER" | "ADMIN" | "CONTENT_MANAGER"

export interface AuthUser {
  id: string
  email: string
  role: AuthRole
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}