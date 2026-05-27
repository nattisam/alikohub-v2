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

export const useTeam = () => {
  return useQuery({
    queryKey: ["team"],
    queryFn: washService.getTeam,
  });
};

export const useUpsertTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => washService.upsertTeamMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Team member saved");
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => washService.deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Team member deleted");
    },
  });
};
export const useDonations = () => {
  return useQuery({
    queryKey: ["donations"],
    queryFn: washService.getDonations,
  });
};

export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: string }) =>
      washService.updateDonationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Donation status updated");
    },
  });
};

export const useDeleteDonation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => washService.deleteDonation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Donation record deleted");
    },
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: washService.getSettings,
  });
};

export const useUpsertSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { key: string; value: any }) =>
      washService.upsertSetting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting saved");
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: washService.getUsers,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string | number; role: string }) =>
      washService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated");
    },
  });
};
