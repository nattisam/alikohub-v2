import { authApi } from "../api";
import type {
  CurrentUser,
  LoginCredentials,
  SignupCredentials,
} from "../types";

export class AuthService {
  private static authToken: string | null = null;
  private static expiresOn: Date | null = null;
  private static instance: AuthService | null = null;

  private constructor() {
    AuthService.authToken = localStorage.getItem("authToken") || null;
    AuthService.expiresOn = localStorage.getItem("expiresOn")
      ? new Date(localStorage.getItem("expiresOn")!)
      : null;
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance as AuthService;
  }

  static getAuthToken() {
    return AuthService.authToken;
  }

  public async register({
    firstname,
    lastname,
    email,
    password,
  }: SignupCredentials): Promise<boolean> {
    try {
      const response = await authApi.post("/auth/register", {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      });

      if (response.status === 201 || response.status === 200) {
        console.log("Registration successful:", response.data);
        return true;
      } else if (response.status >= 400 && response.status < 500) {
        let message = response.data.message;
        if (Array.isArray(message)) {
          message = message.join(",");
        }
        throw new Error(message);
      } else if (response.status >= 500) {
        throw new Error("Unable to create account. Please try again later.");
      }
      return false;
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        // Server responded with error status
        const message =
          error.response.data.message ||
          "Registration failed. Please try again.";
        throw new Error(message);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("Network error. Please check your connection.");
      } else {
        // Something else happened
        throw new Error("Registration failed. Please try again.");
      }
    }
  }

  public async login({ email, password }: LoginCredentials) {
    try {
      const response = await authApi.post("/auth/login", {
        email: email,
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        const userData = response.data.user || response.data;
        if (this.validateUser(userData)) {
          const token = response.data.token;
          if (typeof token === "string") {
            AuthService.authToken = token;
            localStorage.setItem("authToken", token);
          }

          // Handle expires in if provided
          const expiresIn = response.data.expiresIn;
          if (typeof expiresIn === "string") {
            if (expiresIn.endsWith("d")) {
              AuthService.expiresOn = new Date(
                Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000
              );
            } else if (expiresIn.endsWith("h")) {
              AuthService.expiresOn = new Date(
                Date.now() + parseInt(expiresIn) * 60 * 60 * 1000
              );
            } else if (expiresIn.endsWith("m")) {
              AuthService.expiresOn = new Date(
                Date.now() + parseInt(expiresIn) * 60 * 1000
              );
            } else {
              AuthService.expiresOn = new Date(
                Date.now() + parseInt(expiresIn) * 1000
              );
            }
            localStorage.setItem(
              "expiresOn",
              AuthService.expiresOn.toISOString()
            );
          }

          return userData;
        } else {
          console.log("Invalid user data:", response.data);
          throw new Error("Invalid user data received from server");
        }
      } else if (response.status >= 400 && response.status < 500) {
        throw new Error(response.data.message || "Invalid credentials");
      } else if (response.status >= 500) {
        throw new Error("Unable to login. Please try again later.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        // Server responded with error status
        const message =
          error.response.data.message || "Login failed. Please try again.";
        throw new Error(message);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("Network error. Please check your connection.");
      } else {
        // Something else happened
        throw new Error("Login failed. Please try again.");
      }
    }
  }

  public async verifySession(): Promise<{
    user: CurrentUser | null;
    verified: boolean;
  }> {
    try {
      // First check if we have a valid token in localStorage
      if (!AuthService.authToken) {
        return { user: null, verified: false };
      }

      // Try to verify with the server
      let response;
      if (AuthService.expiresOn && AuthService.expiresOn > new Date()) {
        response = await authApi.post("/auth/verify", {
          type: "token",
          value: AuthService.authToken,
        });
      } else {
        response = await authApi.post("/auth/verify");
      }

      if (response.status === 200 || response.status === 201) {
        // Handle different response structures
        const userData = response.data.user || response.data;
        if (this.validateUser(userData)) {
          return { user: userData, verified: true };
        } else {
          console.log("Invalid user data in verifySession:", response.data);
          return { user: null, verified: false };
        }
      }

      return { user: null, verified: false };
    } catch (error: any) {
      console.error("Failed to verify session:", error);
      // Even if verification fails, we might still have a valid user in localStorage
      // But for security, we'll clear the auth state
      AuthService.authToken = null;
      AuthService.expiresOn = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("expiresOn");
      return { user: null, verified: false };
    }
  }

  public async logout(): Promise<boolean> {
    try {
      const response = await authApi.post("/auth/logout");
      if (response.status === 200 || response.status === 201) {
        AuthService.authToken = null;
        AuthService.expiresOn = null;
        localStorage.removeItem("expiresOn");
        localStorage.removeItem("authToken");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on the server, clear local state
      AuthService.authToken = null;
      AuthService.expiresOn = null;
      localStorage.removeItem("expiresOn");
      localStorage.removeItem("authToken");
      return true; // Consider it successful locally
    }
  }

  public validateUser(user: any): user is CurrentUser {
    return (
      user !== null &&
      user !== undefined &&
      typeof user.firebaseId === "string" &&
      typeof user.email === "string" &&
      typeof user.firstname === "string" &&
      typeof user.lastname === "string" &&
      (typeof user.role === "string" ||
        typeof user.globalRole === "string" ||
        user.role === undefined) &&
      typeof user.createdAt === "string" &&
      typeof user.updatedAt === "string"
    );
  }

  public isAdmin(user: CurrentUser | null | undefined): boolean {
    if (!user) return false;
    return user.globalRole === "ADMIN" || user.role === "ADMIN";
  }
}
