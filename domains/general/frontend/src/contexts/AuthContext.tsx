import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import type { CurrentUser, LoginCredentials, SignupCredentials } from "../types.ts";

// Backend response structure
interface AuthResponse {
  user: CurrentUser;
  accessToken: string;
  firebaseCustomToken: string;
}

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');
        
        // If we have both user data and a token, verify the token
        if (userData && token) {
          // Verify token with auth service
          try {
            const response = await authAPI.verifyToken(token);
            if (response.user) {
              setUser(response.user);
            } else {
              // Token is invalid, fall back to stored user data
              try {
                setUser(JSON.parse(userData));
              } catch {
                setUser(null);
              }
            }
          } catch (error) {
            // Verification failed, fall back to stored user data
            try {
              setUser(JSON.parse(userData));
            } catch {
              setUser(null);
            }
          }
        } else if (userData) {
          // We have user data but no token, try to use stored user data
          try {
            setUser(JSON.parse(userData));
          } catch {
            setUser(null);
          }
        }
      } catch (error) {
        // If there's an error, try to use stored user data
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
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
    mutationFn: async (credentials: LoginCredentials) => {
      const response: AuthResponse = await authAPI.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      // Save user data and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('firebaseCustomToken', data.firebaseCustomToken);
      
      // Update user state
      setUser(data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const response: AuthResponse = await authAPI.register(credentials);
      return response;
    },
    onSuccess: (data) => {
      // Save user data and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('firebaseCustomToken', data.firebaseCustomToken);
      
      // Update user state
      setUser(data.user);
    },
  });

  const login = async (email: string, password: string) => {
    try {
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
    } catch (error) {
      // Re-throw to let the calling component handle the error
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      await signupMutation.mutateAsync(credentials);
    } catch (error) {
      // Re-throw to let the calling component handle the error
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Store current location before clearing storage
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      
      // Call the backend logout endpoint if it exists
      try {
        await authAPI.logout();
      } catch (error) {
        // If logout endpoint doesn't exist or fails, continue with local cleanup
        console.log('Logout endpoint may not exist, proceeding with local cleanup');
      }
      
      // Clear user data and token
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('firebaseCustomToken');
      
      // Reset user state
      setUser(null);
      
      // Invalidate queries
      queryClient.invalidateQueries();
      
      // Dispatch a custom event to notify other tabs about logout
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      // Redirect to login with return URL
      window.location.href = `/auth/login?returnTo=${encodeURIComponent(currentPath)}`;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (updatedUser: CurrentUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};