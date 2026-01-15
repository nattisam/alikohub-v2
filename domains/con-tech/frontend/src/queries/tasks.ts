import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contechAPI } from "../services/api";
import type { CreateTaskDto, UpdateTaskDto } from "../components/types";


export const useTasks = (projectId?: number) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      if (projectId) {
        const response = await contechAPI.getTasks(projectId);
        return response;
      }
      return [];
    },
    enabled: !!projectId,
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const response = await contechAPI.getTask(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => {
      return contechAPI.createTask(data);
    },
    onSuccess: (newTask) => {
      // Invalidate tasks for the specific project
      if (newTask.projectId) {
        queryClient.invalidateQueries({ queryKey: ["tasks", newTask.projectId] });
      }
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Add the new task directly to the cache if needed
      queryClient.setQueryData(["task", newTask.id], newTask);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) => {
      return contechAPI.updateTask(id, data);
    },
    onSuccess: (updatedTask) => {
      // Update the specific task in the cache
      queryClient.setQueryData(["task", updatedTask.id], updatedTask);
      // Invalidate tasks for the specific project
      if (updatedTask.projectId) {
        queryClient.invalidateQueries({ queryKey: ["tasks", updatedTask.projectId] });
      }
      // Invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return contechAPI.deleteTask(id);
    },
    onSuccess: (_, deletedId) => {
      // Remove the task from the cache
      queryClient.removeQueries({ queryKey: ["task", deletedId] });
      // Refetch tasks lists
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};