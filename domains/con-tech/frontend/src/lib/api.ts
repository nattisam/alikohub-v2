import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3006";

// Retry configuration for rate limiting
// Retry configuration for rate limiting
export const MAX_RETRIES = 1; // Only retry once to avoid cascading
export const INITIAL_RETRY_DELAY = 2000; // Increased delay
export const MAX_RETRY_DELAY = 5000;

// Helper function to calculate exponential backoff delay
export const getRetryDelay = (retryCount: number): number => {
  const delay = Math.min(
    INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
    MAX_RETRY_DELAY,
  );
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
};

// Helper function to add retry config to request
export const addRetryConfig = (config: any, retryCount: number = 0) => {
  config.__retryCount = retryCount;
  return config;
};

export const setupApiRetry = (instance: any) => {
  instance.interceptors.response.use(
    (response: any) => response,
    async (error: AxiosError) => {
      const config = error.config as
        | (any & { __retryCount?: number })
        | undefined;

      // Handle 429 Too Many Requests with exponential backoff
      if (error.response?.status === 429 && config) {
        const retryCount = config.__retryCount || 0;

        if (retryCount < MAX_RETRIES) {
          const delay = getRetryDelay(retryCount);

          console.log(
            `Rate limited (429). Retrying in ${Math.round(delay)}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
          );

          await new Promise((resolve) => setTimeout(resolve, delay));

          // Update retry count and retry the request with a fresh config copy
          const newConfig = addRetryConfig({ ...config }, retryCount + 1);
          return instance.request(newConfig);
        }
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.dispatchEvent(new CustomEvent("userLoggedOut"));
        }
      }

      return Promise.reject(error);
    },
  );
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Access Token for API authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add retry logic to the main apiClient
setupApiRetry(apiClient);

export default apiClient;
