import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AppRole =
  | "super_admin"
  | "program_admin"
  | "enrollment_officer"
  | "instructor"
  | "support";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: AppRole[];
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: AuthUser = {
  id: "tech-admin-mock-id",
  email: "admin@technology.com",
  fullName: "Tech Admin",
  roles: ["super_admin"],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No-op for mock auth
  }, []);

  const signIn = async (email: string, password: string) => {
    setUser(MOCK_USER);
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setUser(MOCK_USER);
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
  };

  const hasRole = (role: AppRole) => user?.roles.includes(role) ?? false;
  const isAdmin = (user?.roles.length ?? 0) > 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null,
        loading,
        signIn,
        signUp,
        signOut,
        hasRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
