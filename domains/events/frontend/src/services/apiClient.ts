import type { ApiResponse, ApiError } from "../types/api";

// Base configuration for the API
export const API_CONFIG = {
  BASE_URL: "http://localhost:3006", // Events API URL
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// HTTP methods type
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Request options interface
interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

// Auth token management
class AuthTokenManager {
  private static tokenKey = "alikohub_auth_token";

  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Base API client class
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  // Public getter for base URL
  get apiBaseUrl(): string {
    return this.baseUrl;
  }

  private buildHeaders(options: RequestOptions): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...options.headers };

    if (options.requiresAuth || options.requiresAuth === undefined) {
      const token = AuthTokenManager.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (response.ok) {
        return {
          data,
          success: true,
        };
      } else {
        // Handle 401 Unauthorized errors
        if (response.status === 401) {
          // Clear authentication data
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('firebaseCustomToken');
          localStorage.removeItem('alikohub_auth_token');
          
          // Dispatch a custom event to notify other tabs about logout
          window.dispatchEvent(new CustomEvent('userLoggedOut'));
        }
        
        const error: ApiError = {
          error: data.error || "An error occurred",
          message: data.message,
          statusCode: response.status,
        };

        return {
          error,
          success: false,
        };
      }
    } catch (parseError) {
      // Handle 401 Unauthorized errors for non-JSON responses
      if (response.status === 401) {
        // Clear authentication data
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('firebaseCustomToken');
        localStorage.removeItem('alikohub_auth_token');
        
        // Dispatch a custom event to notify other tabs about logout
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
      }
      
      const error: ApiError = {
        error: "Failed to parse response",
        message: response.statusText,
        statusCode: response.status,
      };

      return {
        error,
        success: false,
      };
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", body } = options;
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(options);

    const config: RequestInit = {
      method,
      headers,
      credentials: "include", // Include cookies for session authentication
    };

    if (body && (method === "POST" || method === "PUT")) {
      config.body = JSON.stringify(body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT
      );

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (fetchError) {
      let error: ApiError;

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          error = {
            error: "Request timeout",
            message: "The request took too long to complete",
          };
        } else {
          error = {
            error: "Network error",
            message: fetchError.message,
          };
        }
      } else {
        error = {
          error: "Unknown error",
          message: "An unexpected error occurred",
        };
      }

      return {
        error,
        success: false,
      };
    }
  }

  // Convenience methods for different HTTP verbs
  get<T>(endpoint: string, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", requiresAuth });
  }

  post<T>(
    endpoint: string,
    body: any,
    requiresAuth = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body, requiresAuth });
  }

  put<T>(
    endpoint: string,
    body: any,
    requiresAuth = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, requiresAuth });
  }

  delete<T>(endpoint: string, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", requiresAuth });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export { AuthTokenManager };

// Error handling utility
export const handleApiError = (error: ApiError): string => {
  switch (error.statusCode) {
    case 401:
      return "You are not authorized. Please log in.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return error.message || "There was a conflict with your request.";
    case 422:
      return error.message || "Invalid input data.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return error.message || error.error || "An unexpected error occurred.";
  }
};
