# AlikoHub API Gateway Academy Service - Postman Collection Template

## Collection Structure

Create a new Postman collection with the following folders and requests:

### 1. Authentication Folder

#### Login Request
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/auth/academy/login`
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("authToken", response.token);
    pm.environment.set("userId", response.user.id);
    pm.test("Login successful", function () {
        pm.expect(pm.response.code).to.equal(200);
        pm.expect(response.token).to.be.a("string");
    });
} else {
    pm.test("Login failed", function () {
        pm.expect(pm.response.code).to.be.oneOf([400, 401, 404]);
    });
}
```

#### Register Request
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/auth/academy/register`
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "email": "{{newUserEmail}}",
  "password": "{{newUserPassword}}",
  "displayName": "New Test User"
}
```

### 2. Academy Profile Folder

#### Get Academy Profile
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/profile`
- **Headers**: Authorization: Bearer {{authToken}}

#### Create Academy Profile
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/profile`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "bio": "Passionate learner and educator",
  "interests": ["Technology", "Education", "Innovation"],
  "experience": "5 years in software development"
}
```

#### Select Role
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/select-role`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "role": "STUDENT"
}
```

### 3. Courses Folder

#### Create Course
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/courses`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Introduction to Web Development",
  "description": "Learn the fundamentals of web development",
  "duration": 40,
  "difficulty": "BEGINNER",
  "category": "Programming"
}
```
- **Tests**:
```javascript
pm.test("Course created successfully", function () {
    pm.expect(pm.response.code).to.equal(201);
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("string");
    pm.environment.set("courseId", response.id);
});
```

#### Get All Courses
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/courses`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Course by ID
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/courses/{{courseId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Update Course
- **Method**: PUT
- **URL**: `{{apiGatewayUrl}}/academy/courses/{{courseId}}`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Updated Course Title",
  "description": "Updated course description"
}
```

#### Delete Course
- **Method**: DELETE
- **URL**: `{{apiGatewayUrl}}/academy/courses/{{courseId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Courses by Category
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/courses/category/Programming`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Courses by Difficulty
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/courses/difficulty/BEGINNER`
- **Headers**: Authorization: Bearer {{authToken}}

### 4. Cohorts Folder

#### Create Cohort
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/cohorts`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "name": "Web Development Cohort 2024",
  "courseId": "{{courseId}}",
  "startDate": "2024-01-15",
  "endDate": "2024-06-15",
  "maxStudents": 30
}
```
- **Tests**:
```javascript
pm.test("Cohort created successfully", function () {
    pm.expect(pm.response.code).to.equal(201);
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("string");
    pm.environment.set("cohortId", response.id);
});
```

#### Get All Cohorts
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/cohorts`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Cohort by ID
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/cohorts/{{cohortId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Update Cohort
- **Method**: PUT
- **URL**: `{{apiGatewayUrl}}/academy/cohorts/{{cohortId}}`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "name": "Updated Cohort Name",
  "maxStudents": 35
}
```

#### Delete Cohort
- **Method**: DELETE
- **URL**: `{{apiGatewayUrl}}/academy/cohorts/{{cohortId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Cohorts by Course
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/cohorts/course/{{courseId}}`
- **Headers**: Authorization: Bearer {{authToken}}

### 5. Course Modules Folder

#### Create Module
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/modules`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "HTML & CSS Basics",
  "description": "Learn the fundamentals of HTML and CSS",
  "courseId": "{{courseId}}",
  "order": 1
}
```
- **Tests**:
```javascript
pm.test("Module created successfully", function () {
    pm.expect(pm.response.code).to.equal(201);
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("string");
    pm.environment.set("moduleId", response.id);
});
```

#### Get All Modules
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/modules?courseId={{courseId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Module by ID
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/modules/{{moduleId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Update Module
- **Method**: PUT
- **URL**: `{{apiGatewayUrl}}/academy/modules/{{moduleId}}`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Updated Module Title",
  "description": "Updated module description"
}
```

#### Delete Module
- **Method**: DELETE
- **URL**: `{{apiGatewayUrl}}/academy/modules/{{moduleId}}`
- **Headers**: Authorization: Bearer {{authToken}}

### 6. Lessons Folder

#### Create Lesson
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/lessons`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Introduction to HTML",
  "description": "Learn the basics of HTML structure",
  "moduleId": "{{moduleId}}",
  "order": 1,
  "type": "VIDEO",
  "duration": 30
}
```
- **Tests**:
```javascript
pm.test("Lesson created successfully", function () {
    pm.expect(pm.response.code).to.equal(201);
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("string");
    pm.environment.set("lessonId", response.id);
});
```

#### Get All Lessons
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/lessons?moduleId={{moduleId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Lesson by ID
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/lessons/{{lessonId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Update Lesson
- **Method**: PUT
- **URL**: `{{apiGatewayUrl}}/academy/lessons/{{lessonId}}`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Updated Lesson Title",
  "description": "Updated lesson description"
}
```

#### Delete Lesson
- **Method**: DELETE
- **URL**: `{{apiGatewayUrl}}/academy/lessons/{{lessonId}}`
- **Headers**: Authorization: Bearer {{authToken}}

### 7. Content Folder

#### Create Content
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/content`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "HTML Structure Video",
  "type": "VIDEO",
  "lessonId": "{{lessonId}}",
  "order": 1,
  "url": "https://example.com/video.mp4"
}
```
- **Tests**:
```javascript
pm.test("Content created successfully", function () {
    pm.expect(pm.response.code).to.equal(201);
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("string");
    pm.environment.set("contentId", response.id);
});
```

#### Upload Content
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/content/upload`
- **Headers**: Authorization: Bearer {{authToken}}
- **Body**: form-data
  - file: (file)
  - lessonId: {{lessonId}}
  - type: VIDEO

#### Get Content by ID
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/content/{{contentId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Update Content
- **Method**: PUT
- **URL**: `{{apiGatewayUrl}}/academy/content/{{contentId}}`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Updated Content Title",
  "url": "https://example.com/updated-video.mp4"
}
```

#### Delete Content
- **Method**: DELETE
- **URL**: `{{apiGatewayUrl}}/academy/content/{{contentId}}`
- **Headers**: Authorization: Bearer {{authToken}}

### 8. Enrollments Folder

#### Enroll in Course
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/enrollments`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "courseId": "{{courseId}}",
  "cohortId": "{{cohortId}}"
}
```
- **Tests**:
```javascript
pm.test("Enrollment created successfully", function () {
    pm.expect(pm.response.code).to.equal(201);
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("string");
    pm.environment.set("enrollmentId", response.id);
});
```

#### Get My Enrollments
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/enrollments/my`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Enrollment by ID
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/enrollments/{{enrollmentId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Update Enrollment
- **Method**: PUT
- **URL**: `{{apiGatewayUrl}}/academy/enrollments/{{enrollmentId}}`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "status": "ACTIVE"
}
```

#### Cancel Enrollment
- **Method**: DELETE
- **URL**: `{{apiGatewayUrl}}/academy/enrollments/{{enrollmentId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Enrollments by Course
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/enrollments/course/{{courseId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Enrollments by Cohort
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/enrollments/cohort/{{cohortId}}`
- **Headers**: Authorization: Bearer {{authToken}}

### 9. Notifications Folder

#### Create Notification
- **Method**: POST
- **URL**: `{{apiGatewayUrl}}/academy/notifications`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Course Update",
  "message": "New lesson added to your course",
  "type": "INFO",
  "recipientId": "{{userId}}"
}
```
- **Tests**:
```javascript
pm.test("Notification created successfully", function () {
    pm.expect(pm.response.code).to.equal(201);
    const response = pm.response.json();
    pm.expect(response.id).to.be.a("string");
    pm.environment.set("notificationId", response.id);
});
```

#### Get My Notifications
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/notifications/my`
- **Headers**: Authorization: Bearer {{authToken}}

#### Get Notification by ID
- **Method**: GET
- **URL**: `{{apiGatewayUrl}}/academy/notifications/{{notificationId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Update Notification
- **Method**: PUT
- **URL**: `{{apiGatewayUrl}}/academy/notifications/{{notificationId}}`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "title": "Updated Notification Title",
  "message": "Updated notification message"
}
```

#### Delete Notification
- **Method**: DELETE
- **URL**: `{{apiGatewayUrl}}/academy/notifications/{{notificationId}}`
- **Headers**: Authorization: Bearer {{authToken}}

#### Mark as Read
- **Method**: PATCH
- **URL**: `{{apiGatewayUrl}}/academy/notifications/{{notificationId}}/read`
- **Headers**: Authorization: Bearer {{authToken}}, Content-Type: application/json
- **Body**:
```json
{
  "read": true
}
```

## Environment Variables

Create environment with these variables:
- `apiGatewayUrl`: http://localhost:3000
- `email`: test@example.com
- `password`: password123
- `newUserEmail`: newuser@example.com
- `newUserPassword`: newpassword123
- `authToken`: (auto-set)
- `userId`: (auto-set)
- `courseId`: (auto-set)
- `cohortId`: (auto-set)
- `moduleId`: (auto-set)
- `lessonId`: (auto-set)
- `contentId`: (auto-set)
- `enrollmentId`: (auto-set)
- `notificationId`: (auto-set)

## Global Tests

Add to collection-level tests:
```javascript
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```
