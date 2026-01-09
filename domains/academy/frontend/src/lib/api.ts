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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('firebaseCustomToken');
        localStorage.removeItem('user');
      }
    }
    if (error.response?.status === 429) {
      console.warn("Rate limited — slowing down requests");
      // Add a delay before rejecting the promise to allow rate limit to reset
      return new Promise((resolve) => {
        setTimeout(() => resolve(Promise.reject(error)), 2000);
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;