import { contechApi } from "../api";
import type { Milestone, MilestoneStatus } from "../components/types";

export interface CreateMilestoneDto {
  projectId: number;
  name: string;
  date: string;
}

export class MilestonesService {
  private static instance: MilestonesService;

  private constructor() {}

  static getInstance(): MilestonesService {
    if (!MilestonesService.instance) {
      MilestonesService.instance = new MilestonesService();
    }
    return MilestonesService.instance;
  }

  async create(dto: CreateMilestoneDto): Promise<Milestone> {
    const response = await contechApi.post<Milestone>("/milestones", dto, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return response.data;
  }

  async findByProject(projectId: number): Promise<Milestone[]> {
    const response = await contechApi.get<Milestone[]>(
      `/milestones/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    return response.data;
  }

  async updateStatus(id: number, status: MilestoneStatus): Promise<Milestone> {
    const response = await contechApi.patch<Milestone>(
      `/milestones/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    return response.data;
  }
}
