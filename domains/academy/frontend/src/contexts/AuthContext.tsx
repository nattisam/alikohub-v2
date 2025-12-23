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
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  selectRole: (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("AuthContext: Starting authentication initialization");
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("firebaseCustomToken");
  
        console.log(
          "AuthContext: Found userData:",
          userData,
          "and token:",
          token
        );
  
        // If we have both user data and a token, verify the token
        if (userData && token) {
          console.log(
            "AuthContext: Both userData and token found, proceeding with verification"
          );
          
          // First, parse the stored user data to check for existing role selection
          let storedUser = null;
          try {
            storedUser = JSON.parse(userData);
            console.log("AuthContext: Parsed stored user data:", {
              id: storedUser?.id,
              email: storedUser?.email,
              academyRole: storedUser?.academyRole,
              hasSelectedRole: storedUser?.hasSelectedRole,
              academyProfile: storedUser?.academyProfile
            });
          } catch (e) {
            console.error("AuthContext: Error parsing stored user data:", e);
          }

          // Verify token with auth service
          try {
            console.log(
              "AuthContext: Calling authAPI.verifyToken with token"
            );
            const response = await authAPI.verifyToken(token);
            
            if (response.user) {
              console.log("AuthContext: Token verification successful");
              
              // Transform auth service response to match expected structure
              const transformedUser = {
                ...response.user,
                // Flatten academyUser data if it exists
                academyRole: response.user.academyUser?.role,
                hasSelectedRole: response.user.academyUser?.hasSelectedRole,
                // Move academyUser to academyProfile to match expected structure
                academyProfile: response.user.academyUser || undefined
              };
              
              // If we have a stored user with a role, fetch fresh data and merge
              if (storedUser?.academyRole && storedUser?.hasSelectedRole) {
                console.log("AuthContext: User had previously selected role, fetching fresh academy profile");
                                
                // Fetch the academy profile to get the latest role information
                try {
                  const academyProfile = await academyAPI.getProfile();
                  console.log("AuthContext: Academy profile fetched on initialization:", academyProfile);
                                  
                  // Merge the fresh academy profile with the transformed user
                  const mergedUser = {
                    ...transformedUser,
                    academyRole: academyProfile.role || storedUser.academyRole,
                    hasSelectedRole: academyProfile.hasSelectedRole || storedUser.hasSelectedRole,
                    academyProfile: {
                      ...transformedUser.academyProfile,
                      ...academyProfile
                    }
                  };
                                  
                  console.log("AuthContext: Merged user data with academy profile:", mergedUser);
                  setUser(mergedUser);
                  localStorage.setItem("user", JSON.stringify(mergedUser));
                  setIsLoading(false);
                  return; // Skip the rest of the initialization
                } catch (profileError) {
                  console.error("AuthContext: Failed to fetch academy profile on init, using stored data:", profileError);
                                  
                  // Fall back to using stored user data
                  const fallbackUser = {
                    ...transformedUser,
                    academyRole: storedUser.academyRole,
                    hasSelectedRole: storedUser.hasSelectedRole,
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
                  return; // Skip the rest of the initialization
                }
              }
              
              // If no stored role, fetch the academy profile
              console.log("AuthContext: Fetching academy profile...");
              try {
                const academyProfile = await academyAPI.getProfile();
                console.log("AuthContext: Academy profile fetched:", {
                  role: academyProfile.role,
                  hasSelectedRole: academyProfile.hasSelectedRole
                });
                
                // Determine the effective role and selection status
                const hasSelectedRole = academyProfile.hasSelectedRole || 
                                      (storedUser?.hasSelectedRole === true) ||
                                      (storedUser?.academyProfile?.hasSelectedRole === true);
                
                const effectiveRole = hasSelectedRole ? 
                  (academyProfile.role || storedUser?.academyRole || transformedUser.academyRole) :
                  (storedUser?.academyRole || transformedUser.academyRole || academyProfile.role);

                const mergedUser = {
                  ...transformedUser,
                  academyRole: effectiveRole,
                  hasSelectedRole: hasSelectedRole,
                  academyProfile: {
                    ...transformedUser.academyProfile,
                    ...academyProfile,
                    hasSelectedRole: hasSelectedRole,
                    role: effectiveRole
                  }
                };
                console.log("AuthContext: Merged user data:", mergedUser);
                console.log("AuthContext: Setting user state with merged data");
                setUser(mergedUser);
                // Also save to localStorage to persist the academy profile data
                localStorage.setItem("user", JSON.stringify(mergedUser));
              } catch (profileError) {
                console.error(
                  "AuthContext: Failed to fetch academy profile:",
                  profileError
                );
                
                // Check if it's a 404 error (API not found)
                const isNotFound = profileError?.response?.status === 404;
                
                // If it's a 404, we should still allow the user to proceed but mark that we couldn't fetch profile
                if (isNotFound) {
                  console.log("AuthContext: Academy profile API not found during token verification, proceeding with basic user data");
                  
                  // Use the transformed user data but mark that we couldn't fetch the profile
                  const fallbackUser = {
                    ...transformedUser,
                    // We don't have academy role data, so we'll rely on localStorage or prompt for role selection
                    academyRole: transformedUser.academyRole || null,
                    hasSelectedRole: transformedUser.hasSelectedRole || false,
                    academyProfile: transformedUser.academyProfile || null
                  };
                  
                  setUser(fallbackUser);
                  localStorage.setItem("user", JSON.stringify(fallbackUser));
                } else {
                  // For other errors, try to use localStorage data
                  let localStorageUserData = {};
                  try {
                    localStorageUserData = JSON.parse(userData);
                    console.log(
                      "AuthContext: Parsed localStorage user data:",
                      localStorageUserData
                    );
                  } catch (parseError) {
                    console.error(
                      "AuthContext: Error parsing localStorage user data:",
                      parseError
                    );
                    // If parsing fails, use an empty object
                    localStorageUserData = {};
                  }

                  // Preserve role selection state from localStorage or use default from response
                  const hasSelectedRole = localStorageUserData.hasSelectedRole || 
                                       localStorageUserData.academyProfile?.hasSelectedRole || 
                                       false;
                                        
                  const preservedRole = localStorageUserData.academyRole || 
                                     transformedUser.academyRole;

                  const mergedUser = {
                    ...transformedUser,
                    academyRole: preservedRole,
                    hasSelectedRole: hasSelectedRole,
                    academyProfile: {
                      ...transformedUser.academyProfile,
                      ...localStorageUserData.academyProfile,
                      hasSelectedRole: hasSelectedRole,
                      role: preservedRole
                    }
                  };
                  console.log("AuthContext: Merged user data:", mergedUser);
                  console.log("AuthContext: Setting user state with merged data");
                  setUser(mergedUser);
                  localStorage.setItem("user", JSON.stringify(mergedUser));
                }
              }
            } else {
              // Token is invalid, clear storage
              console.log(
                "AuthContext: Token verification returned no user, clearing storage"
              );
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
              console.log(
                "AuthContext: Using existing localStorage user data:",
                localStorageUserData
              );
              setUser(localStorageUserData);
            } catch (parseError) {
              console.error(
                "AuthContext: Could not parse existing user data either:",
                parseError
              );
            }
          }
        } else if (userData) {
          // We have user data but no token
          // This can happen during role selection or page transitions
          // Don't clear storage immediately, let the auth flow continue
          console.log(
            "AuthContext: Have user data but no token, continuing with existing data"
          );
          try {
            const localStorageUserData = JSON.parse(userData);
            console.log(
              "AuthContext: Using existing localStorage user data:",
              localStorageUserData
            );
            setUser(localStorageUserData);
          } catch (parseError) {
            console.error(
              "AuthContext: Could not parse existing user data:",
              parseError
            );
          }
        } else {
          console.log(
            "AuthContext: No user data or token found, user is not authenticated"
          );
        }
      } catch (error) {
        // If there's an error in the overall initialization, don't clear storage
        // The user data and token might still be valid
        console.error("AuthContext: Auth initialization error:", error);
      } finally {
        console.log(
          "AuthContext: Finished initialization, setting isLoading to false"
        );
        setIsLoading(false);
      }
    };

    console.log("AuthContext: useEffect triggered");
    initializeAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authAPI.login(credentials);
      return response;
    },
    onSuccess: async (data) => {
      console.log('AuthContext: Login mutation successful, processing response');
      // Transform auth service response to match expected structure
      const transformedUser = {
        ...data.user,
        // Flatten academyUser data if it exists
        academyRole: data.user.academyUser?.role,
        hasSelectedRole: data.user.academyUser?.hasSelectedRole,
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
        console.log(
          "AuthContext: Academy profile fetched on login:",
          academyProfile
        );
        
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
          hasSelectedRole,
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
        console.error(
          "AuthContext: Failed to fetch academy profile on login:",
          profileError
        );
        
        // Check if it's a 404 error (API not found)
        const isNotFound = profileError?.response?.status === 404;
        
        // If it's a 404, we should still allow the user to proceed but mark that we couldn't fetch profile
        if (isNotFound) {
          console.log("AuthContext: Academy profile API not found, proceeding with basic user data");
          
          // Use the transformed user data but mark that we couldn't fetch the profile
          const fallbackUser = {
            ...transformedUser,
            // We don't have academy role data, so we'll rely on localStorage or prompt for role selection
            academyRole: transformedUser.academyRole || null,
            hasSelectedRole: transformedUser.hasSelectedRole || false,
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
        console.log(
          "AuthContext: Academy profile fetched on signup:",
          academyProfile
        );
        
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
          hasSelectedRole: hasSelectedRole,
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
        console.error(
          "AuthContext: Failed to fetch academy profile on signup:",
          profileError
        );
        
        // Check if it's a 404 error (API not found)
        const isNotFound = profileError?.response?.status === 404;
        
        // If it's a 404, we should still allow the user to proceed but mark that we couldn't fetch profile
        if (isNotFound) {
          console.log("AuthContext: Academy profile API not found, proceeding with basic user data");
          
          // Use the transformed user data but mark that we couldn't fetch the profile
          const fallbackUser = {
            ...transformedUser,
            // We don't have academy role data, so we'll rely on localStorage or prompt for role selection
            academyRole: transformedUser.academyRole || null,
            hasSelectedRole: transformedUser.hasSelectedRole || false,
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
      console.log('AuthContext: Starting login for:', email);
      const credentials: LoginCredentials = { email, password };
      const result = await loginMutation.mutateAsync(credentials);
      
      // Log the user data after successful login
      if (result?.user) {
        console.log('AuthContext: Login successful, user data:', {
          id: result.user.id,
          email: result.user.email,
          academyRole: result.user.academyRole,
          hasSelectedRole: result.user.hasSelectedRole,
          academyProfile: result.user.academyProfile
        });
      }
      
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
    console.log("AuthContext: logout called");
    // Clear user data and tokens
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("firebaseCustomToken");

    // Reset user state
    setUser(null);
    console.log("AuthContext: user data cleared");
  };

  const updateUser = (updatedUser: CurrentUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const selectRole = async (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    console.log("AuthContext: selectRole called with role:", role);
    console.log("AuthContext: current user before update:", {
      id: user?.id,
      email: user?.email,
      academyRole: user?.academyRole,
      hasSelectedRole: user?.hasSelectedRole,
      academyProfile: user?.academyProfile
    });
    
    if (user) {
      try {
        console.log("AuthContext: Calling academyAPI.selectRole with role:", role);
        const response = await academyAPI.selectRole(role);
        console.log("AuthContext: Role selection API response:", response);
        
        // Create updated user with role and hasSelectedRole set to true
        const updatedUser = {
          ...user,
          academyRole: role,
          hasSelectedRole: true, // Mark that user has selected a role
          academyProfile: {
            ...user.academyProfile,
            hasSelectedRole: true,
            role: role,
            updatedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
        
        console.log("AuthContext: Updated user object:", {
          id: updatedUser.id,
          email: updatedUser.email,
          academyRole: updatedUser.academyRole,
          hasSelectedRole: updatedUser.hasSelectedRole,
          academyProfile: updatedUser.academyProfile
        });
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("AuthContext: User data saved to localStorage");
      } catch (error) {
        console.error("AuthContext: Failed to select role on backend:", error);
        // Even if backend fails, still update the frontend state
        const updatedUser = {
          ...user,
          academyRole: role,
          hasSelectedRole: true, // Mark that user has selected a role
          academyProfile: {
            ...user.academyProfile,
            hasSelectedRole: true,
            role: role
          }
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } else {
      console.log("AuthContext: No user found, cannot set role");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
