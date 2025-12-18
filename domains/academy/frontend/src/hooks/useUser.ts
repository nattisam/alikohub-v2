import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import type { UserContextType } from "../contexts/UserContext";

export const useUser = (): UserContextType => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    // Return default values instead of throwing an error
    return {
      isLoggedIn: false,
      login: async () => false,
      logout: () => { },
      currentUser: null,
      language: "En",
      setLanguage: () => { },
      notifications: [],
      loginLoading: false,
      loginError: null,
      signupError: null,
      signupLoading: false,
      clearLoginError: () => { },
      clearSignupError: () => { },
      setCurrentUser: () => { },
      register: async () => false,
      selectRole: async () => { }
    };
  }

  return userContext;
};