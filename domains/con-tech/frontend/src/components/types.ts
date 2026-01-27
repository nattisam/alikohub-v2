// =========================
// GENERAL INTERFACES
// =========================
export interface Notification {
  id: number | string;
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
  role: "ADMIN" | "CLIENT" | "CONTRACTOR" | "USER";
  globalRole: string;
  contechRole?: string;
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

// =========================
// ENUMS / LITERAL TYPES
// =========================
export type ProjectStatus = "DRAFT" | "PLANNED" | "ACTIVE" | "ON_HOLD" | "DELAYED" | "COMPLETED" | "CANCELLED";
export const ProjectStatus = {
  DRAFT: "DRAFT" as const,
  PLANNED: "PLANNED" as const,
  ACTIVE: "ACTIVE" as const,
  ON_HOLD: "ON_HOLD" as const,
  DELAYED: "DELAYED" as const,
  COMPLETED: "COMPLETED" as const,
  CANCELLED: "CANCELLED" as const,
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEWED" | "COMPLETED" | "BLOCKED" | "CANCELLED" | "PENDING" | "ON_HOLD";
export const TaskStatus = {
  TODO: "TODO" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  REVIEWED: "REVIEWED" as const,
  COMPLETED: "COMPLETED" as const,
  BLOCKED: "BLOCKED" as const,
  CANCELLED: "CANCELLED" as const,
  PENDING: "PENDING" as const,
  ON_HOLD: "ON_HOLD" as const,
};

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "URGENT";
export const TaskPriority = {
  LOW: "LOW" as const,
  MEDIUM: "MEDIUM" as const,
  HIGH: "HIGH" as const,
  CRITICAL: "CRITICAL" as const,
  URGENT: "URGENT" as const,
};

export type ContractStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "AMENDED";
export const ContractStatus = {
  DRAFT: "DRAFT" as const,
  PENDING_APPROVAL: "PENDING_APPROVAL" as const,
  APPROVED: "APPROVED" as const,
  REJECTED: "REJECTED" as const,
  AMENDED: "AMENDED" as const,
};

export type InspectionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED";
export const InspectionStatus = {
  PENDING: "PENDING" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  COMPLETED: "COMPLETED" as const,
  FAILED: "FAILED" as const,
  CANCELLED: "CANCELLED" as const,
};

export type ChecklistItemStatus = "PASS" | "FAIL" | "NOT_APPLICABLE" | "PENDING";
export const ChecklistItemStatus = {
  PASS: "PASS" as const,
  FAIL: "FAIL" as const,
  NOT_APPLICABLE: "NOT_APPLICABLE" as const,
  PENDING: "PENDING" as const,
};

export type MilestoneStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
export const MilestoneStatus = {
  PENDING: "PENDING" as const,
  IN_REVIEW: "IN_REVIEW" as const,
  APPROVED: "APPROVED" as const,
  REJECTED: "REJECTED" as const,
};

// =========================
// DASHBOARD INTERFACES
// =========================

export interface ClientDashboardData {
  projectProgress: number;
  budget: number;
  spent: number;
  remaining: number;
  recentUpdates?: Array<{
    id: number;
    title: string;
    time: string;
  }>;
  inspectionSummary?: {
    passed: number;
    failed: number;
    pending: number;
  };
}

export interface ProjectManagerDashboardData {
  activeProjects: number;
  activeProjectsChange: number;
  contractStatus: {
    pending: number;
    active: number;
    completed: number;
  };
  rfis: {
    pending: number;
    approved: number;
    rejected: number;
  };
  qualityIssues: {
    total: number;
    critical: number;
    minor: number;
  };
}

export interface ContractorDashboardData {
  assignedTasks: number;
  overdueTasks: number;
  pendingTasks: number;
  todayInspections?: Array<{
    id: number;
    title: string;
    time: string;
    location: string;
  }>;
  openIssues: {
    total: number;
    critical: number;
    minor: number;
  };
}

// =========================
// MODELS
// =========================

export interface Project {
  id: number;
  name: string;
  subtitle?: string | null;
  inspectorId?: string | null;
  contractorId?: string | null;
  clientId?: string | null;
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

export interface Task {
  id: number;
  projectId: number;
  title?: string | null;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress?: number | null;
  deadline?: Date | string | null;
  assignedTo?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string | null;
  updatedBy?: string | null;

  project?: Project;
}

export interface TaskQuery {
  status?: TaskStatus;
  assignedTo?: string;
  priority?: TaskPriority;
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
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  progress?: number;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
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

export interface Contract {
  id: number;
  projectId: number;
  fileName: string;
  secureUrl: string;
  publicId: string;
  status: ContractStatus;
  changeOrders: ChangeOrder[];
  uploadedAt: Date | string;
  updatedAt: Date | string;

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
  status?: InspectionStatus;
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
  generatedAt: Date | string;
  createdBy?: string | null;
  updatedBy?: string | null;

  project?: Project;
}

export interface CreateReportDto {
  projectId: number;
  title: string;
  summary: string;
}

export interface Comment {
  id: number | string;
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
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: CurrentUser) => void;
  refreshProfile: () => Promise<CurrentUser | null>;
  selectRole: (role: string) => Promise<void>;
}
