import axios from "axios";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "https://api.consultancy.alikohub.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add Firebase token dynamically
api.interceptors.request.use(async (config) => {
  try {
    // Import Firebase modules
    const { getAuth } = await import("firebase/auth");
    const { getApps, initializeApp, getApp } = await import("firebase/app");

    // Import config
    const firebaseConfig = (await import("@/config/firebase")).default;

    // Initialize Firebase if not already initialized
    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    const auth = getAuth(app);

    if (auth.currentUser) {
      // Get fresh ID token
      const token = await auth.currentUser.getIdToken(true);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Fallback to localStorage token if Firebase user not available
      const localToken = localStorage.getItem("accessToken");
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
      }
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
    // Fallback to localStorage token
    const localToken = localStorage.getItem("accessToken");
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`;
    }
  }

  return config;
});

export default api;
