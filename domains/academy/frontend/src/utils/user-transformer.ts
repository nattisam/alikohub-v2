import { BackendUser, CurrentUser, LoginResponse } from '../types';

/**
 * Transforms the backend user response to a frontend CurrentUser object
 * This allows the frontend to work with a simplified version of the backend response
 */
export const transformBackendUserToCurrentUser = (backendUser: BackendUser): CurrentUser => {
  return {
    id: backendUser.id,
    firebaseId: backendUser.firebaseId,
    email: backendUser.email,
    firstname: backendUser.firstname,
    lastname: backendUser.lastname,
    globalRole: backendUser.globalRole,
    academyRole: backendUser.academyUser?.role,
    academyActiveRole: backendUser.academyUser?.activeRole,
    academyStatus: backendUser.academyUser?.status,
    contechRole: backendUser.contechUser?.role,
    contechStatus: backendUser.contechUser?.status,
    eventsRole: backendUser.eventsUser?.role,
    eventsStatus: backendUser.eventsUser?.status,
    profilePicture: backendUser.profilePicture,
    bio: backendUser.bio,
    status: backendUser.status,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
    // Additional frontend-specific properties
    hasSelectedRole: !!backendUser.academyUser?.activeRole || !!backendUser.academyUser?.role,
    availableRoles: backendUser.academyUser ? [backendUser.academyUser.role] : [],
    currentRole: backendUser.academyUser?.activeRole || backendUser.academyUser?.role,
    roleStatus: undefined, // This would be populated based on specific business logic
    academyProfile: backendUser.academyUser ? {
      id: backendUser.academyUser.id,
      userId: backendUser.academyUser.userId,
      role: backendUser.academyUser.role,
      hasSelectedRole: !!backendUser.academyUser.activeRole || !!backendUser.academyUser.role,
      bio: backendUser.bio || null,
      expertise: null, // This would come from a specific field if available
      createdAt: backendUser.academyUser.createdAt,
      updatedAt: backendUser.academyUser.updatedAt,
    } : undefined,
  };
};

/**
 * Transforms the backend login response to include a frontend-friendly CurrentUser
 */
export const transformLoginResponse = (loginResponse: LoginResponse): { 
  user: CurrentUser; 
  accessToken: string; 
  refreshToken: string; 
  firebaseCustomToken: string;
} => {
  return {
    user: transformBackendUserToCurrentUser(loginResponse.user),
    accessToken: loginResponse.accessToken,
    refreshToken: loginResponse.refreshToken,
    firebaseCustomToken: loginResponse.firebaseCustomToken,
  };
};