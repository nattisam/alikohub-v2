import { useEffect, useState } from "react";
import type { INotification, Language, SignupForm } from "../components/types.d";
import { academyApi, authApi } from "../api";
import { UserContext } from "../contexts/UserContext";
import type { AcademyRole, ExtendedUser } from "../contexts/UserContext"; // Fix import

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null); // Update type
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("En");
  const [notifications, setNotifications] = useState<INotification[]>([])

  const login = async (email: string, password: string): Promise<boolean> => {
    // login request to the api
    try {
      setLoginLoading(true);
      setLoginError(null);
      const response = await authApi.post("/login/", {
        email: email,
        password: password,
      });

      // Validate user data
      if (validateUser(response.data.user)) {
        // Update to ExtendedUser type
        const user: ExtendedUser = {
          ...response.data.user,
          hasSelectedRole: response.data.user.hasSelectedRole !== undefined ? response.data.user.hasSelectedRole : false,
          academyRole: (response.data.user.role || response.data.user.academyRole) as AcademyRole || null
        };

        // Fetch the user's academy profile to ensure we have the latest role information
        try {
          const profileResponse = await academyApi.get("/profile");
          if (profileResponse.data) {
            user.hasSelectedRole = profileResponse.data.hasSelectedRole !== undefined ? profileResponse.data.hasSelectedRole : false;
            user.academyRole = (profileResponse.data.role || user.academyRole) as AcademyRole || null;

            // If the user has any role other than null/undefined, they've selected a role
            // But we still want to show the modal if hasSelectedRole is false
            if (profileResponse.data.hasSelectedRole === undefined) {
              // If hasSelectedRole is not in the response, default to false to show the modal
              user.hasSelectedRole = false;
            }
          }
        } catch (profileError) {
          console.error("Failed to fetch user profile:", profileError);
          // If we can't fetch the profile, default to showing the role selection modal
          user.hasSelectedRole = false;
        }

        console.log('Login successful, user data:', user);
        setCurrentUser(user);
        setIsLoggedIn(true);
        
        // Broadcast SSO login success to other domains
        const token = response.data.token || response.data.accessToken;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          window.postMessage({
            type: 'SSO_LOGIN_SUCCESS',
            token: token
          }, '*');
          
          // Also send legacy auth state change message
          window.postMessage({
            type: 'AUTH_STATE_CHANGED',
            token: token,
            action: 'LOGIN'
          }, '*');
        }
        
        return true;
      } else {
        console.log("Invalid user data in login response:", response.data.user);
        setLoginError("Invalid user data received");
        return false;
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || error.message || String(error);
      setLoginError(errorMessage);
      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    console.log('UserContextProvider: logout called');
    setIsLoggedIn(false);
    setCurrentUser(null);
    // Clear any stored tokens or session data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Broadcast SSO logout to other domains
    window.postMessage({
      type: 'SSO_LOGOUT'
    }, '*');
    
    // Also send legacy auth state change message
    window.postMessage({
      type: 'AUTH_STATE_CHANGED',
      action: 'LOGOUT'
    }, '*');
    
    console.log('UserContextProvider: logout completed');
  };

  const register = async ({
    firstname,
    lastname,
    email,
    password,
  }: SignupForm): Promise<boolean> => {
    try {
      setSignupLoading(true);
      setSignupError(null);
      const response = await authApi.post("/register", {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      });

      // After successful registration, don't automatically log in
      // Instead, return true to indicate success and let the UI redirect to login
      if (response.status === 200 || response.status === 201)
        return true;
      else throw new Error("Registration failed");
    } catch (e: any) {
      console.error(e);
      const errorMessage = e.response?.data?.message || e.message || String(e);
      setSignupError(errorMessage);
      return false;
    } finally {
      setSignupLoading(false);
    }
  };

  // Add selectRole function
  const selectRole = async (role: AcademyRole): Promise<void> => {
    try {
      const response = await academyApi.post("/profile/select-role", { role });

      if (response.status === 200 || response.status === 201) {
        // After successful role selection, fetch the updated user profile
        try {
          const profileResponse = await academyApi.get("/profile");
          console.log('Updated profile data:', profileResponse.data);

          // Update the current user with the selected role and updated profile data
          setCurrentUser(prevUser => {
            if (prevUser) {
              const updatedUser = {
                ...prevUser,
                ...profileResponse.data,
                role: role, // Also update the role property for consistency
                academyRole: role,
                hasSelectedRole: true
              };
              console.log('User context updated with profile data:', updatedUser);
              return updatedUser;
            }
            return null;
          });
        } catch (profileError) {
          console.error("Failed to fetch updated profile:", profileError);
          // Fallback to just updating the role and hasSelectedRole
          setCurrentUser(prevUser => {
            if (prevUser) {
              const updatedUser = {
                ...prevUser,
                role: role, // Also update the role property for consistency
                academyRole: role,
                hasSelectedRole: true
              };
              console.log('User context updated (fallback):', updatedUser);
              return updatedUser;
            }
            return null;
          });
        }
      }
    } catch (error: any) {
      console.error("Role selection failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to select role";
      throw new Error(errorMessage);
    }
  };

  const clearLoginError = () => {
    setLoginError(null);
  };

  const clearSignupError = () => {
    setSignupError(null);
  };

  const validateUser = (user: any): user is ExtendedUser => {
    return (
      user !== null &&
      user !== undefined &&
      typeof user.id === "number" &&
      typeof user.email === "string" &&
      typeof user.firstname === "string" &&
      (user.lastname === undefined || typeof user.lastname === "string") &&
      (user.globalRole === "USER" || user.globalRole === "ADMIN") &&
      (user.status === "active" || user.status === "ACTIVE")
    );
  };

  const retrieveNotifications = async () => {
    if (!currentUser) return;

    try {
      const response = await academyApi.get("/notifications/me");
      const notifs = await response.data;
      console.log("###########Notifications#####################\n", notifs);
      setNotifications(notifs);
    } catch (error) {
      console.error("Failed to retrieve notifications:", error);
    }
  }

  // Verify existing session on app load
  useEffect(() => {
    const verifySession = async (token?: string) => {
      try {
        // Try to verify session with the auth service
        // Get token from localStorage or cookies if not provided
        const storedToken = token || localStorage.getItem('authToken');
              
        let response;
        if (storedToken) {
          response = await authApi.post("/verify", { token: storedToken });
        } else {
          // If no token, try without payload (might work with cookies)
          response = await authApi.post("/verify");
        }
        
        if (response.status === 200 || response.status === 201) {
          // Handle different response structures
          const userData = response.data.user || response.data;
          
          if (validateUser(userData)) {
            // Create ExtendedUser object
            const user: ExtendedUser = {
              ...userData,
              // Map the role from the User interface to the ExtendedUser interface
              academyRole: (userData.role || userData.academyRole) as AcademyRole || null,
              hasSelectedRole: userData.hasSelectedRole !== undefined ? userData.hasSelectedRole : false
            };
            
            // Fetch the user's academy profile to ensure we have the latest role information
            try {
              const profileResponse = await academyApi.get("/profile");
              if (profileResponse.data) {
                user.hasSelectedRole = profileResponse.data.hasSelectedRole !== undefined ? profileResponse.data.hasSelectedRole : false;
                user.academyRole = (profileResponse.data.role || user.academyRole) as AcademyRole || null;
              }
            } catch (profileError) {
              console.error("Failed to fetch user profile:", profileError);
              user.hasSelectedRole = false;
            }
            
            console.log('Session verified, user data:', user);
            setCurrentUser(user);
            setIsLoggedIn(true);
            
            // Store token and user data in localStorage for future use and SSO
            if (storedToken) {
              localStorage.setItem('authToken', storedToken);
            }
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            console.log("Invalid user data in verifySession:", userData);
          }
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        // Clear auth state if verification fails
        setIsLoggedIn(false);
        setCurrentUser(null);
        // Try to load user from localStorage as fallback
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            // Validate the user data before setting it
            if (validateUser(user)) {
              setCurrentUser(user);
              setIsLoggedIn(true);
            }
          } catch (e) {
            console.error("Failed to parse user from localStorage:", e);
          }
        }
      }
    };

    verifySession();
    
    // Listen for user login events from other parts of the application
    const handleUserLogin = () => {
      console.log('User logged in event detected, verifying session...');
      verifySession();
    };
    
    // Also listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && e.newValue) {
        console.log('Auth token changed in localStorage, verifying session...');
        verifySession();
      }
    };
    
    // Listen for cross-origin messages for SSO
    const handleMessage = (event: MessageEvent) => {
      // Security check - only accept messages from trusted origins
      const trustedOrigins = [
        window.location.origin,
        'http://localhost:5173',  // general frontend dev
        'http://localhost:5174',  // academy frontend dev
        // Add production domains as needed
        'https://alikohub.com'
      ];
      
      if (event.origin && !trustedOrigins.includes(event.origin)) {
        return; // Ignore messages from untrusted origins
      }
      
      // Handle SSO login messages
      if (event.data && event.data.type === 'SSO_LOGIN_SUCCESS' && event.data.token) {
        console.log('SSO login detected, verifying session...');
        // Store the token and verify session
        localStorage.setItem('authToken', event.data.token);
        verifySession(event.data.token);
        
        // Broadcast to other tabs/windows that we've processed the login
        window.postMessage({
          type: 'AUTH_STATE_SYNC',
          action: 'LOGIN_PROCESSED',
          timestamp: Date.now()
        }, '*');
      }
      // Handle SSO logout messages
      else if (event.data && event.data.type === 'SSO_LOGOUT') {
        console.log('SSO logout detected, clearing session...');
        // Clear local auth state
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setCurrentUser(null);
        
        // Broadcast to other tabs/windows that we've processed the logout
        window.postMessage({
          type: 'AUTH_STATE_SYNC',
          action: 'LOGOUT_PROCESSED',
          timestamp: Date.now()
        }, '*');
      }
      // Handle legacy auth state change messages
      else if (event.data && event.data.type === 'AUTH_STATE_CHANGED') {
        console.log('Received auth state change message:', event.data);
        
        if (event.data.action === 'LOGIN' && event.data.token) {
          console.log('Processing login from cross-origin message');
          // Store the token and verify session
          localStorage.setItem('authToken', event.data.token);
          verifySession(event.data.token);
        } else if (event.data.action === 'LOGOUT') {
          console.log('Processing logout from cross-origin message');
          // Clear local auth state
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      }
      // Handle sync confirmation messages
      else if (event.data && event.data.type === 'AUTH_STATE_SYNC') {
        console.log('Received auth state sync confirmation:', event.data.action);
      }
    };
    
    // Check for existing auth state from other domains on load
    const checkExistingAuthState = () => {
      // Request current auth state from other windows/tabs
      window.postMessage({
        type: 'AUTH_STATE_REQUEST',
        timestamp: Date.now()
      }, '*');
      
      // Set a timeout to verify our own session if no response
      setTimeout(() => {
        verifySession();
      }, 1000);
    };
    
    // Listen for auth state requests from other domains
    const handleAuthStateRequest = (event: MessageEvent) => {
      // Security check
      const trustedOrigins = [
        window.location.origin,
        'http://localhost:5173',  // general frontend dev
        'http://localhost:5174',  // academy frontend dev
        // Add production domains as needed
        'https://alikohub.com'
      ];
      
      if (event.origin && !trustedOrigins.includes(event.origin)) {
        return; // Ignore messages from untrusted origins
      }
      
      // Respond with current auth state if requested
      if (event.data && event.data.type === 'AUTH_STATE_REQUEST') {
        console.log('Responding to auth state request');
        // Send current auth state to requesting window
        event.source?.postMessage({
          type: 'AUTH_STATE_RESPONSE',
          isLoggedIn: isLoggedIn,
          user: currentUser,
          timestamp: Date.now()
        }, '*');
      }
      // Handle auth state responses
      else if (event.data && event.data.type === 'AUTH_STATE_RESPONSE') {
        console.log('Received auth state response:', event.data);
        // If another window is logged in and we're not, sync the state
        if (event.data.isLoggedIn && !isLoggedIn && event.data.user) {
          console.log('Syncing auth state from another window');
          setCurrentUser(event.data.user);
          setIsLoggedIn(true);
          // Verify the session with the server
          verifySession();
        }
      }
    };
    
    window.addEventListener('userLoggedIn', handleUserLogin);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);
    window.addEventListener('message', handleAuthStateRequest);
    
    // Check for existing auth state when app loads
    checkExistingAuthState();
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('message', handleAuthStateRequest);
    };
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    if (currentUser) {
      retrieveNotifications();
    }
  }, [currentUser]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        register,
        login,
        clearLoginError,
        clearSignupError,
        currentUser,
        setCurrentUser,
        notifications,
        language,
        setLanguage,
        loginLoading,
        loginError,
        signupError,
        signupLoading,
        logout,
        selectRole, // Add this new method
      }}
    >
      {children}
    </UserContext.Provider>
  );
};