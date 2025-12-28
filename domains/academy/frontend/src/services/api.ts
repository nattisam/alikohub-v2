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

  verifyToken: async (token) => {
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
    // Convert frontend role format to backend format
    // Frontend sends: 'STUDENT', 'INSTRUCTOR', 'ADMIN'
    // Backend expects: 'student', 'teacher', 'admin'
    let backendRole;
    switch (role.toUpperCase()) {
      case 'STUDENT':
        backendRole = 'student';
        break;
      case 'INSTRUCTOR':
      case 'TEACHER':
        backendRole = 'teacher';
        break;
      case 'ADMIN':
        backendRole = 'admin';
        break;
      default:
        backendRole = role.toLowerCase();
    }
    
    console.log('Sending role selection request to backend:', { role: backendRole });
    try {
      const response = await apiClient.post('/auth/academy/select-role', { role: backendRole });
      console.log('Role selection response from backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in role selection API call:', error);
      throw error;
    }
  },
  
  switchRole: async (role) => {
    // Convert frontend role format to backend format
    // Frontend sends: 'STUDENT', 'INSTRUCTOR', 'ADMIN'
    // Backend expects: 'student', 'teacher', 'admin'
    let backendRole;
    switch (role.toUpperCase()) {
      case 'STUDENT':
        backendRole = 'student';
        break;
      case 'INSTRUCTOR':
      case 'TEACHER':
        backendRole = 'teacher';
        break;
      case 'ADMIN':
        backendRole = 'admin';
        break;
      default:
        backendRole = role.toLowerCase();
    }
    
    console.log('Making switch role request:', { newRole: backendRole });
    const { data } = await apiClient.post('/auth/academy/switch-role', { newRole: backendRole });
    console.log('Switch role response data:', data);
    return data;
  },
  
  getProfile: async () => {
    const { data } = await apiClient.get('/users/profile');
    return data;
  },
  
  applyTeacher: async (applicationData) => {
    const { data } = await apiClient.post('/auth/academy/apply-teacher', applicationData);
    return data;
  },
};