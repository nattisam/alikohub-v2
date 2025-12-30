import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { authAPI, academyAPI } from "../services/api";

import type {
  CurrentUser,
  LoginCredentials,
  SignupCredentials,
} from "../types";

type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRoleSwitching: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  selectRole: (role: Role) => Promise<any>;
  switchRole: (role: Role) => Promise<void>;
  refreshProfile: () => Promise<CurrentUser | null>;
  applyAsInstructor: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildUser = (user: any): CurrentUser => {
  const academyUser = user.academyUser;
  
  // Convert backend lowercase roles to frontend uppercase format
  const convertRoleToUppercase = (role: string) => {
    if (!role) return role;
    
    switch (role.toLowerCase()) {
      case 'instructor':
      case 'teacher':
        return 'INSTRUCTOR';
      case 'student':
        return 'STUDENT';
      case 'admin':
        return 'ADMIN';
      case 'user':
        return 'USER';
      case 'course_manager':
        return 'COURSE_MANAGER';
      default:
        return role.toUpperCase();
    }
  };

  const convertedAcademyUser = academyUser ? {
    ...academyUser,
    role: convertRoleToUppercase(academyUser.role),
    activeRole: convertRoleToUppercase(academyUser.activeRole),
  } : null;

  return {
    ...user,
    academyUser: convertedAcademyUser,
    academyRole: convertRoleToUppercase(academyUser?.role) ?? 'USER',
    academyActiveRole: convertRoleToUppercase(user.academyActiveRole) ?? convertRoleToUppercase(academyUser?.activeRole) ?? convertRoleToUppercase(academyUser?.role) ?? 'USER',

    hasSelectedRole: convertedAcademyUser?.role && convertedAcademyUser.role !== 'USER',

    // Include INSTRUCTOR in availableRoles if user has applied and been approved
    // Include INSTRUCTOR if the user has an approved instructor application status
    availableRoles: [
      'STUDENT',
      // Include INSTRUCTOR if user's role is INSTRUCTOR or if they have an approved instructor application
      ...((convertedAcademyUser?.role === 'INSTRUCTOR' || user.roleStatus?.instructor === 'approved') ? ['INSTRUCTOR'] : []),
      ...(user.globalRole === 'ADMIN' ? ['ADMIN'] : []),
    ],
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      const rawUser = localStorage.getItem("user");

      if (!token || !rawUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(rawUser);
        const { user: verified } = await authAPI.verifyToken(token);
        const profile = await academyAPI.getProfile();
        const finalUser = buildUser(verified);
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      } catch {
        try {
          setUser(JSON.parse(rawUser));
        } catch {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const loginMutation = useMutation({
    mutationFn: (c: LoginCredentials) => authAPI.login(c),
    onSuccess: async (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);

      // Use the user data from the response which may contain updated role information
      const profile = await academyAPI.getProfile();
      const finalUser = buildUser(data.user);

      setUser(finalUser);
      localStorage.setItem("user", JSON.stringify(finalUser));
    },
  });

  const signupMutation = useMutation({
    mutationFn: (c: SignupCredentials) => authAPI.register(c),
    onSuccess: async (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);

      // Use the user data from the response which may contain updated role information
      const profile = await academyAPI.getProfile();
      const finalUser = buildUser(data.user);

      setUser(finalUser);
      localStorage.setItem("user", JSON.stringify(finalUser));
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const signup = async (credentials: SignupCredentials) => {
    await signupMutation.mutateAsync(credentials);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const updateUser = (u: CurrentUser) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const selectRole = async (role: Role) => {
    if (!user) return;

    if (role === "INSTRUCTOR") {
      const updated = {
        ...user,
        pendingRole: role,
        roleStatus: { ...user.roleStatus, instructor: "not_applied" },
      };
      updateUser(updated);
      return { error: "INSTRUCTOR_APPLICATION_REQUIRED" };
    }

    const res = await academyAPI.selectRole(role);
    if (res?.accessToken) {
      localStorage.setItem("accessToken", res.accessToken);
    }

    // Use the user data from the response which contains the updated role information
    const updatedUserFromResponse = res.user || (await academyAPI.getProfile());
    
    // When selecting a role for the first time, also set it as the active role by calling switchRole
    const updated = buildUser(updatedUserFromResponse);
    
    // Update the user in context
    updateUser(updated);
    
    // After selecting a role, automatically switch to that role to make it the active role
    try {
      await academyAPI.switchRole(role);
      // Refresh the user data after switching
      const switchedUserResponse = await academyAPI.getProfile();
      const switchedUser = buildUser(switchedUserResponse);
      updateUser(switchedUser);
    } catch (error) {
      console.error('Error switching to selected role:', error);
      // If switch fails, still update with the selected role data
      updateUser(updated);
    }

    // Don't redirect automatically - user needs to switch role manually
  };

  const switchRole = async (role: Role) => {
    if (!user) return;

    setIsRoleSwitching(true);
    try {
      console.log("Switching role to:", role);
      const res = await academyAPI.switchRole(role);
      console.log("Switch role response:", res);
      if (res?.accessToken)
        localStorage.setItem("accessToken", res.accessToken);

      // Use the user data from the response which contains the updated active role
      const updatedUserFromResponse = res.user || (await academyAPI.getProfile());
      console.log(
        "Updated user from response after switch:",
        updatedUserFromResponse
      );

      // Build user with the response data which contains the correct active role
      const updated = buildUser(updatedUserFromResponse);

      console.log("Final updated user after switch:", updated);
      updateUser(updated);

      // Don't redirect automatically from profile page - let the UI update as needed
    } catch (error) {
      console.error("Error in switchRole:", error);
      throw error;
    } finally {
      setIsRoleSwitching(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return null;
    const profile = await academyAPI.getProfile();
    const updated = buildUser(profile);
    updateUser(updated);
    return updated;
  };

  const applyAsInstructor = async (data: any) => {
    if (!user) return;
    await academyAPI.applyTeacher(data);
    // Refresh profile to get updated role status
    await refreshProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isRoleSwitching,
        login,
        signup,
        logout,
        updateUser,
        selectRole,
        switchRole,
        refreshProfile,
        applyAsInstructor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
