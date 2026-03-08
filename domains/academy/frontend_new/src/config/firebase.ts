// Firebase configuration for AlikoHub
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alikohub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alikohub",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alikohub.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id",
};

export default firebaseConfig;
