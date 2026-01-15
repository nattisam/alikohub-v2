import { contechApi } from "../api";
import type { Task, TaskQuery, TaskStatsParams, CreateTaskDto, UpdateTaskDto, TaskStats } from "../components/types";

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

export class TasksService {
  private static instance: TasksService;

  private constructor() {}

  static getInstance(): TasksService {
    if (!TasksService.instance) {
      TasksService.instance = new TasksService();
    }
    return TasksService.instance;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const response = await contechApi.post<Task>("/tasks", dto, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  }

  async findByProject(projectId: number, query?: TaskQuery): Promise<Task[]> {
    const response = await contechApi.get<Task[]>(`/tasks/project/${projectId}`, {
      params: query,
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  }

  async findOne(id: number): Promise<Task> {
    const response = await contechApi.get<Task>(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const response = await contechApi.put<Task>(`/tasks/${id}`, dto, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  }

  async remove(id: number): Promise<void> {
    await contechApi.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
  }

  async updateTaskProgress(id: number, progress: number): Promise<Task> {
    const response = await contechApi.patch<Task>(
      `/tasks/${id}/progress`,
      { progress },
      { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
    );
    return response.data;
  }

  async getTaskStats(params?: TaskStatsParams): Promise<TaskStats> {
    const response = await contechApi.get<TaskStats>("/tasks/stats", {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  }
}
