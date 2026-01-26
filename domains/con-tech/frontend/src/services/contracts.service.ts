import { contechApi } from "../api";
import type {
  Contract,
  AddChangeOrderDto,
  ContractStatus,
} from "../components/types";

export class ContractsService {
  private static instance: ContractsService;

  private constructor() {}

  static getInstance(): ContractsService {
    if (!ContractsService.instance) {
      ContractsService.instance = new ContractsService();
    }
    return ContractsService.instance;
  }

  async uploadContract(projectId: number, file: File): Promise<Contract> {
    try {
      const formData = new FormData();
      formData.append("projectId", projectId.toString());
      formData.append("contractFile", file);

      const response = await contechApi.post("/contracts/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading contract:", error);
      throw error;
    }
  }

  async updateContractStatus(
    id: number,
    status: ContractStatus
  ): Promise<Contract> {
    try {
      const response = await contechApi.patch(
        `/contracts/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating contract ${id} status:`, error);
      throw error;
    }
  }

  async addChangeOrder(
    id: number,
    changeOrderDto: AddChangeOrderDto
  ): Promise<Contract> {
    try {
      const response = await contechApi.post(
        `/contracts/${id}/change-orders`,
        changeOrderDto,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding change order to contract ${id}:`, error);
      throw error;
    }
  }

  async getContractViewUrl(id: number): Promise<{ signedUrl: string }> {
    try {
      const response = await contechApi.get(`/contracts/${id}/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error getting view URL for contract ${id}:`, error);
      throw error;
    }
  }

  async getContractsByProject(projectId: number): Promise<Contract[]> {
    try {
      const response = await contechApi.get(`/contracts/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching contracts for project ${projectId}:`,
        error
      );
      throw error;
    }
  }
}
