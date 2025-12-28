import apiClient from '../lib/api';
import { normalizeUserRoles, denormalizeRole } from '../utils/role-normalizer';

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

  verifyToken: async (token) => {
    const { data } = await apiClient.post('/auth/verify', { type: 'token', value: token });
    
    // Normalize roles in the response
    if (data.user) {
      data.user = normalizeUserRoles(data.user);
    }
    
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
    const backendRole = denormalizeRole(role);
    
    console.log('Sending role selection request to backend:', { role: backendRole });
    try {
      const response = await apiClient.post('/auth/academy/select-role', { role: backendRole });
      console.log('Role selection response from backend:', response.data);
      
      // Normalize roles in the response
      if (response.data.user) {
        response.data.user = normalizeUserRoles(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in role selection API call:', error);
      throw error;
    }
  },
  
  switchRole: async (role) => {
    const backendRole = denormalizeRole(role);
    
    console.log('Making switch role request:', { newRole: backendRole });
    const { data } = await apiClient.post('/auth/academy/switch-role', { newRole: backendRole });
    console.log('Switch role response data:', data);
    
    // Normalize roles in the response
    if (data.user) {
      data.user = normalizeUserRoles(data.user);
    }
    
    return data;
  },
  
  getProfile: async () => {
    const { data } = await apiClient.get('/users/profile');
    
    // Normalize roles in the response
    if (data.user) {
      data.user = normalizeUserRoles(data.user);
    }
    
    return data;
  },
  
  applyTeacher: async (applicationData) => {
    const { data } = await apiClient.post('/auth/academy/apply-teacher', applicationData);
    return data;
  },
};