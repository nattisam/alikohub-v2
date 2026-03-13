const fs = require('fs');

const collection = {
  info: {
    name: "Alikohub Platform API",
    description: "Complete API collection for Alikohub Platform - includes Auth, Academy, ConTech, and Events services",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:3006", type: "string" },
    { key: "token", value: "", type: "string" }
  ],
  item: [
    {
      name: "🔐 Auth Service",
      description: "Authentication and user management endpoints",
      item: [
        {
          name: "Authentication",
          item: [
            { name: "Login", request: { method: "POST", url: "{{baseUrl}}/auth/login", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ email: "user@example.com", password: "password123" }, null, 2) } } },
            { name: "Register", request: { method: "POST", url: "{{baseUrl}}/auth/register", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ email: "newuser@example.com", firstname: "John", lastname: "Doe", password: "password123" }, null, 2) } } },
            { name: "Verify Session", request: { method: "POST", url: "{{baseUrl}}/auth/verify", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ type: "token", value: "{{token}}" }, null, 2) } } },
            { name: "Logout", request: { method: "POST", url: "{{baseUrl}}/auth/logout", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Role Management",
          item: [
            { name: "Select Academy Role", request: { method: "POST", url: "{{baseUrl}}/auth/academy/select-role", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ role: "student" }, null, 2) } } },
            { name: "Switch Role", request: { method: "POST", url: "{{baseUrl}}/auth/academy/switch-role", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ newRole: "student" }, null, 2) } } },
            { name: "Get User Academy Status", request: { method: "GET", url: "{{baseUrl}}/auth/academy/user-status/:userId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Teacher Applications",
          item: [
            { 
              name: "Apply as Teacher", 
              request: { 
                method: "POST", 
                url: "{{baseUrl}}/auth/academy/apply-teacher", 
                header: [
                  { key: "Content-Type", value: "application/json" }, 
                  { key: "Authorization", value: "Bearer {{token}}" }
                ], 
                body: { 
                  mode: "raw", 
                  raw: JSON.stringify({ 
                    personalDetails: {
                      firstname: "John",
                      lastname: "Doe",
                      email: "teacher@example.com",
                      phone: "+123456789"
                    },
                    teachingCategories: ["Programming", "Cloud Computing"],
                    resumeUrl: "https://example.com/resume.pdf",
                    interviewResponses: [
                      { question: "Why do you want to teach?", answer: "I love sharing knowledge." }
                    ]
                  }, null, 2) 
                } 
              } 
            },
            { name: "Get All Teacher Applications", request: { method: "GET", url: "{{baseUrl}}/auth/academy/teacher-applications", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Approve Teacher Application", request: { method: "POST", url: "{{baseUrl}}/auth/academy/approve-teacher/:applicationId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Reject Teacher Application", request: { method: "POST", url: "{{baseUrl}}/auth/academy/reject-teacher/:applicationId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "User Profile",
          item: [
            { name: "Get All Users", request: { method: "GET", url: "{{baseUrl}}/users/all", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get My Profile", request: { method: "GET", url: "{{baseUrl}}/users/profile", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update My Profile", request: { method: "PATCH", url: "{{baseUrl}}/users/profile", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ firstName: "Updated", lastName: "Name", phone: "+1234567890" }, null, 2) } } },
            { name: "Delete My Profile", request: { method: "DELETE", url: "{{baseUrl}}/users/profile", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update User by ID", request: { method: "PATCH", url: "{{baseUrl}}/users/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ firstName: "Admin", lastName: "Updated" }, null, 2) } } }
          ]
        }
      ]
    },
    {
      name: "🎓 Academy Service",
      description: "Learning management system endpoints",
      item: [
        {
          name: "Academy Profile",
          item: [
            { name: "Get Academy Profile", request: { method: "GET", url: "{{baseUrl}}/academy/profile", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Create Academy Profile", request: { method: "POST", url: "{{baseUrl}}/academy/profile", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Select Academy Role", request: { method: "POST", url: "{{baseUrl}}/academy/profile/select-role", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ role: "STUDENT" }, null, 2) } } }
          ]
        },
        {
          name: "Courses",
          item: [
            { name: "Create Course", request: { method: "POST", url: "{{baseUrl}}/academy/courses", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Introduction to NestJS", shortDescription: "Learn NestJS basics", longDescription: "Complete NestJS course covering all fundamentals", thumbnail: "https://example.com/image.png", category: "Backend", status: "DRAFT" }, null, 2) } } },
            { name: "Get All Courses", request: { method: "GET", url: "{{baseUrl}}/academy/courses", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Course by ID", request: { method: "GET", url: "{{baseUrl}}/academy/courses/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Course", request: { method: "PATCH", url: "{{baseUrl}}/academy/courses/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Advanced NestJS", status: "PUBLISHED" }, null, 2) } } },
            { name: "Delete Course", request: { method: "DELETE", url: "{{baseUrl}}/academy/courses/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Course Status", request: { method: "PATCH", url: "{{baseUrl}}/academy/courses/:id/status", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ status: "PUBLISHED" }, null, 2) } } },
            { name: "Assign Instructor to Course", request: { method: "PATCH", url: "{{baseUrl}}/academy/courses/:id/instructor", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ instructorId: "firebase-user-id-123" }, null, 2) } } },
            { name: "Get Courses by Category", request: { method: "GET", url: "{{baseUrl}}/academy/courses/category/:category", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Courses by Difficulty", request: { method: "GET", url: "{{baseUrl}}/academy/courses/difficulty/:difficulty", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Course Modules",
          item: [
            { name: "Create Module", request: { method: "POST", url: "{{baseUrl}}/academy/modules", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Introduction", description: "Module overview and goals", courseId: 1 }, null, 2) } } },
            { name: "Get Modules by Course", request: { method: "GET", url: "{{baseUrl}}/academy/modules/course/:courseId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Module by ID", request: { method: "GET", url: "{{baseUrl}}/academy/modules/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Module", request: { method: "PUT", url: "{{baseUrl}}/academy/modules/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Updated Title", description: "Updated description" }, null, 2) } } },
            { name: "Delete Module", request: { method: "DELETE", url: "{{baseUrl}}/academy/modules/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Lessons",
          item: [
            { name: "Create Lesson", request: { method: "POST", url: "{{baseUrl}}/academy/lessons", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Introduction to NestJS", type: "VIDEO", moduleId: 1, dueDate: "2025-01-10T00:00:00.000Z", maxScore: 100 }, null, 2) } } },
            { name: "Get Lessons by Module", request: { method: "GET", url: "{{baseUrl}}/academy/lessons/module/:moduleId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Lesson by ID", request: { method: "GET", url: "{{baseUrl}}/academy/lessons/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Lesson", request: { method: "PUT", url: "{{baseUrl}}/academy/lessons/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Updated Lesson" }, null, 2) } } },
            { name: "Delete Lesson", request: { method: "DELETE", url: "{{baseUrl}}/academy/lessons/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Cohorts",
          item: [
            { name: "Create Cohort", request: { method: "POST", url: "{{baseUrl}}/academy/cohorts", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ name: "January 2025 Cohort", courseId: 1, startDate: "2025-01-01T00:00:00.000Z", endDate: "2025-03-01T00:00:00.000Z" }, null, 2) } } },
            { name: "Get All Cohorts", request: { method: "GET", url: "{{baseUrl}}/academy/cohorts", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Cohort by ID", request: { method: "GET", url: "{{baseUrl}}/academy/cohorts/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Cohort", request: { method: "PATCH", url: "{{baseUrl}}/academy/cohorts/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ name: "Updated Cohort Name" }, null, 2) } } },
            { name: "Delete Cohort", request: { method: "DELETE", url: "{{baseUrl}}/academy/cohorts/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Cohorts by Course", request: { method: "GET", url: "{{baseUrl}}/academy/cohorts/course/:courseId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Enrollments",
          item: [
            { name: "Enroll in Course", request: { method: "POST", url: "{{baseUrl}}/academy/enrollment", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ courseId: 1, cohortId: 1 }, null, 2) } } },
            { name: "Get All Enrollments", request: { method: "GET", url: "{{baseUrl}}/academy/enrollment", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get My Enrollments", request: { method: "GET", url: "{{baseUrl}}/academy/enrollment/me", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get My Enrolled Courses", request: { method: "GET", url: "{{baseUrl}}/academy/enrollment/my-courses", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Enrollments by Cohort", request: { method: "GET", url: "{{baseUrl}}/academy/enrollment/cohort/:cohortId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Enrollments by Course", request: { method: "GET", url: "{{baseUrl}}/academy/enrollment/course/:courseId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Enrollments by User", request: { method: "GET", url: "{{baseUrl}}/academy/enrollment/user/:userId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Remove Enrollment", request: { method: "DELETE", url: "{{baseUrl}}/academy/enrollment/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Progress & Analytics",
          item: [
            { name: "Get Dashboard Progress", request: { method: "GET", url: "{{baseUrl}}/academy/progress/dashboard", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Instructor Stats", request: { method: "GET", url: "{{baseUrl}}/academy/progress/instructor/stats", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Student Stats", request: { method: "GET", url: "{{baseUrl}}/academy/progress/analytics/student", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Overall Analytics", request: { method: "GET", url: "{{baseUrl}}/academy/progress/analytics/overall", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Course Analytics", request: { method: "GET", url: "{{baseUrl}}/academy/progress/course/:courseId/analytics", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Students Progress in Course", request: { method: "GET", url: "{{baseUrl}}/academy/progress/course/:courseId/students", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get User Progress in Course", request: { method: "GET", url: "{{baseUrl}}/academy/progress/course/:courseId/user/:targetUserId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Mark Lesson Complete", request: { method: "POST", url: "{{baseUrl}}/academy/progress/course/:courseId/lesson/:lessonId/complete", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Teaching Schedules",
          item: [
            { name: "Create Schedule", request: { method: "POST", url: "{{baseUrl}}/academy/teaching-schedules", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "NestJS Live Class", description: "Deep dive into NestJS modules", startTime: "2025-12-20T10:00:00Z", endTime: "2025-12-20T11:30:00Z", type: "LIVE", courseId: 1, isRecurring: false }, null, 2) } } },
            { name: "Get Instructor Schedules", request: { method: "GET", url: "{{baseUrl}}/academy/teaching-schedules/instructor", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Course Schedules", request: { method: "GET", url: "{{baseUrl}}/academy/teaching-schedules/course/:courseId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Schedule by ID", request: { method: "GET", url: "{{baseUrl}}/academy/teaching-schedules/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Schedule", request: { method: "PUT", url: "{{baseUrl}}/academy/teaching-schedules/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Updated Schedule" }, null, 2) } } },
            { name: "Delete Schedule", request: { method: "DELETE", url: "{{baseUrl}}/academy/teaching-schedules/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Notifications",
          item: [
            { name: "Create Notification", request: { method: "POST", url: "{{baseUrl}}/academy/notifications", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ userId: "user_id_123", message: "Your assignment has been graded", type: "ASSIGNMENT" }, null, 2) } } },
            { name: "Get My Notifications", request: { method: "GET", url: "{{baseUrl}}/academy/notifications/me", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Mark Notification as Read", request: { method: "PATCH", url: "{{baseUrl}}/academy/notifications/:id/read", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Delete Notification", request: { method: "DELETE", url: "{{baseUrl}}/academy/notifications/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "File Upload",
          item: [
            { name: "Upload Image", request: { method: "POST", url: "{{baseUrl}}/academy/upload/image", header: [{ key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "formdata", formdata: [{ key: "file", type: "file", src: "" }] } } },
            { name: "Get Image by Filename", request: { method: "GET", url: "{{baseUrl}}/academy/upload/image/:filename", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        }
      ]
    },
    {
      name: "🏗️ ConTech Service",
      description: "Construction technology management endpoints",
      item: [
        {
          name: "ConTech Profile",
          item: [
            { name: "Get Profile", request: { method: "GET", url: "{{baseUrl}}/profile", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Create Profile", request: { method: "POST", url: "{{baseUrl}}/profile", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Profile", request: { method: "PUT", url: "{{baseUrl}}/profile", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ companyName: "ABC Construction", phone: "+1234567890" }, null, 2) } } },
            { name: "Select Role", request: { method: "POST", url: "{{baseUrl}}/profile/select-role", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ role: "CLIENT" }, null, 2) } } }
          ]
        },
        {
          name: "Projects",
          item: [
            { name: "Create Project", request: { method: "POST", url: "{{baseUrl}}/projects", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ name: "New Office Building", description: "Construction of 10-story office building", clientId: "client_12345", startDate: "2025-01-01", endDate: "2025-12-31", budget: 1000000, location: "Addis Ababa" }, null, 2) } } },
            { name: "Get All Projects", request: { method: "GET", url: "{{baseUrl}}/projects", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Project by ID", request: { method: "GET", url: "{{baseUrl}}/projects/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Project", request: { method: "PATCH", url: "{{baseUrl}}/projects/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ name: "Updated Project Name", status: "ACTIVE" }, null, 2) } } },
            { name: "Delete Project", request: { method: "DELETE", url: "{{baseUrl}}/projects/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Project Status", request: { method: "PATCH", url: "{{baseUrl}}/projects/:id/status", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ status: "ACTIVE" }, null, 2) } } },
            { name: "Get Project Stats", request: { method: "GET", url: "{{baseUrl}}/projects/stats", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get All Contractors", request: { method: "GET", url: "{{baseUrl}}/projects/contractor", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get All Inspectors", request: { method: "GET", url: "{{baseUrl}}/projects/inspector", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Tasks",
          item: [
            { name: "Create Task", request: { method: "POST", url: "{{baseUrl}}/tasks", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ projectId: 1, description: "Design homepage layout", priority: "HIGH", assignedTo: "user_123", deadline: "2025-12-31", estimatedHours: 10 }, null, 2) } } },
            { name: "Get Tasks by Project", request: { method: "GET", url: "{{baseUrl}}/tasks/project/:projectId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Task by ID", request: { method: "GET", url: "{{baseUrl}}/tasks/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Task", request: { method: "PATCH", url: "{{baseUrl}}/tasks/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ status: "IN_PROGRESS", actualHours: 5 }, null, 2) } } },
            { name: "Update Task Progress", request: { method: "PATCH", url: "{{baseUrl}}/tasks/:id/progress", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ progress: 50 }, null, 2) } } },
            { name: "Delete Task", request: { method: "DELETE", url: "{{baseUrl}}/tasks/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Task Stats", request: { method: "GET", url: "{{baseUrl}}/tasks/stats", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Milestones",
          item: [
            { name: "Create Milestone", request: { method: "POST", url: "{{baseUrl}}/milestones", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ projectId: 1, title: "Foundation Completed", description: "Complete foundation work", status: "PLANNED", dueDate: "2025-06-30" }, null, 2) } } },
            { name: "Get Milestones by Project", request: { method: "GET", url: "{{baseUrl}}/milestones/project/:projectId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Milestone by ID", request: { method: "GET", url: "{{baseUrl}}/milestones/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Milestone", request: { method: "PATCH", url: "{{baseUrl}}/milestones/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Updated Milestone", status: "IN_PROGRESS" }, null, 2) } } },
            { name: "Delete Milestone", request: { method: "DELETE", url: "{{baseUrl}}/milestones/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Submit Milestone for Review", request: { method: "PATCH", url: "{{baseUrl}}/milestones/:id/submit", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Create Milestone Review", request: { method: "POST", url: "{{baseUrl}}/milestones/:id/review", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ inspectorId: "inspector123", status: "APPROVED", comments: "Everything looks good." }, null, 2) } } },
            { name: "Get Milestone Reviews", request: { method: "GET", url: "{{baseUrl}}/milestones/:id/reviews", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Contracts",
          item: [
            { name: "Upload Contract", request: { method: "POST", url: "{{baseUrl}}/contracts/upload", header: [{ key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "formdata", formdata: [{ key: "projectId", value: "1", type: "text" }, { key: "contractFile", type: "file", src: "" }] } } },
            { name: "Get Contracts by Project", request: { method: "GET", url: "{{baseUrl}}/contracts/project/:projectId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Contract Status", request: { method: "PATCH", url: "{{baseUrl}}/contracts/:id/status", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ status: "APPROVED" }, null, 2) } } },
            { name: "Add Change Order", request: { method: "POST", url: "{{baseUrl}}/contracts/:id/change-orders", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ description: "Added new feature X", costImpact: 5000, scheduleImpact: "+10 days" }, null, 2) } } },
            { name: "Get Contract View URL", request: { method: "GET", url: "{{baseUrl}}/contracts/:id/view", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Inspections",
          item: [
            { name: "Create Inspection", request: { method: "POST", url: "{{baseUrl}}/inspections", header: [{ key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "formdata", formdata: [{ key: "data", value: JSON.stringify({ projectId: 1, inspectorId: "inspector123", status: "PENDING", checklist: [{ itemDescription: "Check foundation", status: "PENDING" }] }), type: "text" }, { key: "photos", type: "file", src: "" }] } } },
            { name: "Get Inspections by Project", request: { method: "GET", url: "{{baseUrl}}/inspections/project/:projectId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Inspection by ID", request: { method: "GET", url: "{{baseUrl}}/inspections/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Update Inspection", request: { method: "PATCH", url: "{{baseUrl}}/inspections/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ id: 1, status: "COMPLETED" }, null, 2) } } },
            { name: "Delete Inspection", request: { method: "DELETE", url: "{{baseUrl}}/inspections/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Client Reports",
          item: [
            { name: "Create Client Report", request: { method: "POST", url: "{{baseUrl}}/client-reports", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Q1 2025 Project Report", projectId: 1, summary: "This report provides an overview of the project status, including key achievements and challenges faced during the quarter.", KPIs: [{ name: "Budget Variance", value: "+5%", target: "<2%" }, { name: "Schedule Adherence", value: "95%", target: "100%" }] }, null, 2) } } },
            { name: "Get Reports by Project", request: { method: "GET", url: "{{baseUrl}}/client-reports/projects/:projectId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Get Report by ID", request: { method: "GET", url: "{{baseUrl}}/client-reports/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        }
      ]
    },
    {
      name: "📅 Events Service",
      description: "Event management and registration endpoints",
      item: [
        {
          name: "Public Events",
          item: [
            { name: "Get All Events", request: { method: "GET", url: "{{baseUrl}}/events" } },
            { name: "Get Event by ID", request: { method: "GET", url: "{{baseUrl}}/events/:id" } },
            { name: "Register for Event", request: { method: "POST", url: "{{baseUrl}}/events/:id/register", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "John Doe", email: "john@example.com" }, null, 2) } } }
          ]
        },
        {
          name: "Admin Events",
          item: [
            { name: "Create Event", request: { method: "POST", url: "{{baseUrl}}/admin/events", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Tech Conference 2025", description: "Annual technology conference", date: "2025-06-15", time: "09:00", location: "Convention Center" }, null, 2) } } },
            { name: "Update Event", request: { method: "PUT", url: "{{baseUrl}}/admin/events/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Updated Event Title" }, null, 2) } } },
            { name: "Delete Event", request: { method: "DELETE", url: "{{baseUrl}}/admin/events/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Registrations",
          item: [
            { name: "Get Event Registrations", request: { method: "GET", url: "{{baseUrl}}/admin/events/:eventId/registrations", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } },
            { name: "Delete Registration", request: { method: "DELETE", url: "{{baseUrl}}/admin/events/:eventId/registrations/:registrationId", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Updates/Announcements",
          item: [
            { name: "Get All Updates", request: { method: "GET", url: "{{baseUrl}}/updates" } },
            { name: "Get Update by ID", request: { method: "GET", url: "{{baseUrl}}/updates/:id" } },
            { name: "Create Update", request: { method: "POST", url: "{{baseUrl}}/admin/updates", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "New Feature Announcement", content: "We are excited to announce...", eventId: "event123" }, null, 2) } } },
            { name: "Update Update", request: { method: "PUT", url: "{{baseUrl}}/admin/updates/:id", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ title: "Updated Title" }, null, 2) } } },
            { name: "Delete Update", request: { method: "DELETE", url: "{{baseUrl}}/admin/updates/:id", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        },
        {
          name: "Role Management",
          item: [
            { name: "Assign Role", request: { method: "POST", url: "{{baseUrl}}/events/assign-role", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{token}}" }], body: { mode: "raw", raw: JSON.stringify({ requestedRole: "ORGANIZER" }, null, 2) } } },
            { name: "Get User Role", request: { method: "GET", url: "{{baseUrl}}/events/user-role", header: [{ key: "Authorization", value: "Bearer {{token}}" }] } }
          ]
        }
      ]
    }
  ]
};

fs.writeFileSync('alikohub_postman_collection.json', JSON.stringify(collection, null, 2));
console.log('✅ Comprehensive Postman collection generated!');
console.log('📁 File: alikohub_postman_collection.json');
console.log('\n📦 Structure:');
collection.item.forEach(service => {
  console.log(`  ${service.name} (${service.item.length} folders)`);
  service.item.forEach(folder => {
    console.log(`    - ${folder.name}: ${folder.item.length} requests`);
  });
});
