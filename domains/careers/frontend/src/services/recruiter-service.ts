import { api } from '../lib/api';

export interface RecruiterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export const createRecruiter = async (recruiterData: RecruiterData): Promise<any> => {
  try {
    // TODO: Replace with actual endpoint when available
    // const response = await api.post('/careers/recruiters', recruiterData);
    // return response.data;
    
    // For now, simulate the API call
    console.log('Creating recruiter:', recruiterData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success response
    return { success: true, message: 'Recruiter created successfully!' };
  } catch (error) {
    console.error('Error creating recruiter:', error);
    throw error;
  }
};