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
    const { data } = await apiClient.post('/auth/verify', { token });
    return data;
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