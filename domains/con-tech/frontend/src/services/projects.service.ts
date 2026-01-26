import { contechApi } from "../api";
import type { Project, Milestone } from "../components/types";
import { AuthService } from "./auth.service";

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
}

export class ProjectsService {
  private static instance: ProjectsService;
  private authToken = AuthService.getAuthToken();
  private constructor() {}

  static getInstance(): ProjectsService {
    if (!ProjectsService.instance) {
      ProjectsService.instance = new ProjectsService();
    }
    return ProjectsService.instance;
  }

  async create(dto: Partial<Project>): Promise<Project> {
    try {
      const response = await contechApi.post("/projects", dto, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async findAll(query: Partial<Project> = {}): Promise<Project[]> {
    try {
      const response = await contechApi.get("/projects", {
        params: query,
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const response = await contechApi.get(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, dto: Partial<Project>): Promise<Project> {
    try {
      const response = await contechApi.put(`/projects/${id}`, dto, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await contechApi.delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }

  async updateStatus(id: number, status: string): Promise<Project> {
    try {
      const response = await contechApi.patch(
        `/projects/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id} status:`, error);
      throw error;
    }
  }

  async getProjectStats(managerId?: string): Promise<ProjectStats> {
    try {
      const response = await contechApi.get("/projects/stats", {
        params: managerId ? { managerId } : {},
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching project stats:", error);
      throw error;
    }
  }

  async getmilestones(projectId: number) {
    try {
      const response = await contechApi.get(
        `/projects/${projectId}/milestones`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching project milestones:", error);
      throw error;
    }
  }

  async updateMilestones(
    projectId: number,
    milestones: Milestone[]
  ): Promise<Milestone> {
    try {
      const response = await contechApi.put(
        `/projects/${projectId}/milestones`,
        milestones,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating project milestones:", error);
      throw error;
    }
  }
  async deleteProject(projectId: number) {
    try {
      if (!this.authToken) {
        throw new Error("No authentication token found");
      }
      // console.log("authtoken: ", this.authToken);
      const response = await contechApi.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("error while deleting  project: ", err);
      throw err;
    }
  }
}
