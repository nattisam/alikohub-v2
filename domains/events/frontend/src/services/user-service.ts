import { api } from '../lib/api';

export interface ContentManager {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'DISABLED';
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
  status?: 'ACTIVE' | 'DISABLED';
}

// Admin API - User management
export const createContentManager = async (userData: CreateContentManagerDto): Promise<ContentManager> => {
  try {
    const response = await api.post('/events/users/content-managers', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating content manager:', error);
    throw error;
  }
};

export const getContentManagers = async (): Promise<ContentManager[]> => {
  try {
    const response = await api.get('/events/users/content-managers');
    return response.data;
  } catch (error) {
    console.error('Error fetching content managers:', error);
    throw error;
  }
};

export const updateContentManager = async (userId: string, userData: UpdateContentManagerDto): Promise<ContentManager> => {
  try {
    const response = await api.put(`/events/users/content-managers/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating content manager ${userId}:`, error);
    throw error;
  }
};

export const deleteContentManager = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/events/users/content-managers/${userId}`);
  } catch (error) {
    console.error(`Error deleting content manager ${userId}:`, error);
    throw error;
  }
};
