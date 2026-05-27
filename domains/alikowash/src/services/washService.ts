import api from "../lib/api";

export const washService = {
  // Contacts
  getContacts: async () => {
    const response = await api.get("/alikowash/contacts");
    return response.data;
  },
  deleteContact: async (id: string | number) => {
    const response = await api.delete(`/alikowash/contacts/${id}`);
    return response.data;
  },
  markContactRead: async (id: string | number) => {
    const response = await api.patch(`/alikowash/contacts/${id}`, {
      isRead: true,
    });
    return response.data;
  },
  submitContact: async (data: any) => {
    const response = await api.post("/alikowash/contacts", data);
    return response.data;
  },

  // Stories
  getStories: async () => {
    const response = await api.get("/alikowash/stories");
    return response.data;
  },
  upsertStory: async (data: any) => {
    if (data.id) {
      const response = await api.patch(`/alikowash/stories/${data.id}`, data);
      return response.data;
    } else {
      const response = await api.post("/alikowash/stories", data);
      return response.data;
    }
  },
  deleteStory: async (id: string | number) => {
    const response = await api.delete(`/alikowash/stories/${id}`);
    return response.data;
  },

  // Projects
  getProjects: async () => {
    const response = await api.get("/alikowash/projects");
    return response.data;
  },
  upsertProject: async (data: any) => {
    if (data.id) {
      const response = await api.patch(`/alikowash/projects/${data.id}`, data);
      return response.data;
    } else {
      const response = await api.post("/alikowash/projects", data);
      return response.data;
    }
  },
  deleteProject: async (id: string | number) => {
    const response = await api.delete(`/alikowash/projects/${id}`);
    return response.data;
  },

  // Partners
  getPartners: async () => {
    const response = await api.get("/alikowash/partners");
    return response.data;
  },
  upsertPartner: async (data: any) => {
    if (data.id) {
      const response = await api.patch(`/alikowash/partners/${data.id}`, data);
      return response.data;
    } else {
      const response = await api.post("/alikowash/partners", data);
      return response.data;
    }
  },
  deletePartner: async (id: string | number) => {
    const response = await api.delete(`/alikowash/partners/${id}`);
    return response.data;
  },

  // Team
  getTeam: async () => {
    const response = await api.get("/alikowash/team");
    return response.data;
  },
  upsertTeamMember: async (data: any) => {
    if (data.id) {
      const response = await api.patch(`/alikowash/team/${data.id}`, data);
      return response.data;
    } else {
      const response = await api.post("/alikowash/team", data);
      return response.data;
    }
  },
  deleteTeamMember: async (id: string | number) => {
    const response = await api.delete(`/alikowash/team/${id}`);
    return response.data;
  },

  // Donations
  getDonations: async () => {
    const response = await api.get("/alikowash/donations");
    return response.data;
  },
  getDonationById: async (id: string | number) => {
    const response = await api.get(`/alikowash/donations/${id}`);
    return response.data;
  },
  submitDonation: async (data: any) => {
    const response = await api.post("/alikowash/donations", data);
    return response.data;
  },
  updateDonationStatus: async (id: string | number, status: string) => {
    const response = await api.patch(`/alikowash/donations/${id}/status`, {
      status,
    });
    return response.data;
  },
  deleteDonation: async (id: string | number) => {
    const response = await api.delete(`/alikowash/donations/${id}`);
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await api.get("/alikowash/settings");
    return response.data;
  },
  getSettingByKey: async (key: string) => {
    const response = await api.get(`/alikowash/settings/${key}`);
    return response.data;
  },
  upsertSetting: async (data: { key: string; value: any }) => {
    const response = await api.post("/alikowash/settings", data);
    return response.data;
  },
  deleteSetting: async (key: string) => {
    const response = await api.delete(`/alikowash/settings/${key}`);
    return response.data;
  },

  // Stats
  getStats: async () => {
    const response = await api.get("/alikowash/stats");
    return response.data;
  },

  // Admin Users
  getUsers: async () => {
    const response = await api.get("/alikowash/admin/users");
    return response.data;
  },
  updateUserRole: async (id: string | number, role: string) => {
    const response = await api.patch(`/alikowash/admin/users/${id}/role`, {
      role,
    });
    return response.data;
  },
  // Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/alikowash/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
