# Role Switching Workflow (Simple)

## Overview

Simple workflow for role switching from login to active role management.

## Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant AG as API Gateway
    participant AS as Auth Service
    participant DB as Database
    
    U->>F: Login with credentials
    F->>AG: POST /auth/login
    AG->>AS: login command
    AS->>DB: Find user + roles
    DB-->>AS: User data
    AS->>AS: Generate JWT with activeRole
    AS-->>AG: User + JWT tokens
    AG-->>F: Login response
    F->>F: Store tokens
    F-->>U: Logged in with default role
```

## Role Switching Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant AG as API Gateway
    participant AS as Auth Service
    participant DB as Database
    
    U->>F: Click role switcher
    F->>F: Show available roles
    U->>F: Select new role
    F->>AG: POST /auth/academy/switch-role
    AG->>AS: switch_role command
    AS->>DB: Verify user has role
    DB-->>AS: Role validation
    AS->>DB: Update activeRole
    AS->>AS: Generate new JWT
    AS-->>AG: New tokens + user data
    AG-->>F: Role switch response
    F->>F: Update tokens + UI
    F-->>U: Role switched
```

## JWT Token Structure

```json
{
  "uid": "user_firebase_id",
  "id": 5,
  "email": "user@example.com",
  "academyRole": "INSTRUCTOR",
  "academyActiveRole": "INSTRUCTOR",
  "academyStatus": "ACTIVE"
}
```

## API Endpoints

### Login
```
POST /auth/login
Response: { user, accessToken, refreshToken }
```

### Switch Role
```
POST /auth/academy/switch-role
Body: { "role": "STUDENT" }
Response: { message, activeRole, user, accessToken, refreshToken }
```

## Frontend Implementation

### Role Switcher Component

```mermaid
graph TD
    A[User clicks role switcher] --> B[Show available roles]
    B --> C[User selects role]
    C --> D[Call switch API]
    D --> E{Success?}
    E -->|Yes| F[Update stored tokens]
    E -->|No| G[Show error]
    F --> H[Reload UI permissions]
    H --> I[Show new role]
```

### State Management Flow

```mermaid
graph LR
    A[Login] --> B[Store tokens]
    B --> C[Show current role]
    C --> D[Switch role request]
    D --> E[New tokens]
    E --> F[Update state]
    F --> G[UI re-render]
```

## User Scenarios

### Multi-Role User (Instructor + Student)

```mermaid
graph TB
    A[Login] --> B[Active: INSTRUCTOR]
    B --> C[Can create courses]
    C --> D[Click role switcher]
    D --> E[Select STUDENT]
    E --> F[Switch API call]
    F --> G[Active: STUDENT]
    G --> H[Can enroll courses]
    H --> I[Cannot create courses]
```

### Single Role User (Student Only)

```mermaid
graph TB
    A[Login] --> B[Active: STUDENT]
    B --> C[Can enroll courses]
    C --> D[Role switcher shows STUDENT only]
    D --> E[Switch disabled]
    E --> F[No switching available]
```

## Error Handling

```mermaid
graph TD
    A[Switch role request] --> B{User has role?}
    B -->|No| C[403 Forbidden]
    B -->|Yes| D{Token valid?}
    D -->|No| E[401 Unauthorized]
    D -->|Yes| F[Update activeRole]
    F --> G[Generate new JWT]
    G --> H[Return success]
    
    C --> I[Show error: No permission]
    E --> J[Show error: Login required]
    H --> K[Update UI]
```

## Security Flow

```mermaid
graph LR
    A[Request] --> B[Validate JWT]
    B --> C[Extract activeRole]
    C --> D[Guard checks role]
    D --> E{Role allowed?}
    E -->|Yes| F[Allow access]
    E -->|No| G[Deny access]
```

## Quick Implementation Steps

1. **Login Phase**
   - User logs in normally
   - JWT includes `academyActiveRole`
   - Store tokens in frontend

2. **Role Switch Phase**
   - Show role switcher UI
   - Call `/auth/academy/switch-role`
   - Update stored tokens
   - Reload UI permissions

3. **Permission Checks**
   - Guards read `academyActiveRole` from JWT
   - Enforce access based on active role
   - UI components show/hide based on role

## Testing Checklist

- [ ] Login with different roles
- [ ] Role switcher shows correct options
- [ ] Switch role updates UI
- [ ] Permission guards work
- [ ] Error handling displays correctly
- [ ] Token refresh works after switch
