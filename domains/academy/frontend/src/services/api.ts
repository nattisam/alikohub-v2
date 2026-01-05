import apiClient from '../lib/api';
import type { LoginCredentials, SignupCredentials, CurrentUser } from '../types';



export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (credentials: SignupCredentials) => {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },

  verifyToken: async (token: string) => {
    const { data } = await apiClient.post('/auth/verify', { type: 'jwt', value: token });
    
    return data;
  },

  checkEmailAvailability: async (email: string) => {
    try {
      await apiClient.post('/auth/login', { email, password: 'dummy-password' });
      return false;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return false;
      } else if (error?.response?.status === 400) {
        return true;
      }
      return false;
    }
  },

  updateProfile: async (profileData: Partial<CurrentUser>) => {
    const { data } = await apiClient.patch('/users/profile', profileData);
    return data;
  },
};

export const academyAPI = {
  selectRole: async (role: string) => {
    let backendRole = '';
    switch(role) {
      case 'INSTRUCTOR':
        backendRole = 'instructor';
        break;
      case 'STUDENT':
        backendRole = 'student';
        break;
      case 'ADMIN':
        backendRole = 'admin';
        break;
      default:
        backendRole = role.toLowerCase();
    }
    
    try {
      const response = await apiClient.post('/auth/academy/select-role', { role: backendRole });
      
      return response.data;
    } catch (error) {
      console.error('Error in role selection API call:', error);
      throw error;
    }
  },
  
  switchRole: async (role: string) => {
    let backendRole = '';
    switch(role) {
      case 'INSTRUCTOR':
        backendRole = 'instructor';
        break;
      case 'STUDENT':
        backendRole = 'student';
        break;
      case 'ADMIN':
        backendRole = 'admin';
        break;
      default:
        backendRole = role.toLowerCase();
    }
    
    const { data } = await apiClient.post('/auth/academy/switch-role', { newRole: backendRole });
    
    return data;
  },
  
  getProfile: async () => {
    const { data } = await apiClient.get('/users/profile');
    
    return data;
  },
  
  applyTeacher: async (applicationData: any) => {
    const { data } = await apiClient.post('/auth/academy/apply-teacher', applicationData);
    return data;
  },
};