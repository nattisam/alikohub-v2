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

The Academy frontend uses a token-based authentication system with Firebase Custom Tokens and role-based access control. Users authenticate through a centralized auth service and are assigned roles specific to the Academy platform.

## Authentication Flow

### 1. User Registration
1. User submits registration form with email, password, first name, and last name
2. Frontend calls `authAPI.register()` with user credentials
3. Backend creates a general user account and returns:
   - User data (including Firebase ID)
   - Firebase Custom Token
4. Frontend stores user data and token in localStorage
5. User is redirected to the Academy homepage

### 2. User Login
1. User submits login form with email and password
2. Frontend calls `authAPI.login()` with credentials
3. Backend verifies credentials and returns:
   - User data (including Firebase ID and Academy role if selected)
   - Firebase Custom Token
4. Frontend stores user data and token in localStorage
5. Frontend fetches Academy profile to get latest role information
6. User is redirected to appropriate dashboard based on role

### 3. Token Verification
- On app initialization, the frontend checks for stored user data and token
- If both exist, it calls `authAPI.verifyToken()` to verify the Firebase Custom Token
- If verification succeeds, user remains logged in
- If verification fails, user is logged out and redirected to login page

## State Management

### Auth Context
The `AuthContext` manages the global authentication state using React Context API:

```typescript
interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  selectRole: (role: "STUDENT" | "INSTRUCTOR" | "ADMIN") => Promise<void>;
}
```

### User Data Structure
```typescript
interface CurrentUser {
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  role?: string;
  globalRole?: string;
  academyRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  hasSelectedRole?: boolean;
  academyProfile?: {
    id: number;
    userId: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    hasSelectedRole: boolean;
    bio?: string | null;
    expertise?: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  status?: string;
  profilePicture?: string;
  bio?: string;
}
```

### Local Storage
User data and tokens are persisted in localStorage:
- `user`: Serialized user object
- `firebaseCustomToken`: Firebase Custom Token string

## Role Management

### Role Types
1. **STUDENT**: Can enroll in courses, view content, and track progress
2. **INSTRUCTOR**: Can create and manage courses, view student progress
3. **ADMIN**: Platform administration privileges

### Role Selection Process
1. New users have no Academy role assigned by default
2. Users can browse public content without selecting a role
3. When accessing protected areas, users are prompted to select a role
4. Role selection is stored both in localStorage and sent to the backend
5. Once selected, users are redirected to the appropriate dashboard

### Role-Based Access Control
- Students access `/dashboard` routes
- Instructors access `/instructor` routes
- Admins can access both and additional administrative routes
- Users without a role are redirected to role selection

## API Integration

### Auth Service API Calls
```typescript
// Login
const response = await authAPI.login({ email, password });

// Register
const response = await authAPI.register({ firstname, lastname, email, password });

// Token Verification
const response = await authAPI.verifyToken(token);

// Logout (client-side only)
// Clears localStorage and resets context state
```

### Academy Service API Calls
```typescript
// Get Academy Profile
const response = await academyAPI.getProfile();

// Select Role
const response = await academyAPI.selectRole(role);
```

### HTTP Interceptors
- Requests include Authorization header with Firebase ID Token
- Responses are checked for authentication errors
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
- Displays current role (Student/Instructor) or "no role"
- Shows dropdown with "Choose role" option for users without a role
- Provides logout functionality

### Role Selection Modal
- Presented when users without a role try to access protected areas
- Allows selection between Student, Instructor, and Admin roles
- Updates both frontend state and backend records

### Dashboard Redirection
- Students are directed to `/dashboard`
- Instructors are directed to `/instructor`
- Admins can access both dashboards