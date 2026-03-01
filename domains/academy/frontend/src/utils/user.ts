import type { CurrentUser } from "../services/auth-service";

/**
 * Transforms the raw user object from the API into a clean, consistent CurrentUser object.
 * Handles role conversion, naming conventions, and permission flags.
 */
export const buildUser = (user: any): CurrentUser => {
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

  const convertedGlobalRole =
    convertRoleToUppercase(user?.globalRole) || "USER";

  return {
    ...user,
    firstName: user?.firstname || user?.firstName || "",
    lastName: user?.lastname || user?.lastName || "",
    globalRole: convertedGlobalRole,
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

    availableRoles: [
      "STUDENT",
      ...(convertedAcademyUser?.role === "INSTRUCTOR" ||
      user?.roleStatus?.instructor === "approved" ||
      user?.instructorStatus === "active" ||
      user?.instructorStatus === "approved" ||
      user?.canCreateCourses === true
        ? ["INSTRUCTOR"]
        : []),
      ...(convertedGlobalRole === "ADMIN" ? ["ADMIN"] : []),
    ].filter((v, i, a) => a.indexOf(v) === i), // Unique roles
  };
};

/**
 * Determines the default redirect path for a user after they login or if they are already authenticated.
 */
export const getRedirectPath = (user: CurrentUser | null): string => {
  if (!user) return "/";

  const globalRole = user.globalRole?.toUpperCase();
  if (globalRole === "ADMIN") {
    return "/admin";
  }

  const hasSelectedRole =
    user.hasSelectedRole || user.academyUser?.hasSelectedRole;
  if (!hasSelectedRole) {
    return "/";
  }

  const activeRole = (
    user.academyActiveRole || user.academyUser?.activeRole
  )?.toUpperCase();

  if (activeRole === "INSTRUCTOR") {
    return "/instructor";
  }

  return "/student-dashboard";
};
