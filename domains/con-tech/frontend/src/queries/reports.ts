import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contechAPI } from "../services/api";
import type { CreateReportDto } from "../components/types";


export const useReports = (projectId?: number) => {
  return useQuery({
    queryKey: ["reports", projectId],
    queryFn: async () => {
      if (projectId) {
        const response = await contechAPI.getReports(projectId);
        return response;
      }
      // If no project ID, return empty array
      return [];
    },
    enabled: !!projectId, // Only enable if projectId is provided
  });
};

export const useReport = (id: number) => {
  return useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const response = await contechAPI.getReport(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportDto) => {
      return contechAPI.createReport(data);
    },
    onSuccess: (newReport) => {
      // Invalidate reports for the specific project
      if (newReport.projectId) {
        queryClient.invalidateQueries({ queryKey: ["reports", newReport.projectId] });
      }
      // Invalidate all reports
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      // Add the new report directly to the cache if needed
      queryClient.setQueryData(["report", newReport.id], newReport);
    },
  });
};