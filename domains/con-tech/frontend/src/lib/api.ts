import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3006';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Access Token for API authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('API Interceptor: No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.log('API Interceptor: Error in request interceptor', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Clear authentication data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Dispatch a custom event to notify other tabs about logout
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;