import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";
import type { CurrentUser } from "../types";

interface UserContextType {
  currentUser: CurrentUser | null;
  isLoggedIn: boolean;
  login: (user: CurrentUser) => void;
  logout: () => void;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authService = AuthService.getInstance();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { user, verified } = await authService.verifySession();
        if (verified && user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        } else {
          // Clear any invalid auth state
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to verify session:", error);
        // Clear auth state on error
        setCurrentUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (user: CurrentUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails on the server, clear local state
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  };

  const isAdmin = authService.isAdmin(currentUser);

  // Don't render children until we've checked the session
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider
      value={{ currentUser, isLoggedIn, login, logout, isAdmin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
