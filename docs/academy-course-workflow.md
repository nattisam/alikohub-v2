# AlikoHub Academy — Course Lifecycle Workflow

> Complete end-to-end workflow from course creation to student completion.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Phase 1: Course Creation](#2-phase-1-course-creation)
3. [Phase 2: Course Content Setup](#3-phase-2-course-content-setup)
4. [Phase 3: Course Approval & Publishing](#4-phase-3-course-approval--publishing)
5. [Phase 4: Student Enrollment](#5-phase-4-student-enrollment)
6. [Phase 5: Payment Processing](#6-phase-5-payment-processing)
7. [Phase 6: Payment Fulfillment (Webhook)](#7-phase-6-payment-fulfillment-webhook)
8. [Phase 7: Learning & Progress Tracking](#8-phase-7-learning--progress-tracking)
9. [Phase 8: Exercises & Grading](#9-phase-8-exercises--grading)
10. [Data Models](#10-data-models)
11. [API Endpoints Reference](#11-api-endpoints-reference)
12. [Environment Configuration](#12-environment-configuration)

---

## 1. Architecture Overview

The Academy platform uses a **microservices architecture** with the following services:

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│  API Gateway    │────▶│  Academy Service │
│  (Next.js)   │     │  (NestJS/HTTP)  │     │  (NestJS/TCP)    │
└──────────────┘     │  Port: 3006     │     │  Port: 3005      │
                     └────────┬────────┘     └────────┬─────────┘
                              │                       │
                     ┌────────▼────────┐              │ TCP
                     │  Auth Service   │              │
                     │  Port: 3001     │     ┌────────▼─────────┐
                     └─────────────────┘     │ Payment Service  │
                                             │ Port: 3012       │
                     ┌─────────────────┐     └────────┬─────────┘
                     │   PostgreSQL    │              │
                     │   (Shared DB)   │     ┌────────▼─────────┐
                     │   Port: 5432    │     │    RabbitMQ      │
                     └─────────────────┘     │  (Event Bus)     │
                                             └──────────────────┘
```

**Communication patterns:**
- **Client → API Gateway:** HTTP/REST
- **API Gateway → Microservices:** TCP (NestJS microservice transport)
- **Payment Service → Academy Service:** RabbitMQ (fanout exchange `payment_events`)

---

## 2. Phase 1: Course Creation

### Who: Instructor or Admin

An instructor creates a new course with basic metadata. The course starts in `DRAFT` status.

### API Flow

```
POST /academy/courses
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Introduction to Web Development",
  "shortDescription": "Learn the fundamentals of web development",
  "longDescription": "A comprehensive course covering HTML, CSS, and JavaScript...",
  "category": "Web Development",
  "skills": ["HTML", "CSS", "JavaScript"],
  "conceptsLearned": ["DOM Manipulation", "Responsive Design"],
  "outcomes": ["Build a basic website", "Understand web protocols"],
  "targetLevel": "Beginner",
  "estimatedTime": 40,
  "price": 500,
  "prerequisites": ["Basic computer skills"],
  "languages": ["English", "Amharic"]
}
```

### Internal Flow

```
API Gateway (HTTP)
  └─▶ AuthGuard: Verifies JWT via auth-service
  └─▶ sends { cmd: 'create_course' } via TCP to academy-service
        └─▶ AcademyProfileGuard: Ensures user has an Academy profile
        └─▶ RoleGuard: Checks user is INSTRUCTOR or ADMIN
        └─▶ JoiValidationPipe: Validates DTO against CreateCourseSchema
        └─▶ CoursesService.create():
              - Sets status to DRAFT
              - Sets instructorId to the user's firebaseId
              - Stores in PostgreSQL (academy schema)
              └─▶ Returns the created Course object
```

### Course Statuses

| Status             | Description                                      |
|--------------------|--------------------------------------------------|
| `DRAFT`            | Initial state. Instructor is building content.   |
| `PENDING_APPROVAL` | Submitted for admin review.                      |
| `PUBLISHED`        | Approved and visible to students.                |
| `REJECTED`         | Rejected by admin (with reason).                 |
| `ARCHIVED`         | No longer active.                                |

---

## 3. Phase 2: Course Content Setup

### Who: Instructor or Admin

After creating the course, the instructor builds the content hierarchy:

```
Course
  └─▶ Module 1
  │     └─▶ Lesson 1.1
  │     │     └─▶ Content (VIDEO, PDF, TEXT, QUIZ, ASSIGNMENT)
  │     │     └─▶ Exercise (MULTIPLE_CHOICE, TRUE_FALSE, MATCHING, SHORT_TEXT)
  │     └─▶ Lesson 1.2
  │           └─▶ Content
  │           └─▶ Exercise
  └─▶ Module 2
        └─▶ Lesson 2.1
              └─▶ Content
```

### Step 2a: Create Modules

```
POST /academy/modules
{
  "title": "Module 1: HTML Basics",
  "description": "Learn the foundation of web pages",
  "courseId": 5
}
```

### Step 2b: Create Lessons

```
POST /academy/lessons
{
  "title": "What is HTML?",
  "type": "VIDEO",          // VIDEO | WEBINAR | ASSIGNMENT | QUIZ
  "moduleId": 1,
  "order": 1
}
```

### Step 2c: Create Content

```
POST /academy/content
{
  "title": "HTML Introduction Video",
  "type": "VIDEO",           // VIDEO | PDF | QUIZ | ASSIGNMENT | TEXT
  "url": "https://cdn.example.com/video.mp4",
  "body": null,
  "lessonId": 1
}
```

### Step 2d: Create Exercises (Optional)

```
POST /academy/exercises
{
  "title": "HTML Tags Quiz",
  "type": "MULTIPLE_CHOICE",   // MULTIPLE_CHOICE | TRUE_FALSE | MATCHING | SHORT_TEXT
  "moduleId": 1,
  "lessonId": 1,
  "question": "Which tag is used for paragraphs?",
  "options": ["<p>", "<div>", "<span>", "<h1>"],
  "correctAnswer": "<p>",
  "hints": ["It starts with 'p'"],
  "points": 1,
  "order": 1
}
```

### Step 2e: Create Cohorts (Optional)

For scheduled learning, instructors can create cohorts:

```
POST /academy/cohorts
{
  "name": "Batch 2026-Q1",
  "courseId": 5,
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-06-01T00:00:00Z"
}
```

### Step 2f: Create Teaching Schedules (Optional)

```
POST /academy/teaching-schedule
{
  "title": "Live Q&A Session",
  "description": "Weekly Q&A for Module 1",
  "startTime": "2026-03-05T14:00:00Z",
  "endTime": "2026-03-05T15:00:00Z",
  "type": "Q_AND_A",         // LIVE | RECORDING | Q_AND_A | OFFICE_HOURS | WORKSHOP
  "courseId": 5,
  "isRecurring": true,
  "recurrencePattern": "WEEKLY"
}
```

---

## 4. Phase 3: Course Approval & Publishing

### Step 3a: Instructor Submits for Review

```
PATCH /academy/courses/:id/submit
```

Sets course status from `DRAFT` → `PENDING_APPROVAL`.

### Step 3b: Admin Approves or Rejects

**Approve:**
```
PATCH /academy/courses/:id/approve
```
Sets status from `PENDING_APPROVAL` → `PUBLISHED`. Course is now visible to students.

**Reject:**
```
PATCH /academy/courses/:id/reject
{
  "reason": "Course description needs more detail"
}
```
Sets status from `PENDING_APPROVAL` → `REJECTED` with a rejection reason.

### State Machine

```
DRAFT ──submit──▶ PENDING_APPROVAL ──approve──▶ PUBLISHED
                        │                          │
                     reject                     archive
                        │                          │
                        ▼                          ▼
                    REJECTED                   ARCHIVED
```

---

## 5. Phase 4: Student Enrollment

### Who: Student (or Admin on behalf of student)

Students can browse published courses and enroll.

### Step 4a: Browse Courses (Public)

```
GET /academy/courses?status=PUBLISHED
```

### Step 4b: Enroll in a Course

```
POST /academy/enrollment
Authorization: Bearer <JWT>
{
  "courseId": 5,
  "paymentGateway": "CHAPA"    // "CHAPA" or "STRIPE" (for paid courses)
}
```

### Enrollment Logic (EnrollmentsService.create)

```
1. Validate course exists and is PUBLISHED
2. Determine if course is paid (price > 0)
3. Check for existing enrollment:
   ├─ If exists and paymentStatus = COMPLETED → ConflictException (already enrolled)
   ├─ If exists and paymentStatus = PENDING/FAILED → Update existing enrollment
   └─ If not exists → Create new enrollment record
4. For FREE courses:
   ├─ enrollmentType = FREE
   ├─ paymentStatus = COMPLETED
   ├─ status = ACTIVE
   └─ Return enrollment (done!)
5. For PAID courses:
   ├─ enrollmentType = PAID
   ├─ paymentStatus = PENDING
   ├─ status = PENDING
   └─ Continue to Payment Phase →
```

---

## 6. Phase 5: Payment Processing

### For Paid Courses Only

When a student enrolls in a paid course, the Academy Service communicates with the Payment Service via TCP.

### Internal Flow

```
Academy Service
  └─▶ Fetches user details (email, name) via UserService
  └─▶ Sends { cmd: 'initialize_payment' } to Payment Service via TCP
        Payload:
        {
          amount: 500,
          currency: "ETB",
          email: "student@example.com",
          firstName: "Abel",
          lastName: "Desalegn",
          provider: "CHAPA",           // or "STRIPE"
          userId: "firebaseUserId",
          purpose: "COURSE_PURCHASE_5",
          metadata: {
            courseId: 5,
            enrollmentId: 29,
            userId: "firebaseUserId",
            courseTitle: "Introduction to Web Development"
          }
        }
```

### Payment Service Processing

```
PaymentController.initialize()
  ├─ 1. Generate unique reference (UUID)
  ├─ 2. Create Transaction in DB (status: PENDING)
  ├─ 3. Call payment gateway:
  │     ├─ CHAPA: POST https://api.chapa.co/v1/transaction/initialize
  │     └─ STRIPE: stripe.checkout.sessions.create()
  ├─ 4. Store providerReference
  └─ 5. Return { reference, checkoutUrl }
```

### Response to Student

```json
{
  "id": 29,
  "userId": "CwurqpSPR2WZSbOJwnDDJ7IA5AX2",
  "courseId": 5,
  "paymentStatus": "PENDING",
  "status": "PENDING",
  "checkoutUrl": "https://checkout.chapa.co/checkout/payment/...",
  "message": "Payment required to complete enrollment"
}
```

The frontend redirects the student to the `checkoutUrl` to complete payment.

### Payment Gateways

| Gateway | Currency | Checkout                               | Webhook Endpoint         |
|---------|----------|----------------------------------------|--------------------------|
| Chapa   | ETB      | `checkout.chapa.co/checkout/payment/…` | `POST /payments/webhooks/chapa`  |
| Stripe  | Any      | `checkout.stripe.com/c/pay/…`          | `POST /payments/webhooks/stripe` |

---

## 7. Phase 6: Payment Fulfillment (Webhook)

### After Student Completes Payment

When the payment gateway confirms payment, it sends a webhook to the API Gateway.

### Webhook Flow

```
Payment Gateway (Chapa/Stripe)
  └─▶ POST /payments/webhooks/chapa (or /stripe)
        └─▶ API Gateway forwards to Payment Service via TCP
              └─▶ ChapaWebhookController / StripeWebhookController
                    ├─ 1. Verify webhook signature
                    ├─ 2. Find Transaction by providerReference
                    ├─ 3. Update Transaction status → COMPLETED
                    └─ 4. Emit 'payment.succeeded' event via RabbitMQ
```

### RabbitMQ Event

```
Exchange: payment_events (fanout)
Pattern:  payment.succeeded
Payload:
{
  "transactionId": 9,
  "reference": "uuid-reference",
  "userId": "CwurqpSPR2WZSbOJwnDDJ7IA5AX2",
  "amount": 500,
  "currency": "ETB",
  "purpose": "COURSE_PURCHASE_5",
  "metadata": {
    "courseId": 5,
    "enrollmentId": 29,
    "userId": "CwurqpSPR2WZSbOJwnDDJ7IA5AX2"
  }
}
```

### Academy Service Receives Event

```
PaymentFulfillmentListener
  └─▶ @EventPattern('payment.succeeded')
        ├─ 1. Extract courseId from metadata or purpose
        ├─ 2. Find PENDING enrollment for user + course
        ├─ 3. Update enrollment:
        │     ├─ paymentStatus → COMPLETED
        │     └─ status → ACTIVE
        └─ 4. Student can now access course content! ✅
```

### Full Payment Lifecycle

```
Student clicks "Enroll"
  └─▶ Enrollment created (PENDING)
  └─▶ Payment initialized (checkoutUrl returned)
  └─▶ Student redirected to Chapa/Stripe checkout
  └─▶ Student completes payment
  └─▶ Gateway sends webhook
  └─▶ Payment Service verifies & updates Transaction
  └─▶ RabbitMQ event: payment.succeeded
  └─▶ Academy Service activates enrollment
  └─▶ Student can access course! ✅
```

---

## 8. Phase 7: Learning & Progress Tracking

### Who: Student (enrolled and ACTIVE)

### Step 7a: View My Courses

```
GET /academy/enrollment/me
```

Returns all courses the student is enrolled in.

### Step 7b: Access Course Content

```
GET /academy/modules/course/:courseId
GET /academy/lessons/module/:moduleId
GET /academy/content/lesson/:lessonId
```

### Step 7c: Complete a Lesson

```
POST /academy/progress/complete-lesson
{
  "courseId": 5,
  "lessonId": 1
}
```

### Step 7d: Update Content Progress

```
POST /academy/progress/update-content
{
  "courseId": 5,
  "moduleId": 1,
  "lessonId": 1,
  "contentId": 1,
  "status": "COMPLETED",
  "score": 95
}
```

### Step 7e: View My Progress

```
GET /academy/progress/my-courses
GET /academy/progress/user/:userId/course/:courseId
```

### Progress Tracking

```
Progress is tracked at multiple levels:
  ├─ Course level:   Overall completion percentage
  ├─ Module level:   Which modules are done
  ├─ Lesson level:   Which lessons are completed
  └─ Content level:  Individual content item status & score
```

---

## 9. Phase 8: Exercises & Grading

### Step 8a: Student Submits Exercise

```
POST /academy/exercises/:id/submit
{
  "answer": "<p>"
}
```

For auto-graded exercises (MULTIPLE_CHOICE, TRUE_FALSE), the system compares with `correctAnswer` and sets the score automatically.

### Step 8b: Instructor Grades (Manual)

```
POST /academy/exercises/:id/grade
{
  "score": 85,
  "feedback": "Good work, but could improve on..."
}
```

### Submission Statuses

| Status           | Description                              |
|------------------|------------------------------------------|
| `PENDING_REVIEW` | Submitted, awaiting instructor review    |
| `GRADED`         | Graded by instructor or auto-graded      |

---

## 10. Data Models

### Core Models Hierarchy

```
AcademyProfile (User)
  ├─ Course (many)
  │   ├─ Module (many)
  │   │   ├─ Lesson (many)
  │   │   │   ├─ Content (many)          VIDEO | PDF | QUIZ | ASSIGNMENT | TEXT
  │   │   │   └─ Exercise (many)         MULTIPLE_CHOICE | TRUE_FALSE | MATCHING | SHORT_TEXT
  │   │   │       └─ ExerciseSubmission
  │   │   └─ Exercise (many, direct)
  │   ├─ Cohort (many)
  │   ├─ Enrollment (many)
  │   ├─ Progress (many)
  │   └─ TeachingSchedule (many)
  ├─ Enrollment (many)
  ├─ Notification (many)
  ├─ Progress (many)
  └─ ExerciseSubmission (many)
```

### Payment Models (Payment Service DB)

```
Transaction
  ├─ id (PK)
  ├─ amount: Float
  ├─ currency: String (default "USD")
  ├─ provider: PaymentProvider (CHAPA | STRIPE)
  ├─ status: TransactionStatus (PENDING | COMPLETED | FAILED | CANCELLED)
  ├─ reference: String (unique, internal UUID)
  ├─ providerReference: String? (unique, from Chapa/Stripe)
  ├─ metadata: JSON (courseId, enrollmentId, userId)
  ├─ userId: String
  └─ purpose: String (e.g. "COURSE_PURCHASE_5")
```

---

## 11. API Endpoints Reference

### Courses

| Method | Endpoint                            | Role               | Description                        |
|--------|-------------------------------------|--------------------|------------------------------------|
| POST   | `/academy/courses`                  | Instructor, Admin  | Create a new course                |
| GET    | `/academy/courses`                  | Public/All         | List courses (filterable)          |
| GET    | `/academy/courses/:id`              | Public/All         | Get course details                 |
| PATCH  | `/academy/courses/:id`              | Instructor, Admin  | Update course                      |
| DELETE | `/academy/courses/:id`              | Instructor, Admin  | Delete course                      |
| PATCH  | `/academy/courses/:id/submit`       | Instructor         | Submit for approval                |
| PATCH  | `/academy/courses/:id/approve`      | Admin              | Approve course                     |
| PATCH  | `/academy/courses/:id/reject`       | Admin              | Reject course                      |
| PATCH  | `/academy/courses/:id/status`       | Admin              | Update course status               |
| POST   | `/academy/courses/:id/instructor`   | Admin              | Assign instructor                  |
| GET    | `/academy/courses/instructor/stats` | Instructor         | Get instructor's courses with stats|

### Modules

| Method | Endpoint                         | Role              | Description              |
|--------|----------------------------------|-------------------|--------------------------|
| POST   | `/academy/modules`               | Instructor, Admin | Create module            |
| GET    | `/academy/modules`               | All               | List all modules         |
| GET    | `/academy/modules/course/:id`    | All               | Get modules by course    |
| GET    | `/academy/modules/:id`           | All               | Get module details       |
| PATCH  | `/academy/modules/:id`           | Instructor, Admin | Update module            |
| DELETE | `/academy/modules/:id`           | Instructor, Admin | Delete module            |

### Lessons

| Method | Endpoint                        | Role              | Description              |
|--------|---------------------------------|-------------------|--------------------------|
| POST   | `/academy/lessons`              | Instructor, Admin | Create lesson            |
| GET    | `/academy/lessons/module/:id`   | All               | Get lessons by module    |
| GET    | `/academy/lessons/:id`          | All               | Get lesson details       |
| PATCH  | `/academy/lessons/:id`          | Instructor, Admin | Update lesson            |
| DELETE | `/academy/lessons/:id`          | Instructor, Admin | Delete lesson            |

### Content

| Method | Endpoint                        | Role              | Description              |
|--------|---------------------------------|-------------------|--------------------------|
| POST   | `/academy/content`              | Instructor, Admin | Create content           |
| GET    | `/academy/content/lesson/:id`   | All               | Get content by lesson    |
| GET    | `/academy/content/:id`          | All               | Get content details      |
| PATCH  | `/academy/content/:id`          | Instructor, Admin | Update content           |
| DELETE | `/academy/content/:id`          | Instructor, Admin | Delete content           |

### Enrollments

| Method | Endpoint                            | Role    | Description                  |
|--------|-------------------------------------|---------|------------------------------|
| POST   | `/academy/enrollment`               | Student | Enroll in a course           |
| GET    | `/academy/enrollment`               | Admin   | List all enrollments         |
| GET    | `/academy/enrollment/me`            | Student | Get my enrollments           |
| GET    | `/academy/enrollment/course/:id`    | All     | Enrollments by course        |
| GET    | `/academy/enrollment/cohort/:id`    | Instr.  | Enrollments by cohort        |
| GET    | `/academy/enrollment/user/:id`      | Admin   | Enrollments by user          |
| DELETE | `/academy/enrollment/:id`           | Admin   | Remove enrollment            |

### Exercises

| Method | Endpoint                            | Role              | Description              |
|--------|-------------------------------------|-------------------|--------------------------|
| POST   | `/academy/exercises`                | Instructor, Admin | Create exercise          |
| GET    | `/academy/exercises/module/:id`     | All               | Exercises by module      |
| GET    | `/academy/exercises/:id`            | All               | Exercise details         |
| PATCH  | `/academy/exercises/:id`            | Instructor, Admin | Update exercise          |
| DELETE | `/academy/exercises/:id`            | Instructor, Admin | Delete exercise          |
| POST   | `/academy/exercises/:id/submit`     | Student           | Submit an answer         |
| POST   | `/academy/exercises/:id/grade`      | Instructor, Admin | Grade a submission       |

### Progress

| Method | Endpoint                               | Role    | Description                  |
|--------|----------------------------------------|---------|------------------------------|
| POST   | `/academy/progress/complete-lesson`    | Student | Mark lesson complete         |
| POST   | `/academy/progress/update-content`     | Student | Update content progress      |
| GET    | `/academy/progress/my-courses`         | Student | My course progress           |
| GET    | `/academy/progress/instructor`         | Instr.  | Instructor stats             |
| GET    | `/academy/progress/course/:id`         | Instr.  | Course analytics             |
| GET    | `/academy/progress/students/:courseId`  | Instr.  | Students' progress           |

### Payments

| Method | Endpoint                     | Role   | Description              |
|--------|------------------------------|--------|--------------------------|
| POST   | `/payments/initialize`       | Auth'd | Initialize payment       |
| POST   | `/payments/webhooks/chapa`   | Public | Chapa webhook callback   |
| POST   | `/payments/webhooks/stripe`  | Public | Stripe webhook callback  |

---

## 12. Environment Configuration

### Academy Service (`docker-compose.yml`)

```yaml
academy-service:
  environment:
    - PORT=3005
    - DATABASE_URL=postgresql://user:pass@postgres:5432/alikohub_db?schema=academy
    - AUTH_SERVICE_HOST=auth-service
    - AUTH_SERVICE_PORT=3001
    - PAYMENT_SERVICE_HOST=payment-service
    - PAYMENT_SERVICE_PORT=3012
    - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
    - RABBITMQ_ENABLED=true
```

### Payment Service (`docker-compose.yml`)

```yaml
payment-service:
  environment:
    - PAYMENT_SERVICE_PORT=3012
    - DATABASE_URL=postgresql://user:pass@postgres:5432/alikohub_db?schema=payment
    - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
    - CHAPA_SECRET_KEY=CHASECK_TEST-...
    - STRIPE_SECRET_KEY=sk_test_...
    - STRIPE_WEBHOOK_SECRET=whsec_...
    - STRIPE_SUCCESS_URL=https://yourdomain.com/payment/success
    - STRIPE_CANCEL_URL=https://yourdomain.com/payment/cancel
    - CHAPA_CALLBACK_URL=https://yourdomain.com/payments/webhooks/chapa
```

---

## Visual Summary: Complete Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COURSE LIFECYCLE FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INSTRUCTOR                    ADMIN                   STUDENT      │
│  ─────────                    ─────                   ───────      │
│                                                                     │
│  1. Create Course (DRAFT)                                          │
│  2. Add Modules                                                    │
│  3. Add Lessons                                                    │
│  4. Add Content                                                    │
│  5. Add Exercises                                                  │
│  6. Submit for Approval ──────▶ 7. Review & Approve               │
│                                    (PUBLISHED)                     │
│                                                   8. Browse Courses│
│                                                   9. Enroll        │
│                                                     ├─ FREE → ✅   │
│                                                     └─ PAID:       │
│                                                        10. Pay     │
│                                                        11. Webhook │
│                                                        12. Active ✅│
│                                                   13. Learn        │
│                                                   14. Submit Ex.   │
│  15. Grade Exercises                              15. View Progress│
│  16. View Analytics                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Last updated: February 25, 2026*
