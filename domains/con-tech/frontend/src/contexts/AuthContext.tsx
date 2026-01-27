import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import { contechAPI } from "../services/api";

import type {
  CurrentUser,
  LoginCredentials,
  SignupCredentials,
} from "../components/types";




interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  refreshProfile: () => Promise<CurrentUser | null>;
  selectRole: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildUser = (user: any): CurrentUser => {
  // Determine the current role and if user has selected a role
  // For con-tech, use contechRole if available, otherwise default to global role
  const currentRole = user.contechRole || user.role || 'USER';
  const hasSelectedRole = currentRole && currentRole !== 'USER';
  
  return {
    ...user,
    role: currentRole.toUpperCase(),
    hasSelectedRole: hasSelectedRole,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      const rawUser = localStorage.getItem("user");

      if (!token || !rawUser) {
        setIsLoading(false);
        return;
      }

      try {
        // First, try to use the stored user data without verification
        const parsed = JSON.parse(rawUser);
        setUser(parsed);
        
        // Check if token is likely expired before making API call
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            // If token expires in more than 1 minute, use it without verification
            if (payload.exp && payload.exp > currentTime + 60) {
              setIsLoading(false);
              return;
            }
          }
        } catch (decodeError) {
          console.warn('Could not decode token, proceeding with verification:', decodeError);
        }
        
        // Verify the token in the background
        const verified = await authAPI.verifyToken(token);
        const finalUser = buildUser(verified.user);
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      } catch (error) {
        // If verification fails, clear the stored data
        console.error('Token verification failed:', error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
    
    // Listen for logout events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key === 'accessToken' || e.key === 'user') {
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('user')) {
          setUser(null);
        }
      }
    };
    
    // Listen for custom logout event dispatched by other tabs
    const handleUserLoggedOut = () => {
      setUser(null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: async (data) => {
      // Store the token first to make it available for subsequent API calls
      localStorage.setItem("accessToken", data.token);
      if (data.firebaseCustomToken) {
        localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);
      }
      
      try {
        // Use the user data from the response which may contain updated role information
        const finalUser = buildUser(data.user);

        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      } catch (error) {
        // If profile fetch fails, we should still have the user data from login
        // Build user with the login response data as fallback
        const finalUser = buildUser(data.user);
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
        
        console.error('Error processing user data after login:', error);
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: (credentials: SignupCredentials) => authAPI.register(credentials),
    onSuccess: async (data) => {
      // Store the token first to make it available for subsequent API calls
      localStorage.setItem("accessToken", data.token);
      if (data.firebaseCustomToken) {
        localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);
      }

      try {
        // Use the user data from the response which may contain updated role information
        const finalUser = buildUser(data.user);

        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      } catch (error) {
        // If profile fetch fails, we should still have the user data from registration
        // Build user with the registration response data as fallback
        const finalUser = buildUser(data.user);
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
        
        console.error('Error processing user data after signup:', error);
      }
    },
  });

  const login = async (credentials: LoginCredentials) => {
    const response = await loginMutation.mutateAsync(credentials);
    
    // Use the user data from the response to determine redirect destination
    const userData = buildUser(response.user);
    
    // Check for return URL in query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const returnTo = searchParams.get('returnTo');
    
    if (returnTo) {
      // Decode and navigate to the return URL
      const decodedReturnTo = decodeURIComponent(returnTo);
      // Ensure the return URL is safe (starts with / to prevent external redirects)
      if (decodedReturnTo.startsWith('/')) {
        window.location.href = decodedReturnTo;
      } else {
        // Check if user has selected a role to determine redirect destination
        if (userData && userData.hasSelectedRole) {
          // If user has already selected a role, redirect to appropriate dashboard
          if (userData.role === 'CLIENT') {
            window.location.href = "/client";
          } else if (userData.role === 'CONTRACTOR') {
            window.location.href = "/contractor";
          } else if (userData.role === 'ADMIN') {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        } else {
          // If user hasn't selected a role, redirect to role selection
          window.location.href = "/role-selection";
        }
      }
    } else {
      // Check if user has selected a role to determine redirect destination
      if (userData && userData.hasSelectedRole) {
        // If user has already selected a role, redirect to appropriate dashboard
        if (userData.role === 'CLIENT') {
          window.location.href = "/client";
        } else if (userData.role === 'CONTRACTOR') {
          window.location.href = "/contractor";
        } else if (userData.role === 'ADMIN') {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        // If user hasn't selected a role, redirect to role selection
        window.location.href = "/role-selection";
      }
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    const response = await signupMutation.mutateAsync(credentials);
    
    // Use the user data from the response to determine redirect destination
    const userData = buildUser(response.user);
    
    // Check if user has selected a role to determine redirect destination
    if (userData && userData.hasSelectedRole) {
      // If user has already selected a role, redirect to appropriate dashboard
      if (userData.role === 'CLIENT') {
        window.location.href = "/client";
      } else if (userData.role === 'CONTRACTOR') {
        window.location.href = "/contractor";
      } else if (userData.role === 'ADMIN') {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } else {
      // If user hasn't selected a role, redirect to role selection
      window.location.href = "/role-selection";
    }
  };

  const logout = () => {
    // Store current location before clearing storage
    const currentPath = window.location.pathname + window.location.search + window.location.hash;
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    
    // Dispatch a custom event to notify other tabs about logout
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    
    // Redirect to login with return URL
    window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
  };

  const updateUser = (u: CurrentUser) => {
    const updatedUser = buildUser(u);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const refreshProfile = async () => {
    if (!user) return null;
    try {
      const profile = await contechAPI.getProfile();
      const updated = buildUser(profile);
      // Use updateUser to ensure consistent user object structure
      updateUser(updated);
      return updated;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return null;
    }
  };

  const selectRole = async (role: string) => {
    try {
      const result = await contechAPI.selectRole(role);
      // Update the user with the new role information and hasSelectedRole status
      // Refresh the profile to get updated user data from the backend
      const updatedUserData = await contechAPI.getProfile();
      const finalUser = buildUser(updatedUserData);
      setUser(finalUser);
      localStorage.setItem('user', JSON.stringify(finalUser));
      
      return result;
    } catch (error) {
      console.error('Error selecting role:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        refreshProfile,
        selectRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};