import { api } from '../lib/api';

export interface Job {
  id: string;
  title: string;
  department?: string;
  status: string;
  applicants?: number;
  postedDate?: string;
  description: string;
  requirements?: string;
  salaryMin?: string;
  salaryMax?: string;
  type?: string;
  location?: string;
  company?: string;
}

export const getJobById = async (jobId: string): Promise<Job> => {
  try {
    const response = await api.get(`/careers/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    throw error;
  }
};

export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const response = await api.get('/careers/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const createJob = async (jobData: Omit<Job, 'id'>): Promise<Job> => {
  try {
    const response = await api.post('/careers/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (jobId: string, jobData: Partial<Job>): Promise<Job> => {
  try {
    const response = await api.put(`/careers/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error(`Error updating job with ID ${jobId}:`, error);
    throw error;
  }
};

export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await api.delete(`/careers/jobs/${jobId}`);
  } catch (error) {
    console.error(`Error deleting job with ID ${jobId}:`, error);
    throw error;
  }
};