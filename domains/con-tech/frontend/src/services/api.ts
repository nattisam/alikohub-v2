import apiClient from "../lib/api";
import type {
  LoginCredentials,
  SignupCredentials,
  CreateTaskDto,
  UpdateTaskDto,
  CreateInspectionDto,
  UpdateInspectionDto,
  CreateReportDto,
  ContractStatus,
  Comment,
} from "../components/types";

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    // Map accessToken to token for compatibility with AuthContext
    if (response.data && response.data.accessToken && !response.data.token) {
      return {
        ...response.data,
        token: response.data.accessToken,
      };
    }
    return response.data;
  },

  register: async (credentials: SignupCredentials) => {
    const response = await apiClient.post("/auth/register", credentials);
    // Ensure response has the expected format for AuthContext
    // If backend returns token as 'accessToken', map it to 'token'
    if (response.data && response.data.accessToken && !response.data.token) {
      return {
        ...response.data,
        token: response.data.accessToken,
      };
    }
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await apiClient.post("/auth/verify", {
      type: "jwt",
      value: token,
    });
    // Map accessToken to token for compatibility with AuthContext if needed
    if (response.data && response.data.accessToken && !response.data.token) {
      return {
        ...response.data,
        token: response.data.accessToken,
      };
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    // Map accessToken to token for compatibility with AuthContext if needed
    if (response.data && response.data.accessToken && !response.data.token) {
      return {
        ...response.data,
        token: response.data.accessToken,
      };
    }
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export const contechAPI = {
  getProfile: async () => {
    const response = await apiClient.get("/profile");
    return response.data;
  },

  selectRole: async (role: string) => {
    const response = await apiClient.post("/profile/select-role", { role });
    return response.data;
  },

  createUser: async (data: any) => {
    const response = await apiClient.post("/auth/contech/user", data);
    return response.data;
  },

  getUsersByRole: async (
    role: string,
    page: number = 1,
    pageSize: number = 10,
  ) => {
    const response = await apiClient.get(
      `/contech/admin/users?role=${role}&page=${page}&pageSize=${pageSize}`,
    );
    return response.data;
  },

  getAllProjects: async (page: number = 1, pageSize: number = 100) => {
    const response = await apiClient.get(
      `/projects?page=${page}&pageSize=${pageSize}`,
    );
    return response.data;
  },

  // Projects endpoints
  getProjects: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get("/projects", { params });
    // Extract items from paginated response
    return response.data.items || response.data;
  },

  getProject: async (id: number) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: Record<string, unknown>) => {
    const response = await apiClient.post("/projects", data);
    return response.data;
  },

  updateProject: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  updateProjectStatus: async (id: number, status: string) => {
    const response = await apiClient.patch(`/projects/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Tasks endpoints
  getTasks: async (projectId?: number, params?: Record<string, unknown>) => {
    const url = projectId
      ? `/contech/tasks/project/${projectId}`
      : "/contech/tasks";
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  getTask: async (id: number) => {
    const response = await apiClient.get(`/contech/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskDto) => {
    const response = await apiClient.post("/contech/tasks", data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskDto) => {
    const response = await apiClient.put(`/contech/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await apiClient.delete(`/contech/tasks/${id}`);
    return response.data;
  },

  // Inspections endpoints
  getInspections: async (projectId?: number) => {
    const url = projectId
      ? `/contech/inspections/project/${projectId}`
      : "/contech/inspections";
    const response = await apiClient.get(url);
    return response.data;
  },

  getInspection: async (id: number) => {
    const response = await apiClient.get(`/contech/inspections/${id}`);
    return response.data;
  },

  createInspection: async (data: CreateInspectionDto, files?: File[]) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (files) {
      files.forEach((file) => {
        formData.append(`files`, file);
      });
    }

    const response = await apiClient.post("/contech/inspections", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateInspection: async (data: UpdateInspectionDto) => {
    const response = await apiClient.put(
      `/contech/inspections/${data.id}`,
      data,
    );
    return response.data;
  },

  // Reports endpoints
  getReports: async (projectId?: number) => {
    if (!projectId) {
      return [];
    }
    const response = await apiClient.get(
      `/client-reports/project/${projectId}`,
    );
    return response.data;
  },

  getAllReports: async () => {
    try {
      const response = await apiClient.get("/client-reports");
      return response.data;
    } catch {
      return [];
    }
  },

  getReport: async (id: number) => {
    const response = await apiClient.get(`/client-reports/${id}`);
    return response.data;
  },

  createReport: async (data: CreateReportDto) => {
    const response = await apiClient.post("/client-reports", data);
    return response.data;
  },

  // Contracts endpoints
  getContracts: async (projectId?: number) => {
    const url = projectId
      ? `/contech/contracts/project/${projectId}`
      : "/contech/contracts";
    const response = await apiClient.get(url);
    return response.data;
  },

  getContract: async (id: number) => {
    const response = await apiClient.get(`/contech/contracts/${id}`);
    return response.data;
  },

  uploadContract: async (projectId: number, file: File) => {
    const formData = new FormData();
    formData.append("projectId", projectId.toString());
    formData.append("file", file);

    const response = await apiClient.post("/contech/contracts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateContractStatus: async (id: number, status: ContractStatus) => {
    const response = await apiClient.patch(`/contech/contracts/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Comments endpoints
  getComments: async (_params?: Record<string, unknown>) => {
    // Global comments endpoint does not exist
    return [];
  },

  getProjectComments: async (projectId: number) => {
    const response = await apiClient.get(
      `/contech/comments/project/${projectId}`,
    );
    return response.data;
  },

  createComment: async (data: Comment) => {
    const response = await apiClient.post("/contech/comments", data);
    return response.data;
  },

  updateComment: async (id: string, data: Partial<Comment>) => {
    const response = await apiClient.put(`/contech/comments/${id}`, data);
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await apiClient.delete(`/contech/comments/${id}`);
    return response.data;
  },

  // Milestones endpoints
  getMilestones: async (projectId?: number) => {
    const url = projectId ? `/milestones/project/${projectId}` : "/milestones";
    const response = await apiClient.get(url);
    return response.data;
  },

  getMilestone: async (id: number) => {
    const response = await apiClient.get(`/milestones/${id}`);
    return response.data;
  },

  createMilestone: async (data: {
    projectId: number;
    name: string;
    date?: string;
    description?: string;
  }) => {
    const response = await apiClient.post("/milestones", data);
    return response.data;
  },

  updateMilestone: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.patch(`/milestones/${id}`, data);
    return response.data;
  },

  // Dashboard endpoints
  getClientDashboardData: async () => {
    try {
      // Derive client dashboard data from projects
      const projectsResponse = await apiClient.get("/projects");
      const projects =
        projectsResponse.data.items || projectsResponse.data || [];
      const projectList = Array.isArray(projects) ? projects : [];

      // Calculate aggregate progress from all client projects
      const totalProgress = projectList.reduce(
        (sum: number, p: any) => sum + (p.progress || 0),
        0,
      );
      const avgProgress =
        projectList.length > 0
          ? Math.round(totalProgress / projectList.length)
          : 0;

      return {
        projectProgress: avgProgress,
        budget: 0,
        spent: 0,
        remaining: 0,
        recentUpdates: projectList.slice(0, 5).map((p: any, i: number) => ({
          id: p.id || i,
          title: `${p.name} — ${p.status?.replace(/_/g, " ") || "Active"}`,
          time: p.updatedAt
            ? new Date(p.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A",
        })),
        inspectionSummary: { passed: 0, failed: 0, pending: 0 },
      };
    } catch {
      return {
        projectProgress: 0,
        budget: 0,
        spent: 0,
        remaining: 0,
        recentUpdates: [],
        inspectionSummary: { passed: 0, failed: 0, pending: 0 },
      };
    }
  },

  getProjectManagerDashboardData: async () => {
    const response = await apiClient.get("/contech/admin/dashboard");
    return response.data;
  },

  getContractorDashboardData: async () => {
    try {
      const response = await apiClient.get("/dashboard/contractor");
      return response.data;
    } catch {
      // Endpoint may not exist yet — return safe defaults
      return {
        assignedTasks: 0,
        overdueTasks: 0,
        pendingTasks: 0,
        todayInspections: [],
        openIssues: { total: 0, critical: 0, minor: 0 },
      };
    }
  },
};
