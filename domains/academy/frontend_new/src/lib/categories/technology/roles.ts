// Role-based Access Control for Aliko Academy - Tech

export type UserRole = 'public' | 'student' | 'employer' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock user for development - in production this would come from auth
export const getCurrentUser = (): User | null => {
  // Return null for public users (not logged in)
  return null;
};

// Check if user has access to a specific role level
export const hasRole = (requiredRole: UserRole, userRole?: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    public: 0,
    student: 1,
    employer: 2,
    staff: 3,
    admin: 4,
  };

  const userLevel = roleHierarchy[userRole || 'public'];
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
};

// Check if user can access employer portal
export const canAccessEmployerPortal = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'employer' || user.role === 'staff' || user.role === 'admin';
};

// Check if user can access staff dashboard
export const canAccessStaffDashboard = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'staff' || user.role === 'admin';
};
