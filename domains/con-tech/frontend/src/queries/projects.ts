import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contechAPI } from "../services/api";
import type { Project } from "../components/types";

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await contechAPI.getProjects();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useProject = (id: number) => {
  return useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await contechAPI.getProject(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) => {
      return contechAPI.createProject(data);
    },
    onSuccess: (newProject) => {
      // Update the projects list optimistically
      queryClient.setQueryData<Project[]>(["projects"], (old) => {
        if (!old) return [newProject];
        return [...old, newProject];
      });
      // Also add the new project directly to the cache if needed
      queryClient.setQueryData(["project", newProject.id], newProject);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) => {
      return contechAPI.updateProject(id, data);
    },
    onSuccess: (updatedProject) => {
      // Update the specific project in the cache
      queryClient.setQueryData(["project", updatedProject.id], updatedProject);
      // Update the projects list with the updated project
      queryClient.setQueryData<Project[]>(["projects"], (old) => {
        if (!old) return [updatedProject];
        return old.map(p => p.id === updatedProject.id ? updatedProject : p);
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return contechAPI.deleteProject(id);
    },
    onSuccess: (_, deletedId) => {
      // Remove the project from the cache
      queryClient.removeQueries({ queryKey: ["project", deletedId] });
      // Update the projects list to remove the deleted project
      queryClient.setQueryData<Project[]>(["projects"], (old) => {
        if (!old) return [];
        return old.filter(p => p.id !== deletedId);
      });
    },
  });
};

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => {
      return contechAPI.updateProjectStatus(id, status);
    },
    onSuccess: (updatedProject) => {
      // Update the specific project in the cache
      queryClient.setQueryData(["project", updatedProject.id], updatedProject);
      // Update the projects list with the updated project
      queryClient.setQueryData<Project[]>(["projects"], (old) => {
        if (!old) return [updatedProject];
        return old.map(p => p.id === updatedProject.id ? updatedProject : p);
      });
    },
  });
};