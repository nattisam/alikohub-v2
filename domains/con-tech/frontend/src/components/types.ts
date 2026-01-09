export interface Notification {
  title: string;
  description: string;
  priority?: "High" | "Medium" | "Completed";
  time: string;
}

export interface Activity {
  avatar: string;
  projectId: string;
  user: User; //string referring to the user display name
  action: string;
  time: string;
}

export interface CurrentUser extends User {
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  role: "ADMIN" | "CLIENT" | "CONTRACTOR" | "PROJECT_MANAGER" | "USER";
  bio?: string | null;
  qualifications?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
  hasSelectedRole?: boolean;
}
export interface User {
  firebaseId: number | string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
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
  captchaToken: string;
}


export interface LoginCredentials {
  email: string;
  password: string;
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
  REVIEW = "REVIEWED",
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

export interface FileWithMetadata {
  file: File;
  preview?: string;
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
  subtitle: string | null;
  inspectorId: string;
  contractorId: string;
  site?: string | nulll;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | string | null;
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
  clientReports?: ClientReport[];
  documents?: Document[];
  comments?: Comment[];
  activities?: Activity[];
}
export interface Milestone {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: MilestoneStatus | MilestoneStatus.PENDING;
  dueDate?: Date | string | null;
  progress: number | 0.0;
  createdAt: Date | string;
  updatedAt: Date | string;
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
  title: string | null;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress?: number | null;
  deadline?: Date | null;
  assignedTo?: string | null; // firebaseId of the assignee
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  // Relations
  project?: Project;
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

  // Relations
  project?: Project;
}

export interface ChangeOrder {
  id: number;
  description: string;
  amount: number;
  createdAt: Date |string;
}

export interface AddChangeOrderDto {
  description: string;
  amount: number;
}

export interface Inspection {
  id: number;
  projectId: number;
  inspectorId: string;
  checklist?: ChecklistItem[];
  photos: string[];
  status: InspectionStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  // Relations
  project?: Project;
}

export interface ChecklistItem {
  id: number;
  itemDescription: string;
  status: ChecklistItemStatus;
  comment?: string | null;
  inspectionId: number;

  // Relations
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

  // Relations
  project?: Project;
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

export interface ExtendedCurrentUser extends CurrentUser {
  role: "ADMIN" | "CLIENT" | "CONTRACTOR" | "PROJECT_MANAGER" | "USER";
  permissions?: string[];
  activeRole?: string;
  availableRoles?: string[];
}
