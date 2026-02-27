import { api } from "../lib/api";

export interface ContentManager {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "ACTIVE" | "DISABLED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentManagerDto {
  email: string;
  name: string;
  password: string;
}

export interface UpdateContentManagerDto {
  email?: string;
  name?: string;
  password?: string;
  status?: "ACTIVE" | "DISABLED";
}

// Helper to extract items from paginated response
const extractUsers = (data: any): ContentManager[] => {
  const items =
    data && Array.isArray(data.items)
      ? data.items
      : Array.isArray(data)
        ? data
        : [];

  return items.map((item: any) => ({
    id: item.id || item.userId || item._id || 'unknown',
    email: item.email || item.userEmail || 'N/A',
    name: item.name || item.fullName || item.firstname ||
         (item.firstname && item.lastname ? `${item.firstname} ${item.lastname}` :
         (item.firstname ? item.firstname : (item.lastName || item.lastname || 'Unknown User'))),
    role: item.role || item.userRole || "CONTENT_MANAGER",
    status: item.status || item.userStatus || "ACTIVE",
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
  }));
};

// Admin API - User management
export const createContentManager = async (
  userData: CreateContentManagerDto,
): Promise<ContentManager> => {
  try {
    const response = await api.post("/manage/events/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating content manager:", error);
    throw error;
  }
};

export const getContentManagers = async (): Promise<ContentManager[]> => {
  try {
    const response = await api.get("/manage/events/users");
    const users = extractUsers(response.data);
    
    // The API response from /manage/events/users only includes id, role, and timestamps
    // It doesn't include name or email, so we need to enrich the data
    // We'll try to get current user's profile to see if we can match it with the user list
    try {
      const profileResponse = await api.get('/users/profile');
      const profile = profileResponse.data;
      
      return users.map(user => {
        // If this user matches the current profile, use the actual name and email
        if (user.id === profile.firebaseId) {
          return {
            ...user,
            name: `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || user.name,
            email: profile.email || user.email,
          };
        }
        // For other users, use better defaults
        return {
          ...user,
          name: user.name !== 'Unknown User' ? user.name : `User ${user.id.substring(0, 8)}...`,
          email: user.email !== 'N/A' ? user.email : 'Email not available',
        };
      });
    } catch (profileError) {
      console.error('Error fetching profile for enrichment:', profileError);
      // If profile fetch fails, return users with better defaults
      return users.map(user => ({
        ...user,
        name: user.name !== 'Unknown User' ? user.name : `User ${user.id.substring(0, 8)}...`,
        email: user.email !== 'N/A' ? user.email : 'Email not available',
      }));
    }
  } catch (error) {
    console.error("Error fetching content managers:", error);
    throw error;
  }
};

export const updateContentManager = async (
  userId: string,
  userData: UpdateContentManagerDto,
): Promise<ContentManager> => {
  try {
    const response = await api.put(`/manage/events/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating content manager ${userId}:`, error);
    throw error;
  }
};

export const deleteContentManager = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/manage/events/users/${userId}`);
  } catch (error) {
    console.error(`Error deleting content manager ${userId}:`, error);
    throw error;
  }
};
