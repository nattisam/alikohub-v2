import { api } from "../lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  captchaToken?: string;
}

export interface CurrentUser {
  id: number;
  firebaseId: string;
  firstname: string;
  firstName?: string;
  lastname: string;
  lastName?: string;
  email: string;
  globalRole: string;
  profilePicture: string | null;
  bio: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  academyUser: {
    id: string;
    userId: string;
    role: string;
    activeRole: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    hasSelectedRole?: boolean;
    selectedRole?: string;
  } | null;
  consultancyUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  contechUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  eventsUser: {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  // Additional frontend-specific properties
  hasSelectedRole?: boolean;
  availableRoles?: string[];
  currentRole?: string;
  academyRole?: string;
  academyActiveRole?: string;
  academyStatus?: string;
  contechRole?: string;
  contechStatus?: string;
  eventsRole?: string;
  eventsStatus?: string;
  roleStatus?: {
    instructor: "active" | "pending" | "rejected" | "not_applied" | string;
    applicationDate?: string;
    approvalDate?: string;
  };
  academyProfile?: {
    id: string;
    userId: string;
    role: string;
    hasSelectedRole: boolean;
    bio?: string | null;
    expertise?: string[] | null;
    createdAt: string;
    updatedAt: string;
  };
  [key: string]: unknown; // Allow additional properties
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  register: async (credentials: SignupCredentials) => {
    const { data } = await api.post("/auth/register", credentials);
    return data;
  },

  verifyToken: async (token: string) => {
    const { data } = await api.post("/auth/verify", {
      type: "jwt",
      value: token,
    });
    return data;
  },

  checkEmailAvailability: async (email: string) => {
    try {
      await api.post("/auth/login", { email, password: "dummy-password" });
      return false;
    } catch (error) {
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 401) {
        return false;
      } else if (err?.response?.status === 400) {
        return true;
      }
      return false;
    }
  },

  updateProfile: async (profileData: Partial<CurrentUser>) => {
    const { data } = await api.patch("/users/profile", profileData);
    return data;
  },

  // Academy specific auth actions
  selectRole: async (role: string) => {
    let backendRole = "";
    switch (role) {
      case "INSTRUCTOR":
        backendRole = "instructor";
        break;
      case "STUDENT":
        backendRole = "student";
        break;
      case "ADMIN":
        backendRole = "admin";
        break;
      default:
        backendRole = role.toLowerCase();
    }

    try {
      const response = await api.post("/auth/academy/select-role", {
        role: backendRole,
      });
      return response.data;
    } catch (error) {
      console.error("Error in role selection API call:", error);
      throw error;
    }
  },

  switchRole: async (role: string) => {
    let backendRole = "";
    switch (role) {
      case "INSTRUCTOR":
        backendRole = "instructor";
        break;
      case "STUDENT":
        backendRole = "student";
        break;
      case "ADMIN":
        backendRole = "admin";
        break;
      default:
        backendRole = role.toLowerCase();
    }

    const { data } = await api.post("/auth/academy/switch-role", {
      newRole: backendRole,
    });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get("/users/profile");
    return data;
  },

  applyTeacher: async (applicationData: unknown) => {
    const { data } = await api.post(
      "/auth/academy/apply-teacher",
      applicationData,
    );
    return data;
  },

  getTeacherApplications: async () => {
    const { data } = await api.get("/auth/academy/teacher-applications");
    return data;
  },

  approveTeacher: async ({
    applicationId,
    data,
  }: {
    applicationId: string;
    data: { reviewNotes: string };
  }) => {
    const response = await api.post(
      `/auth/academy/approve-teacher/${applicationId}`,
      data,
    );
    return response.data;
  },

  rejectTeacher: async ({
    applicationId,
    data,
  }: {
    applicationId: string;
    data: { reviewNotes: string };
  }) => {
    const response = await api.post(
      `/auth/academy/reject-teacher/${applicationId}`,
      data,
    );
    return response.data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
