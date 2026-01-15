import { authApi } from "../api";
import type {
  CurrentUser,
  LoginCredentials,
  SignupCredentials,
} from "../components/types";
export class AuthService {
  private static authToken: string | null = null; // Using authToken internally but storing as accessToken
  private static expiresOn: Date | null = null;
  private static instance: AuthService | null = null;
  private constructor() {
    AuthService.authToken = localStorage.getItem("accessToken") || null; // Changed from authToken to accessToken
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
    captchaToken,
  }: SignupCredentials): Promise<{ token: string; user: CurrentUser; expiresIn?: string } | boolean> {  // Changed return type to match expected format
    const response = await authApi.post("/register", {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      captchaToken: captchaToken,
    });
    if (response.status === 201) {
      // If registration returns token and user data, store them
      if (response.data?.token && response.data?.user) {
        const token = response.data?.token;
        if (token) {
          AuthService.authToken = token;
          localStorage.setItem("accessToken", token); // Changed from authToken to accessToken
        }
        // Return the expected format with both token and user
        return {
          token: response.data.token,
          user: response.data.user,
          expiresIn: response.data.expiresIn
        };
      }
      // If registration doesn't return token (requires login after), return true
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
  }

  public async login({ email, password }: LoginCredentials) {
    const response = await authApi.post("login", {
      email: email,
      password: password,
    });
    console.log("response :", response);
    if (response.status === 200) {
      if (response.data?.token && response.data?.user) {
        const token = response.data?.token;
        if (token) {
          AuthService.authToken = token;
          localStorage.setItem("accessToken", token); // Changed from authToken to accessToken
        }
        const expiresIn = response.data?.expiresIn;
        if (expiresIn) {
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
        // Return the expected format with both token and user
        return {
          token: response.data.token,
          user: response.data.user,
          expiresIn: response.data.expiresIn
        };
      } else console.log("response.data :", response.data);
    } else if (response.status >= 400 && response.status < 500) {
      throw new Error(response.data.message);
    } else if (response.status >= 500)
      throw new Error("Unable to login. Please try again later.");
  }

  public async verifySession(): Promise<{
    user: CurrentUser | null;
    verified: boolean;
  }> {
    let response;
    const token = localStorage.getItem("accessToken"); // Use accessToken instead of authToken
    if (token && AuthService.expiresOn && AuthService.expiresOn > new Date())
      response = await authApi.post("verify", {
        type: "token",
        value: token,  // Use the token from localStorage
      });
    else response = await authApi.post("verify");
    if (response.status === 201) {
      console.log("response :", response);
      return { user: response.data.user, verified: true };
    }

    return { user: null, verified: false };
  }

  public async logout(): Promise<boolean> {
    const response = await authApi.post("logout");
    if (response.status === 200) {
      AuthService.authToken = null;
      AuthService.expiresOn = null;
      localStorage.removeItem("expiresOn");
      localStorage.removeItem("accessToken");  // Changed from authToken to accessToken
    }
    return response.status === 200;
  }
  public validateUser(user: CurrentUser | null | undefined) {
    return (
      user !== null &&
      user !== undefined &&
      typeof user.firebaseId === "string" &&
      typeof user.email === "string" &&
      typeof user.firstname === "string" &&
      typeof user.lastname === "string" &&
      typeof user.role === "string" &&
      typeof user.createdAt === "string" &&
      typeof user.updatedAt === "string"
    );
  }
}
