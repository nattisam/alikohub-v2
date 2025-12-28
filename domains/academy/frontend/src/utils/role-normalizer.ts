/**
 * Normalizes role names between API Gateway and frontend formats
 * API Gateway uses: 'student', 'teacher', 'admin', etc.
 * Frontend uses: 'STUDENT', 'INSTRUCTOR', 'ADMIN', etc.
 */

/**
 * Converts backend role format to frontend format
 * @param role - Role from backend ('student', 'teacher', 'instructor', etc.) from API Gateway
 * @returns Normalized role for frontend ('STUDENT', 'INSTRUCTOR', 'ADMIN', etc.)
 */
export const normalizeRole = (role: string): string => {
  if (!role) return role;
  
  // Convert API Gateway response roles to frontend format
  switch (role.toLowerCase()) {
    case 'teacher':
    case 'instructor':  // Both 'teacher' and 'instructor' map to 'INSTRUCTOR' for frontend
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

/**
 * Converts frontend role format to backend format
 * @param role - Role from frontend ('STUDENT', 'INSTRUCTOR', 'ADMIN', etc.)
 * @returns Backend-compatible role ('student', 'teacher', 'instructor', etc.) for API Gateway
 */
export const denormalizeRole = (role: string): string => {
  if (!role) return role;
  
  // The API Gateway DTO expects lowercase values
  switch (role.toUpperCase()) {
    case 'INSTRUCTOR':
    case 'TEACHER':  // Map both INSTRUCTOR and TEACHER to 'instructor' for API Gateway (so backend gets INSTRUCTOR after toUpperCase)
      return 'instructor';
    case 'STUDENT':
      return 'student';
    case 'ADMIN':
      return 'admin';
    case 'USER':
      return 'user';
    case 'COURSE_MANAGER':
      return 'course_manager';
    default:
      return role.toLowerCase();
  }
};

/**
 * Normalizes all role properties in a user object
 * @param user - User object that may contain role properties
 * @returns User object with normalized roles
 */
export const normalizeUserRoles = (user: any): any => {
  if (!user) return user;
  
  const normalizedUser = { ...user };
  
  // Normalize root level role properties
  if (user.academyRole) {
    normalizedUser.academyRole = normalizeRole(user.academyRole);
  }
  
  if (user.academyActiveRole) {
    normalizedUser.academyActiveRole = normalizeRole(user.academyActiveRole);
  }
  
  // Normalize academyUser properties
  if (user.academyUser) {
    normalizedUser.academyUser = {
      ...user.academyUser,
      role: normalizeRole(user.academyUser.role),
      activeRole: normalizeRole(user.academyUser.activeRole)
    };
  }
  
  // Normalize availableRoles array if it exists
  if (user.availableRoles && Array.isArray(user.availableRoles)) {
    normalizedUser.availableRoles = user.availableRoles.map(normalizeRole);
  }
  
  // Normalize roleStatus if it exists
  if (user.roleStatus) {
    normalizedUser.roleStatus = {
      ...user.roleStatus,
      // Only normalize if the role property exists in roleStatus
      instructor: user.roleStatus.instructor
    };
  }
  
  return normalizedUser;
};