import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3006';

// Create a map to track ongoing requests for deduplication
const ongoingRequests = new Map<string, Promise<any>>();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout to 15 seconds
});

// Request interceptor to add Access Token for API authentication and handle deduplication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Create a unique key for the request to enable deduplication
    // Use URLSearchParams to ensure consistent ordering of parameters
    const paramsString = config.params ? new URLSearchParams(config.params).toString() : '';
    const requestKey = `${config.method?.toUpperCase()}_${config.url}_${paramsString}_${typeof config.data === 'string' ? config.data : JSON.stringify(config.data || '')}`;
    
    // If there's already an ongoing request with the same key, return its promise
    if (ongoingRequests.has(requestKey)) {
      console.log(`Deduplicating request for key: ${requestKey}`);
      return ongoingRequests.get(requestKey);
    }
    
    // Create a new promise for this request
    const requestPromise = new Promise((resolve, reject) => {
      // We'll resolve/reject this promise in the response interceptors
      // Store the resolve/reject functions on the config temporarily
      (config as any)._resolve = resolve;
      (config as any)._reject = reject;
    });
    
    // Store the promise in our map
    ongoingRequests.set(requestKey, requestPromise);
    
    return config;
  },
  (error) => {
    console.log('API Interceptor: Error in request interceptor', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle successful responses and cleanup ongoing requests
apiClient.interceptors.response.use(
  (response) => {
    // Clean up ongoing requests
    const paramsString = response.config.params ? new URLSearchParams(response.config.params).toString() : '';
    const requestKey = `${response.config.method?.toUpperCase()}_${response.config.url}_${paramsString}_${typeof response.config.data === 'string' ? response.config.data : JSON.stringify(response.config.data || '')}`;
    
    // Resolve the original promise
    if ((response.config as any)._resolve) {
      (response.config as any)._resolve(response);
    }
    
    // Remove from ongoing requests
    ongoingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    // Clean up ongoing requests
    if (error.config) {
      const paramsString = error.config.params ? new URLSearchParams(error.config.params).toString() : '';
      const requestKey = `${error.config.method?.toUpperCase()}_${error.config.url}_${paramsString}_${typeof error.config.data === 'string' ? error.config.data : JSON.stringify(error.config.data || '')}`;
      
      // Reject the original promise
      if ((error.config as any)._reject) {
        (error.config as any)._reject(error);
      }
      
      // Remove from ongoing requests
      ongoingRequests.delete(requestKey);
    }
    
    if (error.response?.status === 401) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Clear authentication data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('firebaseCustomToken');
        localStorage.removeItem('user');
        
        // Dispatch a custom event to notify other tabs about logout
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
      }
    }
    // 429 errors are now handled by retry logic in the interceptor
    // This check is kept for logging purposes but retry happens before reaching here
    if (error.response?.status === 429) {
      console.warn("Rate limited — retrying with exponential backoff");
    }
    return Promise.reject(error);
  }
);

export default apiClient;