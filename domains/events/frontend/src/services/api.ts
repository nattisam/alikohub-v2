import { apiClient, AuthTokenManager } from './apiClient';
import type { LoginCredentials, SignupCredentials } from '../types/api';

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3006"}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid email or password");
    }

    // Check for various possible token field names in the response
    const token = data.token || data.accessToken || data.access_token;
    if (!token) {
      throw new Error("No authentication token received");
    }

    // Store the token using the token manager
    AuthTokenManager.setToken(token);

    return {
      user: data.user || {},
      accessToken: token,
      firebaseCustomToken: data.firebaseCustomToken || data.firebase_custom_token || "", // Add default if not present
    };
  },

  register: async (credentials: SignupCredentials) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3006"}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Check for various possible token field names in the response
    const token = data.token || data.accessToken || data.access_token;
    if (!token) {
      throw new Error("No authentication token received");
    }

    // Store the token using the token manager
    AuthTokenManager.setToken(token);

    return {
      user: data.user || {},
      accessToken: token,
      firebaseCustomToken: data.firebaseCustomToken || data.firebase_custom_token || "", // Add default if not present
    };
  },

  verifyToken: async (token: string) => {
    // For events, we'll use the events API to verify user role
    // This would typically be implemented by calling an endpoint that validates the token
    const response = await apiClient.get('/events/user-role', true);
    
    if (response.success) {
      return { user: response.data };
    } else {
      throw new Error('Token verification failed');
    }
  },

  checkEmailAvailability: async (email: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3006"}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password: 'dummy-password' }),
        }
      );

      if (response.status === 401) {
        return true; // Email is available since login failed
      } else if (response.status === 200) {
        return false; // Email is not available since login succeeded
      } else {
        return false; // Some other error occurred
      }
    } catch (error) {
      return false;
    }
  },
};

// Events API
export const eventsAPI = {
  getProfile: async () => {
    // Since events doesn't have a dedicated profile endpoint, we'll return user role info
    const response = await apiClient.get('/events/user-role', true);
    return response.data;
  },

  getUserRole: async () => {
    const response = await apiClient.get('/events/user-role', true);
    return response.data;
  },

  selectRole: async (role: string) => {
    const response = await apiClient.post('/events/assign-role', { requestedRole: role }, true);
    return response.data;
  },
};