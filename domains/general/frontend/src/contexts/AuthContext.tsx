import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";

type User = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  globalRole: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const authService = AuthService.getInstance();
        const { user, verified } = await authService.verifySession();
        if (verified && user) {
          setUser(user);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    const authService = AuthService.getInstance();
    const user = await authService.login({ email, password });
    setUser(user);
  };

  const logout = async () => {
    console.log("AuthContext: Logging out");
    const authService = AuthService.getInstance();
    await authService.logout();
    setUser(null);
    console.log("AuthContext: User state cleared");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
