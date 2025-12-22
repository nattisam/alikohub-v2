import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase Custom Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebaseCustomToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('firebaseCustomToken');
      localStorage.removeItem('user');
      // We don't automatically redirect in the academy app like in general app
      // The UI components will handle the unauthorized state
    }
    return Promise.reject(error);
  }
);

export default apiClient;