import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { washService } from "@/services/washService";
import { toast } from "sonner";

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: washService.getContacts,
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => washService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact deleted");
    },
  });
};

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: washService.getStories,
  });
};

export const useUpsertStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => washService.upsertStory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story saved");
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => washService.deleteStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story deleted");
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: washService.getProjects,
  });
};

export const useUpsertProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => washService.upsertProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project saved");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => washService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
  });
};

export const usePartners = () => {
  return useQuery({
    queryKey: ["partners"],
    queryFn: washService.getPartners,
  });
};

export const useUpsertPartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => washService.upsertPartner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner saved");
    },
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => washService.deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner deleted");
    },
  });
};
