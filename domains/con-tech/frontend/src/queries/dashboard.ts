import { useQuery } from "@tanstack/react-query";
import { contechAPI } from "../services/api";

export const useClientDashboardData = () => {
  return useQuery({
    queryKey: ["client-dashboard"],
    queryFn: async () => {
      const response = await contechAPI.getClientDashboardData();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useProjectManagerDashboardData = () => {
  return useQuery({
    queryKey: ["pm-dashboard"],
    queryFn: async () => {
      const response = await contechAPI.getProjectManagerDashboardData();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useContractorDashboardData = () => {
  return useQuery({
    queryKey: ["contractor-dashboard"],
    queryFn: async () => {
      const response = await contechAPI.getContractorDashboardData();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};