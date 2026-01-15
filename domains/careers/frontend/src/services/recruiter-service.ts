import { api } from '../lib/api';

export interface RecruiterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  department?: string;
}

export const createRecruiter = async (recruiterData: RecruiterData): Promise<any> => {
  try {
    // Prepare the request payload with department defaulting to "General" if not provided
    const payload = {
      ...recruiterData,
      department: recruiterData.department || "General"
    };
    
    // Make the actual API call to create a recruiter
    const response = await api.post('/careers/admin/recruiters', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating recruiter:', error);
    throw error;
  }
};