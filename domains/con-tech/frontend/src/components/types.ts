// =========================
// GENERAL INTERFACES
// =========================
export interface Notification {
  title: string;
  description: string;
  priority?: "High" | "Medium" | "Completed";
  time: string;
}

export interface Activity {
  avatar: string;
  projectId: string;
  user: User;
  action: string;
  time: string;
}

export interface User {
  firebaseId: string | number;
  firstname: string;
  lastname: string;
  profilePicture?: string;
}

export interface CurrentUser extends User {
  email: string;
  role: "ADMIN" | "CLIENT" | "CONTRACTOR" | "PROJECT_MANAGER" | "USER";
  bio?: string | null;
  qualifications?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
  hasSelectedRole?: boolean;
}

export interface ExtendedCurrentUser extends CurrentUser {
  permissions?: string[];
  activeRole?: string;
  availableRoles?: string[];
}

export interface Document {
  name: string;
  type: string;
  updated: string;
  version?: string;
}

export interface SignupCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  captchaToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface FileWithMetadata {
  file: File;
  preview?: string;
}

// Task related interfaces
export interface Task {
  id: number;
  projectId: number;
  title?: string | null;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress?: number | null;
  deadline?: Date | null;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  project?: Project;
}

export interface TaskQuery {
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  assignedTo?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDateBefore?: string;
  dueDateAfter?: string;
}

export interface TaskStatsParams {
  projectId?: number;
  assignedTo?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  projectId: number;
  assignedTo?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  progress?: number;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}

// Report related interfaces
export interface Report {
  id: number;
  projectId: number;
  title: string;
  summary: string;
  generatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  project?: Project;
}

// Inspection related interfaces
export interface Inspection {
  id: number;
  projectId: number;
  inspectorId: string;
  findings: string;
  recommendations: string;
  status: InspectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInspectionDto {
  projectId: number;
  inspectorId: string;
  findings: string;
  recommendations: string;
}

export interface UpdateInspectionDto {
  id: number;
  findings?: string;
  recommendations?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// Contract related interfaces
export interface Contract {
  id: number;
  projectId: number;
  fileName: string;
  secureUrl: string;
  publicId: string;
  status: ContractStatus;
  changeOrders: ChangeOrder[];
  uploadedAt: Date;
  updatedAt: Date;

  project?: Project;
}

// Comment related interfaces
export interface Comment {
  id: number;
  projectId: number;
  userId: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// =========================
// ENUMS
// =========================
export enum ProjectStatus {
  DRAFT = "DRAFT",
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  DELAYED = "DELAYED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEWED = "REVIEWED",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
  CANCELLED = "CANCELLED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ContractStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  AMENDED = "AMENDED",
}

export enum InspectionStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ChecklistItemStatus {
  PASS = "PASS",
  FAIL = "FAIL",
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

export enum MilestoneStatus {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// =========================
// MODELS
// =========================
export interface Project {
  id: number;
  name: string;
  subtitle?: string | null;
  inspectorId: string;
  contractorId: string;
  site?: string | null;
  description?: string | null;
  status: ProjectStatus;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  budgetCents?: number | null;
  progress?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string | null;
  updatedBy?: string | null;

  // Relations
  tasks?: Task[];
  contracts?: Contract[];
  inspections?: Inspection[];
  milestones?: Milestone[];
  clientReports?: Report[];
  documents?: Document[];
  comments?: Comment[];
  activities?: Activity[];
}

export interface ProjectWithStats extends Project {
  taskStats?: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

export interface Milestone {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: MilestoneStatus;
  dueDate?: Date | string | null;
  progress: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Task {
  id: number;
  projectId: number;
  title?: string | null;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress?: number | null;
  deadline?: Date | null;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  project?: Project;
}

export interface TaskQuery {
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  assignedTo?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDateBefore?: string;
  dueDateAfter?: string;
}

export interface TaskStatsParams {
  projectId?: number;
  assignedTo?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  projectId: number;
  assignedTo?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  progress?: number;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}

export interface Contract {
  id: number;
  projectId: number;
  fileName: string;
  secureUrl: string;
  publicId: string;
  status: ContractStatus;
  changeOrders: ChangeOrder[];
  uploadedAt: Date;
  updatedAt: Date;

  project?: Project;
}

export interface ChangeOrder {
  id: number;
  description: string;
  amount: number;
  createdAt: Date | string;
}

export interface AddChangeOrderDto {
  description: string;
  amount: number;
}

export interface Inspection {
  id: number;
  projectId: number;
  inspectorId: string;
  findings: string;
  recommendations: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateInspectionDto {
  projectId: number;
  inspectorId: string;
  findings: string;
  recommendations: string;
}

export interface UpdateInspectionDto {
  id: number;
  findings?: string;
  recommendations?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface ChecklistItem {
  id: number;
  itemDescription: string;
  status: ChecklistItemStatus;
  comment?: string | null;
  inspectionId: number;

  inspection?: Inspection;
}

export interface Report {
  id: number;
  projectId: number;
  title: string;
  summary: string;
  generatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  project?: Project;
}

export interface CreateReportDto {
  projectId: number;
  title: string;
  summary: string;
}

// Comment related interfaces
export interface Comment {
  id: number;
  projectId: number;
  userId: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  refreshProfile: () => Promise<CurrentUser | null>;
  selectRole: (role: string) => Promise<void>;
}

// =========================
// OPTIONAL: Comment interface
// =========================
export interface Comment {
  id: number;
  projectId: number;
  userId: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
