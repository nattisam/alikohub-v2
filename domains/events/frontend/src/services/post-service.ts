import { api, publicApi } from "../lib/api";
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostType,
} from "../types/post";

// Helper to extract items from paginated response
const extractPosts = (data: any): Post[] => {
  if (data && Array.isArray(data.items)) {
    return data.items;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};

// Public API - No authentication required
export const getAllPublishedPosts = async (): Promise<Post[]> => {
  try {
    const response = await publicApi.get("/events");
    return extractPosts(response.data);
  } catch (error) {
    console.error("Error fetching published posts:", error);
    throw error;
  }
};

export const getPublishedPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await publicApi.get(`/events/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

export const getPublishedPostsByType = async (
  type: PostType,
): Promise<Post[]> => {
  try {
    const response = await publicApi.get(`/events?type=${type}`);
    return extractPosts(response.data);
  } catch (error) {
    console.error(`Error fetching posts of type ${type}:`, error);
    throw error;
  }
};

// Internal Management API - Requires authentication
export const createDraft = async (postData: CreatePostDto): Promise<Post> => {
  try {
    // Check if there's a File object for coverImage
    const hasFile = postData.coverImage instanceof File;

    if (hasFile) {
      // Use FormData only when uploading a file
      const formData = new FormData();
      Object.keys(postData).forEach((key) => {
        const value = (postData as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      const response = await api.post("/manage/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // Send as JSON (matches Postman behavior), strip empty values
      const cleanData: Record<string, any> = {};
      Object.keys(postData).forEach((key) => {
        const value = (postData as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          cleanData[key] = value;
        }
      });
      const response = await api.post("/manage/events", cleanData);
      return response.data;
    }
  } catch (error) {
    console.error("Error creating draft:", error);
    throw error;
  }
};

export const updateDraft = async (
  postId: string,
  postData: UpdatePostDto,
): Promise<Post> => {
  try {
    const hasFile = postData.coverImage instanceof File;

    if (hasFile) {
      const formData = new FormData();
      Object.keys(postData).forEach((key) => {
        const value = (postData as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      const response = await api.patch(`/manage/events/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      const cleanData: Record<string, any> = {};
      Object.keys(postData).forEach((key) => {
        const value = (postData as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          cleanData[key] = value;
        }
      });
      const response = await api.patch(`/manage/events/${postId}`, cleanData);
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating draft with ID ${postId}:`, error);
    throw error;
  }
};

export const submitForReview = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post(`/manage/events/${postId}/submit`);
    return response.data;
  } catch (error) {
    console.error(`Error submitting post ${postId} for review:`, error);
    throw error;
  }
};

export const getMyPosts = async (
  userId: string,
  status?: string,
): Promise<Post[]> => {
  try {
    const url = status
      ? `/manage/events/user/${userId}?status=${status}`
      : `/manage/events/user/${userId}`;
    const response = await api.get(url);
    return extractPosts(response.data);
  } catch (error) {
    console.error("Error fetching my posts:", error);
    throw error;
  }
};

// Admin API - Requires admin authentication
export const getPendingPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get("/manage/events?status=PENDING");
    return extractPosts(response.data);
  } catch (error) {
    console.error("Error fetching pending posts:", error);
    throw error;
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get("/manage/events");
    return extractPosts(response.data);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};

export const reviewPost = async (
  postId: string,
  status: "PUBLISHED" | "REJECTED" | "APPROVED",
  rejectionReason?: string,
): Promise<Post> => {
  try {
    const response = await api.post(`/manage/events/${postId}/review`, {
      status,
      rejectionReason,
    });
    return response.data;
  } catch (error) {
    console.error(`Error reviewing post ${postId}:`, error);
    throw error;
  }
};

// Helper aliases for existing code
export const approvePost = (postId: string) => reviewPost(postId, "PUBLISHED");
export const rejectPost = (postId: string, feedback: string) =>
  reviewPost(postId, "REJECTED", feedback);

export const unpublishPost = async (postId: string): Promise<Post> => {
  // unpublishing can be done by moving back to APPROVED or DRAFT
  return reviewPost(postId, "APPROVED");
};

export const getPostById = async (postId: string): Promise<Post> => {
  try {
    // Try management endpoint first (Author/Admin context)
    const response = await api.get(`/manage/events/${postId}`);
    return response.data;
  } catch (error) {
    console.log(
      `Internal fetch failed for post ${postId}, trying public endpoint...`,
    );
    try {
      // Fallback to public endpoint
      const response = await publicApi.get(`/events/${postId}`);
      return response.data;
    } catch (fallbackError) {
      console.error(`Error fetching post ${postId}:`, fallbackError);
      throw fallbackError;
    }
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await api.delete(`/manage/events/${postId}`);
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
};
