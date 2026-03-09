import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => authService.getSession().user,
    staleTime: Infinity, // The user data is managed manually via mutations
  });

  const hasRole = (role: string) => {
    if (!user) return false;
    // Adapt based on how roles are checked in AlikoHub generic roles.
    return user.globalRole === role;
  };

  return (
    <AuthContext.Provider value={{
      user: user || null,
      loading: isLoading,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
