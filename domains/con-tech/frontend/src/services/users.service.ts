import { contechApi } from "../api";
import type { CurrentUser } from "../components/type";
import { AuthService } from "./auth.service";

export class UsersService {
  private static instance: UsersService;

  private constructor() {}

  static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  async getProfile(): Promise<CurrentUser> {
    try {
      const response = await contechApi.get("/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  async updateProfile(updateData: Partial<CurrentUser>): Promise<CurrentUser> {
    try {
      const response = await contechApi.put("users/profile", updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  async createProfile(profileData: Partial<CurrentUser>): Promise<CurrentUser> {
    try {
      const response = await contechApi.post("/users/profile", profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  /**
   * Updates the role of a user by sending a request to the server.
   * This method validates the provided role against allowed roles and makes an API call
   * to update the user's role in the system.
   *
   * @param {string} userId - The ID of the user whose role is to be updated
   * @param {string} role - The new role to assign to the user. Must be one of: "CLIENT", "CONTRACTOR", "PROJECT_MANAGER"
   * @returns {Promise<void>} A promise that resolves when the role update is successful
   * @throws {Error} Throws an error if the role is not valid or if the API request fails
   */
  async updateUserRole(
    userId: string,
    role: string
  ): Promise<CurrentUser | null> {
    const authToken = AuthService.getAuthToken();
    const ROLES = ["CLIENT", "CONTRACTOR", "PROJECT_MANAGER", "ADMIN"];
    try {
      if (ROLES.includes(role)) {
        const response = await contechApi.post(
          `/profile/select-role`,
          { role: role },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response);
        if (response.status === 201) {
          return response.data;
        } else return null;
      }
      throw new Error(`Role type should be one of ${ROLES.join(", ")}`);
    } catch (error) {
      console.error(`Error updating user role for ${userId}:`, error);
      throw error;
    }
  }
}
