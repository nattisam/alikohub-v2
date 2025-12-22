import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import type { CurrentUser, LoginCredentials, SignupCredentials } from "../types.ts";

// Backend response structure
interface AuthResponse {
  user: CurrentUser;
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
  selectRole: (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => void;
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
        const token = localStorage.getItem('firebaseCustomToken');
        
        // If we have both user data and a token, verify the token
        if (userData && token) {
          // Verify token with auth service
          try {
            const response = await authAPI.verifyToken(token);
            if (response.user) {
              setUser(response.user);
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('user');
              localStorage.removeItem('firebaseCustomToken');
            }
          } catch (error) {
            // Verification failed, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('firebaseCustomToken');
          }
        } else if (userData) {
          // We have user data but no token, clear storage
          localStorage.removeItem('user');
        }
      } catch (error) {
        // If there's an error, clear any invalid user data
        localStorage.removeItem('user');
        localStorage.removeItem('firebaseCustomToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authAPI.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      // Save user data and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('firebaseCustomToken', data.firebaseCustomToken);
      
      // Update user state
      setUser(data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const response = await authAPI.register(credentials);
      return response;
    },
    onSuccess: (data) => {
      // Save user data and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('firebaseCustomToken', data.firebaseCustomToken);
      
      // Update user state
      setUser(data.user);
    },
  });

  const login = async (email: string, password: string) => {
    try {
      const credentials: LoginCredentials = { email, password };
      await loginMutation.mutateAsync(credentials);
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

  const logout = () => {
    // Clear user data and token
    localStorage.removeItem('user');
    localStorage.removeItem('firebaseCustomToken');
    
    // Reset user state
    setUser(null);
    
    // Invalidate queries
    queryClient.invalidateQueries();
  };

  const updateUser = (updatedUser: CurrentUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const selectRole = (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    if (user) {
      const updatedUser = {
        ...user,
        academyRole: role
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    selectRole,
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