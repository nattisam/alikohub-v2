# Implementation Plan: Aliko Events Refactoring

This plan outlines the steps required to refactor the current "events" subdomain into the **Aliko Events** platform as per the developer workflow documentation.

## 1. Schema & Models (`prisma/schema.prisma`)

### Changes
- Update `EventsRole`: Remove `USER` if public users don't have accounts. Keep `ADMIN` and `CONTENT_MANAGER`.
- Update `PromotionRequest`:
  - Add `type` field (mapped to `PostType`) to specify if the promotion is for an Event, Announcement, or News.
  - Rename `description` to `message` for closer alignment with the requirements (optional).
- Update `Post`:
  - Ensure `eventDate` and `eventTime` are handled consistently.

### Steps
1. Modify `domains/events/backend/prisma/schema.prisma`.
2. Run `npx prisma generate` in the backend directory.
3. Run `npx prisma migrate dev` to update the database.

## 2. User & Access Control (`user` module)

### Changes
- **Restrict Auto-Profile Creation**: Modify `UserService.getOrCreateProfile` to stop auto-assigning the `USER` role. Only global admins or explicitly added users should have profiles.
- **User Management**: Add methods to:
  - List all users with `EventsProfile`.
  - Assign/Revoke `CONTENT_MANAGER` role (Admin only).
  - Search global users to invite them as CMs.

### Steps
1. Refactor `domains/events/backend/src/user/user.service.ts`.
2. Update `domains/events/backend/src/user/user.controller.ts` with new management message patterns.
3. Update `domains/events/backend/src/auth/events-profile.guard.ts` to handle cases where a profile doesn't exist (return false instead of creating one).

## 3. Promotion Request Workflow (`promotion-requests` module)

### Changes
- **Data Model**: Update DTO and service to include the promotion `type`.
- **Email Notification**: Ensure the email sent to the admin contains the `type` and matches the requirements.

### Steps
1. Update `domains/events/backend/src/promotion-requests/dto/create-promotion-request.dto.ts`.
2. Update `domains/events/backend/src/promotion-requests/promotion-requests.service.ts` notification logic.
3. Update API Gateway DTO to match.

## 4. Content Lifecycle & Post Management (`posts` module)

### Changes
- **Content Types**: Ensure the `Post` model is used for Events, Announcements, and News by using the `type` field.
- **Status Transitions**:
  - `Draft` -> `Pending` (CM action)
  - `Pending` -> `Approved` / `Rejected` (Admin action)
  - `Approved` -> `Published` (Admin action)
- **Validation**: Improve Joi schemas to require event-specific fields only when `type === 'EVENT'`.

### Steps
1. Refactor `domains/events/backend/src/posts/posts.service.ts` to strictly enforce the above transitions.
2. Update `domains/events/backend/src/posts/posts.validation.ts` for type-conditional validation.

## 5. API Gateway Refactoring (`api-gateway-service`)

### Changes
- **DTO Alignment**: Rename and update `CreateEventDto` to `CreatePostDto` to reflect that it handles all content types.
- **Swagger Documentation**: Update tags and descriptions to "Aliko Events Management".
- **User Management Endpoints**: Expose the new user management capabilities to the Admin frontend.

### Steps
1. Update `domains/core-platform-services/api-gateway-service/src/events-service/events/dto/`.
2. Update `domains/core-platform-services/api-gateway-service/src/events-service/events/events.controller.ts`.
3. Add promotion type field to the public submission endpoint.

## 6. Frontend Routes Alignment (Documentation)
- **Public**: `events.alikohub.com` (Main Feed, Post Detail, Promotion Form).
- **Internal (CM)**: `/content-manager` (Dashboard for drafting and status tracking).
- **Internal (Admin)**: `/admin` (Review queue, Published content, CM management).

---
**Verification**:
- Verify that users without an `EventsProfile` cannot access `/manage/events`.
- Verify that CMs cannot publish directly.
- Verify that public users can only see `PUBLISHED` content.
- Verify that promotion requests send emails and include the `type`.
