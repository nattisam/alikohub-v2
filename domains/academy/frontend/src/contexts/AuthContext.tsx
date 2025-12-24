import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI, academyAPI } from "../services/api";
import type {
  CurrentUser,
  LoginCredentials,
  SignupCredentials,
} from "../types";

// Backend response structure
interface AuthResponse {
  user: CurrentUser;
  firebaseCustomToken: string;
}

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRoleSwitching: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  selectRole: (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => Promise<void>;
  addRole: (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => Promise<void>;
  switchRole: (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => void;
  refreshProfile: () => Promise<CurrentUser | null>;
  applyAsInstructor: (applicationData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("firebaseCustomToken");

        // If we have both user data and a token, verify the token
        if (userData && token) {
          // First, parse the stored user data to check for existing role selection
          let storedUser = null;
          try {
            storedUser = JSON.parse(userData);
          } catch (e) {
            console.error("AuthContext: Error parsing stored user data:", e);
          }

          // Verify token with auth service
          try {
            const response = await authAPI.verifyToken(token);
            
            if (response.user) {
              // Transform auth service response to match expected structure
              const transformedUser = {
                ...response.user,
                // Flatten academyUser data if it exists
                academyRole: response.user.academyUser?.role,
                hasSelectedRole: response.user.academyUser?.hasSelectedRole,
                // Add role status information if it exists
                roleStatus: response.user.roleStatus || {
                  instructor: 'active', // Default status
                },
                // Move academyUser to academyProfile to match expected structure
                academyProfile: response.user.academyUser || undefined
              };
              
              // ALWAYS fetch the academy profile to get the latest role information
              // This is important because role might have been approved in the backend
              try {
                const academyProfile = await academyAPI.getProfile();
                
                // Backend profile is the source of truth for role and hasSelectedRole
                const effectiveRole = academyProfile.role;
                const hasSelectedRole = academyProfile.hasSelectedRole;
                
                const mergedUser = {
                  ...transformedUser,
                  academyRole: effectiveRole,
                  currentRole: effectiveRole,
                  availableRoles: effectiveRole ? [effectiveRole] : [],
                  hasSelectedRole: hasSelectedRole,
                  roleStatus: {
                    ...transformedUser.roleStatus,
                    ...storedUser?.roleStatus,
                    // If role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
                    instructor: effectiveRole === 'INSTRUCTOR' && hasSelectedRole ? 'active' : (storedUser?.roleStatus?.instructor || 'pending')
                  },
                  academyProfile: {
                    ...transformedUser.academyProfile,
                    ...academyProfile
                  }
                };
                
                setUser(mergedUser);
                localStorage.setItem("user", JSON.stringify(mergedUser));
                setIsLoading(false);
                return;
              } catch (profileError) {
                console.error("AuthContext: Failed to fetch academy profile on init:", profileError);
                                  
                  // Fall back to using stored user data
                  const fallbackUser = {
                    ...transformedUser,
                    academyRole: storedUser.academyRole,
                    currentRole: storedUser.currentRole || storedUser.academyRole,
                    availableRoles: storedUser.availableRoles || (storedUser.academyRole ? [storedUser.academyRole] : []),
                    hasSelectedRole: storedUser.hasSelectedRole,
                    roleStatus: {
                      ...transformedUser.roleStatus,
                      ...storedUser.roleStatus
                    },
                    academyProfile: {
                      ...transformedUser.academyProfile,
                      ...storedUser.academyProfile,
                      hasSelectedRole: storedUser.hasSelectedRole,
                      role: storedUser.academyRole
                    }
                  };
                                  
                  setUser(fallbackUser);
                  localStorage.setItem("user", JSON.stringify(fallbackUser));
                  setIsLoading(false);
                  return;
                }
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem("user");
              localStorage.removeItem("firebaseCustomToken");
            }
          } catch (error) {
            // Verification failed, but don't clear storage immediately
            // The token might still be valid, just couldn't verify right now
            console.error(
              "AuthContext: Token verification failed with error:",
              error
            );
            // Try to use existing data
            try {
              const localStorageUserData = JSON.parse(userData);
              // Ensure currentRole is set from academyRole if not present
              const userWithRole = {
                ...localStorageUserData,
                currentRole: localStorageUserData.currentRole || localStorageUserData.academyRole,
                availableRoles: localStorageUserData.availableRoles || (localStorageUserData.academyRole ? [localStorageUserData.academyRole] : [])
              };
              setUser(userWithRole);
            } catch (parseError) {
              console.error(
                "AuthContext: Could not parse existing user data either:",
                parseError
              );
            }
          }
        }
         else if (userData) {
          // We have user data but no token
          // This can happen during role selection or page transitions
          // Don't clear storage immediately, let the auth flow continue
          try {
            const localStorageUserData = JSON.parse(userData);
            // Ensure currentRole is set from academyRole if not present
            const userWithRole = {
              ...localStorageUserData,
              currentRole: localStorageUserData.currentRole || localStorageUserData.academyRole,
              availableRoles: localStorageUserData.availableRoles || (localStorageUserData.academyRole ? [localStorageUserData.academyRole] : [])
            };
            setUser(userWithRole);
          } catch (parseError) {
            console.error(
              "AuthContext: Could not parse existing user data:",
              parseError
            );
          }
        } else {
          // No user data or token found, user is not authenticated
        }
      } catch (error) {
        // If there's an error in the overall initialization, don't clear storage
        // The user data and token might still be valid
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
    onSuccess: async (data) => {
      // Transform auth service response to match expected structure
      const transformedUser = {
        ...data.user,
        // Flatten academyUser data if it exists
        academyRole: data.user.academyUser?.role,
        hasSelectedRole: data.user.academyUser?.hasSelectedRole,
        // Add role status information if it exists
        roleStatus: data.user.roleStatus || {
          instructor: 'active', // Default status
        },
        // Move academyUser to academyProfile to match expected structure
        academyProfile: data.user.academyUser || undefined
      };
      
      // Save transformed user data and token to localStorage BEFORE making other API calls
      // Use accessToken for API authentication, firebaseCustomToken for Firebase SDK
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);
      localStorage.setItem("user", JSON.stringify(transformedUser));

      // Small delay to ensure localStorage is updated before making API calls
      // This helps ensure the interceptor picks up the token
      await new Promise(resolve => setTimeout(resolve, 10));

      // Fetch the academy profile to get the latest role information
      try {
        const academyProfile = await academyAPI.getProfile();
        
        // Check if user has already selected a role in the past
        // Also check localStorage for previously selected role
        const localStorageUserData = localStorage.getItem("user");
        let parsedLocalStorageData = null;
        try {
          parsedLocalStorageData = JSON.parse(localStorageUserData || '{}');
        } catch (e) {
          console.error("AuthContext: Error parsing localStorage user data:", e);
        }
        
        // Priority: 1. Check if academy profile says user has selected role, 2. Check localStorage
        const hasSelectedRole = academyProfile.hasSelectedRole || 
                              (parsedLocalStorageData?.hasSelectedRole === true) ||
                              (transformedUser.academyProfile?.hasSelectedRole === true);
        
        // Use the academy profile role if the user has already selected it
        // Otherwise, preserve role from localStorage if available
        const effectiveRole = hasSelectedRole ? 
          (academyProfile.role || parsedLocalStorageData?.academyRole || transformedUser.academyRole) :
          (parsedLocalStorageData?.academyRole || transformedUser.academyRole || academyProfile.role);

        const updatedUser = {
          ...transformedUser,
          academyRole: effectiveRole,
          currentRole: effectiveRole,
          availableRoles: effectiveRole ? [effectiveRole] : [],
          hasSelectedRole,
          roleStatus: {
            ...transformedUser.roleStatus,
            ...parsedLocalStorageData?.roleStatus,
            // If role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: effectiveRole === 'INSTRUCTOR' && hasSelectedRole ? 'active' : (parsedLocalStorageData?.roleStatus?.instructor || 'pending')
          },
          academyProfile: {
            ...transformedUser.academyProfile,
            ...academyProfile,
            hasSelectedRole,
            role: effectiveRole
          }
        };
        
        // Update user state
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (profileError) {
        
        // Check if it's a 404 error (API not found)
        const isNotFound = profileError?.response?.status === 404;
        
        // If it's a 404, we should still allow the user to proceed but mark that we couldn't fetch profile
        if (isNotFound) {
          
          // Use the transformed user data but mark that we couldn't fetch the profile
          const fallbackUser = {
            ...transformedUser,
            // We don't have academy role data, so we'll rely on localStorage or prompt for role selection
            academyRole: transformedUser.academyRole || null,
            hasSelectedRole: transformedUser.hasSelectedRole || false,
            roleStatus: transformedUser.roleStatus || {
              instructor: 'active', // Default status
            },
            academyProfile: transformedUser.academyProfile || null
          };
          
          setUser(fallbackUser);
          localStorage.setItem("user", JSON.stringify(fallbackUser));
        } else {
          // For other errors, still use the transformed user data
          setUser(transformedUser);
          localStorage.setItem("user", JSON.stringify(transformedUser));
        }
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const response = await authAPI.register(credentials);
      return response;
    },
    onSuccess: async (data) => {
      // Transform auth service response to match expected structure
      const transformedUser = {
        ...data.user,
        // Flatten academyUser data if it exists
        academyRole: data.user.academyUser?.role,
        hasSelectedRole: data.user.academyUser?.hasSelectedRole,
        // Add role status information if it exists
        roleStatus: data.user.roleStatus || {
          instructor: 'active', // Default status
        },
        // Move academyUser to academyProfile to match expected structure
        academyProfile: data.user.academyUser || undefined
      };
      
      // Save transformed user data and token to localStorage BEFORE making other API calls
      // Use accessToken for API authentication, firebaseCustomToken for Firebase SDK
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);
      localStorage.setItem("user", JSON.stringify(transformedUser));

      // Small delay to ensure localStorage is updated before making API calls
      // This helps ensure the interceptor picks up the token
      await new Promise(resolve => setTimeout(resolve, 10));

      // Fetch the academy profile to get the latest role information
      try {
        const academyProfile = await academyAPI.getProfile();
        
        // Check localStorage for previously selected role
        const localStorageUserData = localStorage.getItem("user");
        let parsedLocalStorageData = null;
        try {
          parsedLocalStorageData = JSON.parse(localStorageUserData || '{}');
        } catch (e) {
          console.error("AuthContext: Error parsing localStorage user data:", e);
        }
        
        // For new users, hasSelectedRole should be false, so we preserve the default role
        // But also check if user had previously selected a role in localStorage
        const hasSelectedRole = academyProfile.hasSelectedRole || 
                              (parsedLocalStorageData?.hasSelectedRole === true);
        
        const effectiveRole = hasSelectedRole ? 
          (academyProfile.role || parsedLocalStorageData?.academyRole || transformedUser.academyRole) :
          (parsedLocalStorageData?.academyRole || transformedUser.academyRole || academyProfile.role);

        const updatedUser = {
          ...transformedUser,
          academyRole: effectiveRole,
          currentRole: effectiveRole,
          availableRoles: effectiveRole ? [effectiveRole] : [],
          hasSelectedRole: hasSelectedRole,
          roleStatus: {
            ...transformedUser.roleStatus,
            ...parsedLocalStorageData?.roleStatus,
            // If role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: effectiveRole === 'INSTRUCTOR' && hasSelectedRole ? 'active' : (parsedLocalStorageData?.roleStatus?.instructor || 'pending')
          },
          academyProfile: {
            ...transformedUser.academyProfile,
            ...academyProfile,
            hasSelectedRole: hasSelectedRole,
            role: effectiveRole
          }
        };
        
        // Update user state
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (profileError) {
        
        // Check if it's a 404 error (API not found)
        const isNotFound = profileError?.response?.status === 404;
        
        // If it's a 404, we should still allow the user to proceed but mark that we couldn't fetch profile
        if (isNotFound) {
          
          // Use the transformed user data but mark that we couldn't fetch the profile
          const fallbackUser = {
            ...transformedUser,
            // We don't have academy role data, so we'll rely on localStorage or prompt for role selection
            academyRole: transformedUser.academyRole || null,
            hasSelectedRole: transformedUser.hasSelectedRole || false,
            roleStatus: transformedUser.roleStatus || {
              instructor: 'active', // Default status
            },
            academyProfile: transformedUser.academyProfile || null
          };
          
          setUser(fallbackUser);
          localStorage.setItem("user", JSON.stringify(fallbackUser));
        } else {
          // For other errors, still use the transformed user data
          setUser(transformedUser);
          localStorage.setItem("user", JSON.stringify(transformedUser));
        }
      }
    },
  });

  const login = async (email: string, password: string) => {
    try {
      const credentials: LoginCredentials = { email, password };
      const result = await loginMutation.mutateAsync(credentials);
      
      return result;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      // Re-throw to let the calling component handle the error
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      await signupMutation.mutateAsync(credentials);
    } catch (error: any) {
      // Handle specific error cases for better UX
      if (error?.response?.status === 409) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      } else if (error?.response?.status === 400) {
        throw new Error('Invalid registration data. Please check your information and try again.');
      } else {
        throw new Error('Registration failed. Please try again later.');
      }
    }
  };

  const logout = () => {
    // Clear user data and tokens
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("firebaseCustomToken");

    // Reset user state
    setUser(null);
  };

  const updateUser = (updatedUser: CurrentUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const addRole = async (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    if (user) {
      try {
        // Call the backend API to add the role
        await academyAPI.selectRole(role); // Using the same API endpoint for now
        
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Update the user with the new role
        const updatedUser = {
          ...user,
          availableRoles: [...new Set([...(user.availableRoles || []), role])], // Add role to available roles
          currentRole: user.currentRole || role, // Set as current role if no current role
          academyRole: role, // Set as current academy role
          hasSelectedRole: true,
          roleStatus: {
            ...user.roleStatus,
            // Get instructor status from backend - if role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: role === 'INSTRUCTOR' ? (academyProfile.hasSelectedRole && academyProfile.role === 'INSTRUCTOR' ? 'active' : (user.roleStatus?.instructor || 'pending')) : (user.roleStatus?.instructor || 'pending')
          },
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile,
            role: role,
            hasSelectedRole: true,
          }
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Even if backend fails, still update the frontend state
        const updatedUser = {
          ...user,
          availableRoles: [...new Set([...(user.availableRoles || []), role])], // Add role to available roles
          currentRole: user.currentRole || role, // Set as current role if no current role
          academyRole: role, // Set as current academy role
          hasSelectedRole: true,
          roleStatus: {
            ...user.roleStatus,
            // Get instructor status from backend - if role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: role === 'INSTRUCTOR' ? (academyProfile.hasSelectedRole && academyProfile.role === 'INSTRUCTOR' ? 'active' : (user.roleStatus?.instructor || 'pending')) : (user.roleStatus?.instructor || 'pending')
          },
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile,
            role: role,
            hasSelectedRole: true,
          }
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };

  const switchRole = async (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    if (user && user.availableRoles?.includes(role)) {
      setIsRoleSwitching(true);
      try {
        // Call the backend API to refresh the JWT with the new role
        const response = await academyAPI.switchRole(role);
        
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Update the user with the new role
        const updatedUser = {
          ...user,
          currentRole: role,
          academyRole: role, // Update current academy role
          roleStatus: {
            ...user.roleStatus,
            // Get instructor status from backend - if role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: role === 'INSTRUCTOR' ? (academyProfile.hasSelectedRole && academyProfile.role === 'INSTRUCTOR' ? 'active' : (user.roleStatus?.instructor || 'pending')) : (user.roleStatus?.instructor || 'pending')
          },
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile,
            role: role,
          }
        };
        
        // Update tokens with the new JWT
        localStorage.setItem("accessToken", response.accessToken);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Navigate to the appropriate dashboard based on the new role
        if (role === "STUDENT") {
          window.location.href = "/dashboard";
        } else if (role === "INSTRUCTOR") {
          window.location.href = "/instructor";
        } else if (role === "ADMIN") {
          window.location.href = "/admin";
        }
      } catch (error) {
        console.error("Failed to switch role and refresh JWT:", error);
        
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Fallback: update the role in frontend only
        const updatedUser = {
          ...user,
          currentRole: role,
          academyRole: role, // Update current academy role
          roleStatus: {
            ...user.roleStatus,
            // Get instructor status from backend - if role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: role === 'INSTRUCTOR' ? (academyProfile.hasSelectedRole && academyProfile.role === 'INSTRUCTOR' ? 'active' : (user.roleStatus?.instructor || 'pending')) : (user.roleStatus?.instructor || 'pending')
          },
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile,
            role: role,
          }
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Navigate to the appropriate dashboard based on the new role
        if (role === "STUDENT") {
          window.location.href = "/dashboard";
        } else if (role === "INSTRUCTOR") {
          window.location.href = "/instructor";
        } else if (role === "ADMIN") {
          window.location.href = "/admin";
        }
      } finally {
        setIsRoleSwitching(false);
      }
    }
  };

  const selectRole = async (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    if (user) {
      try {
        const response = await academyAPI.selectRole(role);
        
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Create updated user with role and hasSelectedRole set to true
        const updatedUser = {
          ...user,
          academyRole: role,
          currentRole: role, // Set as current role
          hasSelectedRole: true, // Mark that user has selected a role
          roleStatus: {
            ...user.roleStatus,
            // Get instructor status from backend - if role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: role === 'INSTRUCTOR' ? (academyProfile.hasSelectedRole && academyProfile.role === 'INSTRUCTOR' ? 'active' : (user.roleStatus?.instructor || 'pending')) : (user.roleStatus?.instructor || 'pending')
          },
          availableRoles: [...new Set([...(user.availableRoles || []), role])], // Add role to available roles
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile,
            role: role,
            updatedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Even if backend fails, still update the frontend state
        const updatedUser = {
          ...user,
          academyRole: role,
          currentRole: role, // Set as current role
          hasSelectedRole: true, // Mark that user has selected a role
          roleStatus: {
            ...user.roleStatus,
            // Get instructor status from backend - if role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: role === 'INSTRUCTOR' ? (academyProfile.hasSelectedRole && academyProfile.role === 'INSTRUCTOR' ? 'active' : (user.roleStatus?.instructor || 'pending')) : (user.roleStatus?.instructor || 'pending')
          },
          availableRoles: [...new Set([...(user.availableRoles || []), role])], // Add role to available roles
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile,
            role: role
          }
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Backend profile is the source of truth for role and hasSelectedRole
        const effectiveRole = academyProfile.role;
        const hasSelectedRole = academyProfile.hasSelectedRole;
        
        // Get current user data from localStorage to preserve other properties
        const localStorageUserData = localStorage.getItem("user");
        let parsedLocalStorageData = null;
        try {
          parsedLocalStorageData = JSON.parse(localStorageUserData || '{}');
        } catch (e) {
          console.error("AuthContext: Error parsing localStorage user data:", e);
        }
        
        // Determine available roles based on backend profile
        // The backend profile should contain information about all roles the user has access to
        const backendRoles: string[] = [];
        
        // Add the main role from the profile if it exists
        if (academyProfile.role) {
          backendRoles.push(academyProfile.role);
        }
        
        // If user has instructor status, add INSTRUCTOR to available roles
        if (user.roleStatus?.instructor) {
          if (!backendRoles.includes('INSTRUCTOR')) {
            backendRoles.push('INSTRUCTOR');
          }
        }
        
        const updatedUser = {
          ...user,
          academyRole: effectiveRole,
          currentRole: effectiveRole,
          hasSelectedRole: hasSelectedRole,
          // Update available roles to include all roles from backend
          availableRoles: [...new Set([...(user.availableRoles || []), ...backendRoles])],
          roleStatus: {
            ...user.roleStatus,
            // If role is INSTRUCTOR and hasSelectedRole is true, mark as active (approved)
            instructor: effectiveRole === 'INSTRUCTOR' && hasSelectedRole ? 'active' : (user.roleStatus?.instructor || 'pending')
          },
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile,
            hasSelectedRole,
            role: effectiveRole
          }
        };
        
        // Update user state and localStorage
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        return updatedUser;
      } catch (error) {
        console.error("AuthContext: Failed to refresh profile:", error);
        // Return the current user if refresh fails
        return user;
      }
    }
    return user;
  };

  const applyAsInstructor = async (applicationData: any) => {
    if (user) {
      try {
        // Call the backend API to apply as instructor
        await academyAPI.applyTeacher(applicationData);
        
        // Fetch the latest academy profile to get the most up-to-date role information
        const academyProfile = await academyAPI.getProfile();
        
        // Update the user with the new role status
        const updatedUser = {
          ...user,
          // Add instructor to available roles if not already there
          availableRoles: user.availableRoles?.includes('INSTRUCTOR') ? user.availableRoles : [...(user.availableRoles || []), 'INSTRUCTOR'],
          roleStatus: {
            ...user.roleStatus,
            // Set instructor status based on backend response
            instructor: academyProfile.role === 'INSTRUCTOR' && academyProfile.hasSelectedRole ? 'active' : 'pending'
          },
          academyProfile: {
            ...user.academyProfile,
            ...academyProfile
          }
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to apply as instructor:', error);
        
        // Even if the application fails, refresh the profile to get current status
        try {
          const academyProfile = await academyAPI.getProfile();
          
          const updatedUser = {
            ...user,
            roleStatus: {
              ...user.roleStatus,
              instructor: academyProfile.role === 'INSTRUCTOR' && academyProfile.hasSelectedRole ? 'active' : (user.roleStatus?.instructor || 'pending')
            },
            academyProfile: {
              ...user.academyProfile,
              ...academyProfile
            }
          };
          
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (refreshError) {
          console.error('Failed to refresh profile after application attempt:', refreshError);
        }
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isRoleSwitching,
    login,
    signup,
    logout,
    updateUser,
    selectRole,
    addRole,
    switchRole,
    refreshProfile,
    applyAsInstructor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};