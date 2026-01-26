import { api, publicApi } from '../lib/api';
import type { Post, CreatePostDto, UpdatePostDto, PostType, PostStatus } from '../types/post';

// Public API - No authentication required
export const getAllPublishedPosts = async (): Promise<Post[]> => {
  try {
    const response = await publicApi.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching published posts:', error);
    throw error;
  }
};

export const getPublishedPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await publicApi.get(`/events/posts/published/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

export const getPublishedPostsByType = async (type: PostType): Promise<Post[]> => {
  try {
    const response = await publicApi.get(`/events/posts/published?type=${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts of type ${type}:`, error);
    throw error;
  }
};

// Content Manager API - Requires authentication
export const createDraft = async (postData: CreatePostDto): Promise<Post> => {
  try {
    const response = await api.post('/events/posts/draft', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating draft:', error);
    throw error;
  }
};

export const updateDraft = async (postId: string, postData: UpdatePostDto): Promise<Post> => {
  try {
    const response = await api.put(`/events/posts/draft/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating draft with ID ${postId}:`, error);
    throw error;
  }
};

export const submitForReview = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post(`/events/posts/${postId}/submit`);
    return response.data;
  } catch (error) {
    console.error(`Error submitting post ${postId} for review:`, error);
    throw error;
  }
};

export const getMyDrafts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/events/posts/my-drafts');
    return response.data;
  } catch (error) {
    console.error('Error fetching my drafts:', error);
    throw error;
  }
};

export const getMyPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/events/posts/my-posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching my posts:', error);
    throw error;
  }
};

// Admin API - Requires admin authentication
export const getPendingPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/events/posts/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    throw error;
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/events/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
};

export const approvePost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post(`/events/posts/${postId}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Error approving post ${postId}:`, error);
    throw error;
  }
};

export const rejectPost = async (postId: string, feedback: string): Promise<Post> => {
  try {
    const response = await api.post(`/events/posts/${postId}/reject`, { feedback });
    return response.data;
  } catch (error) {
    console.error(`Error rejecting post ${postId}:`, error);
    throw error;
  }
};

export const publishPost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post(`/events/posts/${postId}/publish`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing post ${postId}:`, error);
    throw error;
  }
};

export const unpublishPost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post(`/events/posts/${postId}/unpublish`);
    return response.data;
  } catch (error) {
    console.error(`Error unpublishing post ${postId}:`, error);
    throw error;
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await api.delete(`/events/posts/${postId}`);
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
};
