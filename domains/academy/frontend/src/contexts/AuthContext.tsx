import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
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
  isRoleModalOpen: boolean;
  setRoleModalOpen: (open: boolean) => void;
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
      convertRoleToUppercase(user?.currentRole) ||
      convertRoleToUppercase(academyUser?.role) ||
      "USER",

    hasSelectedRole: !!(
      convertedAcademyUser?.role && convertedAcademyUser.role !== "USER"
    ),
    hasTeacherApplication: user.hasTeacherApplication || false,
    instructorStatus:
      user.instructorStatus || user.roleStatus?.instructor || "not_applied",
    hasAcademyRole: user.hasAcademyRole || false,
    canAccessDashboard: user.canAccessDashboard || false,
    canEnrollCourses: user.canEnrollCourses || false,
    canCreateCourses: user.canCreateCourses || false,

    // Include INSTRUCTOR in availableRoles if user has applied and been approved
    // Include INSTRUCTOR if the user has an approved instructor application status
    availableRoles: [
      "STUDENT",
      // Include INSTRUCTOR if user's role is INSTRUCTOR, if they have an approved instructor application,
      // or if they have permissions to create courses (which implies they are an instructor)
      ...(convertedAcademyUser?.role === "INSTRUCTOR" ||
      user?.roleStatus?.instructor === "approved" ||
      user?.instructorStatus === "active" ||
      user?.instructorStatus === "approved" ||
      user?.canCreateCourses === true
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
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

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
    mutationFn: async (c: LoginCredentials) => {
      // Create a timeout promise to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Invalid email or password")),
          5000, // 5 seconds is plenty for a login check
        ),
      );

      return Promise.race([authService.login(c), timeoutPromise]);
    },
    retry: false,
    onSuccess: async (data: any) => {
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
      return authService.selectRole(role);
    },
    onSuccess: async (res, variables) => {
      // Handle the case where the API returned instructor application required
      if (res && res.error === "INSTRUCTOR_APPLICATION_REQUIRED") {
        return;
      }

      // Handle normal role selection
      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
      }

      // Initial user update with the selected role
      const updatedUserFromResponse =
        res.user || (await authService.getProfile());
      const updated = buildUser(updatedUserFromResponse);
      updateUser(updated);

      // Now automatically switch to that role to make it the active role immediately
      try {
        const switchRes = await authService.switchRole(variables.role);

        // Final update with the switched role which refreshes the activeRole and JWT
        if (switchRes?.accessToken) {
          localStorage.setItem("accessToken", switchRes.accessToken);
        }

        const switchedUserFromResponse =
          switchRes.user || (await authService.getProfile());
        const switchedUser = buildUser(switchedUserFromResponse);
        updateUser(switchedUser);
      } catch (error) {
        console.error("Error switching to selected role:", error);
      }
    },
  });

  const login = async (email: string, password: string) => {
    try {
      // Clear any previous transition error states
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      // Error is already captured by loginMutation.error
      console.error("Login call failed:", err);
      throw err;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    await signupMutation.mutateAsync(credentials);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("firebaseCustomToken");

    startTransition(() => {
      setUser(null);
    });

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

    try {
      const profile = await authService.getProfile();
      let academyStatus = {};

      try {
        academyStatus = await authService.getUserAcademyStatus(
          user.id.toString(),
        );
      } catch (e) {
        console.error("Failed to fetch academy status:", e);
      }

      const updated = buildUser({
        ...profile,
        ...academyStatus,
      });

      updateUser(updated);
      return updated;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return null;
    }
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

    // If it's the custom error thrown by our timeout
    if (error.message === "Invalid email or password") {
      return error.message;
    }

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

    // Handle string errors
    if (typeof error === "string") return error;

    // Fallback to error message or status text
    return (
      error.message || "A server error occurred. Please try again in a moment."
    );
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
        isRoleModalOpen,
        setRoleModalOpen: setIsRoleModalOpen,
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
