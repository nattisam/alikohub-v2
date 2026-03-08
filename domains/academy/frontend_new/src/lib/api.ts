import axios from "axios";

const api = axios.create({
  baseURL: "https://api.consultancy.alikohub.com",
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

    // Prioritize localStorage token as it reflects active Academy session/role
    const localToken = localStorage.getItem("accessToken");
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`;
      return config;
    }

    if (auth.currentUser) {
      // Fallback to Firebase ID token
      const token = await auth.currentUser.getIdToken(true);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
