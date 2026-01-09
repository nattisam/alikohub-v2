import { contechApi } from "../api";
import { type Task } from "../components/type";

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
    try {
      const response = await contechApi.post("/tasks", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async findByProject(projectId: number, query: any): Promise<Task[]> {
    try {
      const response = await contechApi.get(`/tasks/project/${projectId}`, {
        params: query,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const response = await contechApi.get(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    try {
      const response = await contechApi.put(`/tasks/${id}`, dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await contechApi.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  async updateTaskProgress(id: number, progress: number): Promise<Task> {
    try {
      const response = await contechApi.patch(
        `/tasks/${id}/progress`,
        { progress },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id} progress:`, error);
      throw error;
    }
  }

  async getTaskStats(
    projectId: number | undefined,
    assignedTo: string | undefined
  ): Promise<TaskStats> {
    try {
      const params: any = {};
      if (projectId) params.projectId = projectId;
      if (assignedTo) params.assignedTo = assignedTo;

      const response = await contechApi.get("/tasks/stats", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching task stats:", error);
      throw error;
    }
  }
}
