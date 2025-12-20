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

      // Update to ExtendedUser type
      const user: ExtendedUser = {
        ...response.data.user,
        hasSelectedRole: response.data.user.hasSelectedRole !== undefined ? response.data.user.hasSelectedRole : false,
        academyRole: response.data.user.academyRole || null
      };

      // Fetch the user's academy profile to ensure we have the latest role information
      try {
        const profileResponse = await academyApi.get("/profile");
        if (profileResponse.data) {
          user.hasSelectedRole = profileResponse.data.hasSelectedRole !== undefined ? profileResponse.data.hasSelectedRole : false;
          user.academyRole = profileResponse.data.role || user.academyRole;

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
      return true;
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
    // Clear any stored tokens or session data if needed
    // For example, if using localStorage:
    // localStorage.removeItem('authToken');
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