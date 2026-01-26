import { useQuery } from "@tanstack/react-query";
import { contechAPI } from "../services/api";
import type { ClientDashboardData, ProjectManagerDashboardData, ContractorDashboardData } from "../components/types";

export const useClientDashboardData = () => {
  return useQuery<ClientDashboardData>({
    queryKey: ["client-dashboard"],
    queryFn: async () => {
      const response = await contechAPI.getClientDashboardData();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useProjectManagerDashboardData = () => {
  return useQuery<ProjectManagerDashboardData>({
    queryKey: ["pm-dashboard"],
    queryFn: async () => {
      const response = await contechAPI.getProjectManagerDashboardData();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useContractorDashboardData = () => {
  return useQuery<ContractorDashboardData>({
    queryKey: ["contractor-dashboard"],
    queryFn: async () => {
      const response = await contechAPI.getContractorDashboardData();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};