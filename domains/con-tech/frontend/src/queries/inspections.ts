import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contechAPI } from "../services/api";
import type { CreateInspectionDto, UpdateInspectionDto } from "../components/types";

export const useInspections = (projectId?: number) => {
  return useQuery({
    queryKey: ["inspections", projectId],
    queryFn: async () => {
      if (projectId) {
        const response = await contechAPI.getInspections(projectId);
        return response;
      }
      return [];
    },
    enabled: !!projectId,
  });
};

export const useInspection = (id: number) => {
  return useQuery({
    queryKey: ["inspection", id],
    queryFn: async () => {
      const response = await contechAPI.getInspection(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }: { data: CreateInspectionDto; files: File[] }) => {
      return contechAPI.createInspection(data, files);
    },
    onSuccess: (newInspection) => {
      // Invalidate inspections for the specific project
      if (newInspection.projectId) {
        queryClient.invalidateQueries({ queryKey: ["inspections", newInspection.projectId] });
      }
      // Invalidate all inspections
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      // Add the new inspection directly to the cache if needed
      queryClient.setQueryData(["inspection", newInspection.id], newInspection);
    },
  });
};

export const useUpdateInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInspectionDto) => {
      return contechAPI.updateInspection(data);
    },
    onSuccess: (updatedInspection) => {
      // Update the specific inspection in the cache
      queryClient.setQueryData(["inspection", updatedInspection.id], updatedInspection);
      // Invalidate inspections for the specific project
      if (updatedInspection.projectId) {
        queryClient.invalidateQueries({ queryKey: ["inspections", updatedInspection.projectId] });
      }
      // Invalidate all inspections
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
    },
  });
};