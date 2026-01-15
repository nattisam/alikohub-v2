# Authentication Implementation

This document explains how authentication is implemented in the AlikoHub General Frontend application.

## Overview

The authentication system uses:
- React Context API for state management
- React Query for data fetching and caching
- Axios for HTTP requests
- Firebase Custom Token authentication with localStorage

## Key Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

The main authentication context that provides:
- User state management
- Login and signup functions
- Logout functionality
- User data updates

### 2. API Service (`src/services/api.ts`)

Handles all HTTP requests to the backend authentication service.

### 3. Custom Hooks (`src/hooks/useUser.ts`)

Provides React Query hooks for user data mutations:
- `useUpdateProfile`: Updates user profile information

### 4. ProtectedRoute (`src/components/ProtectedRoute.tsx`)

A wrapper component that protects routes from unauthorized access.

## Backend API Structure

The authentication service runs on port 3000 and provides the following endpoints:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/login/google` - Google login
- `POST /auth/verify` - Token verification

## How It Works

1. **Registration Process**:
   - User submits registration details via signup form
   - Details are sent to `/auth/register` endpoint
   - On success, Firebase Custom Token and user data are stored in localStorage

2. **Login Process**:
   - User submits credentials via login form
   - Credentials are sent to `/auth/login` endpoint
   - On success, Firebase Custom Token and user data are stored in localStorage

3. **Session Management**:
   - User data is stored in localStorage
   - Firebase Custom Token is stored in localStorage
   - Data is removed from localStorage on logout

4. **Route Protection**:
   - ProtectedRoute checks authentication status
   - Unauthenticated users are redirected to login page
   - Loading states are handled during authentication checks

5. **SSO Across Domains**:
   - Each domain maintains its own Firebase Custom Token
   - All domains use the same Identity Provider (Firebase)
   - When visiting a new domain, the IdP recognizes the user and issues a new token

## Usage Examples

### In Components:
```tsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.firstname}!</div>;
};
```

### Protecting Routes:
```tsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Security Considerations

1. Firebase Custom Tokens are stored in localStorage (consider httponly cookies for higher security)
2. All API requests are made to the backend service on port 3000
3. User data persistence is handled through localStorage
4. Sensitive operations should implement additional security measures

## Extending the System

To add new authenticated API endpoints:
1. Add methods to `authAPI` in `src/services/api.ts`
2. Create custom React Query hooks in `src/hooks/useUser.ts`
3. Use the hooks in your components
4. Wrap components with `ProtectedRoute` if needed