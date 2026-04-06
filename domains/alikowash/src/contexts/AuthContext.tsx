import { createContext, useContext, ReactNode } from "react";
import { useUser, useLogin, useLogout } from "@/hooks/useAuth";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();
  const { mutateAsync: loginMutation } = useLogin();
  const logout = useLogout();

  const isAdmin =
    !!user &&
    (user.globalRole === "ADMIN" ||
      user.isAdmin === true ||
      user.role === "admin");

  const signIn = async (email: string, password: string) => {
    try {
      await loginMutation({ email, password });
      return { error: null };
    } catch (error: any) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, isAdmin, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
