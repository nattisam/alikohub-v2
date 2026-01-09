import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contechAPI } from "../services/api";
import type { Contract } from "../components/type";

export const useContracts = (projectId?: number) => {
  return useQuery({
    queryKey: ["contracts", projectId],
    queryFn: async () => {
      if (projectId) {
        const response = await contechAPI.getContracts(projectId);
        return response;
      }
      return [];
    },
    enabled: !!projectId,
  });
};

export const useContract = (id: number) => {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: async () => {
      const response = await contechAPI.getContract(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useUploadContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: number; file: File }) => {
      return contechAPI.uploadContract(projectId, file);
    },
    onSuccess: (newContract) => {
      // Invalidate contracts for the specific project
      if (newContract.projectId) {
        queryClient.invalidateQueries({ queryKey: ["contracts", newContract.projectId] });
      }
      // Invalidate all contracts
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      // Add the new contract directly to the cache if needed
      queryClient.setQueryData(["contract", newContract.id], newContract);
    },
  });
};

export const useUpdateContractStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: any }) => {
      return contechAPI.updateContractStatus(id, status);
    },
    onSuccess: (updatedContract) => {
      // Update the specific contract in the cache
      queryClient.setQueryData(["contract", updatedContract.id], updatedContract);
      // Invalidate contracts for the specific project
      if (updatedContract.projectId) {
        queryClient.invalidateQueries({ queryKey: ["contracts", updatedContract.projectId] });
      }
      // Invalidate all contracts
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
};