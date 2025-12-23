import apiClient from '../lib/api';

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (credentials) => {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },

  verifyToken: async (firebaseCustomToken) => {
    const { data } = await apiClient.post('/auth/verify', { token: firebaseCustomToken });
    return data;
  },

  // Check if email is available for registration
  checkEmailAvailability: async (email) => {
    try {
      // Attempt to login with the email to check if it exists
      // This is a workaround since there's no direct email check endpoint
      await apiClient.post('/auth/login', { email, password: 'dummy-password' });
      // If login succeeds, email exists
      return false;
    } catch (error: any) {
      // If it's a 401 (unauthorized), the email exists but password is wrong
      // If it's a 400 (bad request), the email doesn't exist
      if (error?.response?.status === 401) {
        return false; // Email exists
      } else if (error?.response?.status === 400) {
        return true; // Email doesn't exist
      }
      // For other errors, assume email exists to be safe
      return false;
    }
  },
};

// Academy API
export const academyAPI = {
  selectRole: async (role) => {
    const { data } = await apiClient.post('/academy/profile/select-role', { role });
    return data;
  },
  
  getProfile: async () => {
    const { data } = await apiClient.get('/academy/profile');
    return data;
  },
};