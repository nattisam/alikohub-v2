import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://api.consultancy.alikohub.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 UNAUTHORIZED
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      // Don't redirect here, let the UI handle it (ProtectedRoute)
    }
    return Promise.reject(error);
  },
);

export default api;
