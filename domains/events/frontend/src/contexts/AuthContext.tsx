import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI, eventsAPI } from "../services/api";
import { AuthTokenManager } from "../services/apiClient";
import type { CurrentUser, LoginCredentials, SignupCredentials, RoleAssignment, RoleAssignmentResponse } from "../types/api";

declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRoleSwitching: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  selectRole: (role: "USER" | "ORGANIZER") => Promise<any>;
  refreshProfile: () => Promise<CurrentUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const buildUser = (userData: any): CurrentUser => {
  return {
    ...userData,
    eventsRole: userData.eventsUser?.role || userData.role,
    eventsStatus: userData.eventsUser?.status || 'active',
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);
  const queryClient = useQueryClient();

  // Query to get current user profile
  const { data: user, isLoading, refetch } = useQuery<CurrentUser | null>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          return null;
        }
        
        const parsedUser = JSON.parse(userData);
        
        // Try to fetch fresh profile data
        try {
          const profile = await eventsAPI.getProfile();
          const finalUser = buildUser(profile);
          localStorage.setItem('user', JSON.stringify(finalUser));
          return finalUser;
        } catch {
          // If profile fetch fails, return the stored user data
          return buildUser(parsedUser);
        }
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Effect for handling logout synchronization across tabs
  useEffect(() => {
    // Listen for logout events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key === 'accessToken' || e.key === 'user') {
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('user')) {
          queryClient.setQueryData(['user'], null);
        }
      }
    };
    
    // Listen for custom logout event dispatched by other tabs
    const handleUserLoggedOut = () => {
      queryClient.setQueryData(['user'], null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, [queryClient]);

  // Mutation for login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: async (data) => {
      // Store the token first to make it available for subsequent API calls
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);

      try {
        // Fetch user profile to get the latest role information
        const profile = await eventsAPI.getProfile();
        const finalUser = buildUser(data.user);

        localStorage.setItem("user", JSON.stringify(finalUser));
        queryClient.setQueryData(['user'], finalUser);
      } catch (error) {
        // If profile fetch fails, we should still have the user data from login
        // Build user with the login response data as fallback
        const finalUser = buildUser(data.user);
        localStorage.setItem("user", JSON.stringify(finalUser));
        queryClient.setQueryData(['user'], finalUser);
        
        console.error('Error fetching profile after login:', error);
      }
    },
  });

  // Mutation for signup
  const signupMutation = useMutation({
    mutationFn: (credentials: SignupCredentials) => authAPI.register(credentials),
    onSuccess: async (data) => {
      // Store the token first to make it available for subsequent API calls
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);

      try {
        // Fetch user profile to get the latest role information
        const profile = await eventsAPI.getProfile();
        const finalUser = buildUser(data.user);

        localStorage.setItem("user", JSON.stringify(finalUser));
        queryClient.setQueryData(['user'], finalUser);
      } catch (error) {
        // If profile fetch fails, we should still have the user data from registration
        // Build user with the registration response data as fallback
        const finalUser = buildUser(data.user);
        localStorage.setItem("user", JSON.stringify(finalUser));
        queryClient.setQueryData(['user'], finalUser);
        
        console.error('Error fetching profile after signup:', error);
      }
    },
  });

  const login = async (email: string, password: string) => {
    const credentials: LoginCredentials = { email, password };
    
    // Check for return URL in query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const returnTo = searchParams.get('returnTo');
    
    await loginMutation.mutateAsync(credentials);
    
    if (returnTo) {
      // Decode and navigate to the return URL
      const decodedReturnTo = decodeURIComponent(returnTo);
      // Ensure the return URL is safe (starts with / to prevent external redirects)
      if (decodedReturnTo.startsWith('/')) {
        window.location.href = decodedReturnTo;
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    await signupMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    try {
      // Store current location before clearing storage
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      
      // Clear user data and token
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('firebaseCustomToken');
      
      // Remove any other related storage items
      localStorage.removeItem("user_data");
      localStorage.removeItem("event_registrations");
      
      // Reset user state in cache
      queryClient.setQueryData(['user'], null);
      
      // Remove auth tokens
      AuthTokenManager.removeToken();
      
      // Invalidate queries
      queryClient.invalidateQueries();
      
      // Dispatch a custom event to notify other tabs about logout
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      // Redirect to login with return URL
      window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (updatedUser: CurrentUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    queryClient.setQueryData(['user'], updatedUser);
  };

  const selectRole = async (role: "USER" | "ORGANIZER") => {
    if (!user) return;

    setIsRoleSwitching(true);
    try {
      const res = await eventsAPI.selectRole(role);
      
      // Refresh the user data after role selection
      const updatedUserFromResponse = await eventsAPI.getProfile();
      const updated = buildUser(updatedUserFromResponse);
      
      updateUser(updated);
      
      return res;
    } catch (error) {
      console.error("Error in selectRole:", error);
      throw error;
    } finally {
      setIsRoleSwitching(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return null;
    try {
      const profile = await eventsAPI.getProfile();
      const updated = buildUser(profile);
      updateUser(updated);
      return updated;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return user;
    }
  };

  const contextValue: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user && AuthTokenManager.isAuthenticated(),
    isLoading,
    isRoleSwitching,
    login,
    signup,
    logout,
    updateUser,
    selectRole,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook for checking specific roles
export const useRole = (requiredRole: "USER" | "ORGANIZER") => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.eventsRole === requiredRole;
};

// Hook for checking if user is an organizer
export const useIsOrganizer = () => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.eventsRole === "ORGANIZER";
};

export default AuthProvider;
