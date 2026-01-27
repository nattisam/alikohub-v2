# Weekly Task Verification

## Page 1

Weekly Task Verification  
 
Date: January 25, 2025 
Team: Frontend & Backend Development 
Report Period: Jan 20 - Jan 23, 2025 
 
Task Completion Verification 
 
Completed (Contech) 
●​ Role-based access control is implemented and enforced. 
●​ Project creation, visibility, and basic lifecycle tracking work 
●​ Task and milestone management functions as intended 
●​ Admin and progress metrics are available. 
●​ Users can participate in multiple projects as assigned. 
 
Pending / In Progress (Contech) 
●​ Missing public ConTech contact endpoint 
●​ Some role actions are limited or missing at the project level. 
●​ Missing public ConTech contact endpoint. 
●​ Media and document handling lacks structure. 
 
 
 
 
 
3. Quick Feature Validation Checklist 
 
Contech Module Quick Tests (Backend) 
ADMIN ROLE 
 
Feature 
Status 
Issue 
Create/manage clients 
Partial 
Clients are stored as ConTech user profiles — no 
dedicated Client resource, metadata, or 
client-specific CRUD. 
Create/manage 
contractors 
Implemented 
Managed via ConTech profiles; no 
contractor-specific entity (works but uses user 
profile table). 
Create/manage projects 
Implemented(Parti
ally) 
create() auto-assigns contractorId to creator and 
sets status = PLANNED (likely unintended). 
Assign 
contractors/clients at 
create 
Partial 
clientId supported at create; contractorId cannot 
be provided on create (must PATCH afterward). 


## Page 2

View all projects & 
dashboards 
Implemented 
No issue.(GET /projects/stats provide admin 
visibility.) 
Monitor overall progress Implemented 
No issue.(getProjectStats returns 
ACTIVE/PLANNED/COMPLETED counts.) 
 
CONTRACTOR ROLE 
Feature 
Status 
Evidence 
Issue 
View only 
projects they 
are assigned 
to 
Implement
ed 
projects.service.ts, 
projects.controller.ts 
findAll/findOne do filter by contractor 
role—add contractor-scoped filters 
when contechProfile.role === 
'CONTRACTOR'. 
Update 
project 
progress 
(project-level) 
Not 
Implement
ed(project-l
evel) / 
Partially 
(task-level) 
Project status: 
projects.service.updateSt
atus; Task progress: 
tasks.service.ts:81 
Contractors can update task progress 
and milestones but cannot change 
project status—decide whether to allow 
limited project progress updates for 
contractors. 
Manage tasks 
and 
milestones 
Implement
ed(scoped) 
tasks.service.ts, 
milestones.controller.ts 
Access checks ensure contractor can 
act if Project.contractorId === 
user.firebaseId or task.assignedTo === 
user. 
Cannot create 
or delete 
projects or 
users 
Mostly 
implement
ed 
Create: 
projects.controller.ts#creat
e, Service checks in 
projects.service.ts 
Creation restricted to ADMIN; deletion 
limited to ADMIN. User creation 
handled in Auth/Careers 
services—ensure Admin-only flows 
there. 
Can be 
assigned to 
multiple 
projects 
Implement
ed 
prisma/schema.prisma 
(Project.contractorId 
indexed) 
Schema supports reuse of contractor 
IDs across projects. 
Cannot 
access 
projects they 
are not 
assigned to 
Implement
ed 
See findAll/findOne in 
projects.service.ts 
findAll / findOne RBAC filter checks 
contractorId and clientId 
(projects.service.ts) 
 
Client (/client) Role 
Feature 
Status 
Evidence 
 Issue 
View only 
projects 
they are 
assigned 
Impleme
nted 
projects.service.ts (filters by clientId) 
— 


## Page 3

to 
View 
uploaded 
photos, 
document
s, and 
reports 
Partially 
impleme
nted 
Photos: schema.prisma + updatePhotos() in 
projects.service.ts; Reports: 
client-report.service.ts 
Photos stored as 
String[] (no per-photo 
metadata). Documents: 
no ProjectDocument 
model or 
/projects/:id/documents 
route 
Cannot 
edit 
project 
data 
(client is 
read-only) 
Impleme
nted 
ProjectsService.update enforces ADMIN-only 
in projects.service.ts 
— 
Clients 
created by 
Admin 
(onboardin
g) 
Partially 
impleme
nted / 
undocu
mented 
User creation exists in auth-service; scripts in 
auth-service 
No explicit/documented 
admin-provisioning 
endpoint in ConTech (flow 
lives in auth-service) 
May have 
multiple 
projects 
Impleme
nted 
Project.clientId in prisma/schema.prisma 
supports multiple projects per client 
— 
Only see 
what 
Admin/Co
ntractor 
expose to 
them 
Partially 
enforced 
Multiple services check if (profile.role === 
'CLIENT' && project.clientId !== 
user.firebaseId) across codebase (projects, 
tasks, milestones, client-report) 
Enforcement present but 
coverage should be 
validated end-to-end 
(messages/docs not 
implemented) 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
[TEST-01] Admin cannot assign contractor at project creation 
Status: 
 


## Page 4

Project: 
ALIKOHUB CONTECH 
 
 
Component 
Contech 
Priority: 
Medium 
 
 
Description 
Admins can call the project create endpoint but cannot assign the intended 
contractor at creation. The backend auto-assigns contractorId/inspectorId to 
the creating user and sets status to PLANNED, so the intended contractor 
doesn't see the project until an update is performed. 
 
 
Steps to Reproduce 
1.​ POST to POST /projects as Admin with a clientId (no contractor id field is supported). 
2.​ Inspect the created project → contractorId == Admin's firebaseId,, status == PLANNED. 
3.​ Intended contractor cannot list or see the project until PATCH /projects/:id sets their 
contractorId. 
 
Expected result: 
-​
contractorId : Admin may optionally provide contractorId at creation and those values 
are persisted. 
-​
status: either remain PLANNED by default or accept an explicit status/activation flag per 
product decision like ACTIVE— but Admin should be able to create and immediately 
assign the correct contractor so they can see the project. 
Actual result: 
-​
contractorId / inspectorId: set to the Admin (creator) firebaseId. 
-​
status: set to PLANNED. 
-​
visibility: Intended contractor does not see the project until a follow-up PATCH assigns 
them. 
Fix: 
-​
Update CreateProjectDto to include optional fields: contractorId to string 
-​
Update ProjectsService.create(): 
                       - If dto.contractorId provided, validate/ensure profiles via await 
this.userService.ensureProfileExists(id) (or fail/return validation error if invalid). 
                       - persist provided IDs. 
             Otherwise default to user.firebaseId (preserve current behavior). 
-​
Status handling: decide product behavior: 
Option A: if creator is Admin, set status = 'ACTIVE', or Option B: accept status in DTO (with 
validation) or keep PLANNED and Project activation flow. 
 
 
 
 
 
 
[TEST-02] Project create: unsafe date defaulting (startDate/endDate) 
Status: 
 


## Page 5

Project: 
ALIKOHUB CONTECH 
 
 
Component 
Contech 
Priority: 
Medium 
 
 
Description 
Project creation improperly requires startDate and defaults missing endDate 
to server now, causing incorrect data and potential logic error. 
 
 
Steps to Reproduce 
1.​ Obtain a valid token for a user who can create projects (ADMIN). 
2.​ POST without startDate: 
curl -s -X POST http://localhost:3009/projects -H "Authorization: Bearer <ACCESS_TOKEN>" 
-H "Content-Type: application/json" -d '{"name":"P-no-start","description":"no start date"}' 
→ 400: "startDate must be a valid ISO 8601 date string" 
3.​ POST with startDate but omit endDate: 
curl -s -X POST http://localhost:3009/projects -H "Authorization: Bearer <ACCESS_TOKEN>" 
-H "Content-Type: application/json" -d 
'{"name":"P-with-start","startDate":"2026-02-01T00:00:00Z","description":"no end"}' 
→ Created project with endDate == server time (unexpected). 
 
Expected result: 
-​
Absent date fields should be handled explicitly: either validated as required (return 400) 
or stored as null/undefined (no implicit default to now).  
Actual result: 
-​
If dto.endDate is omitted, endDate becomes the current timestamp (now). 
Fix: 
In create() use guarded parsing: 
-​
startDate: dto.startDate ? new Date(dto.startDate) : undefined 
-​
endDate: dto.endDate ? new Date(dto.endDate) : undefined 
 
PARTIAL/MISSING ENDPOINTS TO BE IMPLEMENTED 
 
[TEST-03] Project Progress API (partial/missing) 


## Page 6

Status: 
 
Project: 
ALIKOHUB CONTECH 
 
 
Component 
Contech 
Priority: 
Medium 
 
 
Description 
There is no dedicated, validated API for contractors to submit progress 
percentages or structured progress updates. Current updateStatus() allows 
status changes but no progress endpoint or server-side validation of 
progress updates; milestones update exists but is fragmented. 
 
 
Steps to Reproduce 
1.​ Obtain a contractor token. 
2.​ Attempt POST /contractor/projects/:id/progress (route not present) or PATCH 
/projects/:id with { progress: 45 }. 
 
Expected: API accepts a well-formed progress update, validates contractor is assigned 
to project, stores progress and updatedBy metadata. 
Actual: No dedicated /contractor/projects/:id/progress route (404). PATCH may be 
unsupported or restricted; progress field exists on model but no validated endpoint or 
audit fields. 
Fix: Add POST /contractor/projects/:id/progress (or extend PATCH) with request 
validation, require 0 <= progress <= 100, require project.contractorId === 
user.firebaseId, record updatedBy and timestamp 
 
 
[TEST-04] Missing Weekly/Textual Updates 
Status: 
 
Project: 
ALIKOHUB CONTECH 
 
 
Component 
Contech 
Priority: 
Medium 
 
 
Description 
No WeeklyUpdate or textual update model/endpoints for contractors to add 
scheduled narrative updates (summaries). Clients and audit require textual 
logs. 
 


## Page 7

 
Steps to Reproduce 
1.​ Attempt POST /projects/:id/updates or POST /contractor/projects/:id/updates 
with { text: "Weekly summary..." }. 
            Expected: 201 Created with stored summary, author, and timestamp. 
Actual: Endpoint missing (404). 
Fix: Add ProjectUpdate (id, projectId, authorId, text, createdAt) and gateway routes 
/projects/:id/updates and /contractor/projects/:id/updates. Enforce assignment check 
and pagination. 
 
 
 
 
Closed Issues(Regression Test Result) 
 
1.​ [TEST-01] Admin Panel UI Issues - Duplicate Elements  
-Implemented 
2.​ [TEST-02] Teacher Applications API 
-Approval without review: updateTeacherApplicationStatus() allows updating status 
(e.g., to APPROVED) without enforcing reviewedBy, reviewNotes, or checking 
formData completeness — so approvals without review are possible. 
- Fake resume URL: there is no HTTP check or file-type validation; only URL syntax 
is checked. 
 
3.​ [TEST-04] Admin Dashboard (Create Recruiter Form) 
-​
Blocking invalid submits — Not implemented: 
Frontend form relies on HTML required and only disables submit while creating 
(isCreating). No formRef.checkValidity() or disabled-until-valid logic. 
 
-​
Server-side validation & inline field errors — Partially implemented (backend), but not 
surfaced client-side: 
 Backend checks/throws for duplicates and validation (Auth & API gateway):   
careers.controller.tsand auth.service.tsperform DB + Firebase checks and return 
RpcExceptions. 
Frontend shows only a generic error message; it does not parse or display structured field 
errors from the API. See admin-dashboard.tsx:1-200 and recruiter client 
recruiter-service.ts:1-80. 
-​
Duplicate-email race / DB vs Firebase out-of-sync — Largely mitigated 
4.​ [TEST-05] JobType enum mismatch (frontend vs backend)(Not 
implemented) 


## Page 8

Frontend still uses INTERN for job type while backend expects INTERNSHIP 
and also supports FREELANCE. This enum mismatch causes 400 validation 
errors or bad DB values. 
 
5.​ [TEST-06] Missing salary wording: jobs created without salary 
range render no explicit salary message 
Salary fallback missing: job-page.tsx renders salary only when present 
(job.salaryRange && ...), so it shows blank when omitted; elsewhere (e.g. 
JobsHomePage.tsx) there is a "Not specified" or ‘required” fallback. 
 
6.​ [TEST-07] Resume URL not validated/filtered 
         -Implemented 
7.​ [TEST-08] Missing ownership/authorization check on update 
        -Implemented 


