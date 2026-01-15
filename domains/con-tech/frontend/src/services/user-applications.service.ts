import { contechApi } from "../api";
import { AuthService } from "./auth.service";

// Type definitions

export interface ApplicationData {
  role: string;
  bio?: string | null;
  expertise?: string[] | null;
  [key: string]: unknown; // for any additional dynamic fields
}

export interface UserApplication {
  id: number;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicationData: ApplicationData;
  createdAt: string;
  updatedAt: string;
}

export class UserApplicationsService {
  private static instance: UserApplicationsService;

  private constructor() {}

  static getInstance(): UserApplicationsService {
    if (!UserApplicationsService.instance) {
      UserApplicationsService.instance = new UserApplicationsService();
    }
    return UserApplicationsService.instance;
  }


  /**
   * Submits a user application to the server.
   * @param {UserApplication} applicationData - The user application to submit.
   * @returns {Promise<UserApplication>} - A promise that resolves to the submitted user application.
   * @throws {Error} - If no authenticated user is found.
   */
  async submitApplication(applicationData: ApplicationData): Promise<UserApplication> {
    const authToken = AuthService.getAuthToken();
    if (authToken) {
      try {
        const response = await contechApi.post(
          "/user-applications",
          { applicationData },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error submitting user application:", error);
        throw error;
      }
    } else {
      throw new Error(
        "No authenticated user to get Applications for. Please Login first!"
      );
    }
  }


  /**
   * Fetches the status for a user's application with the specified applicationID.
   * @param {string} applicationID - The ID of the application to fetch status for
   * @returns {Promise<UserApplication>} A promise that resolves to the user application with its current status
   * @throws {Error} Throws an error if no authenticated user is found or if the API request fails
   */
  async getApplicationStatus(applicationID: string): Promise<UserApplication> {
    const authToken = AuthService.getAuthToken();
    if (authToken) {
      try {
        const response = await contechApi.get(
          `/user-applications/${applicationID}/status`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching application status for ${applicationID}:`,
          error
        );
        throw error;
      }
    } else {
      throw new Error(
        "No authenticated user to get Applications for. Please Login first!"
      );
    }
  }

  /**
   * Fetches applications based on user role and permissions.
   * For regular users, returns only their own applications.
   * For admin users, returns all applications in the system.
   * 
   * @param {string} userId - The ID of the user whose applications to fetch
   * @returns {Promise<UserApplication[]>} A promise that resolves to an array of user applications
   * @throws {Error} Throws an error if no authenticated user is found or if the API request fails
   */
  async getApplications(userId: string): Promise<UserApplication[]> {
    try {
      const response = await contechApi.get(`/user-applications/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching applications for ${userId}:`, error);
      throw error;
    }
  }
}
