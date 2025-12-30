# Academy Frontend Authentication Implementation

This document explains how authentication, role management, and state handling are implemented in the Academy frontend application.

## Table of Contents
- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Role Management](#role-management)
- [API Integration](#api-integration)
- [Protected Routes](#protected-routes)
- [UI Components](#ui-components)

## Overview

The Academy frontend uses a token-based authentication system with Firebase Custom Tokens and role-based access control. Users authenticate through a centralized auth service and are assigned roles specific to the Academy platform. The system supports multi-domain role management with the ability to switch between different roles.

## Authentication Flow

### 1. User Registration
1. User submits registration form with email, password, first name, and last name
2. Frontend calls `authAPI.register()` with user credentials
3. Backend creates a general user account and returns:
   - User data (including Firebase ID)
   - Access Token
   - Firebase Custom Token
4. Frontend stores user data, access token, and firebase token in localStorage
5. Academy profile is fetched to get latest role information
6. User object is normalized with proper role formatting
7. User is redirected to the Academy homepage

### 2. User Login
1. User submits login form with email and password
2. Frontend calls `authAPI.login()` with credentials
3. Backend verifies credentials and returns:
   - User data (including Firebase ID and Academy role if selected)
   - Access Token
   - Firebase Custom Token
4. Frontend stores tokens in localStorage
5. Frontend fetches Academy profile to get latest role information
6. User object is normalized with proper role formatting
7. User is redirected to appropriate dashboard based on role

### 3. Token Verification
- On app initialization, the frontend checks for stored user data and tokens
- If both exist, it calls `authAPI.verifyToken()` to verify the JWT Access Token
- Academy profile is fetched to get the latest role information
- User object is normalized with proper role formatting
- If verification succeeds, user remains logged in
- If verification fails, user is logged out and redirected to login page

## State Management

### Auth Context
The `AuthContext` manages the global authentication state using React Context API with enhanced role management:

```typescript
interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRoleSwitching: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  selectRole: (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => Promise<any>;
  switchRole: (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => Promise<void>;
  refreshProfile: () => Promise<CurrentUser | null>;
  applyAsInstructor: (data: any) => Promise<void>;
}
```

### User Data Structure
```typescript
interface CurrentUser {
  id: number;
  firebaseId: string;
  firstname: string;
  lastname: string;
  email: string;
  globalRole: string;
  profilePicture: string | null;
  bio: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  academyUser: {
    id: string;
    userId: string;
    role: string;
    activeRole: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  consultancyUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  contechUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  eventsUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  // Additional frontend-specific properties
  hasSelectedRole?: boolean;
  availableRoles?: string[];
  currentRole?: string;
  academyRole?: string;
  academyActiveRole?: string;
  academyStatus?: string;
  contechRole?: string;
  contechStatus?: string;
  eventsRole?: string;
  eventsStatus?: string;
  roleStatus?: {
    instructor: 'active' | 'pending' | 'rejected';
    applicationDate?: string;
    approvalDate?: string;
  };
  academyProfile?: {
    id: string;
    userId: string;
    role: string;
    hasSelectedRole: boolean;
    bio?: string | null;
    expertise?: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
}
```

### Role Conversion
The system includes role conversion to handle differences between backend API Gateway roles (lowercase) and frontend roles (uppercase):
- Backend uses: 'student', 'teacher', 'instructor', 'admin'
- Frontend uses: 'STUDENT', 'INSTRUCTOR', 'ADMIN'
- Role conversion happens directly in API calls from frontend uppercase to backend lowercase format

### Local Storage
User data and tokens are persisted in localStorage:
- `user`: Serialized user object
- `firebaseCustomToken`: Firebase Custom Token string
- `accessToken`: Access token for API requests

## Role Management

### Role Types
1. **STUDENT**: Can enroll in courses, view content, and track progress
2. **INSTRUCTOR**: Can create and manage courses, view student progress
3. **ADMIN**: Platform administration privileges
4. **COURSE_MANAGER**: Specialized role for course management

### Role Selection Process
1. New users have no Academy role assigned by default
2. Users can browse public content without selecting a role
3. When accessing protected areas, users are prompted to select a role
4. Role selection is stored both in localStorage and sent to the backend
5. Once selected, users are redirected to the appropriate dashboard
6. After role selection, the role is automatically set as the active role

### Role Switching Process
1. Users with multiple available roles can switch between them
2. Switching is handled via `switchRole()` method
3. The active role is updated both in frontend state and backend
4. After switching, the user context is refreshed with updated role information
5. UI updates automatically to reflect the new active role

### Instructor Application Process
1. Users can apply to become instructors via `applyAsInstructor()`
2. Application status is tracked in `roleStatus.instructor`
3. Status can be: 'active', 'pending', 'rejected'
4. If application is approved, INSTRUCTOR role becomes available
5. The application data is sent to the backend via `/auth/academy/apply-teacher` endpoint

### Role-Based Access Control
- Students access `/dashboard` routes
- Instructors access `/instructor` routes
- Admins can access both and additional administrative routes
- Users without a role are redirected to role selection
- Available roles are dynamically determined based on user status and applications

## API Integration

### Auth Service API Calls
```typescript
// Login
const response = await authAPI.login({ email, password });

// Register
const response = await authAPI.register({ firstname, lastname, email, password });

// Token Verification
const response = await authAPI.verifyToken(token);

// Check email availability
const isAvailable = await authAPI.checkEmailAvailability(email);
```

### Academy Service API Calls
```typescript
// Get Academy Profile
const response = await academyAPI.getProfile();

// Select Role
const response = await academyAPI.selectRole(role);

// Switch Role
const response = await academyAPI.switchRole(role);

// Apply as Instructor
const response = await academyAPI.applyTeacher(applicationData);
```

### HTTP Interceptors
- Requests include Authorization header with Access Token
- Responses are checked for authentication errors
- Role normalization is applied to all user data responses
- Automatic token refresh when needed

## Protected Routes

The `ProtectedRoute` component ensures only authorized users can access certain routes:

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="STUDENT">
      <AcademyStudentDashboard />
    </ProtectedRoute>
  }
/>
```

### Route Protection Logic
1. Check if user is authenticated
2. If not, redirect to login page
3. If user hasn't selected a role, show role selection modal
4. If user doesn't have required role, redirect to appropriate dashboard
5. If user is admin, grant access to all routes
6. If user has required role, render the component

## UI Components

### Header Role Display
- Displays current active role (Student/Instructor) or "no role"
- Shows dropdown with available roles for switching
- Provides logout functionality
- Shows loading state when switching roles

### Role Selection Modal
- Presented when users without a role try to access protected areas
- Allows selection between Student, Instructor, and Admin roles
- Updates both frontend state and backend records
- Automatically sets selected role as active role

### Instructor Application
- Specialized form for users to apply as instructors
- Updates role status and available roles
- Refreshes user profile after application submission

### Dashboard Redirection
- Students are directed to `/dashboard`
- Instructors are directed to `/instructor`
- Admins can access both dashboards
- Role switching allows navigation between different role dashboards