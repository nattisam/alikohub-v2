import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/auth-service";

import type {
  CurrentUser,
  LoginCredentials,
  SignupCredentials,
} from "../services/auth-service";

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
  loginMutation: UseMutationResult<any, any, LoginCredentials, unknown>;
  signupMutation: UseMutationResult<any, any, SignupCredentials, unknown>;
  selectRoleMutation: UseMutationResult<any, any, { role: Role }, unknown>;
  switchRoleMutation: UseMutationResult<any, any, Role, unknown>;
  applyAsInstructorMutation: UseMutationResult<any, any, any, unknown>;
  loginError: string | null;
  signupError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildUser = (user: any): CurrentUser => {
  if (!user) {
    return {} as CurrentUser;
  }

  const academyUser = user?.academyUser;

  // Convert backend lowercase roles to frontend uppercase format
  const convertRoleToUppercase = (role: string) => {
    if (!role || typeof role !== "string") return role;

    switch (role.toLowerCase()) {
      case "instructor":
      case "teacher":
        return "INSTRUCTOR";
      case "student":
        return "STUDENT";
      case "admin":
        return "ADMIN";
      case "user":
        return "USER";
      case "course_manager":
        return "COURSE_MANAGER";
      default:
        return role.toUpperCase();
    }
  };

  const convertedAcademyUser = academyUser
    ? {
        ...academyUser,
        role: convertRoleToUppercase(academyUser?.role),
        activeRole: convertRoleToUppercase(academyUser?.activeRole),
      }
    : null;

  return {
    ...user,
    firstName: user?.firstname || user?.firstName || "",
    lastName: user?.lastname || user?.lastName || "",
    academyUser: convertedAcademyUser,
    academyRole: convertRoleToUppercase(academyUser?.role) || "USER",
    academyActiveRole:
      convertRoleToUppercase(user?.academyActiveRole) ||
      convertRoleToUppercase(academyUser?.activeRole) ||
      convertRoleToUppercase(academyUser?.role) ||
      "USER",

    hasSelectedRole: !!(
      convertedAcademyUser?.role && convertedAcademyUser.role !== "USER"
    ),

    // Include INSTRUCTOR in availableRoles if user has applied and been approved
    // Include INSTRUCTOR if the user has an approved instructor application status
    availableRoles: [
      "STUDENT",
      // Include INSTRUCTOR if user's role is INSTRUCTOR or if they have an approved instructor application
      ...(convertedAcademyUser?.role === "INSTRUCTOR" ||
      user?.roleStatus?.instructor === "approved"
        ? ["INSTRUCTOR"]
        : []),
      ...(user?.globalRole === "ADMIN" ? ["ADMIN"] : []),
    ].filter((v, i, a) => a.indexOf(v) === i), // Unique roles
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const rawUser = localStorage.getItem("user");

    if (token && rawUser) {
      try {
        setUser(JSON.parse(rawUser)); // trust cached user
      } catch {
        setUser(null);
      }
    }

    setIsLoading(false);

    // Listen for logout events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key === "accessToken" || e.key === "user") {
        if (
          !localStorage.getItem("accessToken") ||
          !localStorage.getItem("user")
        ) {
          setUser(null);
        }
      }
    };

    const handleUserLoggedOut = () => setUser(null);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedOut", handleUserLoggedOut);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedOut", handleUserLoggedOut);
    };
  }, []);

  const loginMutation = useMutation({
    mutationFn: (c: LoginCredentials) => authService.login(c),
    onSuccess: async (data) => {
      // Store the token first to make it available for subsequent API calls
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);

      try {
        // Use the user data from the response which may contain updated role information
        await authService.getProfile();
        const finalUser = buildUser(data.user);

        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      } catch (error) {
        // If profile fetch fails, we should still have the user data from login
        // Build user with the login response data as fallback
        const finalUser = buildUser(data.user);
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));

        console.error("Error fetching profile after login:", error);
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: (c: SignupCredentials) => authService.register(c),
    onSuccess: async (data) => {
      // Store the token first to make it available for subsequent API calls
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firebaseCustomToken", data.firebaseCustomToken);

      try {
        // Use the user data from the response which may contain updated role information
        await authService.getProfile();
        const finalUser = buildUser(data.user);

        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      } catch (error) {
        // If profile fetch fails, we should still have the user data from registration
        // Build user with the registration response data as fallback
        const finalUser = buildUser(data.user);
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));

        console.error("Error fetching profile after signup:", error);
      }
    },
  });

  const selectRoleMutation = useMutation({
    mutationFn: ({ role }: { role: Role }) => {
      // For non-instructor roles, make the API call
      return authService.selectRole(role);
    },
    onSuccess: async (res) => {
      // Check if this was an instructor application case
      if (res && res.error === "INSTRUCTOR_APPLICATION_REQUIRED") {
        // Already handled in mutationFn, just return
        return;
      }

      // Handle normal role selection
      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
      }

      // Use the user data from the response which contains the updated role information
      const updatedUserFromResponse =
        res.user || (await authService.getProfile());

      // When selecting a role for the first time, also set it as the active role by calling switchRole
      const updated = buildUser(updatedUserFromResponse);

      // Update the user in context
      updateUser(updated);

      // After selecting a role, automatically switch to that role to make it the active role
      try {
        const switchRes = await authService.switchRole(
          updated.academyActiveRole as Role,
        );
        // Use the user data from the switch response which contains the updated active role
        const switchedUserFromResponse =
          switchRes.user || (await authService.getProfile());
        const switchedUser = buildUser(switchedUserFromResponse);
        updateUser(switchedUser);
      } catch (error) {
        console.error("Error switching to selected role:", error);
        // If switch fails, still update with the selected role data
        updateUser(updated);
      }
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

    // Dispatch a custom event to notify other tabs about logout
    window.dispatchEvent(new CustomEvent("userLoggedOut"));
  };

  const updateUser = (u: CurrentUser) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const selectRole = async (role: Role) => {
    return selectRoleMutation.mutateAsync({ role });
  };

  const switchRoleMutation = useMutation({
    mutationFn: (role: Role) => authService.switchRole(role),
    onMutate: () => {
      setIsRoleSwitching(true);
    },
    onSuccess: async (res) => {
      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
      }

      // Use the user data from the response which contains the updated active role
      const updatedUserFromResponse =
        res.user || (await authService.getProfile());

      // Build user with the response data which contains the correct active role
      const updated = buildUser(updatedUserFromResponse);

      updateUser(updated);

      // Don't redirect automatically from profile page - let the UI update as needed
    },
    onError: (error) => {
      console.error("Error in switchRole:", error);
      throw error;
    },
    onSettled: () => {
      setIsRoleSwitching(false);
    },
  });

  const switchRole = async (role: Role) => {
    if (!user) return;
    await switchRoleMutation.mutateAsync(role);
  };

  const refreshProfile = async () => {
    if (!user) return null;

    await authService.getProfile();
    // Profile is already updated if the service updates some internal state,
    // but here we just want to refresh. Actually, we should use the result.
    const updated = buildUser(await authService.getProfile());
    updateUser(updated);
    return updated;
  };

  const applyAsInstructorMutation = useMutation({
    mutationFn: (data: any) => authService.applyTeacher(data),
    onSuccess: async () => {
      // Refresh profile to get updated role status
      await refreshProfile();
    },
  });

  const applyAsInstructor = async (data: any) => {
    if (!user) return;
    await applyAsInstructorMutation.mutateAsync(data);
  };

  const extractErrorMessage = (error: any) => {
    if (!error) return null;

    // Axios error handling
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === "string") return data;
      if (data.message) {
        return Array.isArray(data.message)
          ? data.message.join(". ")
          : data.message;
      }
      if (data.error) return data.error;
    }

    // Fallback to error message or status text
    return error.message || "An unexpected error occurred. Please try again.";
  };

  const loginError = extractErrorMessage(loginMutation.error);
  const signupError = extractErrorMessage(signupMutation.error);

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
        loginMutation,
        signupMutation,
        selectRoleMutation,
        switchRoleMutation,
        applyAsInstructorMutation,
        loginError,
        signupError,
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
