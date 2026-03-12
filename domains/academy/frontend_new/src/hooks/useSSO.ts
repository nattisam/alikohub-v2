import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { User } from "@/types/auth";

// Firebase v9+ modular imports
import { getAuth, onIdTokenChanged, signOut } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
  reload: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
}

const getFirebaseAuth = async () => {
  try {
    // Import config
    const firebaseConfig = (await import("@/config/firebase")).default;

    // Initialize Firebase if not already initialized
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    return getAuth();
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    return null;
  }
};

interface SSOState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  emailVerified: boolean;
}

export const useSSO = () => {
  const [state, setState] = useState<SSOState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    emailVerified: false,
  });

  // Initialize Firebase auth and set up observer
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        const firebaseAuth = await getFirebaseAuth();

        if (!firebaseAuth) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            emailVerified: false,
          });
          return;
        }

        // Set up the onIdTokenChanged observer
        unsubscribe = onIdTokenChanged(
          firebaseAuth,
          async (firebaseUser: FirebaseUser | null) => {
            const localSession = authService.getSession();
            const hasLocalSession =
              !!localSession.accessToken && !!localSession.user;

            if (firebaseUser) {
              try {
                // Get fresh ID token
                const idToken = await firebaseUser.getIdToken(true);

                if (hasLocalSession) {
                  // Prefer the local API session if it exists (e.g. standard login)
                  // Let the backend profile manage the roles instead of overwriting with Firebase defaults.
                  setState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: localSession.user,
                    emailVerified: firebaseUser.emailVerified,
                  });
                  return;
                }

                // Get user data from our backend or use Firebase user data
                const userData: User = {
                  id: parseInt(firebaseUser.uid) || Date.now(),
                  firebaseId: firebaseUser.uid,
                  firstname: firebaseUser.displayName?.split(" ")[0] || "",
                  lastname: firebaseUser.displayName?.split(" ")[1] || "",
                  email: firebaseUser.email || "",
                  globalRole: "STUDENT", // Default role
                  profilePicture: firebaseUser.photoURL,
                  bio: null,
                  status: "ACTIVE",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  academyUser: null,
                  consultancyUser: null,
                  contechUser: null,
                  eventsUser: null,
                  careersUser: null,
                  academyRole: "student",
                  academyActiveRole: "student",
                  academyStatus: "ACTIVE",
                  careersRole: "",
                  careersStatus: "",
                };

                // Set session in our auth service
                authService.setSession(idToken, "", userData);

                setState({
                  isAuthenticated: true,
                  isLoading: false,
                  user: userData,
                  emailVerified: firebaseUser.emailVerified,
                });
              } catch (error) {
                console.error("Error handling Firebase user:", error);
                setState({
                  isAuthenticated: false,
                  isLoading: false,
                  user: null,
                  emailVerified: false,
                });
              }
            } else {
              if (hasLocalSession) {
                // User logged in locally but not on Firebase, keep them logged in
                setState({
                  isAuthenticated: true,
                  isLoading: false,
                  user: localSession.user,
                  emailVerified: false,
                });
              } else {
                // User is signed out completely
                authService.logout();
                setState({
                  isAuthenticated: false,
                  isLoading: false,
                  user: null,
                  emailVerified: false,
                });
              }
            }
          },
        );
      } catch (error) {
        console.error("Error initializing Firebase auth:", error);
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          emailVerified: false,
        });
      }
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Manual sign out method
  const signOutUser = async () => {
    try {
      const firebaseAuth = await getFirebaseAuth();
      if (firebaseAuth) {
        await signOut(firebaseAuth);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      // Still clear local state even if Firebase sign out fails
      authService.logout();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        emailVerified: false,
      });
    }
  };

  // Force token refresh
  const refreshToken = async () => {
    try {
      const firebaseAuth = await getFirebaseAuth();
      if (firebaseAuth && firebaseAuth.currentUser) {
        await firebaseAuth.currentUser.getIdToken(true);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return {
    ...state,
    signOut: signOutUser,
    refreshToken,
  };
};
